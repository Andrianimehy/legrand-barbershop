import { useState } from 'react';
import { Scissors, Calendar, Grid2x2 as Grid, Tag, LogOut, Menu, LayoutDashboard, ChevronRight, CreditCard, Video as LucideIcon } from 'lucide-react';

export type AdminPage = 'dashboard' | 'reservations' | 'services' | 'promotions' | 'payments';

interface AdminLayoutProps {
  currentPage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  onSignOut: () => void;
  children: React.ReactNode;
  userEmail?: string;
}

const navItems: { page: AdminPage; label: string; icon: LucideIcon }[] = [
  { page: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { page: 'reservations', label: 'Réservations', icon: Calendar },
  { page: 'payments', label: 'Paiements', icon: CreditCard },
  { page: 'services', label: 'Services', icon: Grid },
  { page: 'promotions', label: 'Promotions', icon: Tag },
];

export default function AdminLayout({ currentPage, onNavigate, onSignOut, children, userEmail }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-gray-800 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="w-9 h-9 rounded-full border border-amber-600 flex items-center justify-center shrink-0">
            <Scissors size={15} className="text-amber-400" />
          </div>
          <div>
            <p className="text-white text-xs font-bold tracking-widest uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
              Admin
            </p>
            <p className="text-xs" style={{ color: '#c9a84c' }}>Le Grand Barbershop</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ page, label, icon: Icon }) => (
            <button
              key={page}
              onClick={() => { onNavigate(page); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 rounded-sm ${
                currentPage === page
                  ? 'bg-amber-900/20 text-amber-400 border-l-2 border-amber-500'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-gray-900/50 border-l-2 border-transparent'
              }`}
            >
              <Icon size={16} />
              <span className="flex-1 text-left">{label}</span>
              {currentPage === page && <ChevronRight size={14} className="text-amber-600" />}
            </button>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-gray-800">
          {userEmail && (
            <p className="text-gray-600 text-xs truncate mb-3 px-2">{userEmail}</p>
          )}
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:text-red-400 hover:bg-red-900/10 transition-all duration-200 rounded-sm"
          >
            <LogOut size={15} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#0d0d0d] border-b border-gray-800 px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-sm font-semibold text-white tracking-wide">
            {navItems.find((n) => n.page === currentPage)?.label ?? 'Admin'}
          </h1>
          <div className="w-8 lg:hidden" />
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
