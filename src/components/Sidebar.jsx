import { motion } from 'framer-motion';
import { tabHoverProps } from '../styles/motion';
import UserAvatar from './UserAvatar';

const Sidebar = ({ tabs = [], activeTab, setActiveTab, userName, userAvatar, roleLabel, onProfileClick, currentUser }) => {
  return (
    <div className="sidebar-panel" style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-light)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'calc(100vh - 81px)',
      position: 'sticky',
      top: '81px'
    }}>
      {/* Upper Navigation */}
      <div className="sidebar-upper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <span className="sidebar-menu-title" style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            fontWeight: 500,
            paddingLeft: '12px',
            fontFamily: 'var(--font-display)'
          }}>
            Menu
          </span>
          <div className="sidebar-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`sidebar-tab ${isActive ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isActive ? 'rgba(197, 168, 128, 0.05)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    outline: 'none',
                    borderLeft: isActive ? '3px solid var(--accent-gold)' : '3px solid transparent'
                  }}
                  {...tabHoverProps(isActive)}
                >
                  {Icon && <Icon size={16} color={isActive ? 'var(--accent-gold)' : 'var(--text-secondary)'} />}
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Profile Details */}
      <motion.div 
        onClick={onProfileClick}
        className="sidebar-profile"
        style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: onProfileClick ? 'pointer' : 'default',
          borderRadius: '6px',
          border: '1px solid transparent',
          padding: '10px',
          marginTop: '10px'
        }}
        whileHover={onProfileClick ? {
          y: -1,
          borderColor: 'var(--border-light)',
          backgroundColor: 'rgba(197, 168, 128, 0.02)',
          boxShadow: '0 4px 12px rgba(28, 28, 28, 0.02)'
        } : {}}
        whileTap={onProfileClick ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <UserAvatar user={currentUser || { name: userName, avatar: userAvatar }} size={40} />
        
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span style={{
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            fontFamily: 'var(--font-serif)'
          }}>
            {currentUser?.name || userName}
          </span>
          <span style={{
            fontSize: '10px',
            color: 'var(--accent-gold)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: '2px',
            fontFamily: 'var(--font-display)'
          }}>
            {roleLabel}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
