import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface AdminContextType {
  isAdmin: boolean;
  userProfile: User | null;
  loading: boolean;
  checkAdminStatus: () => Promise<void>;
  updateUserRole: (userId: string, role: 'client' | 'admin') => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// List of admin emails - in production, this should be in Firestore
// const developer = import.meta.env.VITE_DEVELOPER_EMAIL;
const ADMIN_EMAILS = [
  'admin@lensandlight.com',
  'photographer@lensandlight.com',
  'tuhrelproductions@gmail.com',
  // Add your admin emails here
].filter(Boolean); // Remove undefined values

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async () => {
    if (!currentUser) {
      setIsAdmin(false);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      // Check if user profile exists in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      let userData: User;

      if (userDoc.exists()) {
        userData = userDoc.data() as User;
      } else {
        // Create new user profile
        const isAdminEmail = ADMIN_EMAILS.includes(currentUser.email || '');
        
        userData = {
          id: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || undefined,
          role: isAdminEmail ? 'admin' : 'client',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        // Save to Firestore
        await setDoc(userDocRef, userData);
      }

      // Update last login
      await setDoc(userDocRef, {
        ...userData,
        lastLogin: new Date().toISOString(),
      }, { merge: true });

      setUserProfile(userData);
      setIsAdmin(userData.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'client' | 'admin') => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { role }, { merge: true });
      
      // If updating current user, refresh their profile
      if (userId === currentUser?.uid) {
        await checkAdminStatus();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [currentUser]);

  const value = {
    isAdmin,
    userProfile,
    loading,
    checkAdminStatus,
    updateUserRole,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
