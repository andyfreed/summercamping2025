import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Breadcrumbs, 
  Link,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Card,
  CardContent,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Collapse
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import SignUpForm from './SignUpForm';
import EmailNotificationPreferences from './EmailNotificationPreferences';

function MessageBoard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [authTab, setAuthTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [connectionError, setConnectionError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Check if user is admin based on their email
  const isAdmin = user?.email === 'a.freed@outlook.com';

  const fetchMessages = async () => {
    try {
      setIsLoadingMessages(true);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          is_deleted,
          is_announcement,
          user_id,
          user:user_id (
            username
          )
        `)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        console.log('Fetched messages:', data.length);
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setConnectionError('Error connecting to the message board. Please try again later.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      console.log('Attempting to delete message:', messageId);
      
      // First verify we have permission to delete this message
      const { data: message, error: fetchError } = await supabase
        .from('messages')
        .select('id, user_id, is_deleted')
        .eq('id', messageId)
        .single();

      if (fetchError) {
        console.error('Error fetching message:', fetchError);
        throw fetchError;
      }

      if (!message) {
        throw new Error('Message not found');
      }

      if (message.is_deleted) {
        throw new Error('Message already deleted');
      }

      // Verify the user has permission to delete this message
      if (!isAdmin && message.user_id !== user?.id) {
        throw new Error('You do not have permission to delete this message');
      }

      // Soft delete the message
      const { error } = await supabase
        .from('messages')
        .update({ is_deleted: true })
        .match({ id: messageId })
        .select();

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      // Update local state immediately
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setConnectionError(null);
      
      console.log('Successfully deleted message:', messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
      setConnectionError('Failed to delete message. Please try again.');
      throw error;
    }
  };

  const deleteAllMessages = async () => {
    if (!isAdmin) {
      setConnectionError('Only administrators can delete all messages');
      return;
    }

    try {
      // Get all non-deleted message IDs first
      const { data: messages, error: fetchError } = await supabase
        .from('messages')
        .select('id')
        .eq('is_deleted', false);

      if (fetchError) throw fetchError;

      if (!messages?.length) {
        setDeleteAllDialogOpen(false);
        return;
      }

      // Soft delete all messages
      const { error } = await supabase
        .from('messages')
        .update({ is_deleted: true })
        .in('id', messages.map(msg => msg.id));

      if (error) throw error;

      // Clear local state
      setMessages([]);
    } catch (error) {
      console.error('Error deleting all messages:', error);
      setConnectionError('Failed to delete all messages. Please try again.');
    } finally {
      setDeleteAllDialogOpen(false);
    }
  };

  // Message board UI handlers
  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;
    
    try {
      await deleteMessage(messageToDelete.id);
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    } catch (error) {
      // Keep dialog open if there's an error
      console.error('Error in delete confirmation:', error);
    }
  };

  const handleDeleteAllClick = () => {
    setDeleteAllDialogOpen(true);
  };

  const handleDeleteAllConfirm = async () => {
    await deleteAllMessages();
  };

  useEffect(() => {
    let mounted = true;
    let channel;

    const initializeBoard = async () => {
      if (!mounted) return;
      
      await fetchMessages();

      // Set up real-time subscription with specific event filters
      channel = supabase.channel('message-changes')
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            if (!mounted) return;
            console.log('Received delete update:', payload);
            if (payload.old?.id) {
              setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          (payload) => {
            if (!mounted) return;
            console.log('Received insert update:', payload);
            if (payload.new) {
              setMessages(prev => [payload.new, ...prev]);
            }
          }
        );

      channel.subscribe((status, err) => {
        if (!mounted) return;
        console.log('Subscription status:', status);
        if (err) {
          console.error('Subscription error:', err);
        }
      });
    };

    initializeBoard();

    return () => {
      mounted = false;
      if (channel) {
        console.log('Cleaning up subscription');
        channel.unsubscribe();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isPosting) return;

    try {
      setIsPosting(true);
      
      const isAnnouncement = isAdmin && newMessage.trim().startsWith('!announcement:');
      const messageContent = isAnnouncement 
        ? newMessage.trim().substring('!announcement:'.length).trim() 
        : newMessage.trim();
      
      // Create message
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            content: messageContent,
            user_id: user.id,
            is_announcement: isAnnouncement
          }
        ])
        .select(`
          *,
          user:user_id (
            username
          )
        `)
        .single();

      if (error) {
        console.error('Error posting message:', error);
        throw error;
      }

      // Add to messages list
      setMessages(currentMessages => [data, ...currentMessages]);
      setNewMessage('');
      
      // Send email notifications
      await sendEmailNotifications(data);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsPosting(false);
    }
  };
  
  // Function to handle sending email notifications
  const sendEmailNotifications = async (message) => {
    if (!message || !message.user) return;
    
    try {
      // NOTE: Email notifications are currently disabled because the email field 
      // is not available in the database. In a production environment, 
      // you would fetch the user email from the auth system.
      console.log('Email notifications are disabled - would have sent notification for message:', message.id);
      
      // Simulate successful notification for UI flow
      return true;
    } catch (error) {
      console.error('Error sending email notifications:', error);
      return false;
    }
  };

  const handleResetUsernames = async () => {
    try {
      // First update admin's username to "Storrow"
      const { error: adminError } = await supabase
        .from('profiles')
        .update({ username: 'Storrow' })
        .eq('id', user.id);

      if (adminError) throw adminError;

      // Then get all non-admin profiles
      const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .neq('id', user.id);

      if (fetchError) throw fetchError;

      if (profiles?.length) {
        // Reset usernames for all non-admin profiles
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ username: null })
          .in('id', profiles.map(profile => profile.id));

        if (updateError) throw updateError;
      }
      
      await fetchMessages();
      console.log('Successfully reset usernames');
    } catch (error) {
      console.error('Error resetting usernames:', error);
      setConnectionError('Failed to reset usernames. Please try again.');
    } finally {
      setResetDialogOpen(false);
      setAnchorEl(null);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  const renderAuthCard = () => (
    <Card sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Join the conversation
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={authTab} onChange={(e, newValue) => setAuthTab(newValue)}>
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>
        
        {authTab === 0 ? (
          <Box component="form" onSubmit={handleSignIn}>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!email || !password}
            >
              Sign In
            </Button>
          </Box>
        ) : (
          <SignUpForm onSignUp={() => setAuthTab(0)} />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {connectionError && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.dark' }}>
          <Typography color="white">
            {connectionError}
          </Typography>
        </Paper>
      )}
      
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          color="inherit"
          onClick={() => navigate('/')}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Home
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          Message Board
        </Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          MESSAGE BOARD
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Stay connected with the community
        </Typography>
      </Box>

      {!user ? (
        renderAuthCard()
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            {isAdmin && (
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                color="primary"
              >
                <MoreVertIcon />
              </IconButton>
            )}
            <Button
              variant="outlined"
              startIcon={showPreferences ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              endIcon={<SettingsIcon />}
              onClick={() => setShowPreferences(!showPreferences)}
              sx={{ ml: 'auto' }}
            >
              Email Notifications
            </Button>
          </Box>
          
          <Collapse in={showPreferences} timeout="auto" unmountOnExit>
            <EmailNotificationPreferences />
          </Collapse>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={isAdmin ? "Write your message... Start with !announcement: for admin announcements" : "Write your message..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isPosting}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!newMessage.trim() || isPosting}
              >
                {isPosting ? 'Posting...' : 'Post Message'}
              </Button>
            </Box>
          </Paper>

          {isLoadingMessages ? (
            <Typography>Loading messages...</Typography>
          ) : (
            <List>
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem 
                    alignItems="flex-start"
                    sx={message.is_announcement ? {
                      bgcolor: 'rgba(255, 126, 0, 0.1)',
                      borderLeft: '4px solid #FF7E00',
                    } : {}}
                  >
                    <ListItemAvatar>
                      <Avatar sx={message.is_announcement ? { bgcolor: '#FF7E00' } : {}}>
                        {message.user?.username?.[0] || 'U'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography 
                          component="span" 
                          fontWeight={message.is_announcement ? 'bold' : 'normal'}
                        >
                          {message.is_announcement ? '📢 ' : ''}
                          {message.user?.username || 'Anonymous'}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'block' }}
                          >
                            {message.content}
                          </Typography>
                          {new Date(message.created_at).toLocaleDateString()}
                        </>
                      }
                    />
                    {(isAdmin || message.user_id === user.id) && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(message)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => {
              setResetDialogOpen(true);
              setAnchorEl(null);
            }}>
              Reset All Usernames
            </MenuItem>
            <MenuItem onClick={() => {
              handleDeleteAllClick();
              setAnchorEl(null);
            }}>
              Delete All Messages
            </MenuItem>
          </Menu>

          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Delete Message</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this message? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={deleteAllDialogOpen}
            onClose={() => setDeleteAllDialogOpen(false)}
          >
            <DialogTitle>Delete All Messages</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete all messages? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteAllDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteAllConfirm} color="error">Delete All</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={resetDialogOpen}
            onClose={() => setResetDialogOpen(false)}
          >
            <DialogTitle>Reset All Usernames</DialogTitle>
            <DialogContent>
              <Typography>
                This will reset all usernames except for the administrator. Users will need to set new usernames when they next sign in. Are you sure you want to proceed?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleResetUsernames} color="primary">Reset</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
}

export default MessageBoard; 