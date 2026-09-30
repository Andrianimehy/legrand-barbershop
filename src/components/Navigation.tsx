import { useState, useEffect } from 'react';
import { Menu, X, Scissors } from 'lucide-react';
import { Page } from '../types';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navLinks: { label: string; page: Page }[] = [
  { label: 'Accueil', page: 'home' },
  { label: 'À Propos', page: 'about' },
  { label: 'Notre Équipe', page: 'barbers' },
  { label: 'Services', page: 'services' },
  { label: 'Tarifs', page: 'pricing' },
  { label: 'Galerie', page: 'gallery' },
  { label: 'Contact', page: 'contact' },
];

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full border border-amber-500 flex items-center justify-center group-hover:bg-amber-500 transition-all duration-300">
              <Scissors size={18} className="text-amber-400 group-hover:text-black transition-colors duration-300" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-white tracking-widest text-sm uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                Le Grand
              </span>
              <span className="block text-xs tracking-widest uppercase" style={{ color: '#c9a84c' }}>
                Barbershop
              </span>
            </div>
          </button>

          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ label, page }) => (
              <li key={page}>
                <button
                  onClick={() => handleNav(page)}
                  className={`text-sm tracking-wide uppercase transition-all duration-300 relative group ${
                    currentPage === page ? 'text-amber-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                      currentPage === page ? 'w-full bg-amber-500' : 'w-0 group-hover:w-full bg-amber-500'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <button
              onClick={() => handleNav('booking')}
              className="btn-gold text-xs px-5 py-2.5"
            >
              Réserver
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white p-2"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen bg-black/98 backdrop-blur-md' : 'max-h-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => handleNav(page)}
              className={`text-left text-sm tracking-widest uppercase py-2 border-b border-gray-800 transition-colors duration-200 ${
                currentPage === page ? 'text-amber-400' : 'text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => handleNav('booking')}
            className="btn-gold w-full text-center mt-2"
          >
            Prendre Rendez-vous
          </button>
        </div>
      </div>
    </header>
  );
}
