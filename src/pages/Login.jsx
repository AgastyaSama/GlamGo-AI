import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { btnPrimaryHoverProps, btnSecondaryHoverProps, EASING, DURATION } from '../styles/motion';

const BG_PARTICLES = [
  { width: 180, height: 220, top: 10, left: 20, animateX: 15, animateY: -25, duration: 25 },
  { width: 250, height: 150, top: 50, left: 75, animateX: -15, animateY: 30, duration: 20 },
  { width: 130, height: 280, top: 80, left: 5, animateX: 20, animateY: 15, duration: 35 },
  { width: 210, height: 190, top: 30, left: 85, animateX: -25, animateY: -10, duration: 18 },
  { width: 160, height: 240, top: 65, left: 40, animateX: 10, animateY: 20, duration: 28 }
];

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const Login = ({ setCurrentView }) => {
  const { loginUser } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCredsTip, setShowCredsTip] = useState(false);

  // Validation
  const validateForm = () => {
    if (!email) {
      setError("Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Please enter your account password.");
      return false;
    }
    setError("");
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    // Simulate luxury API delay
    setTimeout(() => {
      const res = loginUser(email, password);
      setLoading(false);

      if (res.success) {
        // Redirect to respective role dashboards
        const role = res.user.role;
        if (role === 'customer') setCurrentView('customerDashboard');
        else if (role === 'professional') setCurrentView('professionalDashboard');
        else if (role === 'admin') setCurrentView('adminDashboard');
      } else {
        setError(res.error || "Authentication failed. Please verify credentials.");
      }
    }, 1800);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 81px)',
      display: 'flex',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Background Particles */}
      {BG_PARTICLES.map((particle, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            background: 'radial-gradient(circle, rgba(197, 168, 128, 0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            zIndex: 1,
            pointerEvents: 'none'
          }}
          animate={{
            x: [0, particle.animateX, 0],
            y: [0, particle.animateY, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Main Form Split Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        width: '100%',
        zIndex: 2,
        position: 'relative'
      }} className="mobile-stack-grid">
        
        {/* Left Side: Branding and Tags */}
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
              color: 'var(--accent-gold)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(197, 168, 128, 0.06)',
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(197, 168, 128, 0.15)',
              marginBottom: '24px'
            }}>
              <Sparkles size={12} style={{ animation: 'float 4s infinite ease-in-out' }} /> Organic Luxury AI
            </span>

            <h1 style={{
              fontSize: '48px',
              fontWeight: 500,
              fontFamily: 'var(--font-serif)',
              lineHeight: '1.15',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em'
            }}>
              Your <i style={{ color: 'var(--accent-gold)' }}>Private</i><br />
              Beauty Concierge.
            </h1>

            <p style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              lineHeight: '1.75',
              marginTop: '20px',
              maxWidth: '400px'
            }}>
              Access curated home salon services, neural beauty diagnostics, and verified local artists — all under one private suite.
            </p>

            {/* Editorial Pull-Quote Feature Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '2px',
                  height: '36px',
                  background: 'linear-gradient(to bottom, var(--accent-gold), transparent)',
                  borderRadius: '1px',
                  flexShrink: 0,
                  marginTop: '4px'
                }} />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Verified Pune Artists</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px', lineHeight: '1.5' }}>Elite network under platform shield auditing.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '2px',
                  height: '36px',
                  background: 'linear-gradient(to bottom, var(--accent-rose), transparent)',
                  borderRadius: '1px',
                  flexShrink: 0,
                  marginTop: '4px'
                }} />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Neural Diagnostics Lab</h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px', lineHeight: '1.5' }}>Computer vision matching treatments to your skin profile.</p>
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
          {/* Main Glass Login Card */}
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
            {/* Loading animation overlay */}
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
                      borderTopColor: 'var(--accent-gold)'
                    }}
                  />
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '15px',
                    color: 'var(--text-primary)',
                    fontStyle: 'italic',
                    letterSpacing: '0.04em'
                  }}>
                    Authenticating look...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header branding */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{
                display: 'inline-flex',
                background: 'var(--text-primary)',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '16px',
                border: '1px solid rgba(197, 168, 128, 0.35)'
              }}>
                <Sparkles size={18} color="var(--bg-primary)" />
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 600,
                fontFamily: 'var(--font-serif)',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em'
              }}>
                Welcome <i style={{ color: 'var(--accent-gold)' }}>back</i>
              </h2>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginTop: '6px',
                lineHeight: '1.6'
              }}>
                Enter your credentials to open your private beauty suite
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

            {/* Login Inputs */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address</label>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>Password</label>
                  <span
                    onClick={() => {
                      setShowCredsTip(!showCredsTip);
                    }}
                    style={{ fontSize: '11.5px', color: 'var(--accent-gold)', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Forgot Password?
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Lock size={14} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    style={{
                      paddingLeft: '38px',
                      paddingRight: '38px',
                      fontSize: '14.5px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {/* Credentials Dropdown Panel */}
                <AnimatePresence>
                  {showCredsTip && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{
                        marginTop: '12px',
                        padding: '12px 14px',
                        background: 'rgba(197, 168, 128, 0.04)',
                        border: '1px solid rgba(197, 168, 128, 0.15)',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid rgba(197, 168, 128, 0.1)' }}>
                        <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--accent-gold)' }}>Demo Credentials</span>
                        <button 
                          type="button"
                          onClick={() => setShowCredsTip(false)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', fontSize: '10px' }}
                        >
                          Close
                        </button>
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(197, 168, 128, 0.08)' }}>
                            <th style={{ padding: '4px 0', fontWeight: 600, fontSize: '10px' }}>Role (Name)</th>
                            <th style={{ padding: '4px 0', fontWeight: 600, fontSize: '10px' }}>Email</th>
                            <th style={{ padding: '4px 0', fontWeight: 600, fontSize: '10px' }}>Password</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid rgba(197, 168, 128, 0.04)' }}>
                            <td style={{ padding: '4px 0', color: 'var(--text-primary)' }}>Customer (Rhea)</td>
                            <td style={{ padding: '4px 0', fontStyle: 'italic' }}>rhea@example.com</td>
                            <td style={{ padding: '4px 0' }}>password123</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(197, 168, 128, 0.04)' }}>
                            <td style={{ padding: '4px 0', color: 'var(--text-primary)' }}>Professional (Priya)</td>
                            <td style={{ padding: '4px 0', fontStyle: 'italic' }}>priya@glamgo.ai</td>
                            <td style={{ padding: '4px 0' }}>password123</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '4px 0', color: 'var(--text-primary)' }}>Admin (Karan)</td>
                            <td style={{ padding: '4px 0', fontStyle: 'italic' }}>karan@glamgo.ai</td>
                            <td style={{ padding: '4px 0' }}>password123</td>
                          </tr>
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Remember Me */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: 'var(--accent-gold)' }}
                />
                <label htmlFor="remember-me" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
                  Remember me on this browser
                </label>
              </div>

              {/* Submit Buttons */}
              <motion.button
                type="submit"
                className="btn-primary"
                style={{
                  justifyContent: 'center',
                  padding: '12.5px',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginTop: '10px'
                }}
                {...btnPrimaryHoverProps}
              >
                Sign In <ArrowRight size={14} style={{ marginLeft: '4px' }} />
              </motion.button>
            </form>

            {/* Separator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }}></div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Or connect with</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }}></div>
            </div>

            {/* Google OAuth button */}
            <motion.button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setError("");
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  // Redirect to Customer Rhea Sharma by default on Google Login
                  loginUser("rhea@example.com", "password123");
                  setCurrentView("customerDashboard");
                }, 1200);
              }}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12.5px',
                fontSize: '12px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
              {...btnSecondaryHoverProps}
            >
              <GoogleIcon /> Google Single Sign-on
            </motion.button>

            {/* Redirect Footer */}
            <div style={{
              textAlign: 'center',
              marginTop: '28px',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}>
              New to GlamGo AI?{' '}
              <span
                onClick={() => setCurrentView('signup')}
                style={{
                  color: 'var(--accent-gold)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderBottom: '1px solid transparent',
                  transition: 'border-color 0.25s'
                }}
                onMouseEnter={(e) => e.target.style.borderBottomColor = 'var(--accent-gold)'}
                onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
              >
                Create Account
              </span>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Login;
