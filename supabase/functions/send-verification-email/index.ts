import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate 6-digit code
    const { data: codeData, error: codeError } = await supabaseClient
      .rpc('generate_verification_code', { user_email: email })

    if (codeError) {
      throw codeError
    }

    const code = codeData

    // Send email using Supabase's built-in email service
    // Note: You'll need to configure SMTP in Supabase or use a service like Resend
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 40px 30px;
    }
    .code-box {
      background: #f8f9fa;
      border: 2px dashed #667eea;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 48px;
      font-weight: bold;
      letter-spacing: 12px;
      color: #667eea;
      font-family: 'Courier New', monospace;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      color: #666;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Email Verification</h1>
    </div>
    
    <div class="content">
      <h2 style="margin-top: 0;">Welcome to NoteMark!</h2>
      <p>Thank you for signing up. Please use this 6-digit code to verify your email:</p>
      
      <div class="code-box">
        <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Your Verification Code</div>
        <div class="code">${code}</div>
      </div>
      
      <p style="color: #666;">
        <strong>⏱️ This code will expire in 5 minutes.</strong>
      </p>
      
      <p style="color: #d32f2f; font-weight: 500;">
        ⚠️ If you didn't request this code, please ignore this email.
      </p>
    </div>
    
    <div class="footer">
      <p>This is an automated message from NoteMark</p>
    </div>
  </div>
</body>
</html>
    `

    // For now, return the code (in production, you'd send via email service)
    // You can integrate with Resend, SendGrid, or other email services here
    console.log(`Verification code for ${email}: ${code}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification code generated',
        // Remove this in production - only for testing
        code: code 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
