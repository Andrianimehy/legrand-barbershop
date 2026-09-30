import { useEffect, useState } from 'react';
import { Check, Tag } from 'lucide-react';
import { Page } from '../types';
import { supabase } from '../lib/supabase';

interface PricingProps {
  onNavigate: (page: Page) => void;
}

interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  category: string;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  original_price: number;
  promo_price: number;
  badge: string;
  condition_text: string;
}

const CATEGORIES = ['Coupe', 'Rasage', 'Coloration', 'Épilation', 'Enfants', 'Soins'];

export default function Pricing({ onNavigate }: PricingProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('services').select('id, name, duration, price, category').eq('active', true).order('sort_order'),
      supabase.from('promotions').select('id, title, description, original_price, promo_price, badge, condition_text').eq('active', true),
    ]).then(([{ data: svcData }, { data: promoData }]) => {
      if (svcData) setServices(svcData as Service[]);
      if (promoData) setPromos(promoData as Promotion[]);
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">Transparence</p>
          <h1 className="section-title text-white">
            Grille<br /><span className="gold-text">Tarifaire</span>
          </h1>
          <div className="gold-divider" />
          <p className="text-gray-300 max-w-xl mx-auto leading-relaxed">
            Des tarifs clairs et transparents pour des prestations d'exception. Tous nos prix incluent les produits utilisés.
          </p>
        </div>
      </section>

      {promos.length > 0 && (
        <section className="py-20 bg-[#0d0d0d]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Offres Spéciales</p>
              <h2 className="section-title text-white mb-4">Promotions en Cours</h2>
              <div className="gold-divider" />
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {promos.map((promo) => (
                <div key={promo.id} className="card-dark p-6 relative overflow-hidden">
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-amber-400 text-black text-xs font-bold px-2 py-1">
                    <Tag size={10} className="inline mr-1" />
                    {promo.badge}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 pr-16" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {promo.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{promo.description}</p>
                  <div className="flex items-baseline gap-2 mb-2">
                    {promo.promo_price > 0 ? (
                      <>
                        <span className="text-gold text-2xl font-bold">{promo.promo_price.toLocaleString()} Ar</span>
                        <span className="text-gray-600 text-sm line-through">{promo.original_price.toLocaleString()} Ar</span>
                      </>
                    ) : (
                      <span className="text-green-400 text-xl font-bold">Offert !</span>
                    )}
                  </div>
                  <p className="text-amber-700/70 text-xs mt-3 border-t border-gray-800 pt-3">{promo.condition_text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            grouped.map(({ category, items }) => (
              <div key={category} className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-px bg-gold" />
                  <h2 className="text-xs font-bold text-white tracking-widest uppercase">{category}</h2>
                  <div className="flex-1 h-px bg-gray-800" />
                </div>
                <div className="space-y-2">
                  {items.map((service, i) => (
                    <div
                      key={service.id}
                      className={`flex items-center justify-between px-6 py-4 transition-colors duration-200 hover:bg-gray-900/50 ${
                        i % 2 === 0 ? 'bg-[#111111]' : 'bg-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Check size={14} className="text-gold shrink-0" />
                        <div>
                          <p className="text-white text-sm font-medium">{service.name}</p>
                          <p className="text-gray-600 text-xs mt-0.5">{service.duration}</p>
                        </div>
                      </div>
                      <span className="text-gold font-bold text-base shrink-0 ml-4">
                        {service.price.toLocaleString()} Ar
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          <div className="card-dark p-6 mt-8 border-l-2 border-gold">
            <p className="text-gray-400 text-sm">
              <span className="text-gold font-semibold">Note :</span> Les tarifs sont indiqués en Ariary (MGA) et peuvent varier selon la longueur et la complexité. Une consultation gratuite est disponible sur demande.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title text-white mb-6">
            Réservez et Profitez de<br /><span className="gold-text">Nos Meilleures Offres</span>
          </h2>
          <button onClick={() => onNavigate('booking')} className="btn-gold px-10">
            Prendre Rendez-vous
          </button>
        </div>
      </section>
    </div>
  );
}
