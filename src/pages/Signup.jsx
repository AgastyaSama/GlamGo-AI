import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldAlert, User, Briefcase, Lock, Mail, ChevronLeft } from 'lucide-react';
import { btnPrimaryHoverProps, EASING, DURATION } from '../styles/motion';

const BG_PARTICLES = [
  { width: 220, height: 180, top: 15, left: 25, animateX: 10, animateY: -15, duration: 18 },
  { width: 140, height: 260, top: 45, left: 70, animateX: -20, animateY: 25, duration: 24 },
  { width: 290, height: 120, top: 80, left: 10, animateX: 15, animateY: 10, duration: 30 },
  { width: 180, height: 200, top: 60, left: 85, animateX: -10, animateY: -20, duration: 15 }
];

const Signup = ({ setCurrentView, setBookingParams }) => {
  const { signupUser } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer"); // 'customer' or 'professional'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form Validation
  const validateForm = () => {
    if (!name.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!email) {
      setError("Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    setTimeout(() => {
      const res = signupUser(name, email, password, role);
      setLoading(false);

      if (res.success) {
        if (role === 'customer') {
          setCurrentView('customerDashboard');
        } else {
          // If professional, cache registration id in bookingParams (or a temp state) for onboarding
          setBookingParams({ registeredProId: res.user.id });
          setCurrentView('professionalOnboarding');
        }
      } else {
        setError(res.error || "Registration failed. Try again.");
      }
    }, 1500);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 81px)',
      display: 'flex',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Ambient Background Particles */}
      {BG_PARTICLES.map((particle, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            background: 'radial-gradient(circle, rgba(195, 151, 151, 0.06) 0%, transparent 70%)',
            borderRadius: '50%',
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            zIndex: 1,
            pointerEvents: 'none'
          }}
          animate={{
            x: [0, particle.animateX, 0],
            y: [0, particle.animateY, 0],
            scale: [1, 1.12, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Main Split Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        width: '100%',
        zIndex: 2,
        position: 'relative'
      }} className="mobile-stack-grid">
        
        {/* Left Side: Branding Panel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, rgba(28, 28, 28, 0.01) 0%, rgba(197, 168, 128, 0.03) 100%)',
          borderRight: '1px solid var(--border-light)',
          position: 'relative'
        }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DURATION.slow, ease: EASING.luxury }}
            style={{ maxWidth: '520px' }}
          >
            <span style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--accent-rose)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(195, 151, 151, 0.06)',
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(195, 151, 151, 0.15)',
              marginBottom: '24px'
            }}>
              <Sparkles size={12} style={{ animation: 'float 4s infinite ease-in-out' }} /> Join GlamGo AI
            </span>

            <h1 style={{
              fontSize: '48px',
              fontWeight: 500,
              fontFamily: 'var(--font-serif)',
              lineHeight: '1.2',
              color: 'var(--text-primary)'
            }}>
              Begin Your Premium <br />
              <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Beauty Experience</span>
            </h1>

            <p style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              marginTop: '16px'
            }}>
              Register an account to explore our premium matching logic, scan hair cuticles with computer vision diagnostics, or launch your professional stylist studio listing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '10px',
                  borderRadius: '50%',
                  background: 'rgba(28, 28, 28, 0.03)',
                  border: '1px solid var(--border-light)'
                }}>
                  <User size={16} color="var(--accent-rose)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Customer Account</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Get AI-scheduled routines and search expert local stylists.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '10px',
                  borderRadius: '50%',
                  background: 'rgba(28, 28, 28, 0.03)',
                  border: '1px solid var(--border-light)'
                }}>
                  <Briefcase size={16} color="var(--accent-gold)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Styling Partner Account</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Publish your treatments, optimize pricing, and manage reviews.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Form Panel */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 40px',
          position: 'relative'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: EASING.luxury, delay: 0.15 }}
            style={{
              width: '100%',
              maxWidth: '420px',
              background: 'rgba(252, 251, 247, 0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(197, 168, 128, 0.18)',
              borderRadius: '8px',
              padding: '40px',
              boxShadow: 'var(--shadow-luxury)',
              position: 'relative'
            }}
          >
            {/* Loading Overlay */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(252, 251, 247, 0.9)',
                    borderRadius: '8px',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px'
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: '2px solid rgba(197, 168, 128, 0.25)',
                      borderTopColor: 'var(--accent-rose)'
                    }}
                  />
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '15px',
                    color: 'var(--text-primary)',
                    fontStyle: 'italic',
                    letterSpacing: '0.04em'
                  }}>
                    Creating user profile...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to login trigger */}
            <button
              onClick={() => setCurrentView('login')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                border: 'none',
                background: 'none',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                cursor: 'pointer',
                marginBottom: '20px',
                padding: 0
              }}
            >
              <ChevronLeft size={14} /> Back to Sign In
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 600,
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-primary)'
              }}>
                Create Account
              </h2>
              <p style={{
                fontSize: '12.5px',
                color: 'var(--text-secondary)',
                marginTop: '4px'
              }}>
                Get started on the ultimate AI-beauty network
              </p>
            </div>

            {/* Error Message Box */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(160, 78, 78, 0.05)',
                    border: '1px solid rgba(160, 78, 78, 0.25)',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    color: '#A04E4E',
                    fontSize: '12.5px',
                    marginBottom: '20px',
                    boxSizing: 'border-box'
                  }}
                >
                  <ShieldAlert size={14} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Role Tabs selection */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              marginBottom: '24px',
              background: 'rgba(28, 28, 28, 0.02)',
              padding: '4px',
              borderRadius: '6px',
              border: '1px solid var(--border-light)'
            }}>
              <button
                type="button"
                onClick={() => setRole("customer")}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: role === 'customer' ? 600 : 500,
                  cursor: 'pointer',
                  background: role === 'customer' ? 'var(--bg-secondary)' : 'transparent',
                  color: role === 'customer' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: role === 'customer' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <User size={13} color={role === 'customer' ? 'var(--accent-rose)' : 'currentColor'} /> Customer
              </button>
              <button
                type="button"
                onClick={() => setRole("professional")}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: role === 'professional' ? 600 : 500,
                  cursor: 'pointer',
                  background: role === 'professional' ? 'var(--bg-secondary)' : 'transparent',
                  color: role === 'professional' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: role === 'professional' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Briefcase size={13} color={role === 'professional' ? 'var(--accent-gold)' : 'currentColor'} /> Professional
              </button>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontWeight: 600 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rhea Sharma"
                    style={{
                      paddingLeft: '38px',
                      fontSize: '14.5px'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rhea@example.com"
                    style={{
                      paddingLeft: '38px',
                      fontSize: '14.5px'
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontWeight: 600 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Lock size={14} />
                  </span>
                  <input
                    type="password"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    style={{
                      paddingLeft: '38px',
                      fontSize: '14.5px'
                    }}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontWeight: 600 }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Lock size={14} />
                  </span>
                  <input
                    type="password"
                    className="input-field"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Verify password"
                    style={{
                      paddingLeft: '38px',
                      fontSize: '14.5px'
                    }}
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="btn-primary"
                style={{
                  justifyContent: 'center',
                  padding: '12.5px',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginTop: '10px',
                  borderColor: role === 'professional' ? 'var(--accent-gold)' : 'var(--text-primary)'
                }}
                {...btnPrimaryHoverProps}
              >
                {role === 'customer' ? 'Create Customer Suite' : 'Proceed to Onboarding'} 
                <ArrowRight size={14} style={{ marginLeft: '4px' }} />
              </motion.button>

            </form>

            <div style={{
              textAlign: 'center',
              marginTop: '24px',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}>
              Already have an account?{' '}
              <span
                onClick={() => setCurrentView('login')}
                style={{
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Sign In
              </span>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
