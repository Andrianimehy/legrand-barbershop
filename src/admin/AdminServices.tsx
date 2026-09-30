import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  category: string;
  active: boolean;
  sort_order: number;
  image_url: string;
}

const CATEGORIES = ['Coupe', 'Rasage', 'Coloration', 'Épilation', 'Enfants', 'Soins'];

const emptyForm = (): Omit<Service, 'id'> => ({
  name: '',
  description: '',
  duration: '',
  price: 0,
  category: 'Coupe',
  active: true,
  sort_order: 0,
  image_url: '',
});

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('sort_order');
    if (data) setServices(data as Service[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ ...emptyForm(), sort_order: services.length + 1 });
    setEditingId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (s: Service) => {
    setForm({
      name: s.name,
      description: s.description,
      duration: s.duration,
      price: s.price,
      category: s.category,
      active: s.active,
      sort_order: s.sort_order,
      image_url: s.image_url,
    });
    setEditingId(s.id);
    setShowForm(true);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        const { error: err } = await supabase.from('services').update(form).eq('id', editingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('services').insert([form]);
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
    if (!window.confirm('Supprimer ce service ? Cette action est irréversible.')) return;
    setDeletingId(id);
    await supabase.from('services').delete().eq('id', id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
  };

  const toggleActive = async (s: Service) => {
    await supabase.from('services').update({ active: !s.active }).eq('id', s.id);
    setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
  };

  const grouped = CATEGORIES.map((cat) => ({
    cat,
    items: services.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Services</h2>
          <p className="text-gray-500 text-sm">{services.length} service{services.length !== 1 ? 's' : ''}</p>
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
                {editingId ? 'Modifier le Service' : 'Nouveau Service'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Nom *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Durée</label>
                  <input name="duration" value={form.duration} onChange={handleChange} placeholder="ex: 45 min"
                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Prix (Ar) *</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} required min={0}
                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Catégorie *</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">Ordre</label>
                  <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange} min={0}
                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-600 mb-1.5">URL Image</label>
                <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://images.pexels.com/..."
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
                {form.image_url && (
                  <div className="mt-2 w-full h-32 bg-[#0a0a0a] border border-gray-800 overflow-hidden">
                    <img src={form.image_url} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="active" checked={form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                  className="accent-amber-500" />
                <label htmlFor="active" className="text-gray-400 text-sm">Service actif (visible sur le site)</label>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline-gold flex-1 py-2.5">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="btn-gold flex-1 py-2.5 flex items-center justify-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" /> : <Check size={14} />}
                  {editingId ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {services.length === 0 ? (
        <div className="bg-[#111111] border border-gray-800 p-12 text-center">
          <p className="text-gray-600 text-sm mb-4">Aucun service enregistré</p>
          <button onClick={openAdd} className="btn-gold">Créer le Premier Service</button>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ cat, items }) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-px bg-gold" />
                <h3 className="text-xs tracking-widest uppercase text-amber-600 font-bold">{cat}</h3>
                <div className="flex-1 h-px bg-gray-800" />
              </div>
              <div className="bg-[#111111] border border-gray-800">
                {items.map((s, i) => (
                  <div key={s.id} className={`flex items-center gap-4 px-5 py-4 ${i < items.length - 1 ? 'border-b border-gray-900' : ''}`}>
                    {s.image_url && (
                      <div className="w-16 h-16 flex-shrink-0 bg-[#0a0a0a] border border-gray-800 overflow-hidden">
                        <img src={s.image_url} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${s.active ? 'text-white' : 'text-gray-600 line-through'}`}>{s.name}</p>
                        {!s.active && <span className="text-xs text-gray-700">(inactif)</span>}
                      </div>
                      <p className="text-gray-600 text-xs mt-0.5 truncate">{s.description}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-sm shrink-0">
                      <span className="text-gray-500 text-xs">{s.duration}</span>
                      <span className="text-amber-400 font-bold">{s.price.toLocaleString()} Ar</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => toggleActive(s)} className={`transition-colors ${s.active ? 'text-green-500 hover:text-green-400' : 'text-gray-600 hover:text-gray-400'}`} title={s.active ? 'Désactiver' : 'Activer'}>
                        {s.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button onClick={() => openEdit(s)} className="text-gray-600 hover:text-amber-400 p-1 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} disabled={deletingId === s.id} className="text-gray-600 hover:text-red-400 p-1 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
