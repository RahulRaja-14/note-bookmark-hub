# Supabase Email OTP Configuration

## Quick Setup Steps

### 1. Access Your Supabase Dashboard
Go to: `https://app.supabase.com/project/ihijdpatdzjowdxbdfom`

### 2. Enable Email Authentication

**Path**: Authentication → Providers → Email

- ✅ Enable "Email" provider
- ✅ Enable "Confirm email"
- ✅ Save changes

### 3. Configure Email Templates

**Path**: Authentication → Email Templates → Magic Link

The Magic Link template is used for OTP codes. Default template:

```html
<h2>Magic Link</h2>
<p>Follow this link to login:</p>
<p><a href="{{ .ConfirmationURL }}">Log In</a></p>
<p>Or enter this code: <strong>{{ .Token }}</strong></p>
```

**Recommended Custom Template for 6-Digit Code**:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .code-box { 
      background: #f4f4f4; 
      border: 2px solid #ddd; 
      border-radius: 8px; 
      padding: 20px; 
      text-align: center; 
      margin: 20px 0; 
    }
    .code { 
      font-size: 32px; 
      font-weight: bold; 
      letter-spacing: 8px; 
      color: #2563eb; 
    }
    .footer { 
      text-align: center; 
      color: #666; 
      font-size: 12px; 
      margin-top: 30px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>
    
    <p>Hello,</p>
    <p>Thank you for signing up! Please use the verification code below to complete your registration:</p>
    
    <div class="code-box">
      <div class="code">{{ .Token }}</div>
    </div>
    
    <p>This code will expire in 60 seconds.</p>
    <p>If you didn't request this code, please ignore this email.</p>
    
    <div class="footer">
      <p>This is an automated message from NoteMark.</p>
    </div>
  </div>
</body>
</html>
```

### 4. Configure URL Settings

**Path**: Authentication → URL Configuration

- **Site URL**: `http://localhost:5173` (development)
- **Redirect URLs**: Add your production URLs when deploying

### 5. Authentication Settings

**Path**: Authentication → Settings

- ✅ **Enable email confirmations**: ON
- ⚙️ **Mailer autoconfirm**: OFF (require verification)
- ⚙️ **Secure email change**: ON (recommended)
- ⚙️ **Double confirm email changes**: ON (recommended)

### 6. Rate Limiting (Optional but Recommended)

**Path**: Authentication → Rate Limits

Configure to prevent abuse:
- **Email sends per hour**: 10-20 (per IP)
- **Verification attempts**: 5-10 (per email)

### 7. Custom SMTP (Optional - For Production)

**Path**: Project Settings → Auth → SMTP Settings

For better email deliverability in production, configure custom SMTP:

- **SMTP Host**: Your email provider's SMTP server
- **SMTP Port**: Usually 587 (TLS) or 465 (SSL)
- **SMTP User**: Your email address
- **SMTP Password**: Your email password or app password
- **Sender Email**: The "from" address for emails
- **Sender Name**: Your app name (e.g., "NoteMark")

**Popular SMTP Providers**:
- SendGrid
- Mailgun
- AWS SES
- Postmark
- Resend

## Testing Email Delivery

### Test in Development

1. Start your app: `npm run dev`
2. Go to signup page
3. Enter your email
4. Check your inbox (and spam folder)
5. You should receive a 6-digit code

### Check Email Logs

**Path**: Authentication → Logs

View all authentication events including:
- Email sent
- Email delivered
- Email failed
- OTP verified
- Login attempts

## Common Issues & Solutions

### Issue: Emails Not Received

**Solutions**:
1. Check spam/junk folder
2. Verify email provider allows emails from Supabase
3. Check Supabase email logs for delivery status
4. Try a different email address
5. Configure custom SMTP for better deliverability

### Issue: "Invalid or Expired Code"

**Solutions**:
1. Code expires in 60 seconds - request a new one
2. Ensure you're entering the correct code
3. Check for typos (codes are case-sensitive)
4. Clear browser cache and try again

### Issue: Rate Limit Exceeded

**Solutions**:
1. Wait before requesting another code
2. Adjust rate limits in Supabase dashboard
3. Use a different email or IP address for testing

### Issue: Email Template Not Updating

**Solutions**:
1. Clear browser cache
2. Wait a few minutes for changes to propagate
3. Test with a new email address
4. Check template syntax for errors

## Email Template Variables

Available variables in email templates:

- `{{ .Token }}` - The 6-digit OTP code
- `{{ .TokenHash }}` - Hashed version of token
- `{{ .ConfirmationURL }}` - Magic link URL (alternative to OTP)
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email address

## Security Best Practices

1. **Never share your Supabase keys publicly**
2. **Use environment variables** for all credentials
3. **Enable rate limiting** to prevent abuse
4. **Use HTTPS** in production
5. **Configure proper CORS** settings
6. **Monitor authentication logs** regularly
7. **Set appropriate token expiration** times
8. **Use custom SMTP** in production for better control

## Production Checklist

Before going live:

- [ ] Configure custom SMTP
- [ ] Update Site URL to production domain
- [ ] Add all redirect URLs
- [ ] Customize email templates with branding
- [ ] Enable rate limiting
- [ ] Test email delivery from production
- [ ] Set up monitoring/alerts
- [ ] Review security settings
- [ ] Test signup/login flow end-to-end
- [ ] Verify RLS policies are working

## Support

If you encounter issues:

1. Check Supabase documentation: https://supabase.com/docs/guides/auth
2. Review authentication logs in dashboard
3. Test with Supabase CLI: `supabase functions serve`
4. Contact Supabase support: https://supabase.com/support
