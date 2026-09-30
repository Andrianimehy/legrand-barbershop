import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Promotion {
  id: string;
  title: string;
  description: string;
  original_price: number;
  promo_price: number;
  badge: string;
  condition_text: string;
  active: boolean;
}

const emptyForm = (): Omit<Promotion, 'id'> => ({
  title: '',
  description: '',
  original_price: 0,
  promo_price: 0,
  badge: '',
  condition_text: '',
  active: true,
});

export default function AdminPromotions() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('promotions').select('*').order('created_at');
    if (data) setPromos(data as Promotion[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (p: Promotion) => {
    setForm({
      title: p.title,
      description: p.description,
      original_price: p.original_price,
      promo_price: p.promo_price,
      badge: p.badge,
      condition_text: p.condition_text,
      active: p.active,
    });
    setEditingId(p.id);
    setShowForm(true);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        const { error: err } = await supabase.from('promotions').update(form).eq('id', editingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('promotions').insert([form]);
        if (err) throw err;
      }
      await load();
      setShowForm(false);
      setEditingId(null);
    } catch {
      setError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette promotion ? Cette action est irréversible.')) return;
    setDeletingId(id);
    await supabase.from('promotions').delete().eq('id', id);
    setPromos((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const toggleActive = async (p: Promotion) => {
    await supabase.from('promotions').update({ active: !p.active }).eq('id', p.id);
    setPromos((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Promotions</h2>
          <p className="text-gray-500 text-sm">{promos.length} promotion{promos.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2 py-2 px-4">
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70">
          <div className="w-full max-w-lg bg-[#111111] border border-gray-800 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                {editingId ? 'Modifier la Promotion' : 'Nouvelle Promotion'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Titre *</label>
                <input name="title" value={form.title} onChange={handleChange} required
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Description</label>
                <input name="description" value={form.description} onChange={handleChange} placeholder="ex: Coupe + Barbe"
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Prix Original (Ar)</label>
                  <input type="number" name="original_price" value={form.original_price} onChange={handleChange} min={0}
                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Prix Promo (Ar, 0 = gratuit)</label>
                  <input type="number" name="promo_price" value={form.promo_price} onChange={handleChange} min={0}
                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Badge (ex: -18%, GRATUIT)</label>
                <input name="badge" value={form.badge} onChange={handleChange} placeholder="-20%"
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Conditions</label>
                <input name="condition_text" value={form.condition_text} onChange={handleChange} placeholder="ex: Sur présentation de la carte étudiant"
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="promoActive" checked={form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                  className="accent-amber-500" />
                <label htmlFor="promoActive" className="text-gray-400 text-sm">Promotion active (visible sur le site)</label>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold flex-1 py-2.5">Annuler</button>
                <button type="submit" disabled={saving} className="btn-gold flex-1 py-2.5 flex items-center justify-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" /> : <Check size={14} />}
                  {editingId ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {promos.length === 0 ? (
        <div className="bg-[#111111] border border-gray-800 p-12 text-center">
          <p className="text-gray-600 text-sm mb-4">Aucune promotion enregistrée</p>
          <button onClick={openAdd} className="btn-gold">Créer la Première Promotion</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {promos.map((p) => (
            <div key={p.id} className={`bg-[#111111] border ${p.active ? 'border-gray-800' : 'border-gray-900 opacity-60'} p-5 relative`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-amber-600 shrink-0" />
                  <h3 className={`font-bold text-base ${p.active ? 'text-white' : 'text-gray-600'}`} style={{ fontFamily: 'Playfair Display, serif' }}>
                    {p.title}
                  </h3>
                </div>
                {p.badge && (
                  <span className="text-xs bg-amber-800/40 text-amber-400 border border-amber-700/40 px-2 py-0.5 shrink-0 ml-2">
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs mb-3">{p.description}</p>
              <div className="flex items-baseline gap-2 mb-2">
                {p.promo_price > 0 ? (
                  <>
                    <span className="text-amber-400 font-bold">{p.promo_price.toLocaleString()} Ar</span>
                    <span className="text-gray-700 text-xs line-through">{p.original_price.toLocaleString()} Ar</span>
                  </>
                ) : (
                  <span className="text-green-400 font-bold text-sm">Offert</span>
                )}
              </div>
              {p.condition_text && (
                <p className="text-gray-700 text-xs border-t border-gray-800 pt-2 mt-2">{p.condition_text}</p>
              )}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-800">
                <button onClick={() => toggleActive(p)} className={`transition-colors ${p.active ? 'text-green-500 hover:text-green-400' : 'text-gray-600 hover:text-gray-400'}`} title={p.active ? 'Désactiver' : 'Activer'}>
                  {p.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <span className="text-gray-800 text-xs flex-1">{p.active ? 'Actif' : 'Inactif'}</span>
                <button onClick={() => openEdit(p)} className="text-gray-600 hover:text-amber-400 p-1 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id} className="text-gray-600 hover:text-red-400 p-1 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
