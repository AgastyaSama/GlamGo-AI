/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import UserAvatar from '../components/UserAvatar';
import { RevenueLineChart } from '../components/Charts';
import RatingStars from '../components/RatingStars';
import { btnPrimaryHoverProps, pillHoverProps, scrollReveal } from '../styles/motion';
import { Calendar, Sparkles, CreditCard, Clock, MapPin, Smile, Heart } from 'lucide-react';

const CustomerDashboard = ({ setCurrentView, setSelectedProId }) => {
  const { currentUser, bookings, scans, professionals, services, users, activeDashboardTab, setActiveDashboardTab } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("planner");

  useEffect(() => {
    if (activeDashboardTab) {
      setActiveTab(activeDashboardTab);
      setActiveDashboardTab(null);
    }
  }, [activeDashboardTab, setActiveDashboardTab]);


  // Safe extraction of dashboard fields with fallback models
  const dashboardData = useMemo(() => currentUser?.dashboardData || {}, [currentUser]);
  const favorites = useMemo(() => dashboardData.favorites || { professionals: [], services: [] }, [dashboardData]);
  const preferences = useMemo(() => dashboardData.preferences || { skinType: "Normal", hairType: "Normal", focus: "General Maintenance", productPref: "None" }, [dashboardData]);
  const reviews = useMemo(() => dashboardData.reviews || [], [dashboardData]);
  const analytics = useMemo(() => dashboardData.analytics || { spending: [0], months: ["Jun"], totalSpend: 0, savings: 0 }, [dashboardData]);

  const sidebarTabs = [
    { id: "planner", label: "Smart Planner", icon: Calendar },
    { id: "scans", label: "AI Scan Reports", icon: Sparkles },
    { id: "analytics", label: "Spending Trends", icon: CreditCard },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "bookings", label: "Bookings", icon: Clock }
  ];

  // Filter scans to active customer only
  const myScans = useMemo(() => {
    return scans.filter(s => s.customerId === currentUser?.id);
  }, [scans, currentUser]);

  const myBookings = useMemo(() => {
    return bookings.filter(b => b.customerId === currentUser?.id);
  }, [bookings, currentUser]);

  const upcomingBookings = useMemo(() => {
    return myBookings.filter(b => b.status === 'upcoming');
  }, [myBookings]);

  const pastBookings = useMemo(() => {
    return myBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');
  }, [myBookings]);

  // Checklist for daily routine completion (mock interactive state)
  const [completedTasks, setCompletedTasks] = useState({});
  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // Generate routines dynamically based on customer's skin and hair preferences
  const dailySkinRoutine = useMemo(() => {
    const skin = preferences.skinType || "Normal";
    if (skin.toLowerCase().includes("dry")) {
      return [
        { id: "skin_1", time: "08:00 AM", task: "Gentle Amino Hydrating Cleanser", details: "Wash with lukewarm water to preserve natural lipids." },
        { id: "skin_2", time: "08:15 AM", task: "2% Hyaluronic Acid Serum", details: "Apply on damp skin for deep moisture locking." },
        { id: "skin_3", time: "08:30 AM", task: "Ceramide Barrier Repair Cream + SPF 50", details: "Essential UV shield to avoid skin redness." },
        { id: "skin_4", time: "09:30 PM", task: "Squalane Nourishing Oil Cleanser", details: "Cleanse away micro-dust and pollutants gently." }
      ];
    } else if (skin.toLowerCase().includes("oily")) {
      return [
        { id: "skin_1", time: "08:00 AM", task: "Salicylic Acid Cleansing Gel", details: "Exfoliates pore walls and controls excess sebum." },
        { id: "skin_2", time: "08:15 AM", task: "Niacinamide Sebum Balancing Serum", details: "Refines pore appearance and targets blemishes." },
        { id: "skin_3", time: "08:30 AM", task: "Lightweight Water Gel Moisturizer + SPF 50", details: "Hydrates without clogging pores." },
        { id: "skin_4", time: "09:30 PM", task: "Tea Tree Clarifying Face Wash", details: "Removes sebum buildup and prevents overnight breakouts." }
      ];
    } else {
      return [
        { id: "skin_1", time: "08:00 AM", task: "Balanced Foam Cleanser", details: "Gentle daily wash for standard pH levels." },
        { id: "skin_2", time: "08:15 AM", task: "Vitamin C Brightening Serum", details: "Antioxidant protection against environmental stressors." },
        { id: "skin_3", time: "08:30 AM", task: "Daily Light Hydrator + SPF 30", details: "Keeps skin soft and protected." },
        { id: "skin_4", time: "09:30 PM", task: "Gentle Night Cleanse & Moisturize", details: "Reset skin state for cell rejuvenation." }
      ];
    }
  }, [preferences.skinType]);

  const dailyHairRoutine = useMemo(() => {
    const hair = preferences.hairType || "Normal";
    if (hair.toLowerCase().includes("color")) {
      return [
        { id: "hair_1", time: "Weekly", task: "Color-Safe Sulfate-Free Restructuring Mask", details: "Locks in hair color pigments and fixes structural bonds." },
        { id: "hair_2", time: "Bi-Weekly", task: "Argan Oil Cuticle Hydrator", details: "Apply 4 drops to dry hair tips to prevent frizz." }
      ];
    } else if (hair.toLowerCase().includes("thick")) {
      return [
        { id: "hair_1", time: "Weekly", task: "Tea Tree Scalp Cooling Therapy", details: "Exfoliates scalp buildup and strengthens root shafts." },
        { id: "hair_2", time: "Bi-Weekly", task: "Nourishing Avocado Hair Butter", details: "Deeply conditions and softens thick hair strands." }
      ];
    } else {
      return [
        { id: "hair_1", time: "Weekly", task: "Light Argan Conditioning Treatment", details: "Restores standard shine and locks cuticle cutouts." },
        { id: "hair_2", time: "Bi-Weekly", task: "Mild Scalp Balancing Wash", details: "Keeps scalp clean and avoids sebum buildup." }
      ];
    }
  }, [preferences.hairType]);

  // Format currencies and summary metrics
  const formattedTotalSpend = useMemo(() => {
    const totalVal = analytics.totalSpend || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalVal);
  }, [analytics.totalSpend]);

  const formattedSavings = useMemo(() => {
    const totalVal = analytics.savings || 0;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalVal);
  }, [analytics.savings]);

  const favoriteCategory = useMemo(() => {
    if (myBookings.length === 0) return "None";
    const categories = myBookings.flatMap(b => b.services.map(s => s.category));
    if (categories.length === 0) return "None";
    const counts = {};
    categories.forEach(c => counts[c] = (counts[c] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }, [myBookings]);

  // Load favorites details
  const favStylists = useMemo(() => {
    const ids = favorites.professionals || [];
    return professionals.filter(p => ids.includes(p.id)).map(pro => {
      const u = users.find(usr => usr.id === pro.id);
      return { ...pro, user: u };
    }).filter(p => p.user !== undefined);
  }, [favorites.professionals, professionals, users]);

  const favSavedServices = useMemo(() => {
    const ids = favorites.services || [];
    return services.filter(s => ids.includes(s.id)).map(srv => {
      const proUser = users.find(u => u.id === srv.professionalId);
      return { ...srv, professionalName: proUser?.name || "Partner Stylist" };
    });
  }, [favorites.services, services, users]);

  const reviewsGiven = useMemo(() => {
    return reviews.map(rev => {
      const targetPro = users.find(u => u.id === rev.professionalId);
      return { ...rev, professionalName: targetPro?.name || "Stylist Partner" };
    });
  }, [reviews, users]);

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 81px)' }}>
      {/* Sidebar Panel */}
      <Sidebar
        tabs={sidebarTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={currentUser?.name || "Customer Client"}
        userAvatar={currentUser?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"}
        roleLabel={currentUser?.role === 'customer' ? 'Customer Profile' : 'User'}
        onProfileClick={() => setActiveTab('planner')}
        currentUser={currentUser}
      />

      {/* Main Panel Content */}
      <div className="dashboard-content-panel" style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>

        {/* TAB 1: SMART BEAUTY PLANNER & TIMELINE */}
        {activeTab === "planner" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Smart Beauty Planner</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>AI-scheduled routines and personalized preferences</p>
              </div>
              <motion.button
                onClick={() => setCurrentView('marketplace')}
                className="btn-primary"
                style={{ fontSize: '12px', padding: '10px 18px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                {...btnPrimaryHoverProps}
              >
                Book Stylist Appointment +
              </motion.button>
            </div>

            {/* Layout Grid */}
            <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px', alignItems: 'start' }}>

              {/* Upcoming Appointments & Profile Preferences */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Profile Preferences */}
                <GlassCard hover={false} {...scrollReveal(0)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px', color: 'var(--text-primary)' }}>
                    Personal Beauty Profile
                  </h2>
                  <div className="stats-grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Skin Profile</span>
                      <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>{preferences.skinType}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Hair Profile</span>
                      <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>{preferences.hairType}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>AI Focus Area</span>
                      <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>{preferences.focus}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Product Preferences</span>
                      <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>{preferences.productPref}</p>
                    </div>
                  </div>
                </GlassCard>

                {/* Upcoming Appointments */}
                <GlassCard hover={false} {...scrollReveal(0.05)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                    Upcoming Bookings Timeline
                  </h2>

                  {upcomingBookings.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {upcomingBookings.map((b) => {
                        const pro = professionals.find(p => p.id === b.professionalId);
                        const proUser = users.find(u => u.id === b.professionalId);
                        const bookingDate = new Date(b.dateTime);

                        return (
                          <motion.div
                            key={b.id}
                            onClick={() => {
                              setSelectedProId(b.professionalId);
                              setCurrentView('professionalProfile');
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '20px',
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-light)',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                            {...pillHoverProps}
                          >
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                              <UserAvatar user={proUser} size={48} />
                              <div>
                                <h4 style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{b.packageName || b.services.map(s => s.name).join(', ')}</h4>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                  With {proUser?.name} • {pro?.specialty.join(', ')}
                                </p>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={12} color="var(--accent-gold)" /> {bookingDate.toLocaleDateString()} at {bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <MapPin size={12} color="var(--accent-rose)" /> {proUser?.location}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>₹{b.totalPrice}</span>
                              <span className="badge badge-verified" style={{ display: 'block', fontSize: '9px', marginTop: '6px', padding: '2px 6px' }}>Confirmed</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px 0', border: '1px dashed var(--border-light)', borderRadius: '6px' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>No bookings scheduled for this month.</p>
                    </div>
                  )}
                </GlassCard>
              </div>

              {/* Home Care Routines Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Skin Routine */}
                <GlassCard hover={false} {...scrollReveal(0.1)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)' }}>
                    <Smile size={16} /> Daily Skin Routine
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {dailySkinRoutine.map((item, idx) => {
                      const isDone = completedTasks[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleTask(item.id)}
                          style={{
                            fontSize: '12px',
                            borderBottom: idx < dailySkinRoutine.length - 1 ? '1px solid var(--border-light)' : 'none',
                            paddingBottom: idx < dailySkinRoutine.length - 1 ? '12px' : '0',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!isDone}
                            readOnly
                            style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--accent-rose)' }}
                          />
                          <div style={{ opacity: isDone ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                            <span style={{ color: 'var(--accent-gold)', fontWeight: 500, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{item.time}</span>
                            <h5 style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px', fontSize: '13.5px', textDecoration: isDone ? 'line-through' : 'none' }}>{item.task}</h5>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '4px', lineHeight: '1.5' }}>{item.details}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>

                {/* Hair Routine */}
                <GlassCard hover={false} {...scrollReveal(0.15)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)' }}>
                    <Sparkles size={16} /> Hair Routine
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {dailyHairRoutine.map((item, idx) => {
                      const isDone = completedTasks[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleTask(item.id)}
                          style={{
                            fontSize: '12px',
                            borderBottom: idx < dailyHairRoutine.length - 1 ? '1px solid var(--border-light)' : 'none',
                            paddingBottom: idx < dailyHairRoutine.length - 1 ? '12px' : '0',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!isDone}
                            readOnly
                            style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--accent-gold)' }}
                          />
                          <div style={{ opacity: isDone ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                            <span style={{ color: 'var(--accent-rose)', fontWeight: 500, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{item.time}</span>
                            <h5 style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px', fontSize: '13.5px', textDecoration: isDone ? 'line-through' : 'none' }}>{item.task}</h5>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '4px', lineHeight: '1.5' }}>{item.details}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: AI SCAN DIAGNOSTIC REPORTS */}
        {activeTab === "scans" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Historical Diagnostics</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>View results of your selfie scan history</p>
            </div>

            {myScans.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {myScans.map((scan) => (
                  <GlassCard key={scan.id} hover={false} className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 8.2fr', gap: 'var(--space-xl)', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                      <img
                        src={scan.imageUrl}
                        alt="Diagnostic target"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, transparent 65%, rgba(28,28,28,0.5))',
                        pointerEvents: 'none',
                        zIndex: 1
                      }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge badge-ai">Analysis Report • {scan.date}</span>
                        <span style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)' }}>Score: {scan.overallScore}/100</span>
                      </div>

                      <div className="stats-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', fontSize: '12.5px' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Skin Hydro</span>
                          <p style={{ fontWeight: '500', color: 'var(--text-primary)', marginTop: '2px' }}>{scan.metrics.skinCondition.label} ({scan.metrics.skinCondition.score}%)</p>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Face Shape</span>
                          <p style={{ fontWeight: '500', color: 'var(--text-primary)', marginTop: '2px' }}>{scan.metrics.faceShape.label}</p>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Hair Cuticle</span>
                          <p style={{ fontWeight: '500', color: 'var(--text-primary)', marginTop: '2px' }}>{scan.metrics.hairTexture.label} ({scan.metrics.hairTexture.score}%)</p>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Tone Palette</span>
                          <p style={{ fontWeight: '500', color: 'var(--text-primary)', marginTop: '2px' }}>{scan.metrics.styleSuitability.label}</p>
                        </div>
                      </div>

                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)', paddingTop: '12px', lineHeight: '1.5' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Routines advice:</strong> {scan.recommendations.join(' ')}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed var(--border-light)', borderRadius: '6px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>You haven't run any AI Beauty Diagnostics yet.</p>
                <motion.button
                  onClick={() => setCurrentView('beautyScan')}
                  className="btn-primary"
                  style={{ marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '12px' }}
                  {...btnPrimaryHoverProps}
                >
                  Upload Selfie & Scan Now <Sparkles size={14} />
                </motion.button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SPENDING ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Spending Analytics</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Overview of beauty treatments investments</p>
            </div>

            <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }}>
              <GlassCard hover={false} {...scrollReveal(0)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Monthly Styling Spending (INR)</h3>
                <RevenueLineChart data={analytics.spending} labels={analytics.months} />
              </GlassCard>

              <GlassCard hover={false} {...scrollReveal(0.05)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '4px' }}>Investment Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Total Bookings:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{myBookings.length} sessions</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Year-to-date Spend:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontFamily: 'var(--font-serif)' }}>{formattedTotalSpend}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>AI Bundle Savings:</span>
                    <span style={{ color: 'var(--accent-rose)', fontWeight: '500' }}>{formattedSavings} saved</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Favorite Category:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500', textTransform: 'capitalize' }}>{favoriteCategory}</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* TAB 4: FAVORITES */}
        {activeTab === "favorites" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Your Favorites</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Keep track of stylists and treatments you love</p>
            </div>

            {/* Favorite Stylists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Favorite Artists</h2>
              {favStylists.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {favStylists.map((pro) => (
                    <GlassCard
                      key={pro.id}
                      onClick={() => {
                        setSelectedProId(pro.id);
                        setCurrentView('professionalProfile');
                      }}
                      style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <UserAvatar user={pro.user} size={48} />
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{pro.user.name}</h4>
                          <p style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 500 }}>{pro.specialty.join(', ')}</p>
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span>★ {pro.rating} ({pro.reviewCount} reviews)</span>
                        <span>Exp: {pro.experienceYears} Years</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>No favorite professionals saved yet.</p>
              )}
            </div>

            {/* Favorite Services */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Saved Salon Services</h2>
              {favSavedServices.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {favSavedServices.map((srv) => (
                    <GlassCard
                      key={srv.id}
                      onClick={() => {
                        setSelectedProId(srv.professionalId);
                        setCurrentView('professionalProfile');
                      }}
                      style={{ padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                      <div>
                        <span className="badge badge-ai" style={{ fontSize: '9px', marginBottom: '8px' }}>{srv.category}</span>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>{srv.name}</h4>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>By {srv.professionalName}</p>
                      </div>
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{srv.durationMinutes} Mins</span>
                        <span style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>₹{srv.price}</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>No services saved yet.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: BOOKINGS & REVIEWS GIVEN */}
        {activeTab === "bookings" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Bookings & Reviews</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Track scheduling history and reviews you have written</p>
            </div>

            {/* Upcoming Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Upcoming Bookings</h2>
              {upcomingBookings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {upcomingBookings.map((b) => {
                    const proUser = users.find(u => u.id === b.professionalId);
                    const bookingDate = new Date(b.dateTime);
                    return (
                      <GlassCard key={b.id} hover={false} style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                          <UserAvatar user={proUser} size={40} />
                          <div>
                            <h4 style={{ fontSize: '14.5px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{b.packageName || b.services.map(s => s.name).join(', ')}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>With {proUser?.name} • Scheduled on {bookingDate.toLocaleDateString()} at {bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>₹{b.totalPrice}</span>
                          <span className="badge badge-verified" style={{ display: 'block', fontSize: '9px', marginTop: '4px' }}>Upcoming</span>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>No upcoming bookings scheduled.</p>
              )}
            </div>

            {/* Past Bookings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Past Session History</h2>
              {pastBookings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pastBookings.map((b) => {
                    const proUser = users.find(u => u.id === b.professionalId);
                    const bookingDate = new Date(b.dateTime);
                    const isCancelled = b.status === 'cancelled';
                    return (
                      <GlassCard key={b.id} hover={false} style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                          <UserAvatar user={proUser} size={40} />
                          <div>
                            <h4 style={{ fontSize: '14.5px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{b.packageName || b.services.map(s => s.name).join(', ')}</h4>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>With {proUser?.name} • Session date {bookingDate.toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>₹{b.totalPrice}</span>
                          <span className={`badge ${isCancelled ? 'badge-pending' : 'badge-verified'}`} style={{ display: 'block', fontSize: '9px', marginTop: '4px' }}>
                            {b.status.toUpperCase()}
                          </span>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>No past bookings found.</p>
              )}
            </div>

            {/* Reviews Given */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Your Reviews Written</h2>
              {reviewsGiven.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviewsGiven.map((rev) => (
                    <GlassCard key={rev.id} hover={false} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>{rev.professionalName}</h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Date: {rev.date}</span>
                        </div>
                        <RatingStars rating={rev.rating} />
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5', borderLeft: '2px solid var(--accent-gold)', paddingLeft: '12px' }}>
                        "{rev.text}"
                      </p>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>You haven't written any reviews yet.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;
