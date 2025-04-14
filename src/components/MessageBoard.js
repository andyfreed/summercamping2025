import React, { useState, useEffect, useCallback } from 'react';
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
import { emailService } from '../services/emailService';

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

  const fetchMessages = useCallback(async (retryAttempt = 0) => {
    // Local constant for maximum retry attempts
    const maxRetries = 2;
    
    try {
      setIsLoadingMessages(true);
      setConnectionError(null);
      
      // First check if we have the expected columns to avoid 42703 errors
      try {
        // Try a simpler query first without the potentially missing columns
        const { error: sampleError } = await supabase
          .from('messages')
          .select('id, content, created_at, user_id')
          .limit(1);
          
        if (sampleError) {
          console.error('Error checking table structure:', sampleError);
          throw sampleError;
        }
        
        // If we got here, the basic columns exist - proceed with full query
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            user_id,
            user:user_id (
              username
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error fetching messages:', error);
          throw error;
        }
        
        if (data) {
          console.log('Fetched messages:', data.length);
          // Enhance the data with default values for potentially missing columns
          const enhancedData = data.map(msg => ({
            ...msg,
            is_deleted: false, // Assume not deleted since we'll filter them out anyway
            is_announcement: false // Default for missing column
          }));
          setMessages(enhancedData);
          // Clear any previous connection error on successful fetch
          setConnectionError(null);
        } else {
          // Handle case where data is null or undefined
          console.warn('No messages data returned from API');
          setMessages([]);
        }
      } catch (tableError) {
        console.error('Error with table structure:', tableError);
        throw tableError;
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      
      // If we haven't exceeded max retries, try again
      if (retryAttempt < maxRetries) {
        console.log(`Retry attempt ${retryAttempt + 1}/${maxRetries}...`);
        setTimeout(() => fetchMessages(retryAttempt + 1), 1500);
        return;
      }
      
      // Show a more user-friendly message with specific guidance
      let errorMessage = 'Unable to connect to the message board. ';
      
      if (error.code === '42703') {
        errorMessage += 'The database table is missing required columns. Please contact the administrator to update the database schema.';
      } else if (error.status === 400) {
        errorMessage += 'The database table might not exist yet.';
      }
      
      errorMessage += ' Please try again later.';
      setConnectionError(errorMessage);
      
      // Set fallback content to avoid completely empty UI
      setMessages(currentMessages => {
        if (currentMessages.length === 0) {
          return [{
            id: 'offline-1',
            content: 'The message board is currently offline. Please try again later.',
            created_at: new Date().toISOString(),
            is_announcement: true,
            user: { username: 'System' }
          }];
        }
        return currentMessages;
      });
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

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
    let retryCount = 0;
    const maxRetries = 3;

    const initializeBoard = async () => {
      if (!mounted) return;
      
      try {
        await fetchMessages();
      } catch (error) {
        console.error('Failed to fetch initial messages:', error);
      }

      try {
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
          
          if (status === 'SUBSCRIBED') {
            setConnectionError(null);
          }
          
          if (err) {
            console.error('Subscription error:', err);
            setConnectionError('Connection to message board lost. Messages may not update in real-time.');
          }
        });
      } catch (error) {
        console.error('Error setting up real-time subscription:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying subscription setup (${retryCount}/${maxRetries})...`);
          setTimeout(initializeBoard, 3000); // Retry after 3 seconds
        } else {
          setConnectionError('Unable to establish real-time connection. Please refresh the page.');
        }
      }
    };

    initializeBoard();

    return () => {
      mounted = false;
      if (channel) {
        console.log('Cleaning up subscription');
        try {
          channel.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from channel:', error);
        }
      }
    };
  }, [fetchMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isPosting) return;

    try {
      setIsPosting(true);
      
      const isAnnouncementPrefix = isAdmin && newMessage.trim().startsWith('!announcement:');
      const messageContent = isAnnouncementPrefix 
        ? newMessage.trim().substring('!announcement:'.length).trim() 
        : newMessage.trim();
      
      // Create base message object with required fields
      const messageData = {
        content: messageContent,
        user_id: user.id
      };
      
      // Only try to set is_announcement if admin is posting with the prefix
      if (isAdmin && isAnnouncementPrefix) {
        try {
          // Try with is_announcement field first
          const { data, error } = await supabase
            .from('messages')
            .insert([{
              ...messageData,
              is_announcement: true
            }])
            .select(`
              *,
              user:user_id (
                username
              )
            `)
            .single();

          if (error) {
            // If 42703 error (column doesn't exist), retry without the field
            if (error.code === '42703' && error.message.includes('is_announcement')) {
              throw new Error('Missing is_announcement column');
            } else {
              throw error;
            }
          }

          // Success! Update messages
          setMessages(currentMessages => [data, ...currentMessages]);
          setNewMessage('');
          return;
        } catch (err) {
          console.log('Falling back to basic message insert without is_announcement:', err);
          // Fall through to basic insert without is_announcement
        }
      }
      
      // Basic insert without is_announcement column
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
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

      // Success with basic insert
      // Manually add is_announcement attribute for UI consistency
      const enhancedMessage = {
        ...data,
        is_announcement: isAnnouncementPrefix
      };
      
      // Add to messages list
      setMessages(currentMessages => [enhancedMessage, ...currentMessages]);
      setNewMessage('');
      
      // Send email notifications
      await sendEmailNotifications(enhancedMessage);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setConnectionError('Failed to post message. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };
  
  // Function to handle sending email notifications
  const sendEmailNotifications = async (message) => {
    if (!message || !message.user) return;
    
    try {
      // Get the username for the email
      const username = message.user?.username || 'Anonymous';
      
      let emailsSent = false;
      
      // If it's an announcement, use the announcement notification
      if (message.is_announcement) {
        emailsSent = await emailService.sendAnnouncementNotification(message, username);
      } else {
        // Otherwise send regular message notification
        emailsSent = await emailService.sendNewMessageNotification(message, username);
        
        // Also check for mentions in the message and send those notifications
        if (message.content && message.content.includes('@')) {
          const authorInfo = {
            username,
            email: user?.email || null
          };
          
          await emailService.sendMentionNotifications(message, authorInfo);
        }
      }
      
      return emailsSent;
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

  const handleDisableOtherNotifications = async () => {
    try {
      const result = await emailService.disableNotificationsExceptFor('a.freed@outlook.com');
      if (result) {
        alert('Successfully disabled notifications for all other users');
      } else {
        alert('Failed to disable notifications for other users');
      }
    } catch (error) {
      console.error('Error disabling notifications:', error);
      alert('Error disabling notifications for other users');
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
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(211, 47, 47, 0.9)', borderRadius: '8px', boxShadow: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography color="white" variant="h6" gutterBottom>
                Connection Issue
              </Typography>
              <Typography color="white" sx={{ mb: 1 }}>
                {connectionError}
              </Typography>
              <Typography color="white" variant="body2" sx={{ opacity: 0.8 }}>
                This could be due to a network issue, server maintenance, or the message board feature not being fully set up yet.
              </Typography>
            </Box>
            <Button 
              variant="outlined"
              onClick={() => {
                setConnectionError(null);
                fetchMessages();
              }}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
              size="medium"
            >
              Retry Connection
            </Button>
          </Box>
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
            <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
              {isAdmin && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDisableOtherNotifications}
                >
                  Disable Other Users' Notifications
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={showPreferences ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                endIcon={<SettingsIcon />}
                onClick={() => setShowPreferences(!showPreferences)}
              >
                Email Notifications
              </Button>
            </Box>
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
              {messages.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="textSecondary">
                    No messages yet. Be the first to post!
                  </Typography>
                </Paper>
              ) : (
                messages.map((message, index) => {
                  const isOfflineMessage = message.id?.toString().startsWith('offline-');
                  return (
                    <React.Fragment key={message.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem 
                        alignItems="flex-start"
                        sx={{
                          ...(message.is_announcement ? {
                            bgcolor: 'rgba(255, 126, 0, 0.1)',
                            borderLeft: '4px solid #FF7E00',
                          } : {}),
                          ...(isOfflineMessage ? {
                            bgcolor: 'rgba(0, 0, 0, 0.05)',
                            borderLeft: '4px solid #999',
                          } : {})
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{
                              ...(message.is_announcement ? { bgcolor: '#FF7E00' } : {}),
                              ...(isOfflineMessage ? { bgcolor: '#999' } : {})
                            }}
                          >
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
                        {!isOfflineMessage && (isAdmin || message.user_id === user.id) && (
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
                  );
                })
              )}
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