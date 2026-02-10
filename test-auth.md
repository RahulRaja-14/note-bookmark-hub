# Testing Authentication Flow

## Manual Testing Steps

### 1. Start the Application

```bash
npm run dev
```

The app should start at `http://localhost:5173`

### 2. Test Sign Up Flow

1. **Navigate to Auth Page**
   - Open browser to `http://localhost:5173`
   - You should see the login page

2. **Click "Sign Up"**
   - Click the "Sign Up" link at the bottom
   - You should see "Enter your email address to create an account"

3. **Enter Email**
   - Enter a valid email address you have access to
   - Click "Send Code"
   - Wait for confirmation message

4. **Check Email**
   - Open your email inbox
   - Look for email from Supabase (check spam folder too)
   - You should see a 6-digit code

5. **Enter Verification Code**
   - Enter the 6-digit code in the app
   - Click "Verify"
   - You should proceed to password setup

6. **Set Password**
   - Enter a password (minimum 6 characters)
   - Confirm the password
   - Click "Continue"
   - You should be automatically logged in and redirected to `/notes`

### 3. Test Logout

1. **Find Logout Button**
   - Look for user menu or logout option
   - Click "Logout"

2. **Verify Redirect**
   - You should be redirected back to login page
   - Session should be cleared

### 4. Test Login Flow

1. **Enter Credentials**
   - Enter the email you signed up with
   - Enter the password you created
   - Click "Log In"

2. **Verify Access**
   - You should be logged in
   - Redirected to `/notes` page
   - Can access your data

### 5. Test Protected Routes

1. **While Logged Out**
   - Try to access `http://localhost:5173/notes`
   - Should redirect to login page

2. **While Logged In**
   - Access `http://localhost:5173/notes`
   - Should show notes page
   - Access `http://localhost:5173/bookmarks`
   - Should show bookmarks page

## Expected Behavior

### Sign Up Success
✅ Email sent successfully
✅ 6-digit code received in email
✅ Code verification successful
✅ Password set successfully
✅ Automatic login after signup
✅ Redirect to `/notes` page
✅ User profile created in database

### Login Success
✅ Credentials validated
✅ Session created
✅ Redirect to `/notes` page
✅ User data accessible

### Error Handling
✅ Invalid email format shows error
✅ Wrong verification code shows error
✅ Expired code shows error with resend option
✅ Password mismatch shows error
✅ Wrong login credentials show error
✅ Network errors handled gracefully

## Verification Checklist

After testing, verify in Supabase Dashboard:

### Check Authentication
**Path**: Authentication → Users

- [ ] New user appears in users list
- [ ] Email is confirmed
- [ ] User ID is generated
- [ ] Created timestamp is correct

### Check User Profile
**Path**: Table Editor → profiles

- [ ] Profile record created automatically
- [ ] `user_id` matches auth user
- [ ] Email is stored correctly
- [ ] Timestamps are set

### Check Logs
**Path**: Authentication → Logs

- [ ] Email sent event logged
- [ ] OTP verified event logged
- [ ] User signed up event logged
- [ ] Login event logged

## Troubleshooting

### Email Not Received

**Check**:
1. Spam/junk folder
2. Email address is correct
3. Supabase email logs show "sent"
4. Email provider isn't blocking Supabase

**Fix**:
- Use "Resend code" button
- Try different email address
- Configure custom SMTP in Supabase

### "Invalid or Expired Code"

**Check**:
1. Code was entered correctly
2. Code hasn't expired (60 seconds)
3. Using the most recent code

**Fix**:
- Request new code
- Enter code faster
- Check for typos

### Login Failed

**Check**:
1. Email is verified
2. Password is correct
3. User exists in database

**Fix**:
- Complete signup process first
- Reset password if forgotten
- Check Supabase logs for errors

### Not Redirecting After Login

**Check**:
1. Browser console for errors
2. Network tab for failed requests
3. Auth state in React DevTools

**Fix**:
- Clear browser cache
- Check protected route logic
- Verify session is created

## Browser Console Commands

Open browser console (F12) and test:

```javascript
// Check if user is logged in
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);

// Check current user
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Test database connection
const { data, error } = await supabase.from('profiles').select('*');
console.log('Profiles:', data, error);
```

## Performance Testing

### Email Delivery Time
- Typical: 1-5 seconds
- Maximum acceptable: 30 seconds
- If slower: Consider custom SMTP

### Code Verification Time
- Should be instant (<1 second)
- If slower: Check network connection

### Login Time
- Should be instant (<1 second)
- If slower: Check Supabase region/latency

## Security Testing

### Test Rate Limiting
1. Request multiple codes rapidly
2. Should be rate limited after threshold
3. Error message should be clear

### Test Invalid Inputs
1. Try SQL injection in email field
2. Try XSS in password field
3. All should be sanitized

### Test Session Security
1. Copy session token from localStorage
2. Try using in different browser
3. Should work (session is portable)
4. Logout should invalidate everywhere

## Next Steps After Testing

Once authentication is working:

1. **Add Password Reset**
   - Implement forgot password flow
   - Use Supabase password reset

2. **Add Profile Management**
   - Allow users to update display name
   - Add profile picture upload

3. **Add Social Login** (Optional)
   - Google OAuth
   - GitHub OAuth
   - Other providers

4. **Enhance Security**
   - Add 2FA (Two-Factor Authentication)
   - Add session management
   - Add login history

5. **Improve UX**
   - Add loading states
   - Add success animations
   - Add better error messages
   - Add email verification reminder
