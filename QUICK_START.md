# Quick Start Guide - Email OTP Authentication

## ✅ What's Already Configured

Your application is now fully configured with:

1. ✅ **Supabase Client** - Connected to your Supabase instance
2. ✅ **Email OTP Authentication** - 6-digit code verification
3. ✅ **User Data Storage** - Profiles, notes, and bookmarks tables
4. ✅ **Row Level Security** - Users can only access their own data
5. ✅ **Auto Profile Creation** - Profile created automatically on signup
6. ✅ **Protected Routes** - Authentication required for app pages

## 🚀 Start the Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The app will be available at: `http://localhost:5173`

## 📧 Configure Supabase Email (IMPORTANT!)

Before testing, you MUST configure email settings in Supabase:

### Step 1: Go to Supabase Dashboard
Visit: `https://app.supabase.com/project/ihijdpatdzjowdxbdfom`

### Step 2: Enable Email Provider
1. Navigate to: **Authentication → Providers**
2. Find "Email" and click to expand
3. Enable "Email" provider
4. Enable "Confirm email" option
5. Click "Save"

### Step 3: Verify Email Template
1. Navigate to: **Authentication → Email Templates**
2. Click on "Magic Link" template
3. Ensure it contains: `{{ .Token }}` (this is the 6-digit code)
4. Save if you made changes

### Step 4: Set Site URL
1. Navigate to: **Authentication → URL Configuration**
2. Set Site URL to: `http://localhost:5173`
3. Click "Save"

**See `SUPABASE_EMAIL_CONFIG.md` for detailed configuration steps**

## 🧪 Test the Authentication

### Sign Up Flow:
1. Open `http://localhost:5173`
2. Click "Sign Up"
3. Enter your email address
4. Click "Send Code"
5. Check your email for 6-digit code
6. Enter the code
7. Set your password
8. You're logged in! 🎉

### Login Flow:
1. Enter your email and password
2. Click "Log In"
3. Access your account

**See `test-auth.md` for comprehensive testing guide**

## 📁 Project Structure

```
src/
├── integrations/supabase/
│   ├── client.ts          # Supabase client configuration
│   └── types.ts           # Database types
├── hooks/
│   └── useAuth.ts         # Authentication hook with OTP methods
├── pages/
│   ├── Auth.tsx           # Login/Signup page with OTP flow
│   ├── Notes.tsx          # Notes management
│   └── Bookmarks.tsx      # Bookmarks management
└── components/
    └── auth/
        └── ProtectedRoute.tsx  # Route protection
```

## 🔑 Authentication Methods

The `useAuth` hook provides:

```typescript
const {
  user,              // Current user object
  session,           // Current session
  loading,           // Loading state
  signUpWithOtp,     // Send 6-digit code to email
  verifyOtp,         // Verify the code
  setPassword,       // Set password after verification
  signIn,            // Login with email/password
  signOut,           // Logout
} = useAuth();
```

## 🗄️ Database Tables

Your Supabase database has:

1. **profiles** - User profile data
   - `user_id`, `email`, `display_name`
   - Auto-created on signup

2. **notes** - User notes
   - `title`, `content`, `tags`, `is_favorite`
   - Linked to user via `user_id`

3. **bookmarks** - User bookmarks
   - `url`, `title`, `description`, `tags`, `is_favorite`
   - Linked to user via `user_id`

All tables have Row Level Security (RLS) enabled.

## 🔒 Security Features

- ✅ Email verification required
- ✅ 6-digit OTP codes
- ✅ Password minimum 6 characters
- ✅ Row Level Security on all tables
- ✅ Automatic session management
- ✅ Protected routes
- ✅ Secure token storage

## 🐛 Troubleshooting

### Email Not Received?
- Check spam/junk folder
- Verify email provider is enabled in Supabase
- Check Supabase logs: Authentication → Logs
- Try resending the code

### "Invalid or Expired Code"?
- Code expires in 60 seconds
- Request a new code
- Check for typos

### Can't Login?
- Ensure you completed signup (including email verification)
- Check password is correct (min 6 characters)
- Verify user exists in Supabase dashboard

### Still Having Issues?
- Check browser console for errors (F12)
- Review Supabase authentication logs
- See `test-auth.md` for detailed troubleshooting

## 📚 Documentation Files

- **AUTH_SETUP.md** - Complete authentication setup guide
- **SUPABASE_EMAIL_CONFIG.md** - Detailed Supabase configuration
- **test-auth.md** - Comprehensive testing guide
- **QUICK_START.md** - This file

## 🎯 Next Steps

Once authentication is working:

1. **Customize Email Template**
   - Add your branding
   - Customize message
   - See `SUPABASE_EMAIL_CONFIG.md`

2. **Test User Data Storage**
   - Create notes
   - Create bookmarks
   - Verify data is saved per user

3. **Deploy to Production**
   - Update Site URL in Supabase
   - Configure custom SMTP (recommended)
   - Update environment variables

4. **Enhance Features**
   - Add password reset
   - Add profile management
   - Add social login (optional)

## 💡 Tips

- **Development**: Use a real email you have access to
- **Testing**: Check spam folder for verification emails
- **Production**: Configure custom SMTP for better deliverability
- **Security**: Never commit `.env` file to git

## 🆘 Need Help?

1. Check the documentation files in this project
2. Review Supabase docs: https://supabase.com/docs/guides/auth
3. Check Supabase authentication logs
4. Test with browser console commands (see `test-auth.md`)

---

**Your authentication system is ready! Start the app and test the signup flow.** 🚀
