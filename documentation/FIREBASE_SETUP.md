# Firebase Configuration

This file contains placeholder values for Firebase configuration.
You need to create a Firebase project and replace these values with your actual Firebase config.

## Steps to set up Firebase:

1. Go to https://console.firebase.google.com/
2. Create a new project (or use an existing one)
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (optional but recommended)
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database (start in test mode for development)
5. Get your config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Web" icon to add a web app
   - Copy the firebaseConfig object values

## Environment Variables

Copy the values from your Firebase config to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

After setting up, restart your dev server: `npm run dev`
