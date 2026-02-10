# Authentication Setup Guide

## Overview
This application uses Supabase authentication with email OTP (One-Time Password) verification. Users receive a 6-digit code via email to verify their identity during signup.

## Authentication Flow

### Sign Up Process
1. **Enter Email**: User provides their email address
2. **Receive Code**: A 6-digit verification code is sent to their email
3. **Verify Code**: User enters the 6-digit code
4. **Set Password**: After verification, user creates a password
5. **Access Account**: User is automatically logged in

### Login Process
1. **Enter Credentials**: User provides email and password
2. **Access Account**: User is logged in immediately

## Supabase Configuration

### Current Credentials
- **URL**: `https://ihijdpatdzjowdxbdfom.supabase.co`
- **Publishable Key**: `sb_publishable_4GPka-kQdqOC7ruc8-dCEw_dfAru1HU`

### Required Supabase Settings

To enable email OTP authentication, configure these settings in your Supabase dashboard:

1. **Navigate to Authentication > Providers**
   - Enable "Email" provider
   - Enable "Confirm email" option

2. **Navigate to Authentication > Email Templates**
   - Customize the "Magic Link" template (used for OTP)
   - The default template includes the 6-digit code: `{{ .Token }}`

3. **Navigate to Authentication > URL Configuration**
   - Set Site URL: `http://localhost:5173` (for development)
   - Add Redirect URLs as needed for production

4. **Navigate to Authentication > Settings**
   - Enable "Enable email confirmations"
   - Set "Mailer autoconfirm" to OFF (to require email verification)

## Database Schema

The application automatically creates user profiles when a new user signs up:

```sql
-- Profiles table stores user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id),
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Notes table stores user notes
CREATE TABLE public.notes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  is_favorite BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Bookmarks table stores user bookmarks
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  tags TEXT[],
  is_favorite BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Security Features

1. **Row Level Security (RLS)**: All tables have RLS enabled
   - Users can only access their own data
   - Automatic user_id filtering on all queries

2. **Email Verification**: Required before account access
   - 6-digit OTP code sent via email
   - Code expires after a set time (configurable in Supabase)

3. **Password Requirements**: Minimum 6 characters
   - Can be customized in Supabase settings

4. **Session Management**:
   - Automatic token refresh
   - Persistent sessions using localStorage
   - Secure session handling

## Testing the Authentication

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Sign Up Flow**:
   - Navigate to the auth page
   - Click "Sign Up"
   - Enter your email
   - Check your email for the 6-digit code
   - Enter the code
   - Set your password
   - You'll be automatically logged in

3. **Login Flow**:
   - Enter your email and password
   - Click "Log In"
   - Access your account

## Troubleshooting

### Email Not Received
- Check spam/junk folder
- Verify email provider settings in Supabase
- Check Supabase logs for email delivery status

### Invalid Code Error
- Code may have expired (default: 60 seconds)
- Request a new code using "Resend code" button
- Verify email address is correct

### Login Failed
- Ensure email is verified
- Check password is correct (minimum 6 characters)
- Verify user exists in Supabase dashboard

## Environment Variables

Make sure your `.env` file contains:

```env
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_4GPka-kQdqOC7ruc8-dCEw_dfAru1HU"
VITE_SUPABASE_URL="https://ihijdpatdzjowdxbdfom.supabase.co"
```

## API Methods

The `useAuth` hook provides these methods:

```typescript
const {
  user,              // Current user object
  session,           // Current session
  loading,           // Loading state
  signUpWithOtp,     // Send OTP to email
  verifyOtp,         // Verify 6-digit code
  setPassword,       // Set password after verification
  signIn,            // Login with email/password
  signOut,           // Logout
} = useAuth();
```

## Production Deployment

Before deploying to production:

1. Update Site URL in Supabase dashboard
2. Add production domain to Redirect URLs
3. Update `.env` file with production values
4. Configure email templates for your brand
5. Set up custom SMTP (optional) for better email delivery
6. Enable rate limiting to prevent abuse
