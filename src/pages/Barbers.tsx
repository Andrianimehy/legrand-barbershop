import { Page } from '../types';
import { barbers } from '../data/barbershop';

interface BarbersProps {
  onNavigate: (page: Page) => void;
}

export default function Barbers({ onNavigate }: BarbersProps) {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-20">
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
          <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">Les Artisans du Style</p>
          <h1 className="section-title text-white">
            Notre<br /><span className="gold-text">Équipe d'Experts</span>
          </h1>
          <div className="gold-divider" style={{ margin: '1.5rem 0' }} />
          <p className="text-gray-300 max-w-xl leading-relaxed">
            Des maîtres de leur art, passionnés par l'excellence et dédiés à votre satisfaction.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            {barbers.map((barber) => (
              <div key={barber.id} className="card-dark overflow-hidden group">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-56 h-64 sm:h-auto overflow-hidden shrink-0">
                    <img
                      src={barber.image}
                      alt={barber.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <p className="text-gold text-xs tracking-widest uppercase mb-2">{barber.role}</p>
                    <h3 className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {barber.name}
                    </h3>
                    <p className="text-amber-700/70 text-xs mb-4">{barber.experience}</p>
                    <div className="w-8 h-px bg-gold mb-4" />
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">{barber.bio}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                      <span className="text-gray-300 text-xs">{barber.specialty}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">Rejoignez-Nous</p>
          <h2 className="section-title text-white mb-4">
            Vous Êtes Barbier ?<br /><span className="gold-text">Rejoignez l'Équipe</span>
          </h2>
          <div className="gold-divider" />
          <p className="text-gray-400 mb-8 leading-relaxed">
            Nous sommes toujours à la recherche de talents passionnés pour rejoindre notre équipe d'exception.
            Si vous partagez notre amour du métier et de l'excellence, contactez-nous.
          </p>
          <button onClick={() => onNavigate('contact')} className="btn-gold">
            Nous Contacter
          </button>
        </div>
      </section>
    </div>
  );
}
