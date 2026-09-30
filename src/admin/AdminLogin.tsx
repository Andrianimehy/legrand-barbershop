import { useState, FormEvent } from 'react';
import { Scissors, Eye, EyeOff, Lock, Mail } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<unknown>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const err = await onLogin(email, password);
    if (err) setError('Identifiants incorrects. Vérifiez votre email et mot de passe.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full border border-amber-500 flex items-center justify-center mx-auto mb-6">
            <Scissors size={24} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Espace Administrateur
          </h1>
          <p className="text-sm" style={{ color: '#c9a84c' }}>Le Grand Barbershop</p>
        </div>

        <div className="bg-[#111111] border border-gray-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors placeholder-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-2">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors placeholder-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-800/50 px-4 py-3">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se Connecter'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          Accès réservé aux administrateurs
        </p>
      </div>
    </div>
  );
}
