import { useContext, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import { CreditCard, Smartphone, ChevronLeft, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { btnPrimaryHoverProps, btnSecondaryHoverProps, stepVariants, SPRING } from '../styles/motion';

const BookingFlow = ({ setCurrentView, bookingParams }) => {
  const { addBooking, professionals, users } = useContext(AppContext);
  const [step, setStep] = useState(1); // 1 = Review, 2 = Payment, 3 = Confirmed
  const [direction, setDir] = useState(1); // 1 = forward, -1 = back
  const [verifying, setVerifying] = useState(false);
  const [customerNotes, setCustomerNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const professional = useMemo(() => {
    return professionals.find(p => p.id === bookingParams?.professionalId);
  }, [professionals, bookingParams]);

  const proUser = useMemo(() => {
    return users.find(u => u.id === professional?.id);
  }, [users, professional]);

  // AI Dynamic Discount Engine:
  // - 1 service: 0% discount
  // - 2 services: 8% discount
  // - 3+ services: 12% discount
  const discountDetails = useMemo(() => {
    const serviceCount = bookingParams?.services?.length || 0;
    const baseTotal = bookingParams?.totalPrice || 0;

    let rate = 0;
    if (serviceCount === 2) rate = 0.08;
    if (serviceCount >= 3) rate = 0.12;

    const discountAmount = Math.round(baseTotal * rate);
    const finalPrice = baseTotal - discountAmount;

    return {
      ratePercent: Math.round(rate * 100),
      discountAmount,
      finalPrice
    };
  }, [bookingParams]);

  const handleConfirmPayment = () => {
    setVerifying(true);
    setDir(1);
    setTimeout(() => {
      addBooking({
        professionalId: bookingParams.professionalId,
        services: bookingParams.services,
        dateTime: bookingParams.dateTime,
        totalPrice: discountDetails.finalPrice,
        isAiPackage: bookingParams.isAiPackage || bookingParams.services.length > 1,
        packageName: bookingParams.packageName || (bookingParams.services.length > 1 ? "Custom Combo Package" : "")
      });
      setVerifying(false);
      setStep(3); // Display confirmed state
    }, 2000);
  };

  const handleProceedToPayment = () => {
    setDir(1);
    setStep(2);
  };

  if (!bookingParams) {
    return (
      <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'var(--font-serif)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No active booking session found.</p>
        <button onClick={() => setCurrentView('marketplace')} className="btn-primary" style={{ marginTop: '16px' }}>
          Explore Marketplace
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 81px)', padding: 'var(--space-3xl) 0' }} className="bg-gradient-radial">
      <div className="container" style={{ maxWidth: '840px' }}>

        {/* Step Indicator */}
        {step < 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  if (step === 2) {
                    setDir(-1);
                    setStep(1);
                  } else {
                    setCurrentView('professionalProfile');
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--font-display)'
                }}
              >
                <ChevronLeft size={14} /> {step === 2 ? "Back to Review" : "Back to Profile"}
              </button>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span style={{ color: step === 1 ? 'var(--accent-gold)' : 'var(--text-secondary)', transition: 'color 0.3s' }}>I. Review</span>
                <span>·</span>
                <span style={{ color: step === 2 ? 'var(--accent-gold)' : 'var(--text-muted)', transition: 'color 0.3s' }}>II. Payment</span>
              </div>
            </div>

            {/* Elegant Spring Progress Bar */}
            <div style={{ height: '2px', background: 'var(--border-dark)', borderRadius: '1px', overflow: 'hidden', width: '100%' }}>
              <motion.div
                style={{ height: '100%', background: '#C5A880', originX: 0, width: '100%' }}
                animate={{ scaleX: step === 1 ? 0.5 : 1.0 }}
                transition={SPRING.gentle}
              />
            </div>
          </div>
        )}

        {/* Step content — direction-aware slide transition */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Step 1: Review Details & Dynamic Bundle Price */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Confirm Your Styling Package</h1>

                <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }}>

                  {/* Left Column: Summary */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
                      <h3 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Selected Stylist</h3>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <img
                          src={proUser?.avatar}
                          alt={proUser?.name}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{proUser?.name}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{professional.specialty.join(', ')} • {proUser?.location}</p>
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
                      <h3 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Selected Treatments</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {bookingParams.services.map((srv, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderBottom: idx < bookingParams.services.length - 1 ? '1px solid var(--border-dark)' : 'none', paddingBottom: idx < bookingParams.services.length - 1 ? '12px' : '0' }}>
                            <div>
                              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{srv.name}</span>
                              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', marginTop: '2px' }}>Category: {srv.category}</span>
                            </div>
                            <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>₹{srv.price}</span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '32px' }}>
                      <label className="label-field">Stylist Notes / Special Instructions</label>
                      <textarea
                        rows={3}
                        placeholder="Enter any color code preferences, skin allergy details, or scheduling notes..."
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        className="input-field"
                        style={{ resize: 'none' }}
                      />
                    </GlassCard>
                  </div>

                  {/* Right Column: Pricing & Bundle Discount */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '36px', borderColor: 'var(--accent-gold)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>AI Price Optimization</h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                          <span style={{ fontFamily: 'var(--font-serif)' }}>₹{bookingParams.totalPrice}</span>
                        </div>

                        {discountDetails.discountAmount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-rose)', fontWeight: 500 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Tag size={12} /> Dynamic Bundle ({discountDetails.ratePercent}%):
                            </span>
                            <span style={{ fontFamily: 'var(--font-serif)' }}>-₹{discountDetails.discountAmount}</span>
                          </div>
                        )}

                        <div style={{ height: '1px', backgroundColor: 'var(--border-light)', margin: '4px 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '600' }}>
                          <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>Payable Total:</span>
                          <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>₹{discountDetails.finalPrice}</span>
                        </div>
                      </div>

                      {discountDetails.discountAmount > 0 && (
                        <div style={{
                          background: 'rgba(197, 168, 128, 0.05)',
                          border: '1px solid rgba(197, 168, 128, 0.18)',
                          borderRadius: '6px',
                          padding: '12px',
                          fontSize: '11.5px',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'flex-start',
                          lineHeight: '1.5'
                        }}>
                          <Sparkles size={14} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>Smart Bundling applied. You saved ₹{discountDetails.discountAmount} by booking complementary treatments.</span>
                        </div>
                      )}

                      <motion.button
                        onClick={handleProceedToPayment}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '14px 0', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '12px' }}
                        {...btnPrimaryHoverProps}
                      >
                        Proceed to Payment
                      </motion.button>
                    </GlassCard>
                  </div>

                </div>
              </div>
            )}

            {/* Step 2: Payment Simulator */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Secure Checkout</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '-12px' }}>Authorized by GlamGo Secure Shield</p>

                <GlassCard hover={false} style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px', padding: '36px' }}>

                  {verifying ? (
                    /* Secure transaction loading spinner */
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '16px' }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          border: '2px solid rgba(197, 168, 128, 0.15)',
                          borderTopColor: 'var(--accent-gold)',
                          borderBottomColor: 'var(--accent-gold)',
                          boxShadow: '0 0 8px rgba(197, 168, 128, 0.2)'
                        }}
                      />
                      <p style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: 'var(--text-secondary)' }}>
                        Authorizing secure transaction...
                      </p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '600', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                        <span style={{ fontFamily: 'var(--font-serif)' }}>Amount Due:</span>
                        <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)' }}>₹{discountDetails.finalPrice}</span>
                      </div>

                      {/* Payment Methods */}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <motion.button
                          onClick={() => setPaymentMethod("card")}
                          style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '6px',
                            border: '1px solid',
                            borderColor: paymentMethod === 'card' ? 'var(--accent-gold)' : 'var(--border-light)',
                            background: paymentMethod === 'card' ? 'rgba(197, 168, 128, 0.04)' : 'rgba(28, 28, 28, 0.015)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 500,
                            fontSize: '12px',
                            fontFamily: 'var(--font-display)'
                          }}
                          whileHover={{
                            y: -2,
                            borderColor: paymentMethod === 'card' ? 'var(--accent-gold-hover)' : 'rgba(197, 168, 128, 0.45)',
                            boxShadow: '0px 4px 12px rgba(28, 28, 28, 0.03)'
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <CreditCard size={18} color={paymentMethod === 'card' ? 'var(--accent-gold)' : 'var(--text-muted)'} />
                          Credit/Debit Card
                        </motion.button>

                        <motion.button
                          onClick={() => setPaymentMethod("upi")}
                          style={{
                            flex: 1,
                            padding: '14px',
                            borderRadius: '6px',
                            border: '1px solid',
                            borderColor: paymentMethod === 'upi' ? 'var(--accent-gold)' : 'var(--border-light)',
                            background: paymentMethod === 'upi' ? 'rgba(197, 168, 128, 0.04)' : 'rgba(28, 28, 28, 0.015)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 500,
                            fontSize: '12px',
                            fontFamily: 'var(--font-display)'
                          }}
                          whileHover={{
                            y: -2,
                            borderColor: paymentMethod === 'upi' ? 'var(--accent-gold-hover)' : 'rgba(197, 168, 128, 0.45)',
                            boxShadow: '0px 4px 12px rgba(28, 28, 28, 0.03)'
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Smartphone size={18} color={paymentMethod === 'upi' ? 'var(--accent-gold)' : 'var(--text-muted)'} />
                          UPI / NetBanking
                        </motion.button>
                      </div>

                      {/* Card details simulation */}
                      {paymentMethod === 'card' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                          <div>
                            <label className="label-field">Cardholder Name</label>
                            <input type="text" placeholder="Rhea Sharma" defaultValue="Rhea Sharma" className="input-field" readOnly />
                          </div>
                          <div>
                            <label className="label-field">Card Number</label>
                            <input type="text" placeholder="•••• •••• •••• 4242" defaultValue="4242 4242 4242 4242" className="input-field" readOnly />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label className="label-field">Expiry</label>
                              <input type="text" placeholder="MM/YY" defaultValue="12/28" className="input-field" readOnly />
                            </div>
                            <div>
                              <label className="label-field">CVV</label>
                              <input type="password" placeholder="•••" defaultValue="123" className="input-field" readOnly />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                          <div>
                            <label className="label-field">Virtual Payment Address (VPA)</label>
                            <input type="text" placeholder="rhea@okaxis" defaultValue="rhea@okaxis" className="input-field" readOnly />
                          </div>
                        </div>
                      )}

                      <motion.button
                        onClick={handleConfirmPayment}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '14px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        {...btnPrimaryHoverProps}
                      >
                        Authorize Payment <ShieldCheck size={16} />
                      </motion.button>
                    </>
                  )}
                </GlassCard>
              </div>
            )}

            {/* Step 3: Confirmation Screen */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 0' }}>
                <motion.div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(197, 168, 128, 0.06)',
                    border: '1.5px solid var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)',
                    marginBottom: '28px',
                    boxShadow: '0 0 15px rgba(197, 168, 128, 0.15)'
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.0, opacity: 1.0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path
                      d="M20 6L9 17L4 12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                    />
                  </svg>
                </motion.div>

                <motion.h1
                  style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '12px', letterSpacing: '-0.02em' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  Appointment <i style={{ color: 'var(--accent-gold)' }}>Confirmed</i>
                </motion.h1>
                <motion.p
                  style={{ color: 'var(--text-secondary)', maxWidth: '480px', fontSize: '14.5px', lineHeight: '1.7', marginBottom: '32px' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  Your payment of <strong style={{ color: 'var(--text-primary)' }}>₹{discountDetails.finalPrice}</strong> was authorized.
                  We've synced this booking to your calendar and notified <strong style={{ color: 'var(--text-primary)' }}>{proUser?.name}</strong>.
                </motion.p>

                {/* Luxury Booking Summary Card */}
                <motion.div
                  style={{
                    background: 'rgba(252, 251, 247, 0.95)',
                    border: '1px solid rgba(197, 168, 128, 0.25)',
                    borderRadius: '8px',
                    padding: '28px 32px',
                    maxWidth: '480px',
                    width: '100%',
                    marginBottom: '32px',
                    textAlign: 'left',
                    boxShadow: '0 8px 32px rgba(28,28,28,0.04)'
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '16px' }}>Booking Summary</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Artist</span>
                      <p style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '4px' }}>{proUser?.name}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Services</span>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{bookingParams?.services?.map(s => s.name).join(', ')}</p>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount Paid</span>
                      <p style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', marginTop: '4px' }}>₹{discountDetails.finalPrice}</p>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</span>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#27A159', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#27A159', display: 'inline-block' }} />
                        Confirmed
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  style={{ display: 'flex', gap: '16px' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <motion.button
                    onClick={() => setCurrentView('customerDashboard')}
                    className="btn-primary"
                    style={{ padding: '12px 28px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    {...btnPrimaryHoverProps}
                  >
                    View My Planner
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentView('marketplace')}
                    className="btn-secondary"
                    style={{ padding: '12px 28px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    {...btnSecondaryHoverProps}
                  >
                    Explore More
                  </motion.button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

export default BookingFlow;
