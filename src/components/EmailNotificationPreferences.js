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
  const [tableExists, setTableExists] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if the notification_preferences table exists by attempting a simple query
        try {
          const { error: tableCheckError } = await supabase
            .from('notification_preferences')
            .select('count', { count: 'exact', head: true });
          
          // If table doesn't exist, set flag and return early
          if (tableCheckError) {
            console.log('Notification preferences table may not exist yet, using defaults');
            setTableExists(false);
            setLoading(false);
            return;
          }
        } catch (tableError) {
          console.log('Error checking table existence:', tableError);
          setTableExists(false);
          setLoading(false);
          return;
        }

        // Table exists, fetch user's preferences
        try {
          const { data, error } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) {
            // No record found or other error
            console.log('No preferences found or error occurred:', error);
          } else if (data) {
            // If preferences exist, update state
            setPreferences({
              receiveAllMessages: Boolean(data.receive_all_messages),
              receiveDirectMentions: Boolean(data.receive_direct_mentions),
              receiveAdminAnnouncements: Boolean(data.receive_admin_announcements),
              emailDigestFrequency: data.email_digest_frequency || 'daily',
            });
          }
        } catch (fetchError) {
          console.error('Error fetching user preferences:', fetchError);
        }
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

      // If table doesn't exist, show message to user
      if (!tableExists) {
        setError('The notification preferences table doesn\'t exist yet in the database. This feature will be available soon.');
        return;
      }

      // Format preferences for database
      const preferencesData = {
        user_id: user.id,
        receive_all_messages: preferences.receiveAllMessages,
        receive_direct_mentions: preferences.receiveDirectMentions,
        receive_admin_announcements: preferences.receiveAdminAnnouncements,
        email_digest_frequency: preferences.emailDigestFrequency,
        updated_at: new Date().toISOString(),
      };

      // Try-catch for error handling
      try {
        // Check if preferences already exist
        const { data: existingData, error: checkError } = await supabase
          .from('notification_preferences')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          // Log error but continue - we'll try to insert
          console.error('Error checking existing preferences:', checkError);
        }

        let saveError;
        if (existingData?.id) {
          // Update existing preferences
          const { error: updateError } = await supabase
            .from('notification_preferences')
            .update(preferencesData)
            .eq('user_id', user.id);
          saveError = updateError;
        } else {
          // Insert new preferences
          const { error: insertError } = await supabase
            .from('notification_preferences')
            .insert([{ ...preferencesData, created_at: new Date().toISOString() }]);
          saveError = insertError;
        }

        if (saveError) {
          // Handle specific table not found error
          if (saveError.message && typeof saveError.message === 'string' && 
              saveError.message.includes('does not exist')) {
            setTableExists(false);
            setError('The notification preferences table doesn\'t exist yet in the database. This feature will be available soon.');
          } else {
            setError('Failed to save notification preferences. Please try again later.');
          }
        } else {
          setSuccess(true);
        }
      } catch (err) {
        console.error('Error in save operation:', err);
        setError('Failed to save notification preferences. Please try again later.');
      }
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
      
      {!tableExists && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Email notification preferences are not yet available. This feature is coming soon.
        </Alert>
      )}

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
              disabled={!tableExists || saving}
            />
          }
          label="Receive email notifications for all new messages"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={preferences.receiveDirectMentions}
              onChange={() => handleToggle('receiveDirectMentions')}
              disabled={!tableExists || saving}
            />
          }
          label="Receive notifications when someone mentions you"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={preferences.receiveAdminAnnouncements}
              onChange={() => handleToggle('receiveAdminAnnouncements')}
              disabled={!tableExists || saving}
            />
          }
          label="Receive notifications for admin announcements"
        />
      </FormGroup>
      
      <Box mt={3}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !tableExists}
          sx={{ mr: 2 }}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </Box>
    </Paper>
  );
};

export default EmailNotificationPreferences; 