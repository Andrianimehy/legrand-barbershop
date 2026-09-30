/*
  # Seed Service Images

  ## Overview
  This migration adds image URLs to existing services from Pexels.

  ## Changes
  - Updates all services with appropriate stock photo URLs
  - Each service has a relevant professional barbershop/grooming image
*/

UPDATE services SET image_url = 'https://images.pexels.com/photos/3307758/pexels-photo-3307758.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE name = 'Coupe Homme Classique';

UPDATE services SET image_url = 'https://images.pexels.com/photos/3407857/pexels-photo-3407857.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE name = 'Coupe & Barbe';

UPDATE services SET image_url = 'https://images.pexels.com/photos/3931603/pexels-photo-3931603.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE name = 'Rasage Traditionnel';

UPDATE services SET image_url = 'https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE name = 'Taille de Barbe';

UPDATE services SET image_url = 'https://images.pexels.com/photos/3370750/pexels-photo-3370750.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE name = 'Coloration Complète';

UPDATE services SET image_url = 'https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE name = 'Mèches / Balayage';

UPDATE services SET image_url = 'https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE name = 'Épilation des Sourcils';

UPDATE services SET image_url = 'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE name = 'Épilation du Visage';

UPDATE services SET image_url = 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE name = 'Coupe Enfant (- 12 ans)';

UPDATE services SET image_url = 'https://images.pexels.com/photos/3962568/pexels-photo-3962568.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE name = 'Soin Capillaire';
