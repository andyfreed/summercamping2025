/**
 * Email templates for the application
 * Each template has both HTML and plain text versions
 */

/**
 * Creates a basic HTML email wrapper
 * @param {string} content - The email content
 * @returns {string} - HTML email
 */
const createHtmlEmail = (content) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Summer Camping 2025</title>
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      background-color: #3f51b5;
      padding: 20px;
      color: white;
      border-radius: 5px 5px 0 0;
      text-align: center;
    }
    .content {
      padding: 20px;
      background-color: #f9f9f9;
      border: 1px solid #eee;
    }
    .footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #999;
    }
    .button {
      display: inline-block;
      background-color: #3f51b5;
      color: white;
      padding: 10px 20px;
      margin: 15px 0;
      text-decoration: none;
      border-radius: 4px;
    }
    .announcement {
      background-color: #ff9800;
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      color: white;
      font-weight: bold;
    }
    .message {
      background-color: #f5f5f5;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #3f51b5;
      border-radius: 4px;
    }
    .mention {
      background-color: #e3f2fd;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Summer Camping 2025</h1>
  </div>
  <div class="content">
    ${content}
  </div>
  <div class="footer">
    <p>This is an automated message from Summer Camping 2025.</p>
    <p>You received this email because you enabled notifications in your account preferences.</p>
    <p>To change your notification settings, visit the message board and click on "Email Notifications".</p>
  </div>
</body>
</html>`;
};

export const emailTemplates = {
  /**
   * Template for new message notifications
   * @param {string} authorUsername - The message author's username
   * @param {string} messageContent - The message content
   * @returns {Object} - Object with text and html properties
   */
  newMessage: (authorUsername, messageContent) => {
    const username = authorUsername || 'Anonymous';
    const text = `
${username} posted a new message:

"${messageContent}"

Visit the message board to respond.

---
You received this email because you enabled notifications in your account preferences.
To change your notification settings, visit the message board and click on "Email Notifications".
`;

    const html = createHtmlEmail(`
      <h2>New Message</h2>
      <p><strong>${username}</strong> posted a new message:</p>
      <div class="message">
        "${messageContent}"
      </div>
      <a href="${process.env.REACT_APP_WEBSITE_URL || '#'}/message-board" class="button">View on Message Board</a>
    `);

    return {
      text,
      html
    };
  },

  /**
   * Template for announcement notifications
   * @param {string} adminUsername - The admin's username
   * @param {string} messageContent - The announcement content
   * @returns {Object} - Object with text and html properties
   */
  announcement: (adminUsername, messageContent) => {
    const username = adminUsername || 'Admin';
    const text = `
ANNOUNCEMENT from ${username}:

"${messageContent}"

Visit the message board for more information.

---
You received this email because you enabled notifications in your account preferences.
To change your notification settings, visit the message board and click on "Email Notifications".
`;

    const html = createHtmlEmail(`
      <h2>🔔 Announcement</h2>
      <p><strong>${username}</strong> has posted an important announcement:</p>
      <div class="announcement">
        "${messageContent}"
      </div>
      <a href="${process.env.REACT_APP_WEBSITE_URL || '#'}/message-board" class="button">View on Message Board</a>
    `);

    return {
      text,
      html
    };
  },

  /**
   * Template for @mention notifications
   * @param {string} mentionerUsername - Username of the person who mentioned
   * @param {string} messageContent - The message content
   * @returns {Object} - Object with text and html properties
   */
  mention: (mentionerUsername, messageContent) => {
    const username = mentionerUsername || 'Someone';
    const text = `
${username} mentioned you in a message:

"${messageContent}"

Visit the message board to respond.

---
You received this email because you enabled notifications in your account preferences.
To change your notification settings, visit the message board and click on "Email Notifications".
`;

    const html = createHtmlEmail(`
      <h2>You've Been Mentioned</h2>
      <p><strong>${username}</strong> mentioned you in a message:</p>
      <div class="mention">
        "${messageContent}"
      </div>
      <a href="${process.env.REACT_APP_WEBSITE_URL || '#'}/message-board" class="button">Reply on Message Board</a>
    `);

    return {
      text,
      html
    };
  }
};

export default emailTemplates; 