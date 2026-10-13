-- Crée un suivi de paiement pour chaque réservation, quel que soit le mode choisi.
-- À appliquer dans Supabase SQL Editor si les migrations ne sont pas déployées automatiquement.

CREATE OR REPLACE FUNCTION public.create_payment_for_reservation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  service_price integer;
BEGIN
  SELECT s.price
    INTO service_price
  FROM public.services s
  WHERE lower(trim(s.name)) = lower(trim(NEW.service))
  ORDER BY s.active DESC
  LIMIT 1;

  IF service_price IS NULL THEN
    RAISE EXCEPTION 'Tarif introuvable pour le service réservé : %', NEW.service;
  END IF;

  INSERT INTO public.payments (
    reservation_id,
    amount,
    payment_method,
    phone_number,
    status
  )
  VALUES (
    NEW.id,
    service_price,
    COALESCE(NULLIF(NEW.payment_method, ''), 'cash'),
    COALESCE(NULLIF(NEW.payment_phone, ''), NULLIF(NEW.phone, '')),
    'pending'
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_create_payment_for_reservation ON public.reservations;
CREATE TRIGGER trigger_create_payment_for_reservation
AFTER INSERT ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.create_payment_for_reservation();

-- Rattrape les réservations existantes qui n'ont pas encore de ligne de paiement.
INSERT INTO public.payments (
  reservation_id,
  amount,
  payment_method,
  phone_number,
  status
)
SELECT
  r.id,
  s.price,
  COALESCE(NULLIF(r.payment_method, ''), 'cash'),
  COALESCE(NULLIF(r.payment_phone, ''), NULLIF(r.phone, '')),
  'pending'
FROM public.reservations r
JOIN LATERAL (
  SELECT price
  FROM public.services
  WHERE lower(trim(name)) = lower(trim(r.service))
  ORDER BY active DESC
  LIMIT 1
) s ON true
WHERE NOT EXISTS (
  SELECT 1
  FROM public.payments p
  WHERE p.reservation_id = r.id
);
