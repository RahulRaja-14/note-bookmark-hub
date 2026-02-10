# Supabase Email Template - 6 Digit Code

## 🔧 Configure This in Supabase Dashboard

Go to: https://app.supabase.com/project/ihijdpatdzjowdxbdfom/auth/templates

Click on **"Magic Link"** template and replace with this:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
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
    .code-small {
      font-size: 32px;
      color: #999;
      text-decoration: line-through;
      margin-right: 10px;
    }
    .instructions {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      color: #666;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
    }
    .warning {
      color: #d32f2f;
      font-weight: 500;
      margin-top: 20px;
    }
    .highlight {
      background: #ffeb3b;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Email Verification</h1>
    </div>
    
    <div class="content">
      <h2 style="color: #333; margin-top: 0;">Welcome to NoteMark!</h2>
      <p>Thank you for signing up. To complete your registration, please use the verification code below:</p>
      
      <div class="code-box">
        <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Your Verification Code</div>
        <div class="code">{{ .Token }}</div>
        <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 6px;">
          <strong style="color: #856404;">⚠️ IMPORTANT:</strong><br>
          <span style="color: #856404;">Use only the <span class="highlight">LAST 6 DIGITS</span> of this code</span>
        </div>
      </div>
      
      <div class="instructions">
        <strong>📋 How to use this code:</strong>
        <ol style="margin: 10px 0; padding-left: 20px;">
          <li>Copy the <strong>last 6 digits</strong> from the code above</li>
          <li>Return to the signup page</li>
          <li>Enter the 6-digit code in the verification boxes</li>
          <li>Create your password</li>
        </ol>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        <strong>⏱️ Important:</strong> This code will expire in <strong>60 seconds</strong> for security reasons.
      </p>
      
      <p class="warning">
        ⚠️ If you didn't request this code, please ignore this email.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 5px 0;">This is an automated message from NoteMark</p>
      <p style="margin: 5px 0; color: #999;">Please do not reply to this email</p>
    </div>
  </div>
</body>
</html>
```

## 📝 Instructions for Users

The email will show an 8-digit code like: `12345678`

Users should enter only the **last 6 digits**: `345678`

## ✅ How It Works

1. Supabase sends 8-digit code (e.g., `12345678`)
2. Email template tells user to use last 6 digits
3. User enters: `345678`
4. App tries to verify with `345678`
5. If that fails, app tries `00345678` (adding prefix)
6. Verification succeeds! ✅

## 🔄 Alternative: Show Only Last 6 Digits

If you want the email to show ONLY 6 digits, you would need to use Supabase Edge Functions to generate custom codes. However, the above solution is simpler and works with Supabase's built-in OTP system.
