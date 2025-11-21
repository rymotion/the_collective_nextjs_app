# Authentication & Offline Testing Guide

This guide provides comprehensive testing procedures for authentication and offline functionality.

## Prerequisites

- Firebase project configured with Authentication and Firestore
- `.env.local` file with Firebase credentials
- Dev server running: `npm run dev`

## 1. Authentication Testing

### Email/Password Sign Up
1. Navigate to http://localhost:3000/auth/signup
2. Fill in the form with:
   - Display Name: "Test User"
   - Email: "test@example.com"
   - Password: "test123456"
   - Confirm Password: "test123456"
3. Click "Sign Up"
4. **Expected**: Redirect to Dashboard with user profile displayed

### Email/Password Sign In
1. Sign out if logged in
2. Navigate to http://localhost:3000/auth/signin
3. Enter credentials from sign-up
4. Click "Sign In"
5. **Expected**: Redirect to Dashboard

### Google Sign In
1. Sign out if logged in
2. Navigate to http://localhost:3000/auth/signin
3. Click "Sign in with Google"
4. Complete Google OAuth flow
5. **Expected**: Redirect to Dashboard with Google profile info

### Auth Persistence Test
1. Sign in to your account
2. Refresh the page (F5 or Cmd+R)
3. **Expected**: Still signed in, no redirect to sign-in page
4. Close the browser completely
5. Reopen and navigate to http://localhost:3000
6. **Expected**: Still signed in

## 2. Offline Functionality Testing

### Test Offline Sign In (Should Fail Gracefully)
1. Sign out if logged in
2. Open browser DevTools (F12)
3. Go to Network tab
4. Click "Offline" checkbox (or throttle to "Offline")
5. Try to sign in
6. **Expected**: Error message: "Network error. Please check your internet connection and try again."
7. **Expected**: Offline indicator appears in bottom-right corner

### Test Offline with Existing Session
1. Sign in while online
2. Navigate to Dashboard
3. Go offline (DevTools Network tab → Offline)
4. **Expected**: 
   - Offline indicator appears
   - User remains signed in
   - Can navigate between pages
   - User profile data still visible (cached)

### Test IMDb Sync Offline
1. Sign in and navigate to Dashboard
2. Go offline
3. Try to connect IMDb profile
4. **Expected**: Error message: "Network error. Your changes will be saved when you reconnect."

### Test Reconnection
1. While offline, note the offline indicator
2. Go back online (DevTools Network tab → Online)
3. **Expected**:
   - Green "Back online" indicator appears
   - Indicator disappears after 3 seconds
   - Any pending Firestore writes sync automatically

## 3. Network Error Scenarios

### Slow Network (3G)
1. DevTools Network tab → Throttle to "Slow 3G"
2. Try signing in
3. **Expected**: Slower response but should complete successfully

### Intermittent Connection
1. Sign in while online
2. Toggle offline/online rapidly
3. **Expected**: 
   - Offline indicator shows/hides appropriately
   - Auth state remains stable
   - No crashes or errors

## 4. Firestore Offline Persistence

### Test Cached Data
1. Sign in and navigate to Dashboard
2. Connect IMDb profile
3. Go offline
4. Refresh the page
5. **Expected**: 
   - User profile loads from cache
   - IMDb connection status shows correctly
   - No loading errors

### Test Write Queue
1. While online, navigate to Dashboard
2. Go offline
3. Try to update IMDb URL
4. Go back online
5. **Expected**: Changes sync automatically when connection restored

## 5. Error Message Testing

### Invalid Credentials
- **Wrong password**: "Incorrect password."
- **Non-existent email**: "No account found with this email."
- **Invalid email format**: "Invalid email address."

### Account Issues
- **Weak password** (< 6 chars): "Password is too weak. Please use at least 6 characters."
- **Email already in use**: "An account with this email already exists."

### Network Issues
- **No connection**: "Network error. Please check your internet connection and try again."
- **Firestore unavailable**: "Network error. Your changes will be saved when you reconnect."

## 6. Browser Compatibility

Test in multiple browsers:
- ✅ Chrome/Edge (IndexedDB supported)
- ✅ Firefox (IndexedDB supported)
- ✅ Safari (IndexedDB supported)
- ⚠️ Private/Incognito mode (persistence may be limited)

## 7. Multi-Tab Behavior

1. Open app in two browser tabs
2. Sign in on Tab 1
3. **Expected**: Tab 2 automatically updates to show signed-in state
4. Go offline in Tab 1
5. **Expected**: Console warning: "Firestore persistence failed: Multiple tabs open"
6. **Note**: Only one tab can have offline persistence enabled

## 8. Sign Out Testing

1. Sign in to account
2. Navigate to different pages
3. Click "Sign Out"
4. **Expected**:
   - Redirect to home page
   - All auth state cleared
   - IMDb sync status reset
   - Can't access Dashboard without signing in again

## Common Issues & Solutions

### Issue: "Firestore persistence failed: Multiple tabs open"
**Solution**: This is expected. Close other tabs or ignore the warning.

### Issue: Changes not syncing after reconnection
**Solution**: Check browser console for errors. Ensure Firestore rules allow writes.

### Issue: Offline indicator not showing
**Solution**: Check browser supports online/offline events. Try hard refresh.

### Issue: Auth state lost on refresh
**Solution**: Check that `.env.local` has correct Firebase config. Clear browser cache and try again.

## Monitoring Tools

### Browser DevTools
- **Network Tab**: Monitor requests, simulate offline
- **Application Tab**: View IndexedDB for cached data
- **Console**: Check for Firebase errors/warnings

### Firebase Console
- **Authentication**: View registered users
- **Firestore**: Check user profile documents
- **Usage**: Monitor read/write operations

## Success Criteria

✅ Users can sign up/in with email and Google  
✅ Auth persists across page reloads and browser restarts  
✅ Offline indicator shows when connection lost  
✅ User-friendly error messages for all failure scenarios  
✅ Cached data accessible offline  
✅ Writes queue and sync when reconnected  
✅ Multi-tab auth state synchronization  
✅ Clean sign-out clears all state
