# 🚀 Setup Instructions for The Collective

## Overview
This document provides a quick overview of how to get The Collective application running on your local machine.

---

## Prerequisites

- **Node.js 18+** installed on your machine
- **npm** or **yarn** package manager
- **Supabase account** (free tier available at [supabase.com](https://supabase.com))

---

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Supabase client, and other dependencies.

---

### 2. Configure Supabase

#### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `the-collective` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"** and wait 2-3 minutes

#### 2.2 Get API Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (the long JWT token under "Project API keys")

#### 2.3 Update Environment Variables

Open `.env` in the project root and update:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual credentials from step 2.2.

---

### 3. Set Up Database

#### 3.1 Open SQL Editor

1. In Supabase Dashboard, click **SQL Editor** in the sidebar
2. Click **"New query"**

#### 3.2 Run Migration

Copy the complete SQL migration from:
- **Option A**: `documentation/SUPABASE_SETUP.md` (see section 4.2)
- **Option B**: Available in the SQL Editor as a ready-to-use script

Paste the SQL and click **"Run"** (or press Ctrl/Cmd + Enter)

You should see "Success. No rows returned" - this means the migration worked!

#### 3.3 Verify Tables

1. Click **Table Editor** in the sidebar
2. You should see 7 tables:
   - ✅ profiles
   - ✅ projects
   - ✅ cast_crew
   - ✅ accolades
   - ✅ contributions
   - ✅ project_updates
   - ✅ favorites

---

### 4. Start Development Server

```bash
npm run dev
```

The application will start at **http://localhost:3000**

---

### 5. Test the Setup

#### Test 1: View the Application
- Open http://localhost:3000 in your browser
- You should see the home page with project carousels

#### Test 2: Create an Account
1. Navigate to http://localhost:3000/auth/signup
2. Sign up with test credentials:
   ```
   Email: test@example.com
   Password: Test123456!
   ```
3. You should be redirected after signup

#### Test 3: Verify Database
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. You should see your test user
3. Go to **Table Editor** → **profiles**
4. A profile should have been auto-created for your user

---

## ✅ Setup Checklist

Use this to verify everything is configured:

- [ ] Node.js 18+ installed
- [ ] Ran `npm install`
- [ ] Created Supabase project
- [ ] Copied Project URL to `.env`
- [ ] Copied anon key to `.env`
- [ ] Ran database migration SQL
- [ ] Verified all 7 tables exist
- [ ] Confirmed RLS is enabled on tables
- [ ] Started dev server with `npm run dev`
- [ ] Opened http://localhost:3000 successfully
- [ ] Created test user account
- [ ] Verified user appears in Supabase Auth
- [ ] Verified profile was auto-created

---

## 🆘 Common Issues

### Issue: "Can't connect to Supabase"
**Solution**:
1. Verify `.env` file has correct URL and key
2. Restart dev server after changing `.env`
3. Check Supabase project is active (not paused)

### Issue: "Tables don't exist"
**Solution**:
1. Re-run the migration SQL in Supabase SQL Editor
2. Check for error messages in SQL Editor output
3. Verify you ran the complete migration (not just part of it)

### Issue: "Authentication not working"
**Solution**:
1. Check browser console for errors
2. Verify Supabase Auth is enabled (should be by default)
3. Try disabling email confirmation in Supabase:
   - Go to **Authentication** → **Settings**
   - Toggle OFF "Enable email confirmations"

### Issue: "Build fails"
**Solution**:
1. Delete `.next` folder: `rm -rf .next`
2. Delete `node_modules`: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

---

## 📚 Next Steps

Now that your environment is set up:

1. **Explore the docs**: See `documentation/` folder for detailed guides
2. **Read QUICK_START.md**: Learn how to use the services and utilities
3. **Review DATABASE_SETUP.md**: Understand the database schema
4. **Start building**: Replace mock data with real database queries

---

## 📖 Documentation

All documentation is in the `/documentation` folder:

- **[SUPABASE_SETUP.md](./documentation/SUPABASE_SETUP.md)** - Detailed setup with troubleshooting
- **[QUICK_START.md](./documentation/QUICK_START.md)** - Developer quick reference
- **[DATABASE_SETUP.md](./documentation/DATABASE_SETUP.md)** - Complete database docs
- **[IMPLEMENTATION_SUMMARY.md](./documentation/IMPLEMENTATION_SUMMARY.md)** - Technical overview

---

## 🎯 You're All Set!

Your development environment is now configured and ready to use. The application has:

✅ Complete database with 7 tables
✅ Row Level Security policies
✅ Authentication system
✅ Type-safe service layer
✅ Responsive design
✅ Internationalization

Happy coding! 🚀

---

**Need Help?** Check the detailed setup guide: [documentation/SUPABASE_SETUP.md](./documentation/SUPABASE_SETUP.md)
