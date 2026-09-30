import { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLogin from './AdminLogin';
import AdminLayout, { AdminPage } from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminReservations from './AdminReservations';
import AdminPayments from './AdminPayments';
import AdminServices from './AdminServices';
import AdminPromotions from './AdminPromotions';
import WhatsAppButton from '../components/WhatsAppButton';

export default function AdminApp() {
  const { session, loading, signIn, signOut } = useAdminAuth();
  const [page, setPage] = useState<AdminPage>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={signIn} />;
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <AdminDashboard />;
      case 'reservations': return <AdminReservations />;
      case 'payments': return <AdminPayments />;
      case 'services': return <AdminServices />;
      case 'promotions': return <AdminPromotions />;
    }
  };

  return (
    <>
      <AdminLayout
        currentPage={page}
        onNavigate={setPage}
        onSignOut={signOut}
        userEmail={session.user.email}
      >
        {renderPage()}
      </AdminLayout>
      <WhatsAppButton phoneNumber="+261341458773" message="Bonjour! Un client souhaite des informations." position="bottom-right" />
    </>
  );
}
