-- Supabase Database Schema for Buscor Bus Inspection App
-- Copy and paste these SQL commands into your Supabase SQL Editor

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('driver', 'mechanic', 'admin')) DEFAULT 'driver',
  phone TEXT,
  employee_id TEXT UNIQUE,
  depot_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create depots table
CREATE TABLE public.depots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  phone TEXT,
  manager_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create buses table
CREATE TABLE public.buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number TEXT UNIQUE NOT NULL,
  registration_number TEXT UNIQUE,
  make TEXT,
  model TEXT,
  year INTEGER,
  capacity INTEGER,
  depot_id UUID REFERENCES depots(id),
  status TEXT CHECK (status IN ('active', 'maintenance', 'retired')) DEFAULT 'active',
  last_inspection DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inspections table
CREATE TABLE public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES user_profiles(id),
  bus_id UUID REFERENCES buses(id),
  depot_id UUID REFERENCES depots(id),
  inspection_type TEXT CHECK (inspection_type IN ('pre_trip', 'post_trip', 'maintenance')) DEFAULT 'pre_trip',
  checklist_data JSONB NOT NULL, -- Store the 31-item checklist responses
  notes TEXT,
  photos TEXT[], -- Array of photo URLs
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  location_address TEXT,
  status TEXT CHECK (status IN ('passed', 'failed', 'needs_attention')) DEFAULT 'passed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create incidents table
CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES user_profiles(id),
  bus_id UUID REFERENCES buses(id),
  incident_type TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  location_address TEXT,
  photos TEXT[], -- Array of photo URLs
  call_recording_url TEXT, -- URL to recorded call
  call_duration INTEGER, -- Duration in seconds
  status TEXT CHECK (status IN ('reported', 'acknowledged', 'investigating', 'resolved')) DEFAULT 'reported',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create clock_entries table
CREATE TABLE public.clock_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES user_profiles(id),
  bus_id UUID REFERENCES buses(id),
  clock_in_time TIMESTAMP WITH TIME ZONE,
  clock_out_time TIMESTAMP WITH TIME ZONE,
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  location_address TEXT,
  total_hours DECIMAL(4, 2), -- Calculated hours worked
  status TEXT CHECK (status IN ('clocked_in', 'clocked_out')) DEFAULT 'clocked_in',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create call_logs table
CREATE TABLE public.call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES user_profiles(id),
  incident_id UUID REFERENCES incidents(id),
  call_type TEXT CHECK (call_type IN ('incident_report', 'emergency', 'maintenance_request')) DEFAULT 'incident_report',
  phone_number TEXT,
  call_duration INTEGER, -- Duration in seconds
  recording_url TEXT,
  transcript TEXT, -- Optional AI transcription
  status TEXT CHECK (status IN ('started', 'completed', 'failed')) DEFAULT 'started',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample depot data for Buscor
INSERT INTO public.depots (name, address, city, province) VALUES
('Buscor Mbombela Depot', '123 Main Street', 'Mbombela', 'Mpumalanga'),
('Buscor Malelane Depot', '456 Industrial Road', 'Malelane', 'Mpumalanga'),
('Buscor Bhoga Depot', '789 Transport Avenue', 'Bhoga', 'Mpumalanga');

-- Insert sample Buscor bus data
INSERT INTO public.buses (bus_number, registration_number, make, model, year, capacity, depot_id) 
SELECT 
  'BUSCOR001', 'ABC123GP', 'Mercedes', 'Sprinter', 2020, 25, d.id
FROM depots d WHERE d.name = 'Buscor Mbombela Depot'
UNION ALL
SELECT 
  'BUSCOR002', 'DEF456GP', 'Iveco', 'Daily', 2019, 30, d.id
FROM depots d WHERE d.name = 'Buscor Malelane Depot'
UNION ALL
SELECT 
  'BUSCOR003', 'GHI789GP', 'Mercedes', 'Sprinter', 2021, 25, d.id
FROM depots d WHERE d.name = 'Buscor Bhoga Depot';

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE depots ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE clock_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can see all data, drivers/mechanics can see their own data
CREATE POLICY "Drivers can view own inspections" ON inspections
  FOR SELECT USING (
    auth.uid() = driver_id OR 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Drivers can create inspections" ON inspections
  FOR INSERT WITH CHECK (auth.uid() = driver_id);

-- Similar policies for incidents and clock entries
CREATE POLICY "Drivers can view own incidents" ON incidents
  FOR SELECT USING (
    auth.uid() = driver_id OR 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Drivers can create incidents" ON incidents
  FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can view own clock entries" ON clock_entries
  FOR SELECT USING (
    auth.uid() = driver_id OR 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Drivers can create clock entries" ON clock_entries
  FOR INSERT WITH CHECK (auth.uid() = driver_id);

-- Public read access for depots and buses (needed for dropdowns)
CREATE POLICY "Anyone can view depots" ON depots FOR SELECT USING (true);
CREATE POLICY "Anyone can view buses" ON buses FOR SELECT USING (true);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('inspection-photos', 'inspection-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('incident-photos', 'incident-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('call-recordings', 'call-recordings', false);

-- Storage policies
CREATE POLICY "Users can upload inspection photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'inspection-photos');

CREATE POLICY "Users can view inspection photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'inspection-photos');

CREATE POLICY "Users can upload incident photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'incident-photos');

CREATE POLICY "Users can view incident photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'incident-photos');

-- Function to calculate total hours worked
CREATE OR REPLACE FUNCTION calculate_work_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.clock_out_time IS NOT NULL AND NEW.clock_in_time IS NOT NULL THEN
    NEW.total_hours := EXTRACT(EPOCH FROM (NEW.clock_out_time - NEW.clock_in_time)) / 3600;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate hours
CREATE TRIGGER calculate_hours_trigger
  BEFORE UPDATE ON clock_entries
  FOR EACH ROW
  EXECUTE FUNCTION calculate_work_hours();

-- Real-time subscriptions setup
-- Enable real-time for tables
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE inspections;
ALTER PUBLICATION supabase_realtime ADD TABLE clock_entries;