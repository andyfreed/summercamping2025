// Supabase Edge Function for sending admin announcement notifications
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
    const { recipients, message, admin } = await req.json();
    
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
    
    // Create email template for announcements - more styled and prominent
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #FF7E00; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">📢 IMPORTANT ANNOUNCEMENT</h1>
        </div>
        <div style="border: 1px solid #FF7E00; padding: 20px; background-color: #fff; margin: 0;">
          <h2 style="color: #FF7E00; margin-top: 0;">Summer Camping 2025 Announcement</h2>
          <p style="font-size: 16px; line-height: 1.5;">${message.content}</p>
          <p style="font-size: 14px; font-style: italic; margin-bottom: 0;">
            Posted by ${admin.username} on ${messageDate}
          </p>
        </div>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin-top: 20px;">
          <a href="https://summercamping2025.com/messages" 
             style="background-color: #FF7E00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            VIEW ALL ANNOUNCEMENTS
          </a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 20px; text-align: center;">
          You're receiving this important notification from the Summer Camping 2025 administrators.
          <br>
          To update your notification preferences, visit your profile settings on the Message Board.
        </p>
      </div>
    `;
    
    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Summer Camping <announcements@summercamping2025.com>',
      to: recipients,
      subject: `🔴 IMPORTANT: Announcement from Summer Camping 2025`,
      html: emailHtml,
    });
    
    if (error) {
      console.error('Error sending announcement email:', error);
      throw error;
    }
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing announcement email request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 