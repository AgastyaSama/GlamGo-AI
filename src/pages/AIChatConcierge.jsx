import { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import MatchScore from '../components/MatchScore';
import { processChatConcierge } from '../services/ai';
import { Send, Calendar, Compass } from 'lucide-react';
import { btnPrimaryHoverProps, btnGoldHoverProps, DURATION, EASING } from '../styles/motion';

const QUICK_PROMPTS = [
  "I have a wedding next week and need a makeover under ₹5000.",
  "Need a quick skin rejuvenation facial before a photo shoot.",
  "Looking for the top rated nail extensions artist in Pune.",
  "Suggest a hair balayage coloring within a budget of ₹4000."
];

const AIChatConcierge = ({ setCurrentView, setBookingParams }) => {
  const { selectedCity } = useContext(AppContext);
  const [messages, setMessages] = useState([
    {
      id: "m_welcome",
      sender: "ai",
      text: "Hello! I am your GlamGo AI Concierge. Tell me about your occasion, style goals, and budget, and I will curate a custom styling package and pair you with the perfect professional.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // User message
    const userMsg = {
      id: "m_" + Math.random().toString(36).substr(2, 9),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText(""); // Clear input only if sent from input box

    setIsTyping(true);

    try {
      const result = await processChatConcierge(text, selectedCity);

      const aiReply = {
        id: "m_" + Math.random().toString(36).substr(2, 9),
        sender: "ai",
        text: result.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        packageData: result.packageTotalPrice > 0 ? {
          occasion: result.occasion,
          services: result.services,
          professional: result.professional,
          matchScore: result.matchScore,
          totalPrice: result.packageTotalPrice
        } : null
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBookPackage = (packageData) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0] + "T14:00:00";
    setBookingParams({
      professionalId: packageData.professional.id,
      services: packageData.services,
      dateTime: dateStr,
      totalPrice: packageData.totalPrice,
      isAiPackage: true,
      packageName: `AI ${packageData.occasion} Package`
    });
    setCurrentView('bookingFlow');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 81px)', padding: 'var(--space-3xl) 0' }} className="bg-gradient-radial">
      <div className="container mobile-stack-grid" style={{ maxWidth: '1100px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-2xl)', alignItems: 'start' }}>

        {/* Left Column: Chat Dialogue */}
        <GlassCard hover={false} className="chat-card-height" style={{ height: '600px', display: 'flex', flexDirection: 'column', padding: 'var(--space-xl)' }}>
          {/* Chat Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
            <div style={{ position: 'relative', width: '10px', height: '10px', flexShrink: 0 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-gold)' }} />
              <div style={{
                position: 'absolute',
                inset: '-3px',
                borderRadius: '50%',
                border: '1.5px solid rgba(197, 168, 128, 0.4)',
                animation: 'pulse-glow-ring 2.5s infinite'
              }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', letterSpacing: '-0.01em' }}>Your <i style={{ color: 'var(--accent-gold)' }}>Beauty</i> Concierge</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Consulting Live · {selectedCity}</p>
            </div>
          </div>

          {/* Dialogue Grid */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-md) var(--space-xs)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div style={{
                  padding: '16px 20px',
                  borderRadius: '6px',
                  background: msg.sender === 'user' ? 'var(--text-primary)' : 'var(--bg-primary)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-light)',
                  color: msg.sender === 'user' ? 'var(--bg-primary)' : 'var(--text-primary)',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

                  {/* Render package widget if compiled */}
                  {msg.packageData && msg.packageData.services.length > 0 && (
                    <motion.div
                      style={{
                        marginTop: '16px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--accent-gold)',
                        borderRadius: '6px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        textAlign: 'left'
                      }}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: DURATION.medium, ease: EASING.luxury }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge badge-ai">AI Package Recommendation</span>
                        <MatchScore score={msg.packageData.matchScore} />
                      </div>

                      <h4 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>
                        {msg.packageData.occasion} Bundle
                      </h4>

                      {/* Services breakdown */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {msg.packageData.services.map((srv, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            <span>• {srv.name}</span>
                            <span style={{ fontFamily: 'var(--font-serif)' }}>₹{srv.price}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ height: '1px', backgroundColor: 'var(--border-light)' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Package Price</span>
                          <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', marginTop: '2px' }}>₹{msg.packageData.totalPrice}</span>
                        </div>
                        <motion.button
                          onClick={() => handleBookPackage(msg.packageData)}
                          className="btn-gold"
                          style={{ padding: '10px 18px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                          {...btnGoldHoverProps}
                        >
                          Book Package <Calendar size={13} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
                <span style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginTop: '6px',
                  marginRight: msg.sender === 'user' ? '4px' : '0',
                  marginLeft: msg.sender === 'ai' ? '4px' : '0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)'
                }}>
                  <span className="bounce-dot"></span>
                  <span className="bounce-dot"></span>
                  <span className="bounce-dot"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input form */}
          <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <input
              type="text"
              placeholder="Describe your occasion, style vision, or budget..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="input-field"
              disabled={isTyping}
            />
            <motion.button
              onClick={() => handleSend()}
              className="btn-primary"
              disabled={isTyping}
              style={{ padding: '12px 20px', borderRadius: '6px' }}
              {...(isTyping ? {} : btnPrimaryHoverProps)}
            >
              <Send size={14} />
            </motion.button>
          </div>
        </GlassCard>

        {/* Right Column: Prompt Assistants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={16} color="var(--accent-gold)" /> Assistant Starters
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.6' }}>
              Select a sample requirement below to simulate a conversational package builder session.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => !isTyping && handleSend(prompt)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '6px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: '1.5',
                    cursor: isTyping ? 'not-allowed' : 'pointer',
                    color: 'var(--text-secondary)',
                    opacity: isTyping ? 0.55 : 1,
                    transition: 'opacity 0.25s ease-in-out, border-color 0.2s, background-color 0.2s',
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start'
                  }}
                  {...(isTyping ? {} : {
                    whileHover: {
                      y: -2,
                      borderColor: 'rgba(197, 168, 128, 0.45)',
                      boxShadow: '0px 4px 12px rgba(28, 28, 28, 0.03)',
                      color: 'var(--text-primary)'
                    },
                    whileTap: {
                      scale: 0.97
                    },
                    transition: { duration: DURATION.fast, ease: EASING.subtle }
                  })}
                >
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.05em', fontFamily: 'var(--font-display)', marginTop: '1px', flexShrink: 0 }}>
                    0{idx + 1}
                  </span>
                  <span>“{prompt}”</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '28px', background: 'rgba(252, 251, 247, 0.6)', borderColor: 'rgba(197, 168, 128, 0.15)' }}>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>AI Capabilities</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Extracts budget thresholds dynamically',
                'Bundles treatments into discounted packages',
                'Ranks local specialists by match accuracy',
                'Drafts scheduling parameters automatically'
              ].map((cap, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '12px', color: 'var(--accent-gold)', flexShrink: 0, marginTop: '1px' }}>✶</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{cap}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default AIChatConcierge;
