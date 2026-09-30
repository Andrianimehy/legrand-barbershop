import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Page } from '../types';

interface GalleryProps {
  onNavigate: (page: Page) => void;
}

const galleryImages = [
  {
    url: 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Salon',
    label: 'Ambiance du salon',
  },
  {
    url: 'https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Coupe',
    label: 'Coupe dégradée précise',
  },
  {
    url: 'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Style',
    label: 'Style urbain moderne',
  },
  {
    url: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Rasage',
    label: 'Rasage traditionnel',
  },
  {
    url: 'https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Salon',
    label: 'Espace premium',
  },
  {
    url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Style',
    label: 'Look élégant',
  },
  {
    url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Barbe',
    label: 'Taille de barbe',
  },
  {
    url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Style',
    label: 'Coiffure tendance',
  },
  {
    url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Style',
    label: 'Style classique',
  },
  {
    url: 'https://images.pexels.com/photos/756862/pexels-photo-756862.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Coupe',
    label: 'Coupe soignée',
  },
  {
    url: 'https://images.pexels.com/photos/2061828/pexels-photo-2061828.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Style',
    label: 'Look sophistiqué',
  },
  {
    url: 'https://images.pexels.com/photos/1153369/pexels-photo-1153369.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Coupe',
    label: 'Finition parfaite',
  },
];

const filterCategories = ['Tous', 'Salon', 'Coupe', 'Rasage', 'Barbe', 'Style'];

export default function Gallery({ onNavigate }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = activeFilter === 'Tous'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeFilter);

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-20">
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">Nos Réalisations</p>
          <h1 className="section-title text-white">
            Galerie<br /><span className="gold-text">Photos</span>
          </h1>
          <div className="gold-divider" />
          <p className="text-gray-300 max-w-xl mx-auto">
            Explorez notre portfolio de coupes, rasages et créations. L'excellence visible à chaque image.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 text-xs tracking-widest uppercase font-medium transition-all duration-300 ${
                  activeFilter === cat
                    ? 'btn-gold'
                    : 'border border-gray-700 text-gray-400 hover:border-amber-600 hover:text-amber-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((img, i) => (
              <div
                key={i}
                className="relative group overflow-hidden cursor-pointer aspect-square"
                onClick={() => setLightbox(img.url)}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <ZoomIn size={24} className="text-gold mx-auto mb-2" />
                    <p className="text-white text-xs tracking-wide">{img.label}</p>
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-black/70 px-2 py-0.5">
                  <span className="text-gold text-xs tracking-widest uppercase">{img.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title text-white mb-6">
            Vous aussi, créez votre<br /><span className="gold-text">Look Signature</span>
          </h2>
          <button onClick={() => onNavigate('booking')} className="btn-gold px-10">
            Prendre Rendez-vous
          </button>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gold transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <img
            src={lightbox}
            alt="Agrandie"
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
