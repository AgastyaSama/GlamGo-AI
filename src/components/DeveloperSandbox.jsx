import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import UserAvatar from './UserAvatar';
import { Sliders, X, Database, Terminal } from 'lucide-react';

const DeveloperSandbox = ({ setCurrentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    users, 
    currentUser, 
    switchUserRole, 
    resetToDefaultSeed,
    professionals,
    bookings,
    scans
  } = useContext(AppContext);

  const [resetCompleted, setResetCompleted] = useState(false);

  const handleResetClick = () => {
    resetToDefaultSeed();
    setResetCompleted(true);
    setTimeout(() => setResetCompleted(false), 2000);
  };

  const handleSwitchUser = (u) => {
    switchUserRole(u.id);
    if (u.role === 'customer') setCurrentView('customerDashboard');
    if (u.role === 'professional') setCurrentView('professionalDashboard');
    if (u.role === 'admin') setCurrentView('adminDashboard');
    setIsOpen(false);
  };

  // Filter to show only demo accounts
  const demoUserIds = ["cust_1", "cust_2", "pro_priya", "pro_amit", "pro_ananya", "pro_rahul", "pro_meera", "admin_1"];
  const demoUsers = users.filter(u => demoUserIds.includes(u.id));

  const customers = demoUsers.filter(u => u.role === 'customer');
  const pros = demoUsers.filter(u => u.role === 'professional');
  const admins = demoUsers.filter(u => u.role === 'admin');

  return (
    <>
      {/* Floating Trigger Badge */}
      <motion.div
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #1C1C1C 0%, #2A2A2A 100%)',
          color: 'var(--accent-gold)',
          border: '1px solid rgba(197, 168, 128, 0.4)',
          borderRadius: '30px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          userSelect: 'none'
        }}
        whileHover={{ 
          scale: 1.05,
          borderColor: 'rgba(197, 168, 128, 0.8)',
          boxShadow: '0 6px 25px rgba(197, 168, 128, 0.25)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Sliders size={14} />
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
          Demo Sandbox
        </span>
      </motion.div>

      {/* Slide-out Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(28, 28, 28, 0.3)',
                backdropFilter: 'blur(4px)',
                zIndex: 10000
              }}
            />

            {/* Panel Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '380px',
                background: 'rgba(252, 251, 247, 0.96)', // Glassmorphic soft cream
                borderLeft: '1px solid rgba(197, 168, 128, 0.25)',
                boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.05)',
                padding: '24px',
                zIndex: 10001,
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                overflowY: 'auto'
              }}
            >
              {/* Drawer Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Developer Sandbox</h3>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>Role simulation and state debugging dashboard</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '4px'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* SECTION: Switch Test Account */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-gold)' }}>
                  Switch Test Account
                </h4>

                {/* Sub-Section: Customers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em' }}>Customers</span>
                  {customers.map(u => {
                    const isCurrent = u.id === currentUser?.id;
                    return (
                      <div
                        key={u.id}
                        onClick={() => handleSwitchUser(u)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px',
                          borderRadius: '6px',
                          border: isCurrent ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-light)',
                          background: isCurrent ? 'rgba(197, 168, 128, 0.05)' : 'rgba(28, 28, 28, 0.01)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <UserAvatar user={u} size={28} />
                          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{u.email}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 500 }}>
                          {isCurrent ? 'Active ✓' : 'Switch ➜'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Sub-Section: Professionals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em' }}>Professionals</span>
                  {pros.map(u => {
                    const isCurrent = u.id === currentUser?.id;
                    return (
                      <div
                        key={u.id}
                        onClick={() => handleSwitchUser(u)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px',
                          borderRadius: '6px',
                          border: isCurrent ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-light)',
                          background: isCurrent ? 'rgba(197, 168, 128, 0.05)' : 'rgba(28, 28, 28, 0.01)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <UserAvatar user={u} size={28} />
                          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{u.email}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 500 }}>
                          {isCurrent ? 'Active ✓' : 'Switch ➜'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Sub-Section: Admins */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em' }}>Administrators</span>
                  {admins.map(u => {
                    const isCurrent = u.id === currentUser?.id;
                    return (
                      <div
                        key={u.id}
                        onClick={() => handleSwitchUser(u)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px',
                          borderRadius: '6px',
                          border: isCurrent ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-light)',
                          background: isCurrent ? 'rgba(197, 168, 128, 0.05)' : 'rgba(28, 28, 28, 0.01)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <UserAvatar user={u} size={28} />
                          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{u.email}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 500 }}>
                          {isCurrent ? 'Active ✓' : 'Switch ➜'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Database Control Card */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Database size={13} color="var(--accent-gold)" /> Seed Database Utilities
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Clears active updates and seeds original records (professionals, clients, and catalogs).
                </p>
                <motion.button
                  onClick={handleResetClick}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    background: resetCompleted ? 'var(--accent-gold)' : 'var(--text-primary)',
                    borderColor: resetCompleted ? 'var(--accent-gold)' : 'var(--text-primary)',
                    color: resetCompleted ? 'var(--text-primary)' : 'var(--bg-primary)',
                    padding: '8px 16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '10.5px'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {resetCompleted ? 'Platform Reset Complete ✓' : 'Reset & Seed Platform'}
                </motion.button>
              </div>

              {/* Memory Card */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={13} color="var(--accent-gold)" /> Sandbox Logs
                </h4>
                <div style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '6px',
                  padding: '12px',
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  color: 'var(--text-secondary)',
                  maxHeight: '130px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-light)',
                  lineHeight: '1.5',
                  textAlign: 'left'
                }}>
                  {`{\n  "status": "online",\n  "database": "LocalStorageStore",\n  "counts": {\n    "users": ${users.length},\n    "professionals": ${professionals.length},\n    "bookings": ${bookings.length},\n    "scans": ${scans.length}\n  }\n}`}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeveloperSandbox;
