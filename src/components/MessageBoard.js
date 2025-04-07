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
  Tabs
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import SignUpForm from './SignUpForm';

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

  const fetchMessages = async () => {
    try {
      setIsLoadingMessages(true);
      setConnectionError(null);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user:user_id (
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        setConnectionError('Error connecting to the message board. Please try again later.');
        return;
      }
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setConnectionError('Error connecting to the message board. Please try again later.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    let messageChannel;
    try {
      messageChannel = supabase.channel('message-changes');
      
      messageChannel
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages'
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to message changes');
          } else {
            console.warn('Subscription status:', status);
          }
        });
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
      setConnectionError('Error connecting to real-time updates. Messages may not update automatically.');
    }

    return () => {
      if (messageChannel) {
        messageChannel.unsubscribe();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isPosting) return;

    try {
      setIsPosting(true);
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            content: newMessage.trim(),
            user_id: user.id
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

      // Update messages state immediately
      setMessages(currentMessages => [data, ...currentMessages]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsPosting(false);
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
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.main' }}>
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

      {!user ? renderAuthCard() : (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Write your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ mb: 2 }}
              disabled={isPosting}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!newMessage.trim() || isPosting}
            >
              {isPosting ? 'Posting...' : 'Post Message'}
            </Button>
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Recent Messages
        </Typography>
        {isLoadingMessages ? (
          <Typography>Loading messages...</Typography>
        ) : (
          <List>
            {messages.map((message, index) => (
              <React.Fragment key={message.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{message.user?.username?.[0] || 'U'}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={message.user?.username || 'Anonymous'}
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
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}

export default MessageBoard; 