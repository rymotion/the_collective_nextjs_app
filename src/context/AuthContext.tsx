"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, setUserProfile, UserProfile } from '@/lib/firestore';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isImdbSynced: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateImdbUrl: (url: string) => Promise<void>;
  removeImdbUrl: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfileState(profile);
        
        // Create profile if it doesn't exist
        if (!profile) {
          await setUserProfile(firebaseUser.uid, {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || undefined,
            imdbSynced: false,
          });
          const newProfile = await getUserProfile(firebaseUser.uid);
          setUserProfileState(newProfile);
        }
      } else {
        setUserProfileState(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      }
      
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await setUserProfile(userCredential.user.uid, {
        uid: userCredential.user.uid,
        email: email,
        displayName: displayName,
        imdbSynced: false,
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      }
      
      throw new Error(error.message || 'Failed to sign up');
    }
  };


  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const updateImdbUrl = async (url: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await setUserProfile(user.uid, {
        imdbProfileUrl: url,
        imdbSynced: true,
      });
      
      // Refresh profile
      const updatedProfile = await getUserProfile(user.uid);
      setUserProfileState(updatedProfile);
    } catch (error: any) {
      console.error('Update IMDb URL error:', error);
      
      if (error.code === 'unavailable') {
        throw new Error('Network error. Your changes will be saved when you reconnect.');
      }
      
      throw new Error(error.message || 'Failed to update IMDb URL');
    }
  };

  const removeImdbUrl = async () => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await setUserProfile(user.uid, {
        imdbProfileUrl: '',
        imdbSynced: false,
      });
      
      // Refresh profile
      const updatedProfile = await getUserProfile(user.uid);
      setUserProfileState(updatedProfile);
    } catch (error: any) {
      console.error('Remove IMDb URL error:', error);
      
      if (error.code === 'unavailable') {
        throw new Error('Network error. Your changes will be saved when you reconnect.');
      }
      
      throw new Error(error.message || 'Failed to remove IMDb URL');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      }
      
      throw new Error(error.message || 'Failed to send reset email');
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    isImdbSynced: userProfile?.imdbSynced || false,
    signIn,
    signUp,
    signOut,
    updateImdbUrl,
    removeImdbUrl,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
