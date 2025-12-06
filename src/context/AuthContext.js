// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService'; // FIXED: Remove curly braces
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const session = await authService.getCurrentUser();
      console.log('Checked user session:', session?.user?.id);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  // context/AuthContext.js
// context/AuthContext.js
const fetchUserProfile = async (userId) => {
  try {
    console.log('Fetching profile for user:', userId);
    
    let profile = null;
    let retries = 5;
    
    // Retry getting profile with delays
    while (retries > 0 && !profile) {
      try {
        profile = await authService.getUserProfile(userId);
        if (!profile) {
          console.log(`Profile not found, retrying... (${retries} attempts left)`);
          retries--;
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.log(`Profile fetch attempt failed: ${error.message}`);
        retries--;
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    if (profile) {
      console.log('Profile found:', profile);
      setUser(profile);
      setUserRole(profile.role || 'customer');
    } else {
      console.log('No profile found after retries, using auth user data');
      // Use auth user data as fallback
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fallbackProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'User',
          role: user.user_metadata?.role || 'customer'
        };
        setUser(fallbackProfile);
        setUserRole(fallbackProfile.role);
      }
    }
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    // Don't block the app if profile fetch fails
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const fallbackProfile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'User',
        role: user.user_metadata?.role || 'customer'
      };
      setUser(fallbackProfile);
      setUserRole(fallbackProfile.role);
    }
  }
};
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Logging in user:', email);
      const result = await authService.signin(email, password);
      
      if (result.user) {
        const profile = await authService.getUserProfile(result.user.id);
        console.log('Login successful, profile:', profile);
        setUser(profile);
        setUserRole(profile?.role || 'customer');
        return { success: true, user: profile };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // context/AuthContext.js - IMPROVED SIGNUP FUNCTION
const signup = async (email, password, userData) => {
  try {
    setLoading(true);
    console.log('Signing up user:', email, userData);
    
    const result = await authService.signup(email, password, userData);
    
    console.log('Signup result:', result);
    
    if (result.user) {
      // Wait a bit for the profile to be created by the trigger
      console.log('Waiting for profile creation...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const profile = await authService.getUserProfile(result.user.id);
      console.log('Profile after signup:', profile);
      
      if (profile) {
        setUser(profile);
        setUserRole(profile.role || userData.role);
        return { success: true, user: profile };
      } else {
        // If profile doesn't exist yet, create a temporary one
        console.log('Creating temporary profile data');
        const tempProfile = {
          id: result.user.id,
          email: email,
          full_name: userData.fullName,
          role: userData.role,
          created_at: new Date().toISOString()
        };
        
        setUser(tempProfile);
        setUserRole(userData.role);
        return { success: true, user: tempProfile };
      }
    }
    
    // If user needs email confirmation
    if (result.user?.identities?.length === 0) {
      return { success: true, needsConfirmation: true };
    }
    
    return { success: false, error: 'Signup failed - no user created' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: error.message };
  } finally {
    setLoading(false);
  }
};
  const logout = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      login, 
      signup,
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};