/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars */
import { useContext, useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import Sidebar from '../components/Sidebar';
import UserAvatar from '../components/UserAvatar';
import { RevenueLineChart, RetentionBarChart } from '../components/Charts';
import RatingStars from '../components/RatingStars';
import { btnPrimaryHoverProps, btnSecondaryHoverProps, pillHoverProps, scrollReveal } from '../styles/motion';
import { Calendar, TrendingUp, Sparkles, Sliders, Clock, Users, DollarSign, Star, MessageSquare, MapPin, Briefcase, ChevronRight } from 'lucide-react';

const ProfessionalDashboard = ({ setCurrentView, setSelectedProId }) => {
  const { currentUser, bookings, services, updateServicePrice, users, activeDashboardTab, setActiveDashboardTab, showToast } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (activeDashboardTab) {
      setActiveTab(activeDashboardTab);
      setActiveDashboardTab(null);
    }
  }, [activeDashboardTab, setActiveDashboardTab]);


  // State for pricing updates
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPriceVal, setNewPriceVal] = useState("");

  // Safe extraction of dashboard data with fallback structures
  const dashboardData = useMemo(() => currentUser?.dashboardData || {}, [currentUser]);
  const earnings = useMemo(() => dashboardData.earnings || { monthly: [0], months: ["Jun"], completedServices: 0, retentionRate: 0, payouts: [] }, [dashboardData]);
  const schedule = useMemo(() => dashboardData.schedule || { days: [], hours: "Not Scheduled" }, [dashboardData]);
  const reviews = useMemo(() => dashboardData.reviews || [], [dashboardData]);
  const aiInsights = useMemo(() => dashboardData.aiInsights || { demandForecastingPercentage: 0, pricingOptimizations: [], popularServiceTrends: [], revenueOpportunities: [] }, [dashboardData]);

  const sidebarTabs = [
    { id: "overview", label: "Studio Overview", icon: TrendingUp },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "clients", label: "Clients Portfolio", icon: Users },
    { id: "earnings", label: "Earnings Growth", icon: DollarSign },
    { id: "services", label: "Manage Services", icon: Sliders },
    { id: "reviews", label: "Client Reviews", icon: Star }
  ];

  // Professional bookings
  const proBookings = useMemo(() => {
    return bookings.filter(b => b.professionalId === currentUser?.id);
  }, [bookings, currentUser]);

  const upcomingBookings = useMemo(() => {
    return proBookings.filter(b => b.status === 'upcoming');
  }, [proBookings]);

  const pastBookings = useMemo(() => {
    return proBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');
  }, [proBookings]);

  const proServices = useMemo(() => {
    return services.filter(s => s.professionalId === currentUser?.id);
  }, [services, currentUser]);

  // Aggregate stats dynamically
  const stats = useMemo(() => {
    const totalRev = proBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const completedCount = proBookings.filter(b => b.status === 'completed').length;
    const upcomingCount = upcomingBookings.length;

    return {
      revenue: totalRev,
      completed: completedCount + (earnings.completedServices || 0),
      upcoming: upcomingCount,
      retention: earnings.retentionRate || 80
    };
  }, [proBookings, earnings, upcomingBookings]);

  // Compute Client Portfolio dynamically from booking history
  const clientPortfolio = useMemo(() => {
    const portfolio = {};
    proBookings.forEach(b => {
      const client = users.find(u => u.id === b.customerId);
      if (!client) return;
      if (!portfolio[b.customerId]) {
        portfolio[b.customerId] = {
          id: b.customerId,
          name: client.name,
          email: client.email,
          avatar: client.avatar,
          bookingsCount: 0,
          totalSpent: 0,
          lastBookingDate: new Date(0)
        };
      }
      portfolio[b.customerId].bookingsCount += 1;
      portfolio[b.customerId].totalSpent += b.totalPrice;
      const bDate = new Date(b.dateTime);
      if (bDate > portfolio[b.customerId].lastBookingDate) {
        portfolio[b.customerId].lastBookingDate = bDate;
      }
    });
    return Object.values(portfolio);
  }, [proBookings, users]);

  // Format currency
  const formattedRevenue = useMemo(() => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(stats.revenue);
  }, [stats.revenue]);

  const handlePriceSave = (srvId) => {
    if (!newPriceVal || isNaN(newPriceVal) || parseInt(newPriceVal, 10) <= 0) {
      showToast("Please enter a valid price rate.", "error");
      return;
    }
    updateServicePrice(srvId, newPriceVal);
    setEditingPriceId(null);
    setNewPriceVal("");
  };

  // Reply state for reviews
  const [replies, setReplies] = useState({});
  const [draftReply, setDraftReply] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const handleSendReply = (revId) => {
    if (!draftReply.trim()) return;
    setReplies(prev => ({ ...prev, [revId]: draftReply }));
    setDraftReply("");
    setSelectedReviewId(null);
  };

  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: 'calc(100vh - 81px)' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        tabs={sidebarTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={currentUser?.name || "Professional"}
        userAvatar={currentUser?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"}
        roleLabel="Partner Stylist"
        onProfileClick={() => {
          if (currentUser?.id) {
            setSelectedProId(currentUser.id);
            setCurrentView('professionalProfile');
          }
        }}
        currentUser={currentUser}
      />

      {/* Main Content Pane */}
      <div className="dashboard-content-panel" style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>

        {/* TAB 1: STUDIO OVERVIEW & AI INSIGHTS */}
        {activeTab === "overview" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Studio Overview</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Welcome back, {currentUser?.name}. Here is your salon studio performance.</p>
              </div>

              <div style={{
                background: 'rgba(195, 151, 151, 0.04)',
                border: '1px solid rgba(195, 151, 151, 0.18)',
                borderRadius: '6px',
                padding: '12px 20px',
                textAlign: 'right'
              }}>
                <span style={{ fontSize: '10px', color: 'var(--accent-rose)', textTransform: 'uppercase', fontWeight: 500, letterSpacing: '0.05em' }}>Forecasted Demand</span>
                <h3 style={{ fontSize: '22px', color: 'var(--accent-rose)', fontWeight: 600, fontFamily: 'var(--font-serif)', marginTop: '2px' }}>+{aiInsights.demandForecastingPercentage}% Growth</h3>
              </div>
            </div>

            {/* Performance Metric Counters */}
            <div className="stats-grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              <GlassCard hover={false} {...scrollReveal(0)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '24px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Live Sales (Bookings)</span>
                <h2 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '2px' }}>{formattedRevenue}</h2>
                <span style={{ fontSize: '11px', color: '#a3855c', fontWeight: 500, marginTop: '4px' }}>+12% vs last month</span>
              </GlassCard>

              <GlassCard hover={false} {...scrollReveal(0.05)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '24px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Client Retention</span>
                <h2 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--accent-rose)', marginTop: '2px' }}>{stats.retention}%</h2>
                <span style={{ fontSize: '11px', color: '#a3855c', fontWeight: 500, marginTop: '4px' }}>Top 5% in {currentUser?.location}</span>
              </GlassCard>

              <GlassCard hover={false} {...scrollReveal(0.1)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '24px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Upcoming Slots</span>
                <h2 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '2px' }}>{stats.upcoming}</h2>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Awaiting schedule</span>
              </GlassCard>

              <GlassCard hover={false} {...scrollReveal(0.15)} style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '24px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>Completed Bookings</span>
                <h2 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '2px' }}>{stats.completed}</h2>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Historical total sessions</span>
              </GlassCard>
            </div>

            {/* Competitor Trends & Up-selling opportunities */}
            <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', alignItems: 'start' }}>

              {/* Pricing Optimizations list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                    <Sparkles size={16} color="var(--accent-gold)" /> AI Revenue Recommendations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                    {aiInsights.pricingOptimizations.length > 0 ? (
                      aiInsights.pricingOptimizations.map((item, idx) => (
                        <motion.div
                          key={idx}
                          onClick={() => {
                            const matchedService = proServices.find(s => s.name === item.serviceName);
                            if (matchedService) {
                              setActiveTab('services');
                              setEditingPriceId(matchedService.id);
                              setNewPriceVal(item.proposedPrice.toString());
                            }
                          }}
                          style={{
                            padding: '20px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            cursor: 'pointer'
                          }}
                          {...pillHoverProps}
                        >
                          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-serif)', flex: 1 }}>{item.serviceName}</h4>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '12.5px' }}>₹{item.currentPrice}</span>
                              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '15.5px', fontFamily: 'var(--font-serif)' }}>₹{item.proposedPrice}</span>
                            </div>
                          </div>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>Insight:</strong> {item.rationale}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', fontStyle: 'italic' }}>No recommendations for this stylist at the moment.</p>
                    )}
                  </div>
                </GlassCard>
              </div>

              {/* Service Catalog Trends */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Service Catalog Trends</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                    {aiInsights.popularServiceTrends.map((trend, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'start', fontSize: '13px', lineHeight: '1.5' }}>
                        <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-rose)', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }}></div>
                        <p style={{ color: 'var(--text-secondary)' }}>{trend}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Cross-Selling Opportunities</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                    {aiInsights.revenueOpportunities.map((opp, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'start', fontSize: '13px', lineHeight: '1.5' }}>
                        <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent-gold)', borderRadius: '50%', marginTop: '6px', flexShrink: 0 }}></div>
                        <p style={{ color: 'var(--text-secondary)' }}>{opp}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: APPOINTMENTS SCHEDULE */}
        {activeTab === "appointments" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Appointments Schedule</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Track daily slot bookings and scheduled sessions</p>
            </div>

            <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '32px', alignItems: 'start' }}>
              {/* Timeline list */}
              <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                  Upcoming Client Bookings
                </h3>

                {upcomingBookings.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {upcomingBookings.map((b) => {
                      const client = users.find(u => u.id === b.customerId);
                      const bookingDate = new Date(b.dateTime);

                      return (
                        <motion.div
                          key={b.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '20px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '6px'
                          }}
                          {...pillHoverProps}
                        >
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                            <UserAvatar user={client} size={44} />
                            <div>
                              <h4 style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{client?.name}</h4>
                              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Services: {b.services.map(s => s.name).join(', ')}
                              </p>
                              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} color="var(--accent-gold)" /> {bookingDate.toLocaleDateString()}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} color="var(--accent-rose)" /> {bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                  <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed var(--border-light)', borderRadius: '6px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No upcoming bookings in your calendar.</p>
                  </div>
                )}
              </GlassCard>

              {/* Working Hours Summary */}
              <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  Working Hours
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Weekly Schedule</span>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>{schedule.days.join(', ')}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Daily Hours</span>
                    <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>{schedule.hours}</p>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '12px', marginTop: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                      <Briefcase size={12} /> Shift Status: Active
                    </span>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>Clients can schedule appointments during these hour intervals through marketplace bookings.</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Past Bookings Section */}
            {pastBookings.length > 0 && (
              <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                  Completed & Cancelled Sessions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pastBookings.map((b) => {
                    const client = users.find(u => u.id === b.customerId);
                    const bookingDate = new Date(b.dateTime);
                    const isCancelled = b.status === 'cancelled';

                    return (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '6px', opacity: isCancelled ? 0.6 : 1 }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <UserAvatar user={client} size={32} />
                          <div>
                            <strong style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{client?.name}</strong>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '12px', marginLeft: '10px' }}>{b.services.map(s => s.name).join(', ')}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{bookingDate.toLocaleDateString()}</span>
                          <span className={`badge ${isCancelled ? 'badge-pending' : 'badge-verified'}`} style={{ fontSize: '9px', minWidth: '70px', textAlign: 'center' }}>{b.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}

          </div>
        )}

        {/* TAB 3: CLIENTS PORTFOLIO */}
        {activeTab === "clients" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Clients Portfolio</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Database profile portfolio of clients who have booked sessions with you.</p>
            </div>

            <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
                Your Stylist Client Database
              </h3>

              {clientPortfolio.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '12px', fontWeight: 500 }}>Client Name</th>
                        <th style={{ padding: '12px', fontWeight: 500 }}>Email Address</th>
                        <th style={{ padding: '12px', fontWeight: 500, textAlign: 'center' }}>Total Appointments</th>
                        <th style={{ padding: '12px', fontWeight: 500, textAlign: 'center' }}>Total Invested</th>
                        <th style={{ padding: '12px', fontWeight: 500, textAlign: 'right' }}>Last Session</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientPortfolio.map((cli) => (
                        <tr key={cli.id} style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                          <td style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <UserAvatar user={cli} size={36} />
                            <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{cli.name}</strong>
                          </td>
                          <td style={{ padding: '12px' }}>{cli.email}</td>
                          <td style={{ padding: '12px', textAlign: 'center', fontWeight: 500 }}>{cli.bookingsCount} bookings</td>
                          <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>₹{cli.totalSpent}</td>
                          <td style={{ padding: '12px', textAlign: 'right', color: 'var(--text-muted)' }}>{cli.lastBookingDate.toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed var(--border-light)', borderRadius: '6px' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No clients registered in your database yet.</p>
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* TAB 4: EARNINGS GROWTH */}
        {activeTab === "earnings" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Earnings Growth</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Overview of monthly payouts and billing analytics</p>
            </div>

            <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px' }}>
              <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Monthly Earning Growth (INR)</h3>
                <RevenueLineChart data={earnings.monthly} labels={earnings.months} />
              </GlassCard>

              {/* Client Retention Rates bar */}
              <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>Studio Client Retention (%)</h3>
                <RetentionBarChart data={[75, 78, 80, 82, 85, stats.retention]} labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} />
              </GlassCard>
            </div>

            {/* Payout Table */}
            <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                Payout Disbursements History
              </h3>
              {earnings.payouts && earnings.payouts.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '12px', fontWeight: 500 }}>Payout ID</th>
                        <th style={{ padding: '12px', fontWeight: 500 }}>Disbursement Date</th>
                        <th style={{ padding: '12px', fontWeight: 500 }}>Settlement Status</th>
                        <th style={{ padding: '12px', textAlign: 'right', fontWeight: 500 }}>Transferred Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.payouts.map((pay) => (
                        <tr key={pay.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '14px 12px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{pay.id}</td>
                          <td style={{ padding: '12px' }}>{new Date(pay.date).toLocaleDateString()}</td>
                          <td style={{ padding: '12px' }}>
                            <span className="badge badge-verified">Settled ({pay.status})</span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>₹{pay.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>No payouts processed for this cycle.</p>
              )}
            </GlassCard>
          </div>
        )}

        {/* TAB 5: SERVICES EDITOR */}
        {activeTab === "services" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Manage Services</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Modify your catalog treatments and prices. Updates synchronize in marketplace search instantly.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
              {proServices.map((srv) => (
                <GlassCard key={srv.id} hover={false} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '16px', padding: '24px' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span className="badge badge-ai" style={{ fontSize: '10px', marginBottom: '10px', width: 'fit-content' }}>{srv.category}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{srv.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', minHeight: '36px', lineHeight: '1.5', flex: 1 }}>{srv.description}</p>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Duration: {srv.durationMinutes} mins</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    {editingPriceId === srv.id ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', fontFamily: 'var(--font-serif)' }}>₹</span>
                        <input
                          type="number"
                          value={newPriceVal}
                          onChange={(e) => setNewPriceVal(e.target.value)}
                          className="input-field"
                          style={{ padding: '6px 0', fontSize: '13px', width: '80px', borderBottom: '1px solid var(--accent-gold)', background: 'transparent' }}
                          placeholder={srv.price.toString()}
                          autoFocus
                        />
                        <motion.button
                          onClick={() => handlePriceSave(srv.id)}
                          className="btn-primary"
                          style={{ padding: '6px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                          {...btnPrimaryHoverProps}
                        >
                          Save
                        </motion.button>
                        <motion.button
                          onClick={() => setEditingPriceId(null)}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                          {...btnSecondaryHoverProps}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price Rate</span>
                          <span style={{ display: 'block', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', marginTop: '2px' }}>₹{srv.price}</span>
                        </div>
                        <motion.button
                          onClick={() => { setEditingPriceId(srv.id); setNewPriceVal(srv.price.toString()); }}
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                          {...btnSecondaryHoverProps}
                        >
                          Modify Price
                        </motion.button>
                      </>
                    )}

                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CLIENT REVIEWS */}
        {activeTab === "reviews" && (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Client Reviews</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Feedback left by marketplace clients for your salon treatments</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviews.length > 0 ? (
                reviews.map((rev) => {
                  const replyText = replies[rev.id];
                  const isReplying = selectedReviewId === rev.id;

                  return (
                    <GlassCard key={rev.id} hover={false} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <UserAvatar user={users.find(u => u.name === rev.customerName) || { name: rev.customerName, avatar: rev.customerAvatar }} size={40} />
                          <div>
                            <strong style={{ color: 'var(--text-primary)', fontSize: '14.5px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{rev.customerName}</strong>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Reviewed on {new Date(rev.date).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <RatingStars rating={rev.rating} />
                      </div>

                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5', paddingLeft: '12px', borderLeft: '2px solid var(--accent-gold)' }}>
                        "{rev.text}"
                      </p>

                      {/* Reply section */}
                      {replyText ? (
                        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '12px 16px', marginLeft: '12px', marginTop: '8px' }}>
                          <span style={{ fontSize: '10px', color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Your Response:</span>
                          <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px', lineHeight: '1.4' }}>{replyText}</p>
                        </div>
                      ) : (
                        <div style={{ marginLeft: '12px', marginTop: '4px' }}>
                          {isReplying ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <textarea
                                value={draftReply}
                                onChange={(e) => setDraftReply(e.target.value)}
                                className="input-field"
                                style={{ width: '100%', minHeight: '60px', padding: '10px', fontSize: '13px', borderRadius: '6px', background: 'transparent' }}
                                placeholder="Type your response to the client..."
                              />
                              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                                <motion.button
                                  onClick={() => handleSendReply(rev.id)}
                                  className="btn-primary"
                                  style={{ padding: '6px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                                  {...btnPrimaryHoverProps}
                                >
                                  Submit Reply
                                </motion.button>
                                <motion.button
                                  onClick={() => { setSelectedReviewId(null); setDraftReply(""); }}
                                  className="btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                                  {...btnSecondaryHoverProps}
                                >
                                  Cancel
                                </motion.button>
                              </div>
                            </div>
                          ) : (
                            <motion.button
                              onClick={() => { setSelectedReviewId(rev.id); setDraftReply(""); }}
                              className="btn-secondary"
                              style={{ padding: '6px 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                              {...btnSecondaryHoverProps}
                            >
                              <MessageSquare size={12} style={{ marginRight: '4px' }} /> Write Reply
                            </motion.button>
                          )}
                        </div>
                      )}
                    </GlassCard>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', border: '1px dashed var(--border-light)', borderRadius: '6px' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No client reviews registered for your profile yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfessionalDashboard;
