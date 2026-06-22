/* eslint-disable no-unused-vars */
import { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import { SPECIALTIES } from '../services/db';
import { Sparkles, ArrowRight, ShieldCheck, Clock, MapPin, Briefcase, Award, ArrowLeft, Camera } from 'lucide-react';
import { btnPrimaryHoverProps, btnSecondaryHoverProps, EASING, DURATION } from '../styles/motion';

const PRESET_AVATARS = [
  { name: "Priya (Creative)", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
  { name: "Amit (Colorist)", url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150" },
  { name: "Ananya (Aesthetician)", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
  { name: "Rahul (Barber)", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { name: "Meera (Nails)", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" }
];

const ProfessionalOnboarding = ({ setCurrentView, bookingParams }) => {
  const { completeProOnboarding, users } = useContext(AppContext);
  const proId = useMemo(() => bookingParams?.registeredProId || "pro_temp", [bookingParams]);

  // Find registered basic info for title welcome
  const proUser = useMemo(() => users.find(u => u.id === proId), [users, proId]);

  // Step state
  const [step, setStep] = useState(1);

  // Form Fields State
  const [salonName, setSalonName] = useState("");
  const [experience, setExperience] = useState("5");
  const [location, setLocation] = useState("Pune");
  
  const [servicesOffered, setServicesOffered] = useState([]);
  const [workingHours, setWorkingHours] = useState("10:00 AM - 07:00 PM");

  const [profileImage, setProfileImage] = useState(PRESET_AVATARS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [biography, setBiography] = useState("");

  const [error, setError] = useState("");

  const handleServiceToggle = (spec) => {
    if (servicesOffered.includes(spec)) {
      setServicesOffered(servicesOffered.filter(s => s !== spec));
    } else {
      setServicesOffered([...servicesOffered, spec]);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!salonName.trim()) {
        setError("Please enter your salon or professional name.");
        return;
      }
      setError("");
      setStep(2);
    } else if (step === 2) {
      if (servicesOffered.length === 0) {
        setError("Please select at least one beauty specialty service.");
        return;
      }
      setError("");
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError("");
    setStep(prev => prev - 1);
  };

  const handleOnboardingSubmit = () => {
    const finalAvatar = customImageUrl.trim() ? customImageUrl : profileImage;

    const onboardingData = {
      salonName,
      experience,
      location,
      servicesOffered,
      workingHours,
      profileImage: finalAvatar,
      biography: biography.trim() || `Luxury stylist treatments by ${salonName}. Experience: ${experience} years. Location: ${location}.`
    };

    completeProOnboarding(proId, onboardingData);
    setCurrentView('professionalDashboard');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 81px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background radial highlights */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(197, 168, 128, 0.04) 0%, transparent 70%)',
        top: '10%',
        left: '10%',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.slow, ease: EASING.luxury }}
        style={{
          width: '100%',
          maxWidth: '560px',
          zIndex: 2,
          position: 'relative'
        }}
      >
        <GlassCard hover={false} style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <span className="badge badge-ai" style={{ marginBottom: '12px' }}>
              Step {step} of 3 • Partner Verification
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 500, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>
              {step === 1 && "Studio Configuration"}
              {step === 2 && "Services & Schedule"}
              {step === 3 && "Branding & Bio"}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
              {proUser ? `Welcome, ${proUser.name}. Let's set up your catalog settings.` : "Define your professional profile properties."}
            </p>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(160, 78, 78, 0.05)',
              border: '1px solid rgba(160, 78, 78, 0.25)',
              borderRadius: '6px',
              padding: '10px 14px',
              color: '#A04E4E',
              fontSize: '13px'
            }}>
              <span>{error}</span>
            </div>
          )}

          {/* Stepper Progress Bar */}
          <div style={{ display: 'flex', gap: '8px', width: '100%', height: '2px', backgroundColor: 'var(--border-light)', borderRadius: '1px' }}>
            <div style={{ flex: 1, backgroundColor: step >= 1 ? 'var(--accent-gold)' : 'transparent', transition: 'background-color 0.3s' }}></div>
            <div style={{ flex: 1, backgroundColor: step >= 2 ? 'var(--accent-gold)' : 'transparent', transition: 'background-color 0.3s' }}></div>
            <div style={{ flex: 1, backgroundColor: step >= 3 ? 'var(--accent-gold)' : 'transparent', transition: 'background-color 0.3s' }}></div>
          </div>

          {/* STEP 1: STUDIO DETAILS */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Salon Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Salon or Stylist Name</label>
                <input
                  type="text"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="e.g. Priya Nair Hair Couture"
                  className="input-field"
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box', background: 'transparent' }}
                />
              </div>

              {/* Experience */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Years of Styling Experience</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="input-field"
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <option value="1">1 - 2 Years</option>
                  <option value="3">3 - 4 Years</option>
                  <option value="5">5 - 8 Years</option>
                  <option value="10">10 - 15 Years</option>
                  <option value="15">15+ Years</option>
                </select>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Operational Location (City)</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <option value="Pune">Pune</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: SERVICES & HOURS */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Services multi-select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Select Services Offered</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {SPECIALTIES.map((spec) => {
                    const selected = servicesOffered.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => handleServiceToggle(spec)}
                        style={{
                          padding: '8px 14px',
                          fontSize: '12px',
                          borderRadius: '6px',
                          border: selected ? '1px solid var(--accent-gold)' : '1px solid var(--border-light)',
                          background: selected ? 'rgba(197, 168, 128, 0.06)' : 'transparent',
                          color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: selected ? 600 : 500,
                          transition: 'all 0.2s'
                        }}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Working Hours */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Salon Working Hours</label>
                <input
                  type="text"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="e.g. 10:00 AM - 07:00 PM"
                  className="input-field"
                  style={{ width: '100%', padding: '12px', boxSizing: 'border-box', background: 'transparent' }}
                />
                <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <Clock size={12} /> Standard schedule matching booking slots.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: BRANDING & PROFILE AVATAR */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Profile image picker */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', textAlign: 'center' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600, alignSelf: 'flex-start' }}>Select Profile Avatar Preset</label>
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '8px 0' }}>
                  {PRESET_AVATARS.map((preset) => {
                    const active = profileImage === preset.url && !customImageUrl.trim();
                    return (
                      <div
                        key={preset.name}
                        onClick={() => { setProfileImage(preset.url); setCustomImageUrl(""); }}
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: active ? '2.5px solid var(--accent-gold)' : '1px solid var(--border-light)',
                          opacity: active ? 1 : 0.7,
                          transform: active ? 'scale(1.08)' : 'scale(1)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <img src={preset.url} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    );
                  })}
                </div>

                <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--border-light)', margin: '4px 0' }}></div>
                
                {/* Custom image URL */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', textAlign: 'left' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Or Paste Custom Avatar Image URL</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                      <Camera size={14} />
                    </span>
                    <input
                      type="url"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="input-field"
                      style={{ width: '100%', padding: '10px 12px 10px 38px', boxSizing: 'border-box', background: 'transparent' }}
                    />
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Stylist Biography & Introduction</label>
                <textarea
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  placeholder="Describe your styling techniques, salon highlights, and elite hair certifications..."
                  className="input-field"
                  style={{ width: '100%', minHeight: '80px', padding: '12px', boxSizing: 'border-box', background: 'transparent' }}
                />
              </div>
            </div>
          )}

          {/* Stepper Buttons footer */}
          <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '10px' }}>
            {step > 1 && (
              <motion.button
                onClick={handlePrevStep}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.05em', justifyContent: 'center' }}
                {...btnSecondaryHoverProps}
              >
                <ArrowLeft size={13} style={{ marginRight: '4px' }} /> Previous
              </motion.button>
            )}

            {step < 3 ? (
              <motion.button
                onClick={handleNextStep}
                className="btn-primary"
                style={{ flex: 2, padding: '12px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.05em', justifyContent: 'center' }}
                {...btnPrimaryHoverProps}
              >
                Continue <ArrowRight size={13} style={{ marginLeft: '4px' }} />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleOnboardingSubmit}
                className="btn-primary"
                style={{ flex: 2, padding: '12px', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.05em', justifyContent: 'center', borderColor: 'var(--accent-gold)' }}
                {...btnPrimaryHoverProps}
              >
                Launch Studio Catalog <Sparkles size={13} style={{ marginLeft: '4px' }} />
              </motion.button>
            )}
          </div>

        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ProfessionalOnboarding;
