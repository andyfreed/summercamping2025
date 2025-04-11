import { supabase } from '../lib/supabase';

// Real implementation using the Mailgun API
const sendMail = async (to, subject, text) => {
  const apiKey = process.env.REACT_APP_MAILGUN_API_KEY;
  const domain = process.env.REACT_APP_MAILGUN_DOMAIN;
  const from = process.env.REACT_APP_MAILGUN_FROM_EMAIL || 'noreply@summercamping2025.com';
  
  if (!apiKey || !domain) {
    console.error('Mailgun API key or domain not configured');
    console.log(`[EMAIL ERROR] Email not sent - missing configuration`);
    return false;
  }

  try {
    console.log(`[EMAIL] Sending email to: ${to}`);
    console.log(`[EMAIL] Subject: ${subject}`);
    
    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('api:' + apiKey),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        from: `Summer Camping 2025 <${from}>`,
        to,
        subject,
        text
      })
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Mailgun API error ${response.status}: ${responseText}`);
    }
    
    console.log(`[EMAIL] Successfully sent email to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Service for handling email notifications for the message board
 */
export const emailService = {
  /**
   * Send a notification for a new message
   * @param {Object} message - The message object
   * @param {Object} author - The message author
   * @returns {Promise<boolean>}
   */
  sendNewMessageNotification: async (message, authorUsername) => {
    try {
      // Check if notification_preferences table exists
      const { error: tableCheckError } = await supabase
        .from('notification_preferences')
        .select('count', { count: 'exact', head: true });
      
      if (tableCheckError) {
        console.log('Notification preferences table does not exist, skipping email');
        return false;
      }
      
      // Get users who have enabled notifications for all messages
      const { data: userPreferences, error } = await supabase
        .from('notification_preferences')
        .select(`
          user_id,
          receive_all_messages,
          profiles:user_id (
            email
          )
        `)
        .eq('receive_all_messages', true);
      
      if (error) {
        console.error('Error fetching user preferences:', error);
        return false;
      }
      
      // Get list of emails to notify
      const recipientEmails = userPreferences
        .filter(pref => pref.profiles?.email) // Only include users with email
        .map(pref => pref.profiles?.email);
      
      if (recipientEmails.length === 0) {
        console.log('No recipients for message notification');
        return false;
      }
      
      // Send email to each recipient
      const subject = `New message from ${authorUsername || 'Anonymous'}`;
      const text = `
${authorUsername || 'Someone'} posted a new message:

"${message.content}"

Visit the message board to respond.
`;
      
      // Send to all recipients (in production you'd want to use BCC or send individual emails)
      await sendMail(recipientEmails.join(','), subject, text);
      
      return true;
    } catch (error) {
      console.error('Error sending message notification:', error);
      return false;
    }
  },
  
  /**
   * Send a notification for admin announcements
   * @param {Object} message - The announcement message
   * @param {string} adminUsername - The admin username
   * @returns {Promise<boolean>}
   */
  sendAnnouncementNotification: async (message, adminUsername) => {
    try {
      // Check if notification_preferences table exists
      const { error: tableCheckError } = await supabase
        .from('notification_preferences')
        .select('count', { count: 'exact', head: true });
      
      if (tableCheckError) {
        console.log('Notification preferences table does not exist, skipping email');
        return false;
      }
      
      // Get users who have enabled notifications for announcements
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
      
      if (error) {
        console.error('Error fetching user preferences:', error);
        return false;
      }
      
      // Get list of emails to notify
      const recipientEmails = userPreferences
        .filter(pref => pref.profiles?.email) // Only include users with email
        .map(pref => pref.profiles?.email);
      
      if (recipientEmails.length === 0) {
        console.log('No recipients for announcement notification');
        return false;
      }
      
      // Send email to each recipient
      const subject = `ANNOUNCEMENT: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`;
      const text = `
ANNOUNCEMENT from ${adminUsername || 'Admin'}:

"${message.content}"

Visit the message board for more information.
`;
      
      // Send to all recipients (in production you'd want to use BCC or send individual emails)
      await sendMail(recipientEmails.join(','), subject, text);
      
      return true;
    } catch (error) {
      console.error('Error sending announcement notification:', error);
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

export default emailService; 