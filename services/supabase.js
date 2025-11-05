import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// You'll need to replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://ibkdisojpbtghuoeyyak.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlia2Rpc29qcGJ0Z2h1b2V5eWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODg4OTQsImV4cCI6MjA3Nzg2NDg5NH0.7tnes-p7LcpBiCDZHX26SEX9STW1XCik1nG9t7rcdCk';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication functions
export const signUp = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error };
  }
};

// Inspection functions
export const createInspection = async (inspectionData) => {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .insert([inspectionData]);
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const getInspections = async (userId = null) => {
  try {
    let query = supabase.from('inspections').select('*');
    if (userId) {
      query = query.eq('driver_id', userId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Incident functions
export const createIncident = async (incidentData) => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .insert([incidentData]);
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const getIncidents = async () => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Clock in/out functions
export const clockIn = async (driverId, location) => {
  try {
    const { data, error } = await supabase
      .from('clock_entries')
      .insert([{
        driver_id: driverId,
        clock_in_time: new Date().toISOString(),
        location: location,
        status: 'clocked_in'
      }]);
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

export const clockOut = async (driverId, location) => {
  try {
    // First get the latest clock in entry
    const { data: clockEntry, error: fetchError } = await supabase
      .from('clock_entries')
      .select('*')
      .eq('driver_id', driverId)
      .eq('status', 'clocked_in')
      .order('clock_in_time', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) return { data: null, error: fetchError };

    // Update the entry with clock out time
    const { data, error } = await supabase
      .from('clock_entries')
      .update({
        clock_out_time: new Date().toISOString(),
        status: 'clocked_out'
      })
      .eq('id', clockEntry.id);

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Photo upload function
export const uploadPhoto = async (uri, fileName, bucket = 'inspection-photos') => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, blob);

    if (error) return { data: null, error };

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { data: { ...data, publicUrl: urlData.publicUrl }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Real-time subscriptions
export const subscribeToIncidents = (callback) => {
  return supabase
    .channel('incidents')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'incidents' },
      callback
    )
    .subscribe();
};

export const subscribeToInspections = (callback) => {
  return supabase
    .channel('inspections')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'inspections' },
      callback
    )
    .subscribe();
};

// Get depot data
export const getDepots = async () => {
  try {
    const { data, error } = await supabase
      .from('depots')
      .select('*')
      .order('name');
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

// Get bus data
export const getBuses = async (depotId = null) => {
  try {
    let query = supabase.from('buses').select('*');
    if (depotId) {
      query = query.eq('depot_id', depotId);
    }
    const { data, error } = await query.order('bus_number');
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};