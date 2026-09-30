import { useEffect, useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Page, Service as ServiceType } from '../types';
import { supabase } from '../lib/supabase';
import ServiceCard from '../components/ServiceCard';

interface ServicesProps {
  onNavigate: (page: Page) => void;
}


const CATEGORIES = ['Coupe', 'Rasage', 'Coloration', 'Épilation', 'Enfants', 'Soins'];

export default function Services({ onNavigate }: ServicesProps) {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('services')
      .select('id, name, description, duration, price, category, image_url')
      .eq('active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setServices(data as ServiceType[]);
        setLoading(false);
      });
  }, []);

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: services.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-20">
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
          <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">Nos Prestations</p>
          <h1 className="section-title text-white">
            Découvrez<br /><span className="gold-text">Nos Services</span>
          </h1>
          <div className="gold-divider" style={{ margin: '1.5rem 0' }} />
          <p className="text-gray-300 max-w-xl leading-relaxed">
            Un éventail complet de prestations premium pour votre style et votre bien-être.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            grouped.map(({ category, items }) => (
              <div key={category} className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-px bg-gold" />
                  <h2 className="text-xl font-bold text-white tracking-widest uppercase text-sm">
                    {category}
                  </h2>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((service) => (
                    <div key={service.id} className="cursor-pointer transition-transform duration-300 hover:-translate-y-1" onClick={() => onNavigate('booking')}>
                      <ServiceCard service={service} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">Passez à l'Action</p>
          <h2 className="section-title text-white mb-6">
            Prêt à Vous Faire<br /><span className="gold-text">Chouchouter ?</span>
          </h2>
          <div className="gold-divider" />
          <p className="text-gray-400 mb-8">
            Réservez votre créneau en ligne en quelques clics et profitez de nos services premium.
          </p>
          <button onClick={() => onNavigate('booking')} className="btn-gold px-10">
            Réserver Maintenant
          </button>
        </div>
      </section>
    </div>
  );
}
