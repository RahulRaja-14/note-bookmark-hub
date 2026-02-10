# Custom 6-Digit OTP Setup Guide

## 🎯 Overview

This implementation creates a **custom 6-digit verification code system** that:
- Generates exactly 6 numeric digits (000000 to 999999)
- Stores codes in your Supabase database
- Expires codes after 5 minutes
- Sends codes via email
- Verifies codes before account creation

## 📋 Setup Steps

### Step 1: Run the Database Migration

1. Go to Supabase Dashboard: https://app.supabase.com/project/ihijdpatdzjowdxbdfom

2. Navigate to: **SQL Editor**

3. Click **"New Query"**

4. Copy and paste the entire content from: `supabase/migrations/create_custom_otp.sql`

5. Click **"Run"**

This creates:
- `email_verification_codes` table
- `generate_verification_code()` function
- `verify_code()` function
- Necessary indexes and policies

### Step 2: Deploy the Edge Function

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ihijdpatdzjowdxbdfom

# Deploy the function
supabase functions deploy send-verification-email
```

#### Option B: Manual Deployment

1. Go to: https://app.supabase.com/project/ihijdpatdzjowdxbdfom/functions

2. Click **"Create a new function"**

3. Name it: `send-verification-email`

4. Copy the code from: `supabase/functions/send-verification-email/index.ts`

5. Click **"Deploy"**

### Step 3: Configure Email Service (Important!)

The Edge Function needs an email service to send the 6-digit codes. You have several options:

#### Option A: Use Resend (Recommended - Easy Setup)

1. Sign up at: https://resend.com (Free tier: 100 emails/day)

2. Get your API key

3. Update the Edge Function to use Resend:

```typescript
// Add this to the Edge Function
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${RESEND_API_KEY}`
  },
  body: JSON.stringify({
    from: 'NoteMark <onboarding@resend.dev>',
    to: [email],
    subject: 'Your Verification Code',
    html: emailHtml
  })
})
```

4. Add the API key to Supabase:
   - Go to: **Edge Functions → send-verification-email → Settings**
   - Add secret: `RESEND_API_KEY` = your_resend_api_key

#### Option B: Use SendGrid

Similar to Resend, but use SendGrid's API

#### Option C: Use Supabase's Built-in Email (Temporary)

For testing, the function currently logs the code to console. You can see it in the Edge Function logs.

### Step 4: Test the Implementation

1. Make sure your app is running:
```bash
npm run dev
```

2. Open: http://localhost:8080/

3. Click "Sign Up"

4. Enter your email

5. Check:
   - **If using email service**: Check your email inbox
   - **If testing**: Check browser console for the code (it's logged for testing)

6. Enter the 6-digit code

7. Set your password

8. You're logged in! ✅

## 🔍 How It Works

### Flow Diagram

```
User enters email
    ↓
Frontend calls Edge Function
    ↓
Edge Function generates 6-digit code
    ↓
Code stored in database (expires in 5 min)
    ↓
Email sent with code
    ↓
User enters code
    ↓
Frontend calls verify_code() function
    ↓
Database checks if code is valid
    ↓
If valid: User creates password
    ↓
Supabase Auth creates account
    ↓
Profile auto-created via trigger
    ↓
User logged in!
```

### Database Schema

```sql
email_verification_codes
├── id (UUID)
├── email (TEXT)
├── code (TEXT) -- 6 digits: "123456"
├── expires_at (TIMESTAMP) -- 5 minutes from creation
├── verified (BOOLEAN)
└── created_at (TIMESTAMP)
```

## 🧪 Testing

### Test Without Email Service

For testing, the Edge Function returns the code in the response:

```javascript
// In browser console after clicking "Send Code"
// You'll see: { success: true, code: "123456" }
```

The code is also logged to the Edge Function logs:
- Go to: **Edge Functions → send-verification-email → Logs**

### Test With Email Service

Once you configure Resend or SendGrid:
1. Enter your real email
2. Check your inbox
3. Copy the 6-digit code
4. Paste in the verification boxes

## 🔒 Security Features

- ✅ Codes expire after 5 minutes
- ✅ Codes are single-use (marked as verified)
- ✅ Old codes are deleted when new ones are generated
- ✅ Codes are random and unique
- ✅ Row Level Security enabled
- ✅ Automatic cleanup of expired codes

## 🐛 Troubleshooting

### "Failed to send verification code"

**Check:**
1. Edge Function is deployed
2. Database migration is run
3. Email service is configured (if using one)

**Solution:**
- Check Edge Function logs in Supabase
- Verify the function name matches: `send-verification-email`

### "Invalid or expired code"

**Check:**
1. Code hasn't expired (5 minutes)
2. Code is exactly 6 digits
3. Code hasn't been used already

**Solution:**
- Request a new code
- Check database: `SELECT * FROM email_verification_codes WHERE email = 'your@email.com'`

### Code not received in email

**Check:**
1. Email service is configured
2. API keys are correct
3. Check spam folder

**Solution:**
- Check Edge Function logs for errors
- Verify email service API key
- For testing, check browser console for the code

### Database errors

**Check:**
1. Migration was run successfully
2. Functions exist: `generate_verification_code`, `verify_code`
3. Table exists: `email_verification_codes`

**Solution:**
- Re-run the migration
- Check SQL Editor for errors
- Verify RLS policies are enabled

## 📊 Monitoring

### Check Generated Codes

```sql
SELECT * FROM email_verification_codes
WHERE email = 'user@example.com'
ORDER BY created_at DESC;
```

### Check Expired Codes

```sql
SELECT * FROM email_verification_codes
WHERE expires_at < now();
```

### Clean Up Expired Codes

```sql
SELECT cleanup_expired_verification_codes();
```

## 🚀 Production Checklist

Before going live:

- [ ] Database migration run
- [ ] Edge Function deployed
- [ ] Email service configured (Resend/SendGrid)
- [ ] API keys added to Edge Function secrets
- [ ] Remove test code logging from Edge Function
- [ ] Test complete signup flow
- [ ] Verify emails are being sent
- [ ] Check spam folder placement
- [ ] Set up monitoring/alerts
- [ ] Configure email templates with branding

## 💡 Advantages of Custom System

✅ **Exactly 6 digits** - Not 8 like Supabase default
✅ **Full control** - Customize expiration, format, etc.
✅ **Custom emails** - Design your own email templates
✅ **Better UX** - Users see exactly 6 digits
✅ **Flexible** - Easy to modify and extend

## 🔄 Alternative: Simple Workaround

If you don't want to set up Edge Functions, you can use the simpler workaround:

1. Keep using Supabase's built-in OTP (8 digits)
2. Tell users to enter only the last 6 digits
3. Update email template to highlight the last 6 digits

See: `SUPABASE_EMAIL_TEMPLATE_6DIGIT.md` for this approach.

## 📞 Need Help?

1. Check Edge Function logs in Supabase
2. Check browser console for errors
3. Verify database migration ran successfully
4. Test with console.log to see the generated code
5. Check email service logs (Resend/SendGrid dashboard)

---

**Your custom 6-digit OTP system is ready!** 🎉
