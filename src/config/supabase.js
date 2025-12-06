// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://mzuzfrewufuisxeggroy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16dXpmcmV3dWZ1aXN4ZWdncm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NTY4NjYsImV4cCI6MjA3ODMzMjg2Nn0.tx78XRojoH1MEdV0_IoHhTQb5ZtZ0kgsVeVHg3TWyj4';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export { supabase };