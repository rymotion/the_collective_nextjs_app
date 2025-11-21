# Vercel Deployment Guide

This guide walks you through deploying The Collective to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Your code in a Git repository (GitHub, GitLab, or Bitbucket)
- Supabase database already configured

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

This is the easiest method with automatic deployments on every push.

#### Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

#### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Vercel will auto-detect Next.js settings

#### Step 3: Configure Environment Variables

In the "Environment Variables" section, add:

```
NEXT_PUBLIC_SUPABASE_URL
```
Value: `https://trccrrtydpdxgqxavzig.supabase.co`

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyY2NycnR5ZHBkeGdxeGF2emlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NjU4MDgsImV4cCI6MjA3OTM0MTgwOH0.Xwzm8Niluv85SpKPS4f3OqCP2CTMoEWYbcjT_YPCZj0`

#### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at `your-project.vercel.app`

---

### Method 2: Vercel CLI

If you prefer command-line deployment:

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Login

```bash
vercel login
```

#### Step 3: Deploy

From your project root directory:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- Project name? (your choice or press Enter)
- Directory? **./
- Override settings? **No**

#### Step 4: Add Environment Variables

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://trccrrtydpdxgqxavzig.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyY2NycnR5ZHBkeGdxeGF2emlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NjU4MDgsImV4cCI6MjA3OTM0MTgwOH0.Xwzm8Niluv85SpKPS4f3OqCP2CTMoEWYbcjT_YPCZj0
```

#### Step 5: Deploy to Production

```bash
vercel --prod
```

---

## Post-Deployment

### Verify Your Deployment

1. Visit your deployed URL
2. Test user authentication (sign up/sign in)
3. Create a test project
4. Verify database connectivity

### Configure Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Enable Automatic Deployments

With GitHub integration:
- Every push to `main` branch triggers a production deployment
- Pull requests get preview deployments automatically
- No manual intervention needed

---

## Project Configuration Files

The following files have been configured for optimal Vercel deployment:

### vercel.json
- Build configuration
- Security headers (XSS protection, frame options, content type)
- URL rewrites for proper routing

### .vercelignore
- Excludes unnecessary files from deployment
- Reduces deployment size
- Speeds up build time

---

## Build Verification

Your project has been tested and builds successfully:

```
✓ Compiled successfully
✓ TypeScript checks passed
✓ All routes generated
✓ Production build ready
```

---

## Troubleshooting

### Build Fails

If the build fails in Vercel:

1. Check the build logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Ensure all dependencies are in package.json
4. Run `npm run build` locally to replicate the issue

### Environment Variables Not Working

1. Make sure variables start with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding environment variables
3. Variables are only available after redeployment

### Database Connection Issues

1. Verify Supabase URL and key are correct
2. Check Supabase project is active
3. Ensure RLS policies allow access

---

## Support

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Supabase Documentation: https://supabase.com/docs

---

## Project Information

- Framework: Next.js 16.0.3
- Database: Supabase (PostgreSQL)
- Build Command: `npm run build`
- Output Directory: `.next`
- Node Version: 20.x (recommended)

---

Your project is now ready for deployment to Vercel!
