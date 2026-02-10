# 🚀 Run This SQL in Supabase

## ⚡ Quick Steps

### 1. Go to Supabase SQL Editor
https://app.supabase.com/project/ihijdpatdzjowdxbdfom/sql/new

### 2. Copy the SQL from `FIXED_DATABASE_SETUP.sql`

### 3. Paste and Click "Run"

---

## ✅ What This SQL Does

1. **Creates 3 tables:**
   - `profiles` - User profile data
   - `notes` - User notes
   - `bookmarks` - User bookmarks

2. **Enables security:**
   - Row Level Security (RLS)
   - Users can only access their own data

3. **Creates automation:**
   - Auto-creates profile when user signs up
   - Auto-updates timestamps

4. **Creates indexes:**
   - Fast search and queries

---

## 🎯 After Running SQL

You should see this message:

```
========================================
✅ Database setup complete!
========================================

Tables created:
  ✓ public.profiles
  ✓ public.notes
  ✓ public.bookmarks

Security:
  ✓ Row Level Security enabled
  ✓ Policies created for all tables

Automation:
  ✓ Auto profile creation trigger active
  ✓ Auto timestamp update triggers active

✅ Ready to store user data!
========================================
```

---

## 🧪 Verify Tables Were Created

Run this query to check:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see:
- ✅ bookmarks
- ✅ notes
- ✅ profiles

---

## 🎉 Then Test Signup!

1. Go to: http://localhost:8080/
2. Click "Sign Up"
3. Enter email
4. Enter 8-digit code from email
5. Enter new password
6. Confirm password
7. Sign up complete! ✅

---

## 🔍 Verify User Data

After signup, check in Supabase:

**Check Auth Users:**
```sql
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
```

**Check Profiles:**
```sql
SELECT id, user_id, email, created_at 
FROM public.profiles 
ORDER BY created_at DESC 
LIMIT 5;
```

Both should show your new user! ✅

---

## 🆘 If You Get Errors

### "relation already exists"
This is OK! It means the table already exists. The SQL will skip it.

### "policy already exists"
This is OK! The SQL drops existing policies before creating new ones.

### Other errors?
Copy the error message and I'll help you fix it!

---

**Ready? Copy SQL from `FIXED_DATABASE_SETUP.sql` and run it!** 🚀
