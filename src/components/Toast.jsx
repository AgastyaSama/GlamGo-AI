import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { DURATION, EASING } from '../styles/motion';

export default function Toast() {
  const { toast, showToast } = useContext(AppContext);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={16} color="var(--accent-gold)" />;
      case 'error':
        return <AlertCircle size={16} color="var(--accent-rose)" />;
      default:
        return <Info size={16} color="var(--text-muted)" />;
    }
  };

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: DURATION.medium, ease: EASING.luxury }}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 100000,
            background: 'var(--bg-secondary)', // Soft Cream
            border: `1px solid ${toast.type === 'error' ? 'var(--accent-rose)' : 'var(--accent-gold)'}`, // Tinted border
            borderRadius: '6px',
            padding: '12px 18px',
            boxShadow: '0px 12px 30px -4px rgba(28, 28, 28, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '360px',
            pointerEvents: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {getIcon()}
          </div>
          <div style={{
            fontSize: '13px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            lineHeight: 1.4,
            textAlign: 'left'
          }}>
            {toast.message}
          </div>
          <button
            onClick={() => showToast(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '4px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
