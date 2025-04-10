// Supabase Edge Function for sending new message notifications
// This would be deployed to Supabase and called via the email service

// Example implementation using Resend.com (you would need to set up an account)
import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle OPTIONS requests for CORS
async function handleCors(request) {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
}

// Main function handler
Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = await handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse the request body
    const { recipients, message, author } = await req.json();
    
    // Validate request
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid recipients' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!message || !message.content) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid message content' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Format message date
    const messageDate = new Date(message.created_at).toLocaleString();
    
    // Create email template
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Message on Summer Camping 2025</h2>
        <div style="border-left: 4px solid #FF7E00; padding: 10px; background-color: #f9f9f9; margin: 20px 0;">
          <p style="margin: 0 0 5px 0;"><strong>${author.username}</strong> posted a new message:</p>
          <p style="margin: 0; font-size: 16px;">${message.content}</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">${messageDate}</p>
        </div>
        <p>
          <a href="https://summercamping2025.com/messages" 
             style="background-color: #FF7E00; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Message Board
          </a>
        </p>
        <p style="font-size: 12px; color: #666; margin-top: 30px;">
          You're receiving this email because you've enabled notifications for new messages.
          <br>
          To update your notification preferences, visit your profile settings on the Message Board.
        </p>
      </div>
    `;
    
    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Summer Camping <notifications@summercamping2025.com>',
      to: recipients,
      subject: `New Message from ${author.username} - Summer Camping 2025`,
      html: emailHtml,
    });
    
    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing email request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 