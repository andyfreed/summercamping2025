// Supabase Edge Function for sending notification when a user is mentioned in a message
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
    
    // Highlight mentions in message
    const highlightedContent = message.content.replace(
      /@(\w+)/g, 
      '<span style="color: #FF7E00; font-weight: bold;">@$1</span>'
    );
    
    // Create email template for mentions
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You were mentioned on the Summer Camping 2025 Message Board!</h2>
        <div style="border-left: 4px solid #008080; padding: 10px; background-color: #f9f9f9; margin: 20px 0;">
          <p style="margin: 0 0 5px 0;"><strong>${author.username}</strong> mentioned you in a message:</p>
          <p style="margin: 0; font-size: 16px; line-height: 1.5;">${highlightedContent}</p>
          <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">${messageDate}</p>
        </div>
        <p>
          <a href="https://summercamping2025.com/messages" 
             style="background-color: #008080; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reply Now
          </a>
        </p>
        <p style="font-size: 12px; color: #666; margin-top: 30px;">
          You're receiving this email because someone mentioned you in a message.
          <br>
          To update your notification preferences, visit your profile settings on the Message Board.
        </p>
      </div>
    `;
    
    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Summer Camping <mentions@summercamping2025.com>',
      to: recipients,
      subject: `@${author.username} mentioned you on Summer Camping 2025`,
      html: emailHtml,
    });
    
    if (error) {
      console.error('Error sending mention email:', error);
      throw error;
    }
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing mention email request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 