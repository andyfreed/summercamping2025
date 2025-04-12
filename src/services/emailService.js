import { supabase } from '../lib/supabase';
import emailTemplates from './emailTemplates';

/**
 * Send an email using the Mailgun API
 */
const sendMail = async (to, subject, text, html = null) => {
  const apiKey = process.env.REACT_APP_MAILGUN_API_KEY;
  const domain = process.env.REACT_APP_MAILGUN_DOMAIN;
  const from = process.env.REACT_APP_MAILGUN_FROM_EMAIL || 'noreply@summercamping2025.com';
  
  // Debug raw API key format
  console.log('[EMAIL DEBUG] Raw API Key format check:', {
    startsWithKey: apiKey?.startsWith('key-'),
    length: apiKey?.length,
    firstFourChars: apiKey?.substring(0, 4),
    envVarName: 'REACT_APP_MAILGUN_API_KEY'
  });

  // Debug environment variables
  console.log('[EMAIL DEBUG] Environment variables loaded:', {
    MAILGUN_API_KEY_PREFIX: apiKey?.substring(0, 8),
    MAILGUN_DOMAIN: domain,
    MAILGUN_FROM: from
  });

  if (!apiKey || !domain || !to) {
    console.error('[EMAIL ERROR] Missing required configuration or recipient');
    return false;
  }

  try {
    console.log(`[EMAIL] Sending email to: ${to}`);
    console.log(`[EMAIL] Subject: ${subject}`);
    
    // Create the body parameters
    const params = new URLSearchParams();
    params.append('from', `Summer Camping 2025 <${from}>`);
    params.append('to', to);
    params.append('subject', subject);
    params.append('text', text);
    
    if (html) {
      params.append('html', html);
    }

    // Create base64 encoded auth string
    const actualKey = apiKey.replace('key-', '');
    const authString = `api:${actualKey}`;
    const auth = window.btoa(authString);
    const authHeader = `Basic ${auth}`;

    console.log('[EMAIL DEBUG] Auth header construction:', {
      keyLength: actualKey.length,
      authStringLength: authString.length,
      base64Length: auth.length,
      authHeaderLength: authHeader.length,
      authStringPrefix: authString.substring(0, 10) + '...',
      base64Prefix: auth.substring(0, 10) + '...',
      isValidBase64: /^[A-Za-z0-9+/=]+$/.test(auth)
    });

    // Log request details
    const endpoint = `https://api.mailgun.net/v3/${domain}/messages`;
    console.log('[EMAIL DEBUG] Trying Mailgun endpoint:', endpoint);
    console.log('[EMAIL DEBUG] Request params:', {
      from: params.get('from'),
      to: params.get('to'),
      subject: params.get('subject')
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('[EMAIL DEBUG] Mailgun API error details:', {
        status: response.status,
        statusText: response.statusText,
        responseBody: responseText,
        url: response.url,
        headers: Object.fromEntries(response.headers)
      });
      throw new Error(`Mailgun API error ${response.status}: ${responseText}`);
    }

    console.log(`[EMAIL] Successfully sent email to ${to}`);
    return true;
  } catch (error) {
    console.error('[EMAIL DEBUG] Detailed error:', error);
    return false;
  }
};

/**
 * Send an email to multiple recipients using BCC
 * @param {Array} bccRecipients - Array of email addresses
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email content
 * @param {string} html - HTML email content
 * @returns {Promise<boolean>} - Success status
 */
const sendMailToBcc = async (bccRecipients, subject, text, html = null) => {
  const apiKey = process.env.REACT_APP_MAILGUN_API_KEY;
  const domain = process.env.REACT_APP_MAILGUN_DOMAIN;
  const from = process.env.REACT_APP_MAILGUN_FROM_EMAIL || 'noreply@summercamping2025.com';
  
  // Debug raw API key format
  console.log('[EMAIL DEBUG] Raw API Key format check:', {
    startsWithKey: apiKey?.startsWith('key-'),
    length: apiKey?.length,
    firstFourChars: apiKey?.substring(0, 4),
    envVarName: 'REACT_APP_MAILGUN_API_KEY'
  });

  // Debug environment variables
  console.log('[EMAIL DEBUG] Environment variables loaded:', {
    MAILGUN_API_KEY_PREFIX: apiKey?.substring(0, 8),
    MAILGUN_DOMAIN: domain,
    MAILGUN_FROM: from
  });

  if (!apiKey || !domain || !bccRecipients || bccRecipients.length === 0) {
    console.error('[EMAIL ERROR] Missing required configuration or recipients');
    return false;
  }

  console.log('[EMAIL DEBUG] Mailgun Configuration:', {
    domain,
    from,
    apiKey: apiKey.substring(0, 8) + '...',
    recipientCount: bccRecipients.length,
    firstRecipient: bccRecipients[0],
    subject
  });

  try {
    console.log(`[EMAIL] Sending BCC email to ${bccRecipients.length} recipients`);
    
    // Create the body parameters
    const params = new URLSearchParams();
    params.append('from', `Summer Camping 2025 <${from}>`);
    params.append('to', from); // Send to self as main recipient
    params.append('bcc', bccRecipients.join(','));
    params.append('subject', subject);
    params.append('text', text);
    
    if (html) {
      params.append('html', html);
    }

    // Create base64 encoded auth string
    const actualKey = apiKey.replace('key-', '');
    const authString = `api:${actualKey}`;
    const auth = window.btoa(authString);
    const authHeader = `Basic ${auth}`;

    console.log('[EMAIL DEBUG] Auth header construction:', {
      keyLength: actualKey.length,
      authStringLength: authString.length,
      base64Length: auth.length,
      authHeaderLength: authHeader.length,
      authStringPrefix: authString.substring(0, 10) + '...',
      base64Prefix: auth.substring(0, 10) + '...',
      isValidBase64: /^[A-Za-z0-9+/=]+$/.test(auth)
    });

    // Log request details
    const endpoint = `https://api.mailgun.net/v3/${domain}/messages`;
    console.log('[EMAIL DEBUG] Trying Mailgun endpoint:', endpoint);
    console.log('[EMAIL DEBUG] Request params:', {
      from: params.get('from'),
      to: params.get('to'),
      bcc: params.get('bcc'),
      subject: params.get('subject')
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('[EMAIL DEBUG] Mailgun API error details:', {
        status: response.status,
        statusText: response.statusText,
        responseBody: responseText,
        url: response.url,
        headers: Object.fromEntries(response.headers)
      });
      throw new Error(`Mailgun API error ${response.status}: ${responseText}`);
    }

    console.log(`[EMAIL] Successfully sent BCC email to ${bccRecipients.length} recipients`);
    return true;
  } catch (error) {
    console.error('[EMAIL DEBUG] Detailed BCC error:', error);
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
      console.log('[EMAIL DEBUG] Starting new message notification process');
      
      // Check if we're within our rate limit
      if (!emailRateLimiter.canSendEmail()) {
        console.log('[EMAIL] Rate limit exceeded, skipping notification');
        return false;
      }

      // Get the current user's session to access auth.users
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[EMAIL DEBUG] Error getting session:', sessionError);
        return false;
      }

      // First get the notification preferences
      const { data: preferences, error: prefError } = await supabase
        .from('notification_preferences')
        .select('user_id, receive_all_messages')
        .eq('receive_all_messages', true);

      if (prefError) {
        console.error('[EMAIL DEBUG] Error fetching user preferences:', prefError);
        return false;
      }

      if (!preferences?.length) {
        console.log('[EMAIL DEBUG] No users have notifications enabled');
        return false;
      }

      console.log('[EMAIL DEBUG] Found preferences for users:', preferences.map(p => p.user_id));

      // Get the user's email from their session
      const recipientEmails = [session.user.email];

      console.log('[EMAIL DEBUG] Recipient emails:', recipientEmails);

      if (!recipientEmails?.length) {
        console.log('[EMAIL DEBUG] No recipients found for new message notification');
        return false;
      }

      // Get email template
      const emailContent = emailTemplates.newMessage(authorUsername, message.content);

      // Send email to all recipients using BCC
      const subject = `New Message from ${authorUsername}`;
      const result = await sendMailToBcc(recipientEmails, subject, emailContent.text, emailContent.html);

      if (result) {
        // Record that we sent an email
        emailRateLimiter.recordEmailSent();
        console.log('[EMAIL DEBUG] Successfully sent new message notifications');
      } else {
        console.log('[EMAIL DEBUG] Failed to send new message notifications');
      }

      return result;
    } catch (error) {
      console.error('[EMAIL DEBUG] Error in sendNewMessageNotification:', error);
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
      
      console.log('[EMAIL DEBUG] Starting announcement notification process');
      
      // Get the current user's session to access auth.users
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[EMAIL DEBUG] Error getting session:', sessionError);
        return false;
      }

      // First get the notification preferences
      const { data: preferences, error: prefError } = await supabase
        .from('notification_preferences')
        .select('user_id, receive_admin_announcements')
        .eq('receive_admin_announcements', true);
      
      if (prefError) {
        console.error('[EMAIL DEBUG] Error fetching announcement preferences:', prefError);
        return false;
      }

      if (!preferences?.length) {
        console.log('[EMAIL DEBUG] No users have announcement notifications enabled');
        return false;
      }

      console.log('[EMAIL DEBUG] Found preferences for users:', preferences.map(p => p.user_id));

      // Get the user's email from their session
      const recipientEmails = [session.user.email];
      
      console.log('[EMAIL DEBUG] Announcement recipient emails:', recipientEmails);
      
      if (!recipientEmails?.length) {
        console.log('[EMAIL DEBUG] No recipients found for announcement');
        return false;
      }
      
      // Get email template
      const emailContent = emailTemplates.announcement(adminUsername, message.content);
      
      // Send email to all recipients using BCC
      const subject = `ANNOUNCEMENT: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`;
      const result = await sendMailToBcc(recipientEmails, subject, emailContent.text, emailContent.html);
      
      if (result) {
        // Record that we sent an email
        emailRateLimiter.recordEmailSent();
        console.log('[EMAIL DEBUG] Successfully sent announcement emails');
      } else {
        console.log('[EMAIL DEBUG] Failed to send announcement emails');
      }
      
      return result;
    } catch (error) {
      console.error('[EMAIL DEBUG] Error in sendAnnouncementNotification:', error);
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
  },

  // Utility function to disable notifications for all users except one
  disableNotificationsExceptFor: async (exceptEmail) => {
    try {
      console.log('[EMAIL DEBUG] Disabling notifications for all users except:', exceptEmail);
      
      // Get the current user's ID since we know it's the admin
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('[EMAIL DEBUG] Error getting current user:', userError);
        return false;
      }
      
      if (!user?.id) {
        console.error('[EMAIL DEBUG] Could not get current user ID');
        return false;
      }

      // First, ensure a notification preference exists for the admin
      const { error: insertError } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: user.id,
          receive_all_messages: true,
          receive_admin_announcements: true,
          receive_direct_mentions: true
        })
        .select()
        .maybeSingle();

      if (insertError && !insertError.message.includes('duplicate')) {
        console.error('[EMAIL DEBUG] Error creating admin preferences:', insertError);
        return false;
      }
      
      // Update all other users' preferences
      const { error: updateError } = await supabase
        .from('notification_preferences')
        .update({
          receive_all_messages: false,
          receive_admin_announcements: false,
          receive_direct_mentions: false
        })
        .neq('user_id', user.id);
      
      if (updateError) {
        console.error('[EMAIL DEBUG] Error updating notification preferences:', updateError);
        return false;
      }
      
      console.log('[EMAIL DEBUG] Successfully updated notification preferences');
      return true;
    } catch (error) {
      console.error('[EMAIL DEBUG] Error in disableNotificationsExceptFor:', error);
      return false;
    }
  }
};

export { sendMail, sendMailToBcc, emailService as default }; 