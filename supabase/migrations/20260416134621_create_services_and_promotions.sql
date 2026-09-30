/*
  # Services and Promotions Tables

  ## Overview
  This migration creates `services` and `promotions` tables to allow admin management
  of the barbershop's offerings. Data is seeded with the existing static content.

  ## New Tables

  ### 1. `services`
  - `id` - UUID primary key
  - `name` - Service name
  - `description` - Service description
  - `duration` - Duration string (e.g., "45 min")
  - `price` - Price in Ariary (MGA)
  - `category` - Service category (Coupe, Rasage, Coloration, etc.)
  - `active` - Whether the service is currently offered
  - `sort_order` - Display order
  - `created_at` - Creation timestamp

  ### 2. `promotions`
  - `id` - UUID primary key
  - `title` - Promotion title
  - `description` - What is included
  - `original_price` - Original price before discount
  - `promo_price` - Discounted price (0 = free)
  - `badge` - Badge label (e.g., "-18%", "GRATUIT")
  - `condition_text` - Conditions for the promotion
  - `active` - Whether the promotion is currently active
  - `created_at` - Creation timestamp

  ## Security
  - RLS enabled on both tables
  - Public (anon) can only SELECT active records
  - Authenticated users (admins) can perform all operations

  ## Data
  Both tables are seeded with the existing static data from the frontend.
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  price integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Authenticated users can insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  original_price integer NOT NULL DEFAULT 0,
  promo_price integer NOT NULL DEFAULT 0,
  badge text NOT NULL DEFAULT '',
  condition_text text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active promotions"
  ON promotions
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Authenticated users can insert promotions"
  ON promotions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update promotions"
  ON promotions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete promotions"
  ON promotions
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO services (name, description, duration, price, category, sort_order) VALUES
  ('Coupe Homme Classique', 'Coupe soignée avec lavage, séchage et coiffage inclus', '45 min', 15000, 'Coupe', 1),
  ('Coupe & Barbe', 'Coupe complète associée à la taille et mise en forme de la barbe', '60 min', 22000, 'Coupe', 2),
  ('Rasage Traditionnel', 'Rasage au rasoir droit avec serviette chaude et soin après-rasage', '30 min', 12000, 'Rasage', 3),
  ('Taille de Barbe', 'Entretien et mise en forme précise de la barbe', '20 min', 8000, 'Rasage', 4),
  ('Coloration Complète', 'Coloration professionnelle avec diagnostic de couleur personnalisé', '90 min', 35000, 'Coloration', 5),
  ('Mèches / Balayage', 'Technique de mèches ou balayage pour un résultat naturel et lumineux', '120 min', 45000, 'Coloration', 6),
  ('Épilation des Sourcils', 'Mise en forme et épilation précise des sourcils', '15 min', 5000, 'Épilation', 7),
  ('Épilation du Visage', 'Épilation complète du visage (oreilles, nez, cou)', '20 min', 7000, 'Épilation', 8),
  ('Coupe Enfant (- 12 ans)', 'Coupe adaptée aux enfants dans un cadre accueillant', '30 min', 8000, 'Enfants', 9),
  ('Soin Capillaire', 'Masque nourrissant, traitement anti-chute ou soin hydratant', '40 min', 18000, 'Soins', 10);

INSERT INTO promotions (title, description, original_price, promo_price, badge, condition_text) VALUES
  ('Pack Étudiant', 'Coupe + Barbe', 22000, 18000, '-18%', 'Sur présentation de la carte étudiant'),
  ('Duo Père & Fils', 'Deux coupes au prix de', 30000, 22000, '-27%', 'Le samedi uniquement'),
  ('Fidélité', 'À partir de la 10ème visite', 15000, 0, 'GRATUIT', 'Programme de fidélité sur carte');
