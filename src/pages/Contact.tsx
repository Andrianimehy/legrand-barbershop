import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Twitter, Send } from 'lucide-react';
import { Page } from '../types';

interface ContactProps {
  onNavigate: (page: Page) => void;
}

export default function Contact({ onNavigate: _onNavigate }: ContactProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-20">
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/90" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 fade-in">
          <p className="text-gold tracking-[0.3em] uppercase text-xs mb-4">Parlons-Nous</p>
          <h1 className="section-title text-white">
            Contactez<br /><span className="gold-text">Notre Équipe</span>
          </h1>
          <div className="gold-divider" style={{ margin: '1.5rem 0' }} />
          <p className="text-gray-300 max-w-xl leading-relaxed">
            Nous sommes à votre écoute pour toute question, réservation ou demande particulière.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                Informations de Contact
              </h2>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full border border-amber-700/40 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Adresse</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Lot II B 45, Ankorondrano<br />
                      Antananarivo 101, Madagascar
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full border border-amber-700/40 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Téléphone</p>
                    <a href="tel:+261340000000" className="text-gray-400 text-sm hover:text-gold transition-colors">
                      +261 34 00 000 00
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full border border-amber-700/40 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Email</p>
                    <a href="mailto:contact@legrand-barbershop.mg" className="text-gray-400 text-sm hover:text-gold transition-colors">
                      contact@legrand-barbershop.mg
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full border border-amber-700/40 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Horaires d'Ouverture</p>
                    <div className="text-gray-400 text-sm space-y-1">
                      <p>Lundi – Vendredi : 09:00 – 19:00</p>
                      <p>Samedi : 09:00 – 18:00</p>
                      <p className="text-red-400/80">Dimanche : Fermé</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <a
                  href="https://wa.me/261340000000?text=Bonjour%2C%20je%20souhaite%20prendre%20rendez-vous"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-900/20 border border-green-700/40 hover:border-green-500 px-5 py-3 transition-all duration-300 group w-fit"
                >
                  <MessageCircle size={20} className="text-green-400" />
                  <span className="text-green-300 text-sm font-medium group-hover:text-green-200">
                    Contacter via WhatsApp
                  </span>
                </a>
              </div>

              <div>
                <p className="text-gold text-xs tracking-widest uppercase mb-4">Nos Réseaux Sociaux</p>
                <div className="flex gap-3">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-400 transition-all duration-300">
                    <Facebook size={16} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-pink-500 hover:text-pink-400 transition-all duration-300">
                    <Instagram size={16} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-sky-500 hover:text-sky-400 transition-all duration-300">
                    <Twitter size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                Envoyez-nous un Message
              </h2>

              {sent ? (
                <div className="card-dark p-10 text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-6">
                    <Send size={24} className="text-gold" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Message Envoyé !
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button onClick={() => setSent(false)} className="btn-outline-gold">
                    Nouveau Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Nom Complet</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                        className="w-full bg-[#111111] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors duration-200 placeholder-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                        className="w-full bg-[#111111] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors duration-200 placeholder-gray-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+261 XX XX XXX XX"
                      className="w-full bg-[#111111] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors duration-200 placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Votre message..."
                      className="w-full bg-[#111111] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors duration-200 placeholder-gray-600 resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-gold w-full text-center">
                    Envoyer le Message
                  </button>
                </form>
              )}

              <div className="mt-10 overflow-hidden" style={{ height: '300px' }}>
                <iframe
                  title="Localisation"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.89!2d47.5295!3d-18.9127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU0JzQ1LjciUyA0N8KwMzEnNDYuMiJF!5e0!3m2!1sfr!2smg!4v1000000000000"
                  width="100%"
                  height="300"
                  style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(80%)' }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
