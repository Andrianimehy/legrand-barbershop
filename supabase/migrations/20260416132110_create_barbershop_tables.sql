
/*
  # Barbershop Website - Initial Schema

  ## Overview
  This migration sets up the core tables for the barbershop website.

  ## New Tables

  ### 1. `reservations`
  Stores all booking requests made through the website.
  - `id` - Unique identifier (UUID)
  - `full_name` - Customer's full name
  - `email` - Customer's email address
  - `phone` - Customer's phone number
  - `service` - Selected service (coupe, rasage, coloration, etc.)
  - `barber_name` - Preferred barber name (optional)
  - `appointment_date` - Chosen date for appointment
  - `appointment_time` - Chosen time slot
  - `payment_method` - Payment method (Mvola, Airtel Money, cash)
  - `payment_phone` - Phone number for mobile payment
  - `notes` - Additional notes from client
  - `status` - Booking status (pending, confirmed, cancelled)
  - `created_at` - Timestamp of submission

  ## Security
  - RLS enabled on all tables
  - Public can INSERT reservations (booking form)
  - Only authenticated users (admins) can SELECT/UPDATE/DELETE
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  barber_name text DEFAULT '',
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  payment_method text NOT NULL DEFAULT 'cash',
  payment_phone text DEFAULT '',
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a reservation"
  ON reservations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
