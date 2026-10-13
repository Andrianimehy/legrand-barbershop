import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, User, CreditCard, CheckCircle, ChevronRight, Copy, Banknote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { barbers, timeSlots } from '../data/barbershop';
import { Reservation } from '../types';

interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: number;
  category: string;
}

const paymentMethods = [
  { id: 'mvola', label: 'MVola', subtitle: 'Paiement mobile', mark: 'MVola', color: 'text-yellow-400', colorClass: 'border-gray-800 hover:border-yellow-400/70', activeColor: 'border-yellow-400 bg-yellow-400/10 ring-1 ring-yellow-400/50' },
  { id: 'orange', label: 'Orange Money', subtitle: 'Paiement mobile', mark: 'Orange', color: 'text-orange-500', colorClass: 'border-gray-800 hover:border-orange-500/70', activeColor: 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500/50' },
  { id: 'airtel', label: 'Airtel Money', subtitle: 'Paiement mobile', mark: 'airtel', color: 'text-red-500', colorClass: 'border-gray-800 hover:border-red-500/70', activeColor: 'border-red-500 bg-red-500/10 ring-1 ring-red-500/50' },
  { id: 'cash', label: 'Espèces', subtitle: 'Paiement en boutique', mark: 'CASH', color: 'text-emerald-400', colorClass: 'border-gray-800 hover:border-emerald-500/70', activeColor: 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50' },
];

const paymentDestinations: Record<string, { number: string; label: string }> = {
  mvola: { number: '0341458773', label: 'MVola' },
  orange: { number: '0379894927', label: 'Orange Money' },
};

const steps = ['Service', 'Date & Heure', 'Coordonnées', 'Paiement', 'Confirmation'];

// Référence courte à communiquer dans le motif du transfert (8 caractères alphanumériques).
const createPaymentReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join('');
};

const initialForm: Reservation = {
  full_name: '',
  email: '',
  phone: '',
  service: '',
  barber_name: '',
  appointment_date: '',
  appointment_time: '',
  payment_method: 'cash',
  payment_phone: '',
  notes: '',
};

export default function Booking() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Reservation>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [reservationId, setReservationId] = useState(() => crypto.randomUUID());
  const [paymentReference, setPaymentReference] = useState(() => createPaymentReference());
  const [copiedReference, setCopiedReference] = useState(false);
  const bookingCardRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (success) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    bookingCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, success]);

  useEffect(() => {
    supabase
      .from('services')
      .select('id, name, duration, price, category')
      .eq('active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setServices(data as ServiceItem[]);
      });
  }, []);

  const selectedService = services.find((s) => s.name === form.service);

  const getTodayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setMonth(max.getMonth() + 3);
    return max.toISOString().split('T')[0];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // L'identifiant est créé avant l'envoi afin d'être affiché comme référence de commande.
      // Enregistrer la réservation
      const { error: dbError } = await supabase
        .from('reservations')
        .insert([
          {
            ...form,
            notes: [form.notes?.trim(), `Référence paiement: ${paymentReference}`].filter(Boolean).join('\n'),
            id: reservationId,
          },
        ]);

      if (dbError) throw dbError;

      // Initialiser le paiement mobile si nécessaire
      if (form.payment_method === 'mvola' && selectedService) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mvola-payment`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                reservation_id: reservationId,
                amount: selectedService.price,
                phone_number: form.phone,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Payment error:', errorData);
          }
        } catch (paymentError) {
          console.error('Payment initialization error:', paymentError);
        }
      }

      setSuccess(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep0 = !!form.service;
  const canProceedStep1 = !!form.appointment_date && !!form.appointment_time;
  const canProceedStep2 = !!form.full_name && !!form.email && !!form.phone;
  const canProceedStep3 = true;

  if (success) {
    const paymentPending = form.payment_method !== 'cash';

    return (
      <div className="bg-[#0a0a0a] min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center card-dark p-12">
          <div className="w-20 h-20 rounded-full border-2 border-amber-500 flex items-center justify-center mx-auto mb-6 scale-in">
            <CheckCircle size={36} className="text-gold" />
          </div>

          <h2 className="section-title text-white mb-3">
            Réservation Confirmée !
          </h2>

          <div className="gold-divider" />

          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Merci <span className="text-white font-medium">{form.full_name}</span> !
            Votre rendez-vous a été enregistré.
            Nous vous contacterons au{' '}
            <span className="text-gold">{form.phone}</span> pour confirmer votre séance.
          </p>

          {paymentPending && (
            <div className="bg-amber-900/20 border border-amber-800/40 rounded px-4 py-3 mb-6">
              <p className="text-amber-300 text-sm font-medium mb-2">
                Paiement en cours
              </p>

              <p className="text-gray-400 text-xs">
                Le montant de{' '}
                <span className="text-gold font-bold">
                  {selectedService?.price.toLocaleString() ?? '–'} Ar
                </span>{' '}
                est à transférer au numéro indiqué ci-dessous, avec la référence de paiement{' '}
                <span className="text-gold font-mono font-bold tracking-widest">{paymentReference}</span> comme motif.
              </p>

              <p className="text-gray-500 text-xs mt-2">Conservez le reçu de transfert pour faciliter la vérification du paiement.</p>
            </div>
          )}

          <div className="card-dark p-5 mb-8 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Service</span>
              <span className="text-white">{form.service}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="text-white">
                {new Date(form.appointment_date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Heure</span>
              <span className="text-white">{form.appointment_time}</span>
            </div>

            {form.barber_name && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Barbier</span>
                <span className="text-white">{form.barber_name}</span>
              </div>
            )}

            <div className="flex justify-between gap-4 text-sm border-t border-gray-800 pt-2 mt-2">
              <span className="text-gray-500 shrink-0">Référence</span>
              <span className="text-amber-300 font-mono text-sm tracking-widest text-right">{paymentReference}</span>
            </div>

            <div className="flex justify-between text-sm border-t border-gray-800 pt-2 mt-2">
              <span className="text-gray-500">Paiement</span>
              <span className="text-white capitalize">
                {form.payment_method === 'mvola'
                  ? 'MVola'
                  : form.payment_method === 'orange'
                    ? 'Orange Money'
                    : form.payment_method === 'airtel'
                      ? 'Airtel Money'
                      : 'Espèces'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setSuccess(false);
              setForm(initialForm);
              setStep(0);
              setReservationId(crypto.randomUUID());
              setPaymentReference(createPaymentReference());
              setCopiedReference(false);
            }}
            className="btn-gold w-full"
          >
            Nouvelle Réservation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen pt-20">
      <section className="py-16 bg-[#0d0d0d] border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gold tracking-[0.3em] uppercase text-xs mb-3">
            En Ligne 24h/24
          </p>

          <h1 className="section-title text-white">
            Réserver Votre<br />
            <span className="gold-text">Rendez-vous</span>
          </h1>

          <div className="gold-divider" />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center gap-2 shrink-0 transition-all duration-300 ${
                  i <= step ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => i < step && setStep(i)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    i < step
                      ? 'bg-gold text-black'
                      : i === step
                        ? 'border-2 border-gold text-gold'
                        : 'border-2 border-gray-700 text-gray-600'
                  }`}
                >
                  {i < step ? '✓' : i + 1}
                </div>

                <span
                  className={`text-xs tracking-wide hidden sm:block ${
                    i === step
                      ? 'text-gold'
                      : i < step
                        ? 'text-gray-400'
                        : 'text-gray-700'
                  }`}
                >
                  {s}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-px mx-2 transition-all duration-300 ${
                    i < step ? 'bg-gold' : 'bg-gray-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div ref={bookingCardRef} className="card-dark p-5 sm:p-8 scroll-mt-24">
          {step === 0 && (
            <div className="fade-in">
              <h2
                className="text-white text-xl font-bold mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                <User size={20} className="text-gold" />
                Choisissez un Service
              </h2>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {services.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setForm({ ...form, service: s.name })}
                    className={`p-4 border cursor-pointer transition-all duration-200 ${
                      form.service === s.name
                        ? 'border-amber-500 bg-amber-900/10'
                        : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white text-sm font-medium">{s.name}</p>
                        <p className="text-gray-600 text-xs mt-1">{s.duration}</p>
                      </div>

                      <span className="text-gold font-bold text-sm shrink-0 ml-2">
                        {s.price.toLocaleString()} Ar
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                  Barbier Préféré (optionnel)
                </label>

                <select
                  name="barber_name"
                  value={form.barber_name}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors duration-200"
                >
                  <option value="">Pas de préférence</option>

                  {barbers.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} — {b.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <button
                disabled={!canProceedStep0}
                onClick={() => setStep(1)}
                className={`btn-gold w-full flex items-center justify-center gap-2 ${
                  !canProceedStep0 ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                Continuer <ChevronRight size={16} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="fade-in">
              <h2
                className="text-white text-xl font-bold mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                <Calendar size={20} className="text-gold" />
                Date & Heure
              </h2>

              {selectedService && (
                <div className="bg-amber-900/10 border border-amber-800/30 px-4 py-3 mb-6">
                  <p className="text-gold text-xs">
                    Service sélectionné :{' '}
                    <span className="text-white">{selectedService.name}</span> —{' '}
                    {selectedService.duration} —{' '}
                    <span className="font-bold">
                      {selectedService.price.toLocaleString()} Ar
                    </span>
                  </p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                  Date du Rendez-vous
                </label>

                <div className="relative">
                  <input
                    ref={dateInputRef}
                    type="date"
                    name="appointment_date"
                    value={form.appointment_date}
                    onChange={handleChange}
                    min={getTodayDate()}
                    max={getMaxDate()}
                    required
                    onClick={() => {
                      // Ouvre le calendrier natif au clic sur le champ, notamment sur ordinateur.
                      const dateInput = dateInputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
                      try {
                        dateInput?.showPicker?.();
                      } catch {
                        dateInput?.focus();
                      }
                    }}
                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 pr-12 text-sm focus:outline-none focus:border-amber-600 transition-colors duration-200 [color-scheme:dark]"
                  />
                  <button
                    type="button"
                    aria-label="Ouvrir le calendrier"
                    title="Choisir une date"
                    onClick={() => {
                      const dateInput = dateInputRef.current as (HTMLInputElement & { showPicker?: () => void }) | null;
                      try {
                        dateInput?.showPicker?.();
                      } catch {
                        dateInput?.focus();
                        dateInput?.click();
                      }
                    }}
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-amber-400 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <Calendar size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-3">
                  <Clock size={12} className="inline mr-1" />
                  Créneau Horaire
                </label>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm({ ...form, appointment_time: slot })}
                      className={`py-2 text-xs border font-medium transition-all duration-200 ${
                        form.appointment_time === slot
                          ? 'border-amber-500 bg-amber-900/20 text-gold'
                          : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(0)}
                  className="btn-outline-gold flex-1"
                >
                  Retour
                </button>

                <button
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                  className={`btn-gold flex-1 flex items-center justify-center gap-2 ${
                    !canProceedStep1 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  Continuer <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h2
                className="text-white text-xl font-bold mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                <User size={20} className="text-gold" />
                Vos Coordonnées
              </h2>

              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                    Nom Complet *
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom complet"
                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors duration-200 placeholder-gray-600"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                      className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors duration-200 placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                      Téléphone *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+261 34 XX XXX XX"
                      className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors duration-200 placeholder-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                    Notes Additionnelles
                  </label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Précisions particulières sur votre coupe..."
                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors duration-200 placeholder-gray-600 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="btn-outline-gold flex-1"
                >
                  Retour
                </button>

                <button
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                  className={`btn-gold flex-1 flex items-center justify-center gap-2 ${
                    !canProceedStep2 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  Continuer <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <h2
                className="text-white text-xl font-bold mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                <CreditCard size={20} className="text-gold" />
                Mode de Paiement
              </h2>

              <p className="text-gray-500 text-sm mb-6">
                Choisissez votre méthode de paiement. Le paiement mobile est sécurisé et instantané.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {paymentMethods.map((pm) => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setForm({ ...form, payment_method: pm.id, payment_phone: pm.id === 'cash' ? '' : form.payment_phone })}
                    aria-pressed={form.payment_method === pm.id}
                    className={`relative rounded-xl p-5 sm:p-6 border transition-all duration-200 text-center min-h-36 ${form.payment_method === pm.id ? pm.activeColor : pm.colorClass}`}
                  >
                    {form.payment_method === pm.id && <span className="absolute top-3 right-3 text-amber-300"><CheckCircle size={18} /></span>}
                    <div className={`mx-auto mb-3 flex h-12 min-w-16 w-fit items-center justify-center rounded-xl bg-black/30 px-3 text-lg font-black italic tracking-tight ${pm.color}`}>
                      {pm.id === 'cash' ? <Banknote size={30} strokeWidth={1.8} /> : pm.mark}
                    </div>
                    <p className="text-white text-sm font-semibold">{pm.label}</p>
                    <p className="text-gray-500 text-xs mt-2">{pm.subtitle}</p>
                  </button>
                ))}
              </div>

              {form.payment_method !== 'cash' && (
                <div className="mb-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.08] to-[#0d0d0d] p-5 sm:p-6">
                  <div className="flex items-start gap-3 mb-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 text-xl">
                      {form.payment_method === 'mvola' ? <span className="font-black italic text-yellow-400">M</span> : form.payment_method === 'orange' ? <span className="font-black text-orange-500">O</span> : <span className="font-black italic text-red-500">A</span>}
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-semibold">Instructions de paiement — {paymentMethods.find((pm) => pm.id === form.payment_method)?.label}</h3>
                      <p className="text-gray-400 text-sm mt-1">Envoyez le montant exact indiqué ci-dessous.</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-amber-400/20 bg-black/30 p-4 mb-4">
                    <p className="text-gray-400 text-sm">Montant à envoyer</p>
                    <p className="text-3xl sm:text-4xl font-bold text-amber-300 mt-1">{selectedService?.price.toLocaleString('fr-FR') ?? '–'} Ar</p>
                  </div>

                  {form.payment_method !== 'airtel' && (
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-800 bg-black/20 p-4">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Numéro {paymentDestinations[form.payment_method as 'mvola' | 'orange'].label}</p>
                          <p className="text-white text-lg sm:text-xl font-semibold tracking-wide">{paymentDestinations[form.payment_method as 'mvola' | 'orange'].number}</p>
                        </div>
                        <button type="button" onClick={() => navigator.clipboard?.writeText(paymentDestinations[form.payment_method as 'mvola' | 'orange'].number)} className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 px-3 py-2 text-sm text-amber-300 hover:bg-amber-500/10">
                          <Copy size={15} /> Copier
                        </button>
                      </div>
                      <div className="rounded-xl border border-gray-800 bg-black/20 p-4">
                        <p className="text-gray-500 text-xs mb-1">Nom du bénéficiaire</p>
                        <p className="text-white font-semibold">LeGrandBarberShop</p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-gray-800 bg-black/20 p-4 mb-4">
                    <p className="text-gray-500 text-xs mb-1">Référence / raison du transfert</p>
                    <p className="text-white font-mono text-lg font-bold tracking-[0.2em]">{paymentReference}</p>
                    <p className="text-gray-400 text-xs mt-2">Indiquez cette référence comme motif du transfert.</p>
                    <button type="button" onClick={() => { navigator.clipboard?.writeText(paymentReference); setCopiedReference(true); }} className="mt-3 inline-flex items-center gap-2 text-sm text-amber-300 hover:text-amber-200">
                      <Copy size={14} /> {copiedReference ? 'Référence copiée' : 'Copier la référence'}
                    </button>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed">Après le transfert, conservez votre reçu. La réservation sera enregistrée avec cette référence pour permettre à la boutique de vérifier le paiement.</p>

                </div>
              )}

              {form.payment_method === 'cash' && (
                <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5 sm:p-6 flex items-start gap-4">
                  <div className="rounded-xl bg-emerald-500/10 p-3 text-2xl">💵</div>
                  <div>
                    <h3 className="text-white text-lg font-semibold">Paiement en boutique</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mt-2">Le paiement s’effectuera en espèces à votre arrivée au salon.</p>
                    <p className="text-emerald-300 font-semibold mt-3">Montant à régler : {selectedService?.price.toLocaleString('fr-FR') ?? '–'} Ar</p>
                  </div>
                </div>
              )}

              <div className="card-dark p-5 mb-6">
                <p className="text-xs tracking-widest uppercase text-gray-600 mb-4">
                  Récapitulatif
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service</span>
                    <span className="text-white">{form.service}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="text-white">
                      {form.appointment_date
                        ? new Date(form.appointment_date).toLocaleDateString('fr-FR')
                        : '–'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Heure</span>
                    <span className="text-white">{form.appointment_time}</span>
                  </div>

                  {form.barber_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Barbier</span>
                      <span className="text-white">{form.barber_name}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t border-gray-800">
                    <span className="text-gray-500">Total</span>
                    <span className="text-gold font-bold text-base">
                      {selectedService?.price.toLocaleString() ?? '–'} Ar
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-700/50 px-4 py-3 mb-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="btn-outline-gold flex-1"
                >
                  Retour
                </button>

                <button
                  disabled={!canProceedStep3 || loading}
                  onClick={handleSubmit}
                  className={`btn-gold flex-1 flex items-center justify-center gap-2 ${
                    !canProceedStep3 || loading
                      ? 'opacity-60 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Confirmer la Réservation
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}