import { useEffect, useRef } from 'react';
import { ChevronDown, Star, Award, Users, Clock } from 'lucide-react';
import { Page } from '../types';
import { useServices } from '../hooks/useServices';

interface HomeProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  { icon: Users, value: '2000+', label: 'Clients Satisfaits' },
  { icon: Award, value: '12', label: 'Années d\'Excellence' },
  { icon: Star, value: '4.9', label: 'Note Moyenne' },
  { icon: Clock, value: '6j/7', label: 'Disponibilité' },
];

const testimonials = [
  {
    name: 'Rakoto Jean',
    text: 'Service exceptionnel ! Karim a parfaitement réalisé ma coupe. L\'atmosphère du salon est unique, je recommande vivement.',
    rating: 5,
  },
  {
    name: 'Andry M.',
    text: 'Le meilleur barbershop de la ville sans hésitation. Équipe professionnelle, résultat impeccable. Je suis client depuis 3 ans.',
    rating: 5,
  },
  {
    name: 'Fidy R.',
    text: 'Ambiance élégante et prestations haut de gamme. Le rasage traditionnel est une expérience à vivre absolument.',
    rating: 5,
  },
];

export default function Home({ onNavigate }: HomeProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { services, loading } = useServices();
  const featuredServices = services.slice(0, 4);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#0a0a0a]">
      <section className="relative h-screen overflow-hidden flex items-center">
        <div
          ref={heroRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl fade-in">
            <p className="text-gold tracking-[0.4em] uppercase text-xs mb-4 font-medium">
              — Antananarivo, Madagascar
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}>
              L'Art du{' '}
              <span className="gold-text block">Style Masculin</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-xl">
              Découvrez une expérience de coiffure d'exception. Coupes précises, rasage traditionnel
              et soins premium pour révéler votre meilleur style.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => handleNav('booking')} className="btn-gold text-sm px-8 py-3.5">
                Prendre Rendez-vous
              </button>
              <button onClick={() => handleNav('services')} className="btn-outline-gold text-sm px-8 py-3.5">
                Nos Services
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={24} className="text-gold opacity-70" />
        </div>
      </section>

      <section className="py-16 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 rounded-full border border-amber-700/40 flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-gold" />
                </div>
                <div className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {value}
                </div>
                <div className="text-gray-400 text-sm tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Notre Histoire</p>
              <h2 className="section-title text-white mb-4">
                Un Héritage de<br /><span className="gold-text">Savoir-Faire</span>
              </h2>
              <div className="gold-divider" style={{ margin: '0 0 1.5rem' }} />
              <p className="text-gray-400 leading-relaxed mb-5">
                Fondé en 2012, Le Grand Barbershop est né d'une passion profonde pour l'art de la coiffure masculine. Inspirés des grands barbiers européens, nous avons créé un espace où l'excellence artisanale rencontre l'élégance contemporaine.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Chaque coupe est une œuvre d'art, chaque rasage une expérience sensorielle. Notre équipe de maîtres barbiers vous accueille dans un cadre raffiné pour une expérience unique et personnalisée.
              </p>
              <button onClick={() => handleNav('about')} className="btn-outline-gold">
                En Savoir Plus
              </button>
            </div>
            <div className="relative">
              <div className="relative z-10 overflow-hidden" style={{ borderRadius: '2px' }}>
                <img
                  src="https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Intérieur du salon"
                  className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-32 border border-amber-500/30 rounded-sm z-0" />
              <div className="absolute -top-6 -right-6 w-32 h-48 border border-amber-500/20 rounded-sm z-0" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Ce Que Nous Faisons</p>
            <h2 className="section-title text-white">Nos Prestations</h2>
            <div className="gold-divider" />
            <p className="text-gray-400 max-w-xl mx-auto">
              Des services soigneusement élaborés pour sublimer votre style et vous offrir une expérience premium.
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredServices.map((service) => (
                  <div key={service.id} className="card-dark overflow-hidden group cursor-pointer" onClick={() => handleNav('services')}>
                    {service.image_url && (
                      <div className="relative h-40 overflow-hidden bg-gray-900">
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="w-10 h-0.5 bg-gold mb-4 group-hover:w-full transition-all duration-500" />
                      <h3 className="text-white font-semibold text-base mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {service.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gold font-bold">{service.price.toLocaleString()} Ar</span>
                        <span className="text-gray-600 text-xs">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <button onClick={() => handleNav('services')} className="btn-outline-gold">
                  Voir Tous les Services
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">Prenez Soin de Vous</p>
          <h2 className="section-title text-white mb-6">
            Prêt à Transformer<br />Votre Style ?
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Réservez votre séance dès maintenant et laissez nos experts vous guider vers le look qui vous correspond parfaitement.
          </p>
          <button onClick={() => handleNav('booking')} className="btn-gold px-10 py-4 text-base">
            Réserver Ma Séance
          </button>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Témoignages</p>
            <h2 className="section-title text-white">Ce Que Disent Nos Clients</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card-dark p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-900/30 border border-amber-700/30 flex items-center justify-center">
                    <span className="text-gold text-sm font-bold">{t.name.charAt(0)}</span>
                  </div>
                  <span className="text-white text-sm font-medium">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d0d] border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { label: 'Lun – Ven', hours: '09:00 – 19:00' },
              { label: 'Samedi', hours: '09:00 – 18:00' },
              { label: 'Dimanche', hours: 'Fermé' },
            ].map(({ label, hours }) => (
              <div key={label} className="border-l border-amber-800/30 pl-6 text-left">
                <p className="text-gold text-xs tracking-widest uppercase mb-1">{label}</p>
                <p className="text-white text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {hours}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
