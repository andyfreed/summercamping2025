# Supabase Edge Functions for Email Notifications

This directory contains Edge Functions that handle sending email notifications for the message board.

## Functions

1. **send-message-notification**: Sends email notifications when a new message is posted
2. **send-admin-announcement**: Sends email notifications when an admin posts an announcement
3. **send-mention-notification**: Sends email notifications when a user is mentioned in a message

## Prerequisites

1. [Supabase CLI](https://supabase.com/docs/guides/cli)
2. [Deno](https://deno.land/) (required by Supabase Edge Functions)
3. A Supabase project
4. An email sending service account (the examples use [Resend](https://resend.com))

## Setup

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to your Supabase account:
   ```bash
   supabase login
   ```

3. Link to your Supabase project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

4. Set your email service API key as a secret:
   ```bash
   supabase secrets set RESEND_API_KEY=your_resend_api_key
   ```

## Deployment

Deploy all functions at once:

```bash
supabase functions deploy
```

Or deploy individual functions:

```bash
supabase functions deploy send-message-notification
supabase functions deploy send-admin-announcement
supabase functions deploy send-mention-notification
```

## Testing

You can test the functions locally before deploying:

```bash
supabase functions serve
```

Then use curl or a tool like Postman to send test requests:

```bash
curl -X POST http://localhost:54321/functions/v1/send-message-notification \
  -H "Content-Type: application/json" \
  -d '{"recipients":["test@example.com"], "message":{"content":"Test message", "created_at":"2023-04-01T12:00:00"}, "author":{"username":"TestUser", "email":"author@example.com"}}'
```

## Database Setup

These functions require a `notification_preferences` table in your Supabase database. Create it with:

```sql
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receive_all_messages BOOLEAN NOT NULL DEFAULT FALSE,
  receive_direct_mentions BOOLEAN NOT NULL DEFAULT TRUE,
  receive_admin_announcements BOOLEAN NOT NULL DEFAULT TRUE,
  email_digest_frequency TEXT NOT NULL DEFAULT 'daily',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an RLS policy for this table
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own preferences
CREATE POLICY "Users can read their own preferences"
  ON notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

Also, make sure the `messages` table has an `is_announcement` column:

```sql
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_announcement BOOLEAN NOT NULL DEFAULT FALSE;
```

## Integration

The Edge Functions are called from the `emailService.js` in the React application. Make sure the Edge Function URLs are correctly configured to match your Supabase project. 