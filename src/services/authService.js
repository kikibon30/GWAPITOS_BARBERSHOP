// services/authService.js
import { supabase } from '../config/supabase';

const authService = {
  // Sign in function
  signin: async (email, password) => {
    try {
      console.log('Signing in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        throw error;
      }
      
      console.log('Signin successful:', data.user?.id);
      return data;
    } catch (error) {
      console.error('Auth service signin error:', error);
      throw error;
    }
  },

  // Sign up function
// services/authService.js
signup: async (email, password, userData) => {
  try {
    console.log('Signing up with:', email, userData);
    
    // Wait to avoid rate limiting
    console.log('Waiting 16 seconds to avoid rate limiting...');
    await new Promise(resolve => setTimeout(resolve, 16000));
    
    // Create auth user - the trigger will automatically create the profile
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: userData.fullName,
          role: userData.role
        }
      }
    });

    if (error) {
      console.error('Signup auth error:', error);
      throw error;
    }

    console.log('Auth user created:', data.user?.id);

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Try to get the profile to verify it was created
    if (data.user) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.log('Profile not immediately available (this is normal):', profileError);
        } else {
          console.log('Profile found:', profile);
        }
      } catch (e) {
        console.log('Profile check failed (normal during signup):', e.message);
      }
    }

    console.log('Signup process completed successfully');
    return data;
  } catch (error) {
    console.error('Auth service signup error:', error);
    throw error;
  }
},

// Update getUserProfile to use the function if needed
// services/authService.js - KEEP ONLY ONE VERSION
getUserProfile: async (userId) => {
  try {
    console.log('Fetching profile for user:', userId);
    
    // Try multiple approaches to get the profile
    let profile = null;
    
    // Approach 1: Direct query
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      console.log('Profile found via direct query:', data);
      return data;
    }

    console.log('Direct query failed, trying RPC function...');
    
    // Approach 2: RPC function if exists
    try {
      const { data: funcData, error: funcError } = await supabase.rpc('get_user_profile', { 
        user_id: userId 
      });
      
      if (!funcError && funcData && funcData.length > 0) {
        console.log('Profile found via RPC:', funcData[0]);
        return funcData[0];
      }
    } catch (rpcError) {
      console.log('RPC function not available:', rpcError.message);
    }

    // Approach 3: Wait and retry
    console.log('Profile not found, waiting and retrying...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { data: retryData, error: retryError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!retryError && retryData) {
      console.log('Profile found after retry:', retryData);
      return retryData;
    }

    console.log('No profile found after all attempts');
    return null;
    
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
},
  // Sign out function
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;