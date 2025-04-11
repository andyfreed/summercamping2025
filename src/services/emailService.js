import { supabase } from '../lib/supabase';
import emailTemplates from './emailTemplates';

// Real implementation using the Mailgun API
const sendMail = async (to, subject, text, html = null) => {
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
    
    // Create the body parameters
    const params = {
      from: `Summer Camping 2025 <${from}>`,
      to,
      subject,
      text
    };
    
    // Add HTML version if provided
    if (html) {
      params.html = html;
    }
    
    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('api:' + apiKey),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params)
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
 * Send an email to multiple recipients using BCC
 * @param {Array} recipients - Array of email addresses
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email content
 * @param {string} html - HTML email content
 * @returns {Promise<boolean>} - Success status
 */
const sendMailToBcc = async (recipients, subject, text, html = null) => {
  if (!recipients || !recipients.length) {
    console.warn('No recipients provided for email');
    return false;
  }
  
  // For privacy, use BCC and send to the website's own address
  const apiKey = process.env.REACT_APP_MAILGUN_API_KEY;
  const domain = process.env.REACT_APP_MAILGUN_DOMAIN;
  const from = process.env.REACT_APP_MAILGUN_FROM_EMAIL || 'noreply@summercamping2025.com';
  
  if (!apiKey || !domain) {
    console.error('Mailgun API key or domain not configured');
    console.log(`[EMAIL ERROR] Email not sent - missing configuration`);
    return false;
  }

  try {
    console.log(`[EMAIL] Sending BCC email to ${recipients.length} recipients`);
    console.log(`[EMAIL] Subject: ${subject}`);
    
    // Create the body parameters
    const params = {
      from: `Summer Camping 2025 <${from}>`,
      to: from, // Send to ourselves
      bcc: recipients.join(','), // BCC all recipients
      subject,
      text
    };
    
    // Add HTML version if provided
    if (html) {
      params.html = html;
    }
    
    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('api:' + apiKey),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params)
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`Mailgun API error ${response.status}: ${responseText}`);
    }
    
    console.log(`[EMAIL] Successfully sent BCC email to ${recipients.length} recipients`);
    return true;
  } catch (error) {
    console.error('Error sending BCC email:', error);
    return false;
  }
};

/**
 * Rate limit to avoid sending too many emails at once
 * Keeps track of email send times and limits to a max number per minute
 */
const emailRateLimiter = {
  // Array to track timestamps of recent emails
  recentEmails: [],
  // Maximum emails per minute 
  maxPerMinute: 10,
  
  /**
   * Check if we can send another email (within rate limit)
   * @returns {boolean} - True if allowed to send
   */
  canSendEmail() {
    const now = Date.now();
    // Remove emails older than 1 minute from tracking array
    this.recentEmails = this.recentEmails.filter(
      timestamp => now - timestamp < 60000
    );
    
    // Check if we're under the limit
    return this.recentEmails.length < this.maxPerMinute;
  },
  
  /**
   * Record that we sent an email
   */
  recordEmailSent() {
    this.recentEmails.push(Date.now());
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
      // Check if we're within our rate limit
      if (!emailRateLimiter.canSendEmail()) {
        console.log('[EMAIL] Rate limit exceeded, skipping notification');
        return false;
      }
      
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
      
      // Get email template
      const emailContent = emailTemplates.newMessage(authorUsername, message.content);
      
      // Send to all recipients using BCC
      const subject = `New message from ${authorUsername || 'Anonymous'}`;
      await sendMailToBcc(recipientEmails, subject, emailContent.text, emailContent.html);
      
      // Record that we sent an email
      emailRateLimiter.recordEmailSent();
      
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
      // Check if we're within our rate limit
      if (!emailRateLimiter.canSendEmail()) {
        console.log('[EMAIL] Rate limit exceeded, skipping announcement');
        return false;
      }
      
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
      
      // Get email template
      const emailContent = emailTemplates.announcement(adminUsername, message.content);
      
      // Send email to all recipients using BCC
      const subject = `ANNOUNCEMENT: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`;
      await sendMailToBcc(recipientEmails, subject, emailContent.text, emailContent.html);
      
      // Record that we sent an email
      emailRateLimiter.recordEmailSent();
      
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
      // Check if we're within our rate limit
      if (!emailRateLimiter.canSendEmail()) {
        console.log('[EMAIL] Rate limit exceeded, skipping mention notifications');
        return false;
      }
      
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
      
      // Get email template
      const emailContent = emailTemplates.mention(author.username || 'Someone', message.content);
      
      // Send email to mentioned recipients
      const subject = `You were mentioned by ${author.username || 'Someone'}`;
      await sendMailToBcc(recipientEmails, subject, emailContent.text, emailContent.html);
      
      // Record that we sent an email
      emailRateLimiter.recordEmailSent();
      
      return true;
    } catch (error) {
      console.error('Error sending mention notifications:', error);
      return false;
    }
  }
};

export default emailService; 