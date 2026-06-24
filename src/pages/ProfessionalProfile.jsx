import { useContext, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import RatingStars from '../components/RatingStars';
import MatchScore from '../components/MatchScore';
import UserAvatar from '../components/UserAvatar';
import { calculateMatchScore } from '../services/ai';
import { btnPrimaryHoverProps } from '../styles/motion';
import { MapPin, Sparkles, ChevronRight, BookOpen } from 'lucide-react';

const ProfessionalProfile = ({ setCurrentView, selectedProId, setBookingParams }) => {
  const { professionals, services, users, selectedCity, showToast } = useContext(AppContext);
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const professional = useMemo(() => {
    return professionals.find(p => p.id === selectedProId) || professionals[0];
  }, [professionals, selectedProId]);

  const proUser = useMemo(() => {
    return users.find(u => u.id === professional?.id);
  }, [users, professional]);

  const proServices = useMemo(() => {
    return services.filter(s => s.professionalId === professional?.id);
  }, [services, professional]);

  const matchScore = useMemo(() => {
    return calculateMatchScore(professional, []);
  }, [professional]);

  const toggleService = (srv) => {
    if (selectedServices.find(s => s.id === srv.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== srv.id));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const handleCheckout = () => {
    if (selectedServices.length === 0) {
      showToast("Please select at least one beauty service to book.", "error");
      return;
    }
    if (!bookingDate || !bookingTime) {
      showToast("Please select a date and time slot.", "error");
      return;
    }

    setBookingParams({
      professionalId: professional.id,
      services: selectedServices,
      dateTime: `${bookingDate}T${bookingTime}:00`,
      totalPrice
    });
    setCurrentView('bookingFlow');
  };

  if (!professional) return <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>Loading profile...</div>;

  return (
    <div style={{ minHeight: 'calc(100vh - 81px)', padding: 'var(--space-3xl) 0' }} className="bg-gradient-radial">
      <div className="container mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 'var(--space-2xl)', alignItems: 'start' }}>
        
        {/* Left Side: Bio, Portfolio, Reviews, Services */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
          
          {/* Header Profile Info */}
          <GlassCard hover={false} className="pro-header-card" style={{ display: 'flex', gap: 'var(--space-xl)', position: 'relative', padding: 'var(--space-2xl)' }}>
            <div className="pro-header-match-score" style={{ position: 'absolute', top: '32px', right: '32px' }}>
              <MatchScore score={matchScore} />
            </div>

            <UserAvatar
              user={proUser}
              size={110}
              style={{
                border: '1px solid var(--border-light)'
              }}
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '70%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{proUser?.name}</h1>
                {professional.verified && <span className="badge badge-verified">Verified Partner</span>}
              </div>
              
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {professional.specialty.map(spec => (
                  <span key={spec} className="badge badge-ai" style={{ fontSize: '11px' }}>{spec}</span>
                ))}
              </div>
              
              <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                <MapPin size={13} color="var(--accent-gold)" /> Studio in {proUser?.location} • {professional.experienceYears} Years Experience
              </p>
              
              <div style={{ marginTop: '4px' }}>
                <RatingStars rating={professional.rating} count={professional.reviewCount} />
              </div>
            </div>
          </GlassCard>

          {/* About & Portfolio */}
          <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', padding: 'var(--space-2xl)' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>Artist <i style={{ color: 'var(--accent-gold)' }}>Biography</i></h2>
              <div style={{ width: '28px', height: '1px', background: 'linear-gradient(90deg, var(--accent-gold), transparent)', marginBottom: '16px' }} />
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: '1.75' }}>{professional.biography}</p>
            </div>

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '10px' }}>Portfolio <i style={{ color: 'var(--accent-gold)' }}>Highlights</i></h2>
              <div style={{ width: '28px', height: '1px', background: 'linear-gradient(90deg, var(--accent-gold), transparent)', marginBottom: '16px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                {professional.portfolio.map((img, i) => (
                  <div key={i} style={{ aspectRatio: '4/3', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-light)', cursor: 'pointer', position: 'relative' }}>
                    <motion.img
                      src={img}
                      alt="portfolio file"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, transparent 65%, rgba(28,28,28,0.5))',
                      pointerEvents: 'none',
                      zIndex: 1
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Services Catalog Checklist */}
          <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', padding: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Curate Your <i style={{ color: 'var(--accent-gold)' }}>Treatment</i></h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Select treatments</span>
            </div>
            <div style={{ width: '28px', height: '1px', background: 'linear-gradient(90deg, var(--accent-gold), transparent)', marginBottom: '20px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {proServices.map((srv) => {
                const isSelected = selectedServices.find(s => s.id === srv.id);
                return (
                  <motion.div
                    key={srv.id}
                    onClick={() => toggleService(srv)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-md) var(--space-lg)',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(197, 168, 128, 0.04)' : 'var(--bg-secondary)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-gold)' : 'var(--border-light)',
                      cursor: 'pointer'
                    }}
                    whileHover={{
                      y: -2,
                      borderColor: isSelected ? 'var(--accent-gold-hover)' : 'rgba(197, 168, 128, 0.45)',
                      boxShadow: '0px 8px 20px rgba(28, 28, 28, 0.04)',
                      backgroundColor: isSelected ? 'rgba(197, 168, 128, 0.06)' : 'rgba(197, 168, 128, 0.01)'
                    }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', maxWidth: '75%' }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '3px',
                        border: '1.5px solid',
                        borderColor: isSelected ? 'var(--accent-gold)' : 'rgba(197, 168, 128, 0.35)',
                        backgroundColor: isSelected ? 'var(--accent-gold)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isSelected && <span style={{ color: 'var(--text-primary)', fontSize: '11px', fontWeight: 'bold' }}>✓</span>}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{srv.name}</h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>{srv.description}</p>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Duration: {srv.durationMinutes} mins</span>
                      </div>
                    </div>
                    
                    <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>₹{srv.price}</span>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Booking Panel & Matching Analytics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', position: 'sticky', top: '120px' }}>
          
          {/* Booking Config Card */}
          <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: 'var(--space-xl)', borderColor: 'var(--accent-gold)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="var(--accent-gold)" /> Reserve Your <i style={{ color: 'var(--accent-gold)' }}>Date</i>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label-field">Booking Date</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="input-field"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
              </div>

              <div>
                <label className="label-field">Preferred Time Slot</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>-- Choose slot --</option>
                  <option value="10:00" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>10:00 AM</option>
                  <option value="12:00" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>12:00 PM</option>
                  <option value="14:00" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>02:00 PM</option>
                  <option value="16:00" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>04:00 PM</option>
                  <option value="18:00" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>06:00 PM</option>
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Selected items ({selectedServices.length}):</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>₹{totalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '600' }}>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>Estimated Total:</span>
                <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>₹{totalPrice}</span>
              </div>
            </div>

            <motion.button
              onClick={handleCheckout}
              disabled={selectedServices.length === 0}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px 0',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                opacity: selectedServices.length === 0 ? 0.4 : 1,
                cursor: selectedServices.length === 0 ? 'not-allowed' : 'pointer'
              }}
              {...(selectedServices.length === 0 ? {} : btnPrimaryHoverProps)}
            >
              Configure Package Details <ChevronRight size={14} />
            </motion.button>
          </GlassCard>

          {/* AI Matching Engine Details */}
          <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px', background: 'rgba(195, 151, 151, 0.04)', borderColor: 'rgba(195, 151, 151, 0.18)' }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)' }}>
              <Sparkles size={14} /> AI Recommendation Breakdown
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Profile Rating Alignment:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>99%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Experience Level Factor:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{professional.experienceYears >= 10 ? 'Elite (98%)' : 'Intermediate (85%)'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Average Response Speed:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{professional.responseTimeMinutes} mins (94%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Location Proximity Match:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{selectedCity === proUser?.location ? 'Perfect (100%)' : 'Different City (0%)'}</span>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>
    </div>
  );
};

export default ProfessionalProfile;
