import { Heart, Shield, Sparkles, Target } from 'lucide-react';
import { Page } from '../types';

interface AboutProps {
  onNavigate: (page: Page) => void;
}

const values = [
  {
    icon: Heart,
    title: 'Passion',
    description: 'Chaque coupe est réalisée avec amour et dévouement. La coiffure est notre vocation, pas seulement notre métier.',
  },
  {
    icon: Shield,
    title: 'Excellence',
    description: 'Des standards irréprochables à chaque prestation. Nous n\'acceptons que le meilleur pour nos clients.',
  },
  {
    icon: Sparkles,
    title: 'Créativité',
    description: 'Tendances actuelles et techniques innovantes alliant tradition et modernité pour un style unique.',
  },
  {
    icon: Target,
    title: 'Précision',
    description: 'L\'art du détail fait toute la différence. Chaque trait, chaque contour est maîtrisé à la perfection.',
  },
];

const milestones = [
  { year: '2012', event: 'Ouverture du premier salon à Antananarivo' },
  { year: '2015', event: 'Expansion de l\'équipe avec 2 nouveaux maîtres barbiers' },
  { year: '2018', event: 'Rénovation et modernisation du salon' },
  { year: '2020', event: 'Lancement des services de coloration premium' },
  { year: '2023', event: 'Certification internationale en techniques de barbier' },
  { year: '2024', event: '2000+ clients fidèles et satisfaction record de 4.9/5' },
];

export default function About({ onNavigate }: AboutProps) {
  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-20">
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl fade-in">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">Notre Identité</p>
            <h1 className="section-title text-white">À Propos de<br /><span className="gold-text">Le Grand Barbershop</span></h1>
            <div className="gold-divider" style={{ margin: '1.5rem 0' }} />
            <p className="text-gray-300 leading-relaxed">
              Plus qu'un salon, un lieu de vie dédié à l'élégance masculine.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Notre salon"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 border-2 border-amber-500/20 z-0" />
              <div className="absolute bottom-8 right-8 card-dark p-6 max-w-xs z-10">
                <p className="text-4xl font-bold text-gold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>12+</p>
                <p className="text-gray-400 text-sm">Années d'expérience dans l'excellence capillaire</p>
              </div>
            </div>

            <div>
              <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Notre Histoire</p>
              <h2 className="section-title text-white mb-4">
                L'Histoire d'une<br /><span className="gold-text">Passion</span>
              </h2>
              <div className="gold-divider" style={{ margin: '0 0 1.5rem' }} />
              <p className="text-gray-400 leading-relaxed mb-4">
                Né d'une vision audacieuse en 2012, Le Grand Barbershop a été créé par des passionnés de l'art capillaire masculin. Inspirés par les grandes maisons de barbiers européens et les traditions africaines de soin, nous avons souhaité créer un espace unique à Madagascar.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                Notre mission est simple : offrir à chaque homme un espace où il peut se ressourcer, se transformer et repartir avec confiance. Chez nous, chaque visite est une expérience sensorielle complète.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Nous avons bâti notre réputation sur trois piliers : la qualité irréprochable de nos prestations, l'accueil chaleureux de notre équipe et notre engagement constant pour l'innovation dans les techniques.
              </p>
              <button
                onClick={() => onNavigate('barbers')}
                className="btn-gold"
              >
                Rencontrer l'Équipe
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Ce Qui Nous Guide</p>
            <h2 className="section-title text-white">Nos Valeurs</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card-dark p-8 text-center group">
                <div className="w-14 h-14 rounded-full border border-amber-700/40 flex items-center justify-center mx-auto mb-5 group-hover:border-amber-500 group-hover:bg-amber-900/20 transition-all duration-300">
                  <Icon size={22} className="text-gold" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">Notre Parcours</p>
            <h2 className="section-title text-white">Moments Clés</h2>
            <div className="gold-divider" />
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-px bg-amber-800/30" />
            <div className="space-y-10">
              {milestones.map(({ year, event }, i) => (
                <div key={year} className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="card-dark inline-block px-6 py-4">
                      <p className="text-gold font-bold text-lg mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{year}</p>
                      <p className="text-gray-400 text-sm">{event}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 rounded-full bg-amber-500 border-2 border-black shrink-0" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { url: 'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Barbier au travail' },
              { url: 'https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Coupe professionnelle' },
              { url: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Ambiance salon' },
            ].map(({ url, alt }) => (
              <div key={alt} className="overflow-hidden group">
                <img
                  src={url}
                  alt={alt}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
