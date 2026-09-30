export type Page =
  | 'home'
  | 'about'
  | 'barbers'
  | 'services'
  | 'pricing'
  | 'gallery'
  | 'contact'
  | 'booking'
  | 'legal';

export interface Reservation {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  service: string;
  barber_name: string;
  appointment_date: string;
  appointment_time: string;
  payment_method: string;
  payment_phone: string;
  notes: string;
  status?: string;
  created_at?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  category: string;
  image_url?: string;
  active?: boolean;
  sort_order?: number;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  image: string;
  bio: string;
}
