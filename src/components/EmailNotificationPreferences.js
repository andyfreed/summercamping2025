import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Button,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const EmailNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    receiveAllMessages: true,
    receiveDirectMentions: true,
    receiveAdminAnnouncements: true,
    emailDigestFrequency: 'daily', // daily, weekly, never
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Check if the notification_preferences table exists
        const { error: tableCheckError } = await supabase
          .from('notification_preferences')
          .select('count(*)', { count: 'exact', head: true });
        
        // If table doesn't exist yet, just use defaults
        if (tableCheckError) {
          console.log('Notification preferences table may not exist yet, using defaults');
          setLoading(false);
          return;
        }

        // Fetch user notification preferences from Supabase
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found" error
          console.error('Error fetching preferences:', error);
          // Just log the error but don't display to user - use defaults instead
          console.error('Using default preferences');
        } else if (data) {
          // If preferences exist, update state
          setPreferences({
            receiveAllMessages: data.receive_all_messages,
            receiveDirectMentions: data.receive_direct_mentions,
            receiveAdminAnnouncements: data.receive_admin_announcements,
            emailDigestFrequency: data.email_digest_frequency || 'daily',
          });
        }
      } catch (err) {
        console.error('Error in fetchPreferences:', err);
        // Just log the error but don't display to user - use defaults instead
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  const handleToggle = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Format preferences for database
      const preferencesData = {
        user_id: user.id,
        receive_all_messages: preferences.receiveAllMessages,
        receive_direct_mentions: preferences.receiveDirectMentions,
        receive_admin_announcements: preferences.receiveAdminAnnouncements,
        email_digest_frequency: preferences.emailDigestFrequency,
        updated_at: new Date().toISOString(),
      };

      // Check if preferences already exist
      const { data: existingData, error: checkError } = await supabase
        .from('notification_preferences')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing preferences:', checkError);
      }

      let error;
      if (existingData) {
        // Update existing preferences
        const { error: updateError } = await supabase
          .from('notification_preferences')
          .update(preferencesData)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new preferences
        const { error: insertError } = await supabase
          .from('notification_preferences')
          .insert([{ ...preferencesData, created_at: new Date().toISOString() }]);
        error = insertError;
      }

      if (error) {
        console.error('Error saving preferences:', error);
        if (error.message.includes('does not exist')) {
          setError('The notification preferences table doesn\'t exist yet in the database. This is normal during development.');
        } else {
          setError('Failed to save notification preferences. Please try again later.');
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save notification preferences. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Email Notification Preferences
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Notification preferences saved successfully.
        </Alert>
      )}
      
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={preferences.receiveAllMessages}
              onChange={() => handleToggle('receiveAllMessages')}
            />
          }
          label="Receive email notifications for all new messages"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={preferences.receiveDirectMentions}
              onChange={() => handleToggle('receiveDirectMentions')}
            />
          }
          label="Receive notifications when someone mentions you"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={preferences.receiveAdminAnnouncements}
              onChange={() => handleToggle('receiveAdminAnnouncements')}
            />
          }
          label="Receive notifications for admin announcements"
        />
      </FormGroup>
      
      <Box mt={3}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ mr: 2 }}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </Box>
    </Paper>
  );
};

export default EmailNotificationPreferences; 