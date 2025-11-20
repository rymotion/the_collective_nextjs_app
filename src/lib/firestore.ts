import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  imdbProfileUrl?: string;
  imdbSynced: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Create or update user profile in Firestore
 */
export async function setUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const now = new Date().toISOString();
    
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing profile
      await updateDoc(userRef, {
        ...data,
        updatedAt: now,
      });
    } else {
      // Create new profile
      await setDoc(userRef, {
        uid,
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (error) {
    console.error('Error setting user profile:', error);
    throw error;
  }
}

/**
 * Update IMDb profile URL
 */
export async function updateImdbProfile(uid: string, imdbProfileUrl: string): Promise<void> {
  try {
    await setUserProfile(uid, {
      imdbProfileUrl,
      imdbSynced: !!imdbProfileUrl,
    });
  } catch (error) {
    console.error('Error updating IMDb profile:', error);
    throw error;
  }
}

/**
 * Remove IMDb profile URL
 */
export async function removeImdbProfile(uid: string): Promise<void> {
  try {
    await setUserProfile(uid, {
      imdbProfileUrl: '',
      imdbSynced: false,
    });
  } catch (error) {
    console.error('Error removing IMDb profile:', error);
    throw error;
  }
}
