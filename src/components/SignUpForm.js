import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Typography
} from '@mui/material';
import { supabase } from '../lib/supabase';

const AVAILABLE_USERNAMES = [
  'Andrew Tate',
  'Russell Brand',
  'George Santos',
  'Diddy',
  'Andrew Mcflow',
  'Theodore McCarrick',
  'Emily Hoyt'
];

export default function SignUpForm({ onSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [takenUsernames, setTakenUsernames] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTakenUsernames();
  }, []);

  const fetchTakenUsernames = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username');
      
      if (error) throw error;
      setTakenUsernames(data.map(profile => profile.username));
    } catch (error) {
      console.error('Error fetching usernames:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if username is taken
      if (takenUsernames.includes(username)) {
        setError('Username is already taken');
        setLoading(false);
        return;
      }

      // Sign up with Supabase with auto-confirm
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (authError) throw authError;

      // Immediately sign in after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      // Create profile with username
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username: username
          }
        ]);

      if (profileError) throw profileError;

      onSignUp?.();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
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
      <FormControl fullWidth sx={{ mb: 1 }}>
        <InputLabel>Choose your identity</InputLabel>
        <Select
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          label="Choose your identity"
        >
          {AVAILABLE_USERNAMES.map((name) => (
            <MenuItem
              key={name}
              value={name}
              disabled={takenUsernames.includes(name)}
              sx={{
                '&.Mui-disabled': {
                  opacity: 0.5,
                  color: 'text.secondary',
                }
              }}
            >
              {name} {takenUsernames.includes(name) && '(taken)'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          color: 'error.main',
          mb: 2,
          fontWeight: 500
        }}
      >
        ⚠️ WARNING: When you select an identity and create your account, the identity you choose will be permanently linked to your account, and will no longer be available to other users.
      </Typography>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading || !email || !password || !username}
      >
        Sign Up
      </Button>
    </Box>
  );
} 