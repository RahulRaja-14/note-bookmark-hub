# 📧 Update Email Template - Code Only (No Link)

## 🎯 Goal
Remove the magic link from the email and show ONLY the 8-digit verification code.

---

## 📋 Step-by-Step Instructions

### Step 1: Go to Supabase Email Templates

**URL:** https://app.supabase.com/project/ihijdpatdzjowdxbdfom/auth/templates

### Step 2: Click "Magic Link" Template

This is the template used for OTP (One-Time Password) emails.

### Step 3: Replace the Template

**Choose one of these templates:**

#### Option 1: Professional Template (Recommended)
- File: `EMAIL_TEMPLATE_CODE_ONLY.html`
- Beautiful design with gradients
- Clear instructions
- Security warnings
- Professional branding

#### Option 2: Simple Template
- File: `EMAIL_TEMPLATE_SIMPLE.html`
- Clean and minimal
- Easy to read
- Fast loading

### Step 4: Copy Template Content

Open the template file you chose and copy ALL the HTML code.

### Step 5: Paste in Supabase

1. Delete all existing content in the "Magic Link" template
2. Paste your chosen template
3. Click **"Save"**

### Step 6: Test It!

1. Go to: http://localhost:8080/
2. Click "Sign Up"
3. Enter your email
4. Check your email
5. You should see ONLY the 8-digit code (no link!)

---

## ✅ What's Different?

### ❌ OLD Template (with link):
```html
<p>Click this link to sign in:</p>
<a href="{{ .ConfirmationURL }}">Sign In</a>
<p>Or use this code: {{ .Token }}</p>
```

### ✅ NEW Template (code only):
```html
<div class="code">{{ .Token }}</div>
<p>Enter this code in the signup page</p>
```

**No link, no URL, just the code!**

---

## 🔍 Key Features of New Template

### 1. Code Display
- ✅ Large, bold 8-digit code
- ✅ Easy to read font (Courier New)
- ✅ High contrast colors
- ✅ Centered and prominent

### 2. Clear Instructions
- ✅ Step-by-step guide
- ✅ What to do with the code
- ✅ Where to enter it

### 3. Security Features
- ✅ Expiry warning (60 seconds)
- ✅ Security notice
- ✅ "Ignore if not you" message

### 4. Professional Design
- ✅ Branded header
- ✅ Clean layout
- ✅ Mobile responsive
- ✅ Professional footer

---

## 📱 Email Preview

### What Users Will See:

```
┌─────────────────────────────────────┐
│   🔐 Email Verification             │
│   NoteMark                          │
├─────────────────────────────────────┤
│                                     │
│   Welcome! 👋                       │
│                                     │
│   Thank you for signing up...      │
│                                     │
│   ┌───────────────────────────┐   │
│   │ YOUR VERIFICATION CODE    │   │
│   │                           │   │
│   │      12345678             │   │
│   │                           │   │
│   │ Enter this code in the    │   │
│   │ signup page               │   │
│   └───────────────────────────┘   │
│                                     │
│   📋 How to Complete Verification: │
│   1. Copy the 8-digit code         │
│   2. Return to signup page         │
│   3. Enter all 8 digits            │
│   4. Create your password          │
│                                     │
│   ⏱️ This code expires in 60 sec   │
│                                     │
│   ⚠️ Security Notice: If you       │
│   didn't request this...           │
│                                     │
├─────────────────────────────────────┤
│   NoteMark                          │
│   Your personal notes & bookmarks   │
└─────────────────────────────────────┘
```

---

## 🎨 Template Variables

The template uses Supabase variables:

### Available Variables:
- `{{ .Token }}` - The 8-digit verification code ✅ **We use this**
- `{{ .TokenHash }}` - Hashed token (not needed)
- `{{ .ConfirmationURL }}` - Magic link URL ❌ **We removed this**
- `{{ .SiteURL }}` - Your site URL (not needed)
- `{{ .Email }}` - User's email (optional)

### What We Use:
```html
<!-- ONLY the code -->
<div class="code">{{ .Token }}</div>
```

### What We Removed:
```html
<!-- NO LINK -->
<!-- <a href="{{ .ConfirmationURL }}">Click here</a> -->
```

---

## 🧪 Testing Checklist

After updating the template:

- [ ] Template saved in Supabase
- [ ] Go to signup page
- [ ] Enter email
- [ ] Check email inbox
- [ ] Email shows 8-digit code
- [ ] Email does NOT show any link
- [ ] Code is easy to read
- [ ] Instructions are clear
- [ ] Can copy code easily
- [ ] Code works in signup form

---

## 🔧 Troubleshooting

### Email still shows link?
- Clear browser cache
- Wait 1-2 minutes for changes to propagate
- Try with a different email address
- Check you saved the template

### Code not showing?
- Verify `{{ .Token }}` is in the template
- Check for typos in the variable name
- Make sure you're editing "Magic Link" template

### Email looks broken?
- Check HTML syntax
- Make sure all tags are closed
- Test with the simple template first

### Email not received?
- Check spam folder
- Verify email provider is enabled
- Check Supabase logs (Authentication → Logs)

---

## 📊 Comparison

### Before (with link):
```
Subject: Confirm your signup
Body:
  Click this link to sign in:
  https://yourapp.com/auth/confirm?token=...
  
  Or use this code: 12345678
```

### After (code only):
```
Subject: Email Verification
Body:
  YOUR VERIFICATION CODE
  
  12345678
  
  Enter this code in the signup page
```

**Much cleaner and more secure!**

---

## 🎯 Benefits of Code-Only Approach

### Security:
- ✅ No clickable links (prevents phishing)
- ✅ User must be on your site
- ✅ Code expires quickly (60 seconds)
- ✅ Cannot be bookmarked or shared

### User Experience:
- ✅ Clear and simple
- ✅ Easy to understand
- ✅ Works on all devices
- ✅ No confusion about what to do

### Technical:
- ✅ No URL parameters
- ✅ No redirect handling
- ✅ Simpler flow
- ✅ Better mobile experience

---

## 📝 Quick Copy-Paste

### For Supabase Template Editor:

1. Go to: https://app.supabase.com/project/ihijdpatdzjowdxbdfom/auth/templates
2. Click "Magic Link"
3. Delete everything
4. Copy from: `EMAIL_TEMPLATE_CODE_ONLY.html` or `EMAIL_TEMPLATE_SIMPLE.html`
5. Paste
6. Click "Save"
7. Done! ✅

---

## 🎉 Summary

**What you're doing:**
- Removing the magic link from emails
- Showing only the 8-digit code
- Making verification clearer and more secure

**Files to use:**
- `EMAIL_TEMPLATE_CODE_ONLY.html` (professional)
- `EMAIL_TEMPLATE_SIMPLE.html` (minimal)

**Where to update:**
- Supabase Dashboard → Authentication → Email Templates → Magic Link

**Result:**
- Users receive clean email with just the code
- No confusing links
- Better security
- Clearer user experience

---

**Ready? Copy the template and update Supabase!** 🚀
