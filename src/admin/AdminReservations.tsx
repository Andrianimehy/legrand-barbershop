import { useEffect, useState } from 'react';
import { Search, ChevronDown, ChevronUp, RefreshCw, Eye, Smartphone, MessageCircle, Mail, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Reservation {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service: string;
  barber_name: string;
  appointment_date: string;
  appointment_time: string;
  payment_method: string;
  payment_phone: string;
  notes: string;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled'];

const statusLabel: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
};

const statusStyle: Record<string, string> = {
  pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
  confirmed: 'bg-green-900/30 text-green-400 border-green-800/40',
  cancelled: 'bg-red-900/30 text-red-400 border-red-800/40',
};

const paymentLabel: Record<string, string> = {
  mvola: 'Mvola',
  airtel: 'Airtel Money',
  cash: 'Espèces',
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filtered, setFiltered] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'appointment_date' | 'created_at'>('appointment_date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order(sortField, { ascending: sortDir === 'asc' });
    if (data) {
      setReservations(data as Reservation[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [sortField, sortDir]);

  useEffect(() => {
    let result = reservations;
    if (statusFilter !== 'all') result = result.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.full_name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.phone?.includes(q) ||
          r.service?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [reservations, search, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await supabase.from('reservations').update({ status }).eq('id', id);
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setUpdatingId(null);
  };

  const toggleSort = (field: 'appointment_date' | 'created_at') => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: 'appointment_date' | 'created_at' }) =>
    sortField === field ? (
      sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
    ) : null;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Réservations
          </h2>
          <p className="text-gray-500 text-sm">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-gray-500 hover:text-amber-400 text-sm border border-gray-800 px-3 py-2 hover:border-amber-700/40 transition-colors"
        >
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, téléphone, service..."
            className="w-full bg-[#111111] border border-gray-800 text-white pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors placeholder-gray-700"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#111111] border border-gray-800 text-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors"
        >
          <option value="all">Tous les statuts</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{statusLabel[s]}</option>
          ))}
        </select>
      </div>

      <div className="bg-[#111111] border border-gray-800">
        <div className="hidden lg:grid grid-cols-12 px-5 py-3 border-b border-gray-800 text-xs text-gray-600 tracking-wider uppercase">
          <div className="col-span-3">Client</div>
          <div className="col-span-3">Service</div>
          <div className="col-span-2 cursor-pointer flex items-center gap-1 hover:text-gray-400" onClick={() => toggleSort('appointment_date')}>
            Rendez-vous <SortIcon field="appointment_date" />
          </div>
          <div className="col-span-2">Paiement</div>
          <div className="col-span-1">Statut</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-12">Aucune réservation trouvée</p>
        ) : (
          <div>
            {filtered.map((r) => (
              <div key={r.id} className="border-b border-gray-900 last:border-0">
                <div
                  className="hidden lg:grid grid-cols-12 px-5 py-4 hover:bg-gray-900/40 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                >
                  <div className="col-span-3">
                    <p className="text-white text-sm font-medium">{r.full_name}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{r.phone}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-gray-300 text-sm">{r.service}</p>
                    {r.barber_name && <p className="text-gray-600 text-xs mt-0.5">{r.barber_name}</p>}
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-300 text-sm">
                      {r.appointment_date ? new Date(r.appointment_date).toLocaleDateString('fr-FR') : '–'}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">{r.appointment_time}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm">{paymentLabel[r.payment_method] ?? r.payment_method}</p>
                    {r.payment_phone && <p className="text-gray-600 text-xs mt-0.5">{r.payment_phone}</p>}
                  </div>
                  <div className="col-span-1">
                    <span className={`px-2 py-0.5 text-xs border ${statusStyle[r.status] ?? 'text-gray-400'}`}>
                      {statusLabel[r.status] ?? r.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Eye size={15} className="text-gray-600" />
                  </div>
                </div>

                <div className="lg:hidden px-4 py-4 hover:bg-gray-900/30 cursor-pointer" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white text-sm font-medium">{r.full_name}</p>
                      <p className="text-gray-500 text-xs">{r.service}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs border ${statusStyle[r.status] ?? 'text-gray-400'}`}>
                      {statusLabel[r.status] ?? r.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    {r.appointment_date ? new Date(r.appointment_date).toLocaleDateString('fr-FR') : '–'} à {r.appointment_time}
                  </p>
                </div>

                {expandedId === r.id && (
                  <div className="px-5 pb-5 bg-[#0d0d0d] border-t border-gray-800">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5">
                      <div>
                        <p className="text-xs tracking-widest uppercase text-gray-600 mb-3">Coordonnées Client</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail size={13} className="text-amber-600" />
                            <a href={`mailto:${r.email}`} className="text-gray-300 text-sm hover:text-amber-400">{r.email}</a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={13} className="text-amber-600" />
                            <a href={`tel:${r.phone}`} className="text-gray-300 text-sm hover:text-amber-400">{r.phone}</a>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle size={13} className="text-green-500" />
                            <a
                              href={`https://wa.me/${r.phone.replace(/\D/g, '')}?text=Bonjour%20${encodeURIComponent(r.full_name)}%2C%20votre%20réservation%20au%20Le%20Grand%20Barbershop`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-400 text-sm hover:text-green-300"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs tracking-widest uppercase text-gray-600 mb-3">Détails du Rendez-vous</p>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Service</span>
                            <span className="text-gray-300">{r.service}</span>
                          </div>
                          {r.barber_name && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Barbier</span>
                              <span className="text-gray-300">{r.barber_name}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date</span>
                            <span className="text-gray-300">
                              {r.appointment_date ? new Date(r.appointment_date).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '–'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Heure</span>
                            <span className="text-gray-300">{r.appointment_time}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs tracking-widest uppercase text-gray-600 mb-3">Paiement & Notes</p>
                        <div className="space-y-1.5 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <Smartphone size={13} className="text-amber-600" />
                            <span className="text-gray-300">{paymentLabel[r.payment_method] ?? r.payment_method}</span>
                          </div>
                          {r.payment_phone && (
                            <p className="text-gray-500 text-xs">N° : {r.payment_phone}</p>
                          )}
                          {r.notes && (
                            <p className="text-gray-500 text-xs italic mt-2 border-t border-gray-800 pt-2">
                              "{r.notes}"
                            </p>
                          )}
                        </div>
                        <p className="text-xs tracking-widest uppercase text-gray-600 mb-2">Changer le Statut</p>
                        <div className="flex gap-2 flex-wrap">
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              disabled={r.status === s || updatingId === r.id}
                              onClick={(e) => { e.stopPropagation(); updateStatus(r.id, s); }}
                              className={`px-3 py-1 text-xs border transition-all duration-200 ${
                                r.status === s
                                  ? `${statusStyle[s]} cursor-default`
                                  : 'border-gray-700 text-gray-500 hover:border-amber-600 hover:text-amber-400 cursor-pointer'
                              }`}
                            >
                              {updatingId === r.id ? '...' : statusLabel[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
                      <p className="text-gray-700 text-xs">
                        Réservé le {r.created_at ? new Date(r.created_at).toLocaleString('fr-FR') : '–'}
                      </p>
                      <span className="text-gray-800">•</span>
                      <p className="text-gray-700 text-xs font-mono">#{r.id.split('-')[0]}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
