import { Scissors, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNav = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full border border-amber-500 flex items-center justify-center">
                <Scissors size={18} className="text-amber-400" />
              </div>
              <div>
                <span className="block font-bold text-white tracking-widest text-sm uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Le Grand
                </span>
                <span className="block text-xs tracking-widest uppercase text-gold">
                  Barbershop
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              L'art du style masculin depuis 2012. Un espace où tradition et modernité se rencontrent pour révéler le meilleur de vous-même.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-amber-500 hover:text-amber-400 transition-all duration-300">
                <Facebook size={15} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-amber-500 hover:text-amber-400 transition-all duration-300">
                <Instagram size={15} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-amber-500 hover:text-amber-400 transition-all duration-300">
                <Twitter size={15} />
              </a>
              <a href="https://wa.me/261340000000" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-400 transition-all duration-300">
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold tracking-widest uppercase text-xs mb-5 text-gold">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', page: 'home' as Page },
                { label: 'À Propos', page: 'about' as Page },
                { label: 'Notre Équipe', page: 'barbers' as Page },
                { label: 'Services', page: 'services' as Page },
                { label: 'Tarifs', page: 'pricing' as Page },
                { label: 'Galerie', page: 'gallery' as Page },
                { label: 'Contact', page: 'contact' as Page },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => handleNav(page)}
                    className="text-gray-400 hover:text-amber-400 text-sm transition-colors duration-200 tracking-wide"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold tracking-widest uppercase text-xs mb-5 text-gold">
              Informations
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-gold mt-0.5 shrink-0" />
                <span>Lot II B 45, Antananarivo 101, Madagascar</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-gold shrink-0" />
                <span>+261 34 00 000 00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-gold shrink-0" />
                <span>contact@legrand-barbershop.mg</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold tracking-widest uppercase text-xs mb-5 text-gold">
              Horaires
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2.5 text-gray-400">
                <Clock size={15} className="text-gold mt-0.5 shrink-0" />
                <div>
                  <p>Lun – Ven : 09h00 – 19h00</p>
                  <p>Samedi : 09h00 – 18h00</p>
                  <p className="text-red-400">Dimanche : Fermé</p>
                </div>
              </li>
            </ul>
            <div className="mt-6">
              <button
                onClick={() => handleNav('booking')}
                className="btn-gold w-full text-center"
              >
                Prendre Rendez-vous
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Le Grand Barbershop. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <button
              onClick={() => handleNav('legal')}
              className="text-gray-600 hover:text-amber-400 text-xs transition-colors duration-200"
            >
              Mentions légales
            </button>
            <button
              onClick={() => handleNav('legal')}
              className="text-gray-600 hover:text-amber-400 text-xs transition-colors duration-200"
            >
              Politique de confidentialité
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
