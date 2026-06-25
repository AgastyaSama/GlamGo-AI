import { useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { Sparkles, MapPin, ChevronDown, Award, ShieldAlert } from 'lucide-react';
import { linkHoverProps, btnPrimaryHoverProps, btnSecondaryHoverProps, DURATION, EASING } from '../styles/motion';
import UserAvatar from './UserAvatar';
import BrandLogo from './Logo';

const Navbar = ({ currentView, setCurrentView }) => {
  const {
    currentUser,
    selectedCity,
    setSelectedCity,
    logoutUser,
    setActiveDashboardTab,
    showToast
  } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  return (
    <motion.nav
      className="navbar-container"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: DURATION.slow, ease: EASING.luxury }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(252, 251, 247, 0.72)', // Glassmorphic translucent soft cream
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(197, 168, 128, 0.15)', // Fine luxury gold bottom hairline
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)', // Soft ambient shadow
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="navbar-main" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '20px 32px'
      }}>
        {/* Logo */}
        <motion.div
          onClick={() => { setCurrentView('landing'); setIsOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: DURATION.fast, ease: EASING.subtle }}
        >
          <BrandLogo />
        </motion.div>

        {/* Main Links (Desktop) */}
        <div className="navbar-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <motion.span
            id="nav-home"
            onClick={() => setCurrentView('landing')}
            style={{
              color: currentView === 'landing' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em', // Spaced out luxury layout
              fontWeight: 500,
              position: 'relative',
              paddingBottom: '6px',
              fontFamily: 'var(--font-display)'
            }}
            {...linkHoverProps(currentView === 'landing')}
          >
            Home
            {currentView === 'landing' && (
              <motion.div
                layoutId="navbar-underline"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1.5px',
                  backgroundColor: 'var(--accent-gold)'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.span>
          <motion.span
            id="nav-services"
            onClick={() => setCurrentView('marketplace')}
            style={{
              color: currentView === 'marketplace' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em', // Spaced out luxury layout
              fontWeight: 500,
              position: 'relative',
              paddingBottom: '6px',
              fontFamily: 'var(--font-display)'
            }}
            {...linkHoverProps(currentView === 'marketplace')}
          >
            Find Services
            {currentView === 'marketplace' && (
              <motion.div
                layoutId="navbar-underline"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1.5px',
                  backgroundColor: 'var(--accent-gold)'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.span>
          <motion.span
            id="nav-scan"
            onClick={() => setCurrentView('beautyScan')}
            style={{
              color: currentView === 'beautyScan' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em', // Spaced out luxury layout
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              position: 'relative',
              paddingBottom: '6px',
              fontFamily: 'var(--font-display)'
            }}
            {...linkHoverProps(currentView === 'beautyScan')}
          >
            <Sparkles size={12} color="var(--accent-rose)" /> AI Scan
            {currentView === 'beautyScan' && (
              <motion.div
                layoutId="navbar-underline"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1.5px',
                  backgroundColor: 'var(--accent-gold)'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.span>
          <motion.span
            id="nav-concierge"
            onClick={() => setCurrentView('chatConcierge')}
            style={{
              color: currentView === 'chatConcierge' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em', // Spaced out luxury layout
              fontWeight: 500,
              position: 'relative',
              paddingBottom: '6px',
              fontFamily: 'var(--font-display)'
            }}
            {...linkHoverProps(currentView === 'chatConcierge')}
          >
            AI Concierge
            {currentView === 'chatConcierge' && (
              <motion.div
                layoutId="navbar-underline"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1.5px',
                  backgroundColor: 'var(--accent-gold)'
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </motion.span>
        </div>

        {/* Right side options (Desktop) */}
        <div className="navbar-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* City Selector */}
          <motion.div
            whileHover={{
              borderColor: 'rgba(197, 168, 128, 0.6)',
              backgroundColor: 'rgba(197, 168, 128, 0.03)',
              boxShadow: '0 2px 10px rgba(197, 168, 128, 0.1)',
              y: -1.5
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(28, 28, 28, 0.015)',
              border: '1px solid rgba(197, 168, 128, 0.25)', // Elegant light gold border
              borderRadius: '6px',
              padding: '6px 12px',
              boxSizing: 'border-box'
            }}
          >
            <MapPin size={13} color="var(--accent-gold)" />
            <select
              id="select-city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)'
              }}
            >
              <option value="Pune" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Pune</option>
            </select>
          </motion.div>

          {/* Dynamic auth buttons */}
          {!currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <motion.button
                onClick={() => setCurrentView('login')}
                className="btn-secondary"
                style={{
                  padding: '8px 20px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                {...btnSecondaryHoverProps}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => setCurrentView('signup')}
                className="btn-primary"
                style={{
                  padding: '8px 20px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                {...btnPrimaryHoverProps}
              >
                Get Started
              </motion.button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Profile Pill Dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: 'rgba(197, 168, 128, 0.05)',
                    borderColor: 'rgba(197, 168, 128, 0.45)',
                    boxShadow: '0 4px 15px rgba(197, 168, 128, 0.1)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    border: '1px solid rgba(197, 168, 128, 0.25)',
                    background: 'rgba(252, 251, 247, 0.6)',
                    padding: '6px 14px 6px 8px',
                    borderRadius: '30px',
                    userSelect: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <UserAvatar user={currentUser} size={30} />
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '1.2' }}>
                    <span style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.01em'
                    }}>
                      {currentUser.name}
                    </span>
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: 500,
                      color: 'var(--accent-gold)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginTop: '2px'
                    }}>
                      {currentUser.role === 'customer' ? 'Customer' : currentUser.role === 'professional' ? 'Professional' : 'Admin'}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isProfileOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', marginLeft: '2px', color: 'var(--text-muted)' }}
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </motion.div>

                {/* Dropdown Options List */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: EASING.luxury }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        right: 0,
                        width: '285px',
                        background: 'rgba(252, 251, 247, 0.95)', // Glassmorphic luxury soft ivory
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(197, 168, 128, 0.25)', // Premium hairline gold border
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(28, 28, 28, 0.08)',
                        padding: '16px',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transformOrigin: 'top right'
                      }}
                    >
                      {/* Top Section: User Card */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <UserAvatar user={currentUser} size={48} />
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', textAlign: 'left' }}>
                          <span style={{
                            fontSize: '14.5px',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-serif)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {currentUser.name}
                          </span>
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 600,
                            color: 'var(--accent-gold)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginTop: '2px'
                          }}>
                            {currentUser.role === 'customer' ? 'Customer' : currentUser.role === 'professional' ? 'Professional' : 'Admin'}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '1px'
                          }}>
                            {currentUser.email}
                          </span>
                        </div>
                      </div>

                      <div style={{ height: '1px', background: 'rgba(197, 168, 128, 0.15)', margin: '2px 0' }} />

                      {/* Menu Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {currentUser.role === 'customer' && (
                          <>
                            {/* My Profile */}
                            <div
                              onClick={() => {
                                setCurrentView('profileSuite');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>👤</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>My Profile</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Manage personal information</span>
                              </div>
                            </div>

                            {/* My Bookings */}
                            <div
                              onClick={() => {
                                setActiveDashboardTab('bookings');
                                setCurrentView('customerDashboard');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>📅</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>My Bookings</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>View appointments</span>
                              </div>
                            </div>

                            {/* Favorites */}
                            <div
                              onClick={() => {
                                setActiveDashboardTab('favorites');
                                setCurrentView('customerDashboard');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>❤️</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>Favorites</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Saved artists & salons</span>
                              </div>
                            </div>

                            {/* AI Beauty Profile */}
                            <div
                              onClick={() => {
                                setActiveDashboardTab('scans');
                                setCurrentView('customerDashboard');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>✨</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>AI Beauty Profile</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Personal AI recommendations</span>
                              </div>
                            </div>
                          </>
                        )}

                        {currentUser.role === 'professional' && (
                          <>
                            {/* Professional Profile */}
                            <div
                              onClick={() => {
                                setCurrentView('profileSuite');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>👤</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>Professional Profile</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Overview & stats</span>
                              </div>
                            </div>

                            {/* My Clients */}
                            <div
                              onClick={() => {
                                setActiveDashboardTab('clients');
                                setCurrentView('professionalDashboard');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>👥</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>My Clients</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Clients portfolio</span>
                              </div>
                            </div>

                            {/* Appointments */}
                            <div
                              onClick={() => {
                                setActiveDashboardTab('appointments');
                                setCurrentView('professionalDashboard');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>📅</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>Appointments</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>View calendar schedule</span>
                              </div>
                            </div>

                            {/* Earnings Dashboard */}
                            <div
                              onClick={() => {
                                setActiveDashboardTab('earnings');
                                setCurrentView('professionalDashboard');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>💵</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>Earnings Dashboard</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>View income trends</span>
                              </div>
                            </div>

                            {/* Service Management */}
                            <div
                              onClick={() => {
                                setActiveDashboardTab('services');
                                setCurrentView('professionalDashboard');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>⚙️</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>Service Management</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Configure offers & pricing</span>
                              </div>
                            </div>
                          </>
                        )}

                        {currentUser.role === 'admin' && (
                          <>
                            {/* Admin Profile */}
                            <div
                              onClick={() => {
                                setCurrentView('profileSuite');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>👤</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>Admin Profile</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Status overview</span>
                              </div>
                            </div>

                            {/* Platform Dashboard */}
                            <div
                              onClick={() => {
                                setActiveDashboardTab('platform');
                                setCurrentView('adminDashboard');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>🖥️</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>Platform Dashboard</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>System health & analytics</span>
                              </div>
                            </div>

                            {/* User Management */}
                            <div
                              onClick={() => {
                                setActiveDashboardTab('userManagement');
                                setCurrentView('adminDashboard');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>👥</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>User Management</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Audit global user bases</span>
                              </div>
                            </div>

                            {/* Provider Verification */}
                            <div
                              onClick={() => {
                                setActiveDashboardTab('verification');
                                setCurrentView('adminDashboard');
                                setIsProfileOpen(false);
                              }}
                              className="dropdown-action-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '16px' }}>🛡️</span>
                              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>Provider Verification</span>
                                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Approve platform stylists</span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Common Settings */}
                        <div
                          onClick={() => {
                            setIsProfileOpen(false);
                            showToast("Profile Settings: Configured and synchronized successfully.", "success");
                          }}
                          className="dropdown-action-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>⚙️</span>
                          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '13px' }}>Settings</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Account preferences</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ height: '1px', background: 'rgba(197, 168, 128, 0.15)', margin: '2px 0' }} />

                      {/* Logout */}
                      <div
                        onClick={() => {
                          logoutUser();
                          setIsProfileOpen(false);
                          setCurrentView('landing');
                        }}
                        className="dropdown-action-item logout-item"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: 'var(--accent-rose)',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>🚪</span>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px' }}>Logout</span>
                          <span style={{ fontSize: '10px', color: 'rgba(195, 151, 151, 0.7)' }}>End current session</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dashboard Button */}
              <motion.button
                id="btn-nav-dashboard"
                onClick={() => {
                  if (currentUser.role === 'customer') setCurrentView('customerDashboard');
                  if (currentUser.role === 'professional') setCurrentView('professionalDashboard');
                  if (currentUser.role === 'admin') setCurrentView('adminDashboard');
                }}
                className="btn-primary"
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                {...btnPrimaryHoverProps}
              >
                {currentUser.role === 'customer' && <Award size={13} style={{ marginRight: '4px' }} />}
                {currentUser.role === 'professional' && <Sparkles size={13} style={{ marginRight: '4px' }} />}
                {currentUser.role === 'admin' && <ShieldAlert size={13} style={{ marginRight: '4px' }} />}
                {currentUser.role === 'customer' && 'Client Suite'}
                {currentUser.role === 'professional' && 'Professional Studio'}
                {currentUser.role === 'admin' && 'Admin Center'}
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <motion.button
          className="navbar-hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          whileHover={{
            scale: 1.05,
            borderColor: "var(--accent-gold)",
            color: "var(--accent-gold)",
            backgroundColor: "rgba(197, 168, 128, 0.05)"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: DURATION.fast, ease: EASING.subtle }}
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            animate={isOpen ? "open" : "closed"}
            variants={{
              closed: { rotate: 0 },
              open: { rotate: 180 }
            }}
            transition={{ duration: DURATION.medium, ease: EASING.luxury }}
          >
            <motion.path
              variants={{
                closed: { d: "M 3 5 L 17 5" },
                open: { d: "M 4 16 L 16 4" }
              }}
              transition={{ duration: DURATION.medium, ease: EASING.luxury }}
            />
            <motion.path
              variants={{
                closed: { opacity: 1, scaleX: 1 },
                open: { opacity: 0, scaleX: 0 }
              }}
              transition={{ duration: DURATION.fast, ease: EASING.luxury }}
              d="M 3 10 L 17 10"
            />
            <motion.path
              variants={{
                closed: { d: "M 3 15 L 17 15" },
                open: { d: "M 4 4 L 16 16" }
              }}
              transition={{ duration: DURATION.medium, ease: EASING.luxury }}
            />
          </motion.svg>
        </motion.button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="navbar-menu-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASING.luxury }}
          >
            {/* Mobile Navigation Links */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                className={`mobile-nav-link ${currentView === 'landing' ? 'active' : ''}`}
                onClick={() => { setCurrentView('landing'); setIsOpen(false); }}
              >
                Home
              </div>
              <div
                className={`mobile-nav-link ${currentView === 'marketplace' ? 'active' : ''}`}
                onClick={() => { setCurrentView('marketplace'); setIsOpen(false); }}
              >
                Find Services
              </div>
              <div
                className={`mobile-nav-link ${currentView === 'beautyScan' ? 'active' : ''}`}
                onClick={() => { setCurrentView('beautyScan'); setIsOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Sparkles size={14} color="var(--accent-rose)" /> AI Scan
              </div>
              <div
                className={`mobile-nav-link ${currentView === 'chatConcierge' ? 'active' : ''}`}
                onClick={() => { setCurrentView('chatConcierge'); setIsOpen(false); }}
              >
                AI Concierge
              </div>
            </div>

            {/* Mobile Selectors & Buttons */}
            <div className="mobile-controls-row">
              {/* Mobile City Selector */}
              <div className="mobile-control-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(28, 28, 28, 0.015)',
                border: '1px solid rgba(197, 168, 128, 0.25)',
                borderRadius: '6px',
                padding: '6px 12px',
                boxSizing: 'border-box',
                width: '100%',
                height: '44px'
              }}>
                <MapPin size={14} color="var(--accent-gold)" />
                <select
                  id="select-city-mobile"
                  value={selectedCity}
                  onChange={(e) => { setSelectedCity(e.target.value); setIsOpen(false); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    outline: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    fontFamily: 'var(--font-display)',
                    height: '100%'
                  }}
                >
                  <option value="Pune" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Pune</option>
                </select>
              </div>

              {/* Dynamic mobile auth options */}
              {!currentUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '10px' }}>
                  <motion.button
                    onClick={() => { setCurrentView('login'); setIsOpen(false); }}
                    className="btn-secondary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '12px 16px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                    {...btnSecondaryHoverProps}
                  >
                    Login
                  </motion.button>
                  <motion.button
                    onClick={() => { setCurrentView('signup'); setIsOpen(false); }}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '12px 16px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                    {...btnPrimaryHoverProps}
                  >
                    Get Started
                  </motion.button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '10px' }}>
                  <motion.button
                    id="btn-nav-dashboard-mobile"
                    onClick={() => {
                      if (currentUser.role === 'customer') setCurrentView('customerDashboard');
                      if (currentUser.role === 'professional') setCurrentView('professionalDashboard');
                      if (currentUser.role === 'admin') setCurrentView('adminDashboard');
                      setIsOpen(false);
                    }}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '12px 16px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                    {...btnPrimaryHoverProps}
                  >
                    {currentUser.role === 'customer' && <Award size={14} style={{ marginRight: '6px' }} />}
                    {currentUser.role === 'professional' && <Sparkles size={14} style={{ marginRight: '6px' }} />}
                    {currentUser.role === 'admin' && <ShieldAlert size={14} style={{ marginRight: '6px' }} />}
                    {currentUser.role === 'customer' && 'Client Suite'}
                    {currentUser.role === 'professional' && 'Professional Studio'}
                    {currentUser.role === 'admin' && 'Admin Center'}
                  </motion.button>


                  <motion.button
                    onClick={() => {
                      logoutUser();
                      setIsOpen(false);
                      setCurrentView('landing');
                    }}
                    className="btn-secondary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '12px 16px',
                      fontSize: '13px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderColor: 'var(--accent-rose)',
                      color: 'var(--accent-rose)'
                    }}
                    {...btnSecondaryHoverProps}
                  >
                    Logout
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
