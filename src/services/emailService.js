import { supabase } from '../lib/supabase';

/**
 * Service for handling email notifications for the message board
 */
export const emailService = {
  /**
   * Send a notification for a new message
   * @param {Object} message - The message object
   * @param {Object} author - The message author
   * @returns {Promise}
   */
  sendNewMessageNotification: async (message, author) => {
    try {
      // Get users who have enabled notifications for all messages
      const { data: userPreferences, error } = await supabase
        .from('notification_preferences')
        .select(`
          user_id,
          receive_all_messages,
          receive_admin_announcements,
          profiles:user_id (
            email
          )
        `)
        .eq('receive_all_messages', true);
      
      if (error) throw error;
      
      // Get list of emails to notify
      const recipientEmails = userPreferences
        .map(pref => pref.profiles?.email)
        .filter(email => email && email !== author.email); // Don't send to the author
      
      if (recipientEmails.length === 0) return;
      
      // Call Supabase Edge Function to send emails
      const { error: fnError } = await supabase.functions.invoke('send-message-notification', {
        body: {
          recipients: recipientEmails,
          message: {
            id: message.id,
            content: message.content,
            created_at: message.created_at
          },
          author: {
            username: author.username || 'Anonymous',
            email: author.email
          }
        }
      });
      
      if (fnError) throw fnError;
      
      return true;
    } catch (error) {
      console.error('Error sending message notification:', error);
      return false;
    }
  },
  
  /**
   * Send a notification for admin announcements
   * @param {Object} message - The announcement message
   * @param {Object} admin - The admin user
   * @returns {Promise}
   */
  sendAdminAnnouncementNotification: async (message, admin) => {
    try {
      // Get users who have enabled notifications for admin announcements
      const { data: userPreferences, error } = await supabase
        .from('notification_preferences')
        .select(`
          user_id,
          receive_admin_announcements,
          profiles:user_id (
            email
          )
        `)
        .eq('receive_admin_announcements', true);
      
      if (error) throw error;
      
      // Get list of emails to notify
      const recipientEmails = userPreferences
        .map(pref => pref.profiles?.email)
        .filter(email => email && email !== admin.email); // Don't send to the admin
      
      if (recipientEmails.length === 0) return;
      
      // Call Supabase Edge Function to send emails
      const { error: fnError } = await supabase.functions.invoke('send-admin-announcement', {
        body: {
          recipients: recipientEmails,
          message: {
            id: message.id,
            content: message.content,
            created_at: message.created_at
          },
          admin: {
            username: admin.username || 'Admin',
            email: admin.email
          }
        }
      });
      
      if (fnError) throw fnError;
      
      return true;
    } catch (error) {
      console.error('Error sending admin announcement:', error);
      return false;
    }
  },
  
  /**
   * Check if a message contains mentions and notify mentioned users
   * @param {Object} message - The message object
   * @param {Object} author - The message author
   * @returns {Promise}
   */
  sendMentionNotifications: async (message, author) => {
    try {
      // Get all users who have preferences set for mentions
      const { data: userPreferences, error } = await supabase
        .from('notification_preferences')
        .select(`
          user_id,
          receive_direct_mentions,
          profiles:user_id (
            email,
            username
          )
        `)
        .eq('receive_direct_mentions', true);
      
      if (error) throw error;
      
      // Filter out users without username or email
      const usersToCheck = userPreferences.filter(
        pref => pref.profiles?.username && pref.profiles?.email
      );
      
      if (usersToCheck.length === 0) return;
      
      // Check message content for @mentions
      const mentionedUsers = usersToCheck.filter(user => 
        message.content.includes(`@${user.profiles.username}`)
      );
      
      if (mentionedUsers.length === 0) return;
      
      // Get emails of mentioned users (except the author)
      const recipientEmails = mentionedUsers
        .map(user => user.profiles.email)
        .filter(email => email !== author.email);
      
      if (recipientEmails.length === 0) return;
      
      // Call Supabase Edge Function to send emails
      const { error: fnError } = await supabase.functions.invoke('send-mention-notification', {
        body: {
          recipients: recipientEmails,
          message: {
            id: message.id,
            content: message.content,
            created_at: message.created_at
          },
          author: {
            username: author.username || 'Anonymous',
            email: author.email
          }
        }
      });
      
      if (fnError) throw fnError;
      
      return true;
    } catch (error) {
      console.error('Error sending mention notifications:', error);
      return false;
    }
  }
}; 