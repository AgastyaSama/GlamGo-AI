/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars */
import { useContext, useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import UserAvatar from '../components/UserAvatar';
import { RevenueLineChart, BookingProgressList } from '../components/Charts';
import { btnPrimaryHoverProps, btnSecondaryHoverProps, scrollReveal } from '../styles/motion';
import { ShieldCheck, Users, RefreshCw, Trash2, MapPin, ShieldAlert, Award, TrendingUp, Settings, Check } from 'lucide-react';

const AdminDashboard = ({ setCurrentView }) => {
  const { professionals, bookings, users, scans, toggleVerification, resetToDefaultSeed, updateUserData, deleteUser, currentUser, activeDashboardTab, setActiveDashboardTab, switchUserRole, showToast } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("platform");
  const [resetCompleted, setResetCompleted] = useState(false);

  const demoUserIds = ["cust_1", "cust_2", "pro_priya", "pro_amit", "pro_ananya", "pro_rahul", "pro_meera", "admin_1"];
  const demoUsers = users.filter(u => demoUserIds.includes(u.id));
  const demoCustomers = demoUsers.filter(u => u.role === 'customer');
  const demoPros = demoUsers.filter(u => u.role === 'professional');
  const demoAdmins = demoUsers.filter(u => u.role === 'admin');

  useEffect(() => {
    if (activeDashboardTab) {
      setActiveTab(activeDashboardTab);
      setActiveDashboardTab(null);
    }
  }, [activeDashboardTab, setActiveDashboardTab]);


  const sidebarTabs = [
    { id: "platform", label: "Platform Status", icon: ShieldCheck },
    { id: "verification", label: "Provider Auditing", icon: ShieldAlert },
    { id: "userManagement", label: "User Management", icon: Users },
    { id: "devLab", label: "Developer Sandbox", icon: RefreshCw }
  ];

  // Dynamic global platform statistics calculations
  const adminStats = useMemo(() => {
    const totalRev = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalUsers = users.length;
    const totalBookings = bookings.length;
    const pendingVerificationCount = professionals.filter(p => !p.verified).length;

    // Platform GMV is total booking revenue + a standard mock platform fee contribution
    return {
      revenue: totalRev,
      users: totalUsers,
      bookings: totalBookings,
      pending: pendingVerificationCount
    };
  }, [bookings, users, professionals]);

  const handleResetClick = () => {
    resetToDefaultSeed();
    setResetCompleted(true);
    setTimeout(() => setResetCompleted(false), 2000);
  };

  const handleRoleChange = (userId, newRole) => {
    updateUserData(userId, { role: newRole });
  };

  const handleLocationChange = (userId, newLocation) => {
    updateUserData(userId, { location: newLocation });
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser?.id) {
      showToast("System Safety Lock: You cannot delete your own admin account.", "error");
      return;
    }
    if (confirm("Are you sure you want to delete this user? All profile settings and local database association keys will be removed.")) {
      deleteUser(userId);
    }
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 81px)' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        tabs={sidebarTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={currentUser?.name || "Platform Admin"}
        userAvatar={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"}
        roleLabel="Platform Administrator"
        onProfileClick={() => setActiveTab('platform')}
        currentUser={currentUser}
      />

      {/* Main Content Space */}
      <div className="dashboard-content-panel" style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>

        {/* TAB 1: PLATFORM STATUS */}
        {activeTab === "platform" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Platform Status Center</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Overview of global metrics and multi-city transactions.</p>
            </div>

            {/* Metrics Row */}
            <div className="stats-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              <GlassCard hover={false} {...scrollReveal(0)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '24px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Total Platform GMV</span>
                <h2 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '2px' }}>₹{adminStats.revenue.toLocaleString()}</h2>
                <span style={{ fontSize: '11px', color: '#a3855c', fontWeight: 500, marginTop: '4px' }}>+20% weekly increase</span>
              </GlassCard>

              <GlassCard hover={false} {...scrollReveal(0.05)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '24px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Registered Users</span>
                <h2 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '2px' }}>{adminStats.users}</h2>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Across customers, stylists & admins</span>
              </GlassCard>

              <GlassCard hover={false} {...scrollReveal(0.1)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '24px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Bookings Completed</span>
                <h2 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '2px' }}>{adminStats.bookings}</h2>
                <span style={{ fontSize: '11px', color: '#a3855c', fontWeight: 500, marginTop: '4px' }}>98% success rate</span>
              </GlassCard>

              <GlassCard hover={false} {...scrollReveal(0.15)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '24px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Audits Pending</span>
                <h2 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--accent-rose)', marginTop: '2px' }}>{adminStats.pending}</h2>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Awaiting license check</span>
              </GlassCard>
            </div>

            {/* Visual breakdown graphs */}
            <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }}>
              <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Platform Monthly Growth Curve (INR)</h3>
                <RevenueLineChart data={[45000, 78000, 94000, 120000, 160000, adminStats.revenue + 140000]} labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} />
              </GlassCard>

              <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Trending Treatments</h3>
                <BookingProgressList />
              </GlassCard>
            </div>
          </div>
        )}

        {/* TAB 2: PROVIDER DIRECTORY & VERIFICATION AUDITING */}
        {activeTab === "verification" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Provider Verification Registry</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Verify partner licenses and portfolios to ensure trust across the GlamGo marketplace.</p>
            </div>

            <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                Stylist Partners Registry
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px', fontWeight: 500 }}>Stylist Partner</th>
                      <th style={{ padding: '12px', fontWeight: 500 }}>Location</th>
                      <th style={{ padding: '12px', fontWeight: 500 }}>Specialties</th>
                      <th style={{ padding: '12px', fontWeight: 500 }}>Experience</th>
                      <th style={{ padding: '12px', fontWeight: 500 }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 500 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {professionals.map((pro) => {
                      const user = users.find(u => u.id === pro.id);
                      if (!user) return null;
                      return (
                        <tr key={pro.id} style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                          <td style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <UserAvatar user={user} size={36} />
                            <div>
                              <strong style={{ color: 'var(--text-primary)', display: 'block', fontWeight: 500 }}>{user.name}</strong>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>{user.location}</td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {pro.specialty.map(s => (
                                <span key={s} style={{ fontSize: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', padding: '3px 6px', borderRadius: '6px', color: 'var(--text-secondary)' }}>{s}</span>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>{pro.experienceYears} Years</td>
                          <td style={{ padding: '12px' }}>
                            {pro.verified ? (
                              <span className="badge badge-verified">Verified</span>
                            ) : (
                              <span className="badge badge-pending">Pending</span>
                            )}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <motion.button
                              onClick={() => toggleVerification(pro.id)}
                              className="btn-secondary"
                              style={{
                                padding: '6px 14px',
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                borderColor: pro.verified ? 'var(--accent-rose)' : 'var(--accent-gold)',
                                color: pro.verified ? 'var(--accent-rose)' : 'var(--text-primary)',
                                background: 'transparent'
                              }}
                              whileHover={{
                                borderColor: pro.verified ? 'var(--accent-rose-hover)' : 'var(--accent-gold-hover)',
                                backgroundColor: pro.verified ? 'rgba(195, 151, 151, 0.05)' : 'rgba(197, 168, 128, 0.05)',
                                transition: { duration: 0.25 }
                              }}
                              whileTap={{ scale: 0.97 }}
                            >
                              {pro.verified ? 'Revoke Shield' : 'Grant Shield'}
                            </motion.button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === "userManagement" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>User Account Directory</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Manage all registered profiles, location assignments, and role scopes.</p>
            </div>

            <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                All Platform Users ({users.length})
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px', fontWeight: 500 }}>User Profile</th>
                      <th style={{ padding: '12px', fontWeight: 500 }}>Platform Role Scope</th>
                      <th style={{ padding: '12px', fontWeight: 500 }}>Assigned City</th>
                      <th style={{ padding: '12px', fontWeight: 500 }}>Account Status</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: 500 }}>Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const isSelf = u.id === currentUser?.id;
                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                          {/* User Column */}
                          <td style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <UserAvatar user={u} size={36} />
                            <div>
                              <strong style={{ color: 'var(--text-primary)', display: 'block', fontWeight: 500 }}>{u.name} {isSelf && "(You)"}</strong>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</span>
                            </div>
                          </td>

                          {/* Role Column */}
                          <td style={{ padding: '12px' }}>
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={isSelf}
                              style={{
                                border: '1px solid var(--border-light)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                outline: 'none',
                                fontSize: '12.5px',
                                cursor: isSelf ? 'not-allowed' : 'pointer'
                              }}
                            >
                              <option value="customer">Customer</option>
                              <option value="professional">Professional</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>

                          {/* Location Column */}
                          <td style={{ padding: '12px' }}>
                            <select
                              value={u.location}
                              onChange={(e) => handleLocationChange(u.id, e.target.value)}
                              style={{
                                border: '1px solid var(--border-light)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                outline: 'none',
                                fontSize: '12.5px',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Pune">Pune</option>
                            </select>
                          </td>

                          {/* Status Column */}
                          <td style={{ padding: '12px' }}>
                            <span className="badge badge-verified" style={{ padding: '3px 8px', fontSize: '10px' }}>
                              Active ✓
                            </span>
                          </td>

                          {/* Action Column */}
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <motion.button
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={isSelf}
                              style={{
                                padding: '6px',
                                background: 'transparent',
                                border: 'none',
                                color: isSelf ? 'var(--text-muted)' : 'var(--accent-rose)',
                                cursor: isSelf ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              whileHover={isSelf ? {} : { scale: 1.1, color: '#A04E4E' }}
                              whileTap={isSelf ? {} : { scale: 0.95 }}
                            >
                              <Trash2 size={15} /> Delete Profile
                            </motion.button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 4: DEV SANDBOX & CONTROLS */}
        {activeTab === "devLab" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Developer Sandbox</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Utilities to reset platform states and inspect platform memory dumps.</p>
            </div>

            <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Database Control Panel</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Resetting the database clears local storage partitions and reinstates the original mock seed configurations (elite professionals, default bookings, and customer profiles).
                </p>

                <motion.button
                  onClick={handleResetClick}
                  className="btn-primary"
                  style={{
                    alignSelf: 'flex-start',
                    background: resetCompleted ? 'var(--accent-gold)' : 'var(--text-primary)',
                    borderColor: resetCompleted ? 'var(--accent-gold)' : 'var(--text-primary)',
                    color: resetCompleted ? 'var(--text-primary)' : 'var(--bg-primary)',
                    padding: '12px 24px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '12px'
                  }}
                  whileHover={{
                    backgroundColor: resetCompleted ? '#B4966F' : '#2A2A2A',
                    borderColor: resetCompleted ? '#B4966F' : '#2A2A2A',
                    transition: { duration: 0.25 }
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {resetCompleted ? 'Platform Seeding Completed ✓' : 'Reset & Seed Platform DB'}
                </motion.button>
              </GlassCard>

              <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', maxHeight: '380px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Platform Memory Monitor</h3>
                <div style={{
                  flex: 1,
                  background: 'var(--bg-primary)',
                  borderRadius: '6px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '11.5px',
                  color: 'var(--text-secondary)',
                  overflowY: 'auto',
                  border: '1px solid var(--border-light)',
                  lineHeight: '1.5'
                }}>
                  {`{\n  "status": "online",\n  "database_type": "LocalStorageStore",\n  "total_records": {\n    "users": ${users.length},\n    "professionals": ${professionals.length},\n    "bookings": ${bookings.length},\n    "scans": ${scans.length}\n  },\n  "subsystems": {\n    "AIMatchingEngine": "Active",\n    "AIChatConcierge": "Active",\n    "AIBeautyScanner": "Active",\n    "AIRevenueStudio": "Active"\n  }\n}`}
                </div>
              </GlassCard>

              <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Switch Test Account</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Select a demo account to instantly switch contexts, update navbar, sidebar and dashboards.
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}>
                  {/* Customers */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textAlign: 'left' }}>Customers</span>
                    {demoCustomers.map((u) => {
                      const isCurrent = u.id === currentUser?.id;
                      return (
                        <div
                          key={u.id}
                          onClick={() => {
                            switchUserRole(u.id);
                            setCurrentView('customerDashboard');
                          }}
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

                  {/* Professionals */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textAlign: 'left' }}>Professionals</span>
                    {demoPros.map((u) => {
                      const isCurrent = u.id === currentUser?.id;
                      return (
                        <div
                          key={u.id}
                          onClick={() => {
                            switchUserRole(u.id);
                            setCurrentView('professionalDashboard');
                          }}
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

                  {/* Administrators */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textAlign: 'left' }}>Administrators</span>
                    {demoAdmins.map((u) => {
                      const isCurrent = u.id === currentUser?.id;
                      return (
                        <div
                          key={u.id}
                          onClick={() => {
                            switchUserRole(u.id);
                            setCurrentView('adminDashboard');
                          }}
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
              </GlassCard>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
