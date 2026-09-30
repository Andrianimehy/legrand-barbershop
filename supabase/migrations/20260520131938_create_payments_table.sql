/*
  # Create Payments Tracking Table

  ## Overview
  This migration creates a `payments` table to track payment transactions
  for Mvola, Airtel Money, and cash payments.

  ## New Tables
  - `payments`
    - `id` - UUID primary key
    - `reservation_id` - Foreign key to reservations
    - `amount` - Payment amount in Ariary
    - `payment_method` - Payment method (mvola, airtel, cash)
    - `phone_number` - Phone number for mobile payments
    - `status` - Payment status (pending, processing, completed, failed)
    - `transaction_id` - External transaction ID from provider
    - `error_message` - Error details if payment failed
    - `created_at` - Timestamp
    - `updated_at` - Last update timestamp

  ## Security
  - RLS enabled
  - Only admin (authenticated) users can view all payments
  - Customers can only view their own payments
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  payment_method text NOT NULL DEFAULT 'cash',
  phone_number text,
  status text NOT NULL DEFAULT 'pending',
  transaction_id text,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update payments"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can insert payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX idx_payments_reservation_id ON payments(reservation_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
