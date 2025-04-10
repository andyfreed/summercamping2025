# Summer Camping 2025

A community website for the upcoming summer camping event. Features include a message board, information about the house, boat, and general area.

## Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Configure environment variables (see below)
4. Run `npm start` to start the development server

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase settings
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Mailgun settings (for email notifications)
REACT_APP_MAILGUN_DOMAIN=your-mailgun-domain.com
REACT_APP_MAILGUN_API_KEY=your-mailgun-api-key
REACT_APP_MAILGUN_FROM_EMAIL=noreply@your-domain.com
```

## Email Notifications

The message board supports email notifications when new messages are posted. To enable this functionality:

1. Sign up for a [Mailgun](https://www.mailgun.com/) account
2. Add your Mailgun API key and domain to the `.env.local` file
3. Create the `notification_preferences` table in your Supabase database

### Creating the Notification Preferences Table

Run the following SQL in your Supabase SQL Editor:

```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receive_all_messages BOOLEAN DEFAULT false,
  receive_direct_mentions BOOLEAN DEFAULT false,
  receive_admin_announcements BOOLEAN DEFAULT true,
  email_digest_frequency VARCHAR(10) DEFAULT 'daily',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS (Row Level Security) policies
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Only allow users to read/update their own preferences
CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own notification preferences"
  ON notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Message Board Features

The message board includes:

- Real-time message updates
- Email notifications for new messages (when configured)
- Admin announcements
- User-specific settings for notification preferences
- Fallback functionality when database is unavailable

## Security Notes

- Never commit API keys to version control
- Use `.env.local` for local development secrets
- Environment variables are exposed to the browser in create-react-app - never put server-side secrets in the .env files 