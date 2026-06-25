import { useState, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppContext, AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import { pageVariants } from './styles/motion';
import AmbientBackground from './components/AmbientBackground';

// Import Pages
import LandingPage from './pages/LandingPage';
import Marketplace from './pages/Marketplace';
import ProfessionalProfile from './pages/ProfessionalProfile';
import BookingFlow from './pages/BookingFlow';
import AIBeautyScan from './pages/AIBeautyScan';
import AIChatConcierge from './pages/AIChatConcierge';
import CustomerDashboard from './pages/CustomerDashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfessionalOnboarding from './pages/ProfessionalOnboarding';
import ProfileSuite from './pages/ProfileSuite';
import DeveloperSandbox from './components/DeveloperSandbox';
import Toast from './components/Toast';
import CinematicIntro from './components/CinematicIntro';


function GlamGoApp() {
  const [currentView, setCurrentView] = useState('landing');
  const [selectedProId, setSelectedProId] = useState('pro_priya'); // Default selector
  const [bookingParams, setBookingParams] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const { currentUser } = useContext(AppContext);

  const renderView = () => {
    // Route guard check: redirect to login if attempting to access dashboard or profile anonymously
    const isDashboard = ['customerDashboard', 'professionalDashboard', 'adminDashboard', 'profileSuite'].includes(currentView);
    if (isDashboard && !currentUser) {
      return <Login setCurrentView={setCurrentView} />;
    }

    switch (currentView) {
      case 'landing':
        return <LandingPage setCurrentView={setCurrentView} />;
      case 'marketplace':
        return <Marketplace setCurrentView={setCurrentView} setSelectedProId={setSelectedProId} />;
      case 'professionalProfile':
        return <ProfessionalProfile setCurrentView={setCurrentView} selectedProId={selectedProId} setBookingParams={setBookingParams} />;
      case 'bookingFlow':
        if (!currentUser) return <Login setCurrentView={setCurrentView} />;
        return <BookingFlow setCurrentView={setCurrentView} bookingParams={bookingParams} />;
      case 'beautyScan':
        return <AIBeautyScan setCurrentView={setCurrentView} />;
      case 'chatConcierge':
        return <AIChatConcierge setCurrentView={setCurrentView} setBookingParams={setBookingParams} />;
      case 'customerDashboard':
        return <CustomerDashboard setCurrentView={setCurrentView} setSelectedProId={setSelectedProId} />;
      case 'professionalDashboard':
        return <ProfessionalDashboard setCurrentView={setCurrentView} setSelectedProId={setSelectedProId} />;
      case 'adminDashboard':
        return <AdminDashboard setCurrentView={setCurrentView} />;
      case 'profileSuite':
        return <ProfileSuite setCurrentView={setCurrentView} />;
      case 'login':
        return <Login setCurrentView={setCurrentView} />;
      case 'signup':
        return <Signup setCurrentView={setCurrentView} setBookingParams={setBookingParams} />;
      case 'professionalOnboarding':
        return <ProfessionalOnboarding setCurrentView={setCurrentView} bookingParams={bookingParams} />;
      default:
        return <LandingPage setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro
            onComplete={() => {
              setShowIntro(false);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          filter: showIntro ? 'blur(10px)' : 'blur(0px)',
          scale: showIntro ? 0.98 : 1,
          opacity: showIntro ? 0 : 1,
        }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          transformOrigin: 'center center',
          width: '100%',
        }}
      >
        <AmbientBackground />
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        <div style={{ flex: 1, position: 'relative' }}>
          {/*
            AnimatePresence mode="wait" ensures the exiting page fully dissolves
            before the entering page begins — critical for the luxury crossfade feel.
          */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentView}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
        <DeveloperSandbox setCurrentView={setCurrentView} />
      </motion.div>
      <Toast />
    </div>

  );
}

export default function App() {
  return (
    <AppProvider>
      <GlamGoApp />
    </AppProvider>
  );
}
