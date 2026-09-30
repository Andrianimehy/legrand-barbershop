import { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  today: number;
  paymentsCompleted: number;
  paymentsPending: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0, cancelled: 0, today: 0, paymentsCompleted: 0, paymentsPending: 0 });
  const [recent, setRecent] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const todayStr = new Date().toISOString().split('T')[0];

      const { data: all } = await supabase.from('reservations').select('id, status, appointment_date, full_name, service, appointment_time');
      const { data: payments } = await supabase.from('payments').select('id, status');

      if (all) {
        setStats({
          total: all.length,
          pending: all.filter((r) => r.status === 'pending').length,
          confirmed: all.filter((r) => r.status === 'confirmed').length,
          cancelled: all.filter((r) => r.status === 'cancelled').length,
          today: all.filter((r) => r.appointment_date === todayStr).length,
          paymentsCompleted: payments?.filter((p) => p.status === 'completed').length ?? 0,
          paymentsPending: payments?.filter((p) => p.status === 'pending' || p.status === 'processing').length ?? 0,
        });
        setRecent(all.slice(-5).reverse());
      }
      setLoading(false);
    };
    load();
  }, []);

  const statCards = [
    { label: 'Total Réservations', value: stats.total, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-900/20' },
    { label: 'En Attente', value: stats.pending, icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
    { label: 'Confirmées', value: stats.confirmed, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-900/20' },
    { label: 'Paiements', value: stats.paymentsCompleted, icon: CreditCard, color: 'text-green-400', bg: 'bg-green-900/20' },
  ];

  const statusBadge = (status: string) => {
    if (status === 'confirmed') return <span className="px-2 py-0.5 text-xs bg-green-900/30 text-green-400 border border-green-800/40">Confirmé</span>;
    if (status === 'cancelled') return <span className="px-2 py-0.5 text-xs bg-red-900/30 text-red-400 border border-red-800/40">Annulé</span>;
    return <span className="px-2 py-0.5 text-xs bg-yellow-900/30 text-yellow-400 border border-yellow-800/40">En attente</span>;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
          Tableau de Bord
        </h2>
        <p className="text-gray-500 text-sm">Vue d'ensemble de l'activité du salon</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#111111] border border-gray-800 p-5">
            <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-gray-500 text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111111] border border-gray-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Réservations Récentes</h3>
          <Clock size={15} className="text-gray-600" />
        </div>
        <div className="overflow-x-auto">
          {recent.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">Aucune réservation pour l'instant</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs text-gray-600 tracking-wider px-5 py-3">Client</th>
                  <th className="text-left text-xs text-gray-600 tracking-wider px-5 py-3">Service</th>
                  <th className="text-left text-xs text-gray-600 tracking-wider px-5 py-3 hidden sm:table-cell">Date</th>
                  <th className="text-left text-xs text-gray-600 tracking-wider px-5 py-3">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-b border-gray-900 hover:bg-gray-900/30">
                    <td className="px-5 py-3 text-gray-300">{r.full_name}</td>
                    <td className="px-5 py-3 text-gray-500 max-w-[150px] truncate">{r.service}</td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">
                      {r.appointment_date ? new Date(r.appointment_date).toLocaleDateString('fr-FR') : '–'} {r.appointment_time}
                    </td>
                    <td className="px-5 py-3">{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-amber-900/10 border border-amber-800/30 p-5">
        <div className="flex items-start gap-3">
          <XCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 text-sm font-medium mb-1">Annulations</p>
            <p className="text-amber-700 text-xs">
              {stats.cancelled} réservation{stats.cancelled !== 1 ? 's' : ''} annulée{stats.cancelled !== 1 ? 's' : ''} au total.
              Consultez la liste complète des réservations pour plus de détails.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
