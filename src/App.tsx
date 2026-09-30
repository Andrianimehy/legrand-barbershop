import { useState } from 'react';
import { Page } from './types';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import About from './pages/About';
import Barbers from './pages/Barbers';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Legal from './pages/Legal';
import AdminApp from './admin/AdminApp';

const isAdminRoute = () =>
  window.location.pathname.startsWith('/admin') ||
  window.location.hash === '#admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdmin] = useState(isAdminRoute);

  if (isAdmin) {
    return <AdminApp />;
  }

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={handleNavigate} />;
      case 'about': return <About onNavigate={handleNavigate} />;
      case 'barbers': return <Barbers onNavigate={handleNavigate} />;
      case 'services': return <Services onNavigate={handleNavigate} />;
      case 'pricing': return <Pricing onNavigate={handleNavigate} />;
      case 'gallery': return <Gallery onNavigate={handleNavigate} />;
      case 'contact': return <Contact onNavigate={handleNavigate} />;
      case 'booking': return <Booking />;
      case 'legal': return <Legal />;
      default: return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <main>{renderPage()}</main>
      <Footer onNavigate={handleNavigate} />
      <WhatsAppButton phoneNumber="+261341458773" message="Bonjour! Je souhaiterais prendre rendez-vous ou en savoir plus sur vos services." />
    </div>
  );
}

export default App;
