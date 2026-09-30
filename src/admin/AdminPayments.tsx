import { useEffect, useState } from 'react';
import { Search, ChevronDown, ChevronUp, RefreshCw, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Payment {
  id: string;
  reservation_id: string;
  amount: number;
  payment_method: string;
  phone_number: string;
  status: string;
  transaction_id: string;
  error_message: string;
  created_at: string;
  updated_at: string;
  reservations?: {
    full_name: string;
    service: string;
    appointment_date: string;
  };
}

const STATUS_OPTIONS = ['pending', 'processing', 'completed', 'failed'];

const statusLabel: Record<string, string> = {
  pending: 'En attente',
  processing: 'En cours',
  completed: 'Complété',
  failed: 'Échoué',
};

const statusStyle: Record<string, string> = {
  pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/40',
  processing: 'bg-blue-900/30 text-blue-400 border-blue-800/40',
  completed: 'bg-green-900/30 text-green-400 border-green-800/40',
  failed: 'bg-red-900/30 text-red-400 border-red-800/40',
};

const paymentMethodLabel: Record<string, string> = {
  mvola: 'Mvola',
  airtel: 'Airtel Money',
  cash: 'Espèces',
};

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filtered, setFiltered] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('payments')
      .select('*, reservations(full_name, service, appointment_date)')
      .order('created_at', { ascending: sortDir === 'asc' });
    if (data) {
      setPayments(data as Payment[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [sortDir]);

  useEffect(() => {
    let result = payments;
    if (statusFilter !== 'all') result = result.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.reservations?.full_name?.toLowerCase().includes(q) ||
          p.phone_number?.includes(q) ||
          p.transaction_id?.toLowerCase().includes(q) ||
          p.reservations?.service?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [payments, search, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('payments').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const toggleSort = () => {
    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  };

  const stats = {
    pending: payments.filter((p) => p.status === 'pending').length,
    processing: payments.filter((p) => p.status === 'processing').length,
    completed: payments.filter((p) => p.status === 'completed').length,
    failed: payments.filter((p) => p.status === 'failed').length,
  };

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
            Suivi des Paiements
          </h2>
          <p className="text-gray-500 text-sm">{filtered.length} paiement{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 text-gray-500 hover:text-amber-400 text-sm border border-gray-800 px-3 py-2 hover:border-amber-700/40 transition-colors"
        >
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { key: 'pending', label: 'En attente', color: 'yellow' },
          { key: 'processing', label: 'En cours', color: 'blue' },
          { key: 'completed', label: 'Complétés', color: 'green' },
          { key: 'failed', label: 'Échoués', color: 'red' },
        ].map(({ key, label, color }) => (
          <div key={key} className={`bg-${color}-900/10 border border-${color}-800/30 rounded px-4 py-3`}>
            <p className={`text-${color}-400 text-xs tracking-widest uppercase mb-1`}>{label}</p>
            <p className="text-white text-2xl font-bold">{stats[key as keyof typeof stats]}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone, transaction..."
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
          <div className="col-span-2">Service</div>
          <div className="col-span-2">Montant</div>
          <div className="col-span-2 cursor-pointer flex items-center gap-1 hover:text-gray-400" onClick={toggleSort}>
            Date {sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-12">Aucun paiement trouvé</p>
        ) : (
          <div>
            {filtered.map((p) => (
              <div key={p.id} className="border-b border-gray-900 last:border-0">
                <div
                  className="hidden lg:grid grid-cols-12 px-5 py-4 hover:bg-gray-900/40 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                >
                  <div className="col-span-3">
                    <p className="text-white text-sm font-medium">{p.reservations?.full_name}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{p.phone_number}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-300 text-sm">{p.reservations?.service}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gold font-bold text-sm">{p.amount.toLocaleString()} Ar</p>
                    <p className="text-gray-600 text-xs mt-0.5">{paymentMethodLabel[p.payment_method]}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-300 text-sm">
                      {new Date(p.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">{new Date(p.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-0.5 text-xs border rounded ${statusStyle[p.status] ?? 'text-gray-400'}`}>
                      {statusLabel[p.status] ?? p.status}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <span className="text-gray-600 text-sm">{expandedId === p.id ? '−' : '+'}</span>
                  </div>
                </div>

                <div className="lg:hidden px-4 py-4 hover:bg-gray-900/30 cursor-pointer" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white text-sm font-medium">{p.reservations?.full_name}</p>
                      <p className="text-gray-500 text-xs">{p.reservations?.service}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs border rounded ${statusStyle[p.status] ?? 'text-gray-400'}`}>
                      {statusLabel[p.status] ?? p.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs">
                    {p.amount.toLocaleString()} Ar • {new Date(p.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                {expandedId === p.id && (
                  <div className="px-5 pb-5 bg-[#0d0d0d] border-t border-gray-800">
                    <div className="grid sm:grid-cols-2 gap-6 pt-5">
                      <div>
                        <p className="text-xs tracking-widest uppercase text-gray-600 mb-3">Détails du Paiement</p>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Montant</span>
                            <span className="text-gold font-bold">{p.amount.toLocaleString()} Ar</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Méthode</span>
                            <span className="text-gray-300">{paymentMethodLabel[p.payment_method]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Téléphone</span>
                            <span className="text-gray-300">{p.phone_number}</span>
                          </div>
                          {p.transaction_id && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Transaction ID</span>
                              <span className="text-gray-400 text-xs font-mono">{p.transaction_id}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs tracking-widest uppercase text-gray-600 mb-3">Changer le Statut</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              disabled={p.status === s}
                              onClick={() => updateStatus(p.id, s)}
                              className={`px-3 py-1.5 text-xs border rounded transition-all duration-200 flex items-center justify-center gap-1 ${
                                p.status === s
                                  ? `${statusStyle[s]} cursor-default`
                                  : 'border-gray-700 text-gray-500 hover:border-amber-600 hover:text-amber-400 cursor-pointer'
                              }`}
                            >
                              {s === 'completed' && <Check size={12} />}
                              {s === 'failed' && <X size={12} />}
                              {statusLabel[s]}
                            </button>
                          ))}
                        </div>
                        {p.error_message && (
                          <div className="bg-red-900/20 border border-red-800/30 p-2 rounded text-xs text-red-300">
                            {p.error_message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800 text-xs text-gray-600">
                      <span>Créé: {new Date(p.created_at).toLocaleString('fr-FR')}</span>
                      <span>•</span>
                      <span>Mis à jour: {new Date(p.updated_at).toLocaleString('fr-FR')}</span>
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
