const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const UserAvatar = ({ user, size = 32, style = {} }) => {
  if (!user) return null;
  const initials = getInitials(user.name);

  // Predefined demo profile pictures mapping
  const demoAvatars = {
    "cust_1": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    "cust_2": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    "pro_priya": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    "pro_amit": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    "pro_ananya": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    "pro_rahul": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    "pro_meera": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    "admin_1": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  };

  const isDemo = user.isDemoAccount || ["cust_1", "cust_2", "pro_priya", "pro_amit", "pro_ananya", "pro_rahul", "pro_meera", "admin_1"].includes(user.id);
  const avatarUrl = isDemo ? (demoAvatars[user.id] || user.avatar) : user.avatar;

  if (avatarUrl && avatarUrl.trim() !== "") {
    return (
      <img
        src={avatarUrl}
        alt={user.name}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid var(--border-light)',
          flexShrink: 0,
          ...style
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-rose) 100%)',
        color: '#FCFBF7', // Warm premium ivory/cream text
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.38}px`,
        fontWeight: 600,
        fontFamily: 'var(--font-display)',
        border: '1px solid rgba(197, 168, 128, 0.35)',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(197, 168, 128, 0.12)',
        userSelect: 'none',
        textShadow: '0 1px 1.5px rgba(0, 0, 0, 0.15)',
        ...style
      }}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
