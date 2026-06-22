import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import { simulateBeautyScan } from '../services/ai';
import { Sparkles, Camera, RefreshCw, Smile, Scissors, Heart, Plus } from 'lucide-react';
import { EASING, DURATION, btnPrimaryHoverProps, btnSecondaryHoverProps } from '../styles/motion';

const SAMPLE_PORTRAITS = [
  { name: "Sample A", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200" },
  { name: "Sample B", url: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200" },
  { name: "Sample C", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200" }
];

const ScoreRing = ({ score, color, size = 60, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="var(--border-dark)" strokeWidth={strokeWidth} />
        {/* Animated fill arc */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 1.0, ease: EASING.luxury, delay: 0.3 }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size > 60 ? '16px' : '11px',
        fontWeight: 600,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)'
      }}>
        {score}%
      </div>
    </div>
  );
};

// Diagnostic Card Stagger Variants
const diagnosticContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
};

const diagnosticCardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.medium, ease: EASING.luxury }
  }
};

const AIBeautyScan = ({ setCurrentView }) => {
  const { addScanResult, activeScanReport, setActiveScanReport } = useContext(AppContext);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState(null);

  const [prevActiveReport, setPrevActiveReport] = useState(activeScanReport);
  if (activeScanReport !== prevActiveReport) {
    setPrevActiveReport(activeScanReport);
    setReport(activeScanReport);
    if (activeScanReport) {
      setSelectedPhoto(activeScanReport.imageUrl);
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedPhoto(url);
      setReport(null);
      setActiveScanReport(null);
    }
  };

  const handleSelectSample = (url) => {
    setSelectedPhoto(url);
    setReport(null);
    setActiveScanReport(null);
  };

  const executeScan = async () => {
    if (!selectedPhoto) return;
    setScanning(true);
    setProgress(0);
    setReport(null);

    // Start progress simulation (takes 2000ms total)
    const intervalTime = 40; // update every 40ms
    const totalSteps = 2000 / intervalTime; // 50 steps
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min((currentStep / totalSteps) * 100, 98); // hold at 98% until done
      setProgress(nextProgress);
    }, intervalTime);

    try {
      const result = await simulateBeautyScan(selectedPhoto);
      clearInterval(progressInterval);
      setProgress(100);

      // Delay setting report slightly so they see 100% complete
      setTimeout(() => {
        setReport(result);
        addScanResult(result);
        setActiveScanReport(result);
        setScanning(false);
      }, 300);

    } catch (err) {
      clearInterval(progressInterval);
      setScanning(false);
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 81px)', padding: '60px 0 120px 0' }} className="bg-gradient-radial">
      <div className="container" style={{ maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <span className="badge badge-ai" style={{ marginBottom: '12px', padding: '6px 14px' }}>
            <Sparkles size={12} style={{ animation: 'float 4s infinite ease-in-out' }} /> AI Diagnostics Laboratory
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>AI Beauty & Style Scan</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '12px auto 0', fontSize: '15px', lineHeight: '1.6' }}>
            Upload your portrait. Our neural networks analyze facial symmetry, skin hydration, and hair cuticle integrity to curate a bespoke treatment path.
          </p>
        </div>

        {/* Dynamic Scan Panel */}
        <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: report ? '1fr 1.2fr' : '1fr', gap: '32px', alignItems: 'start' }}>

          {/* Left Panel: Photo Uploader & Scanning State */}
          <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', textAlign: 'center', padding: '36px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Portrait Input</h3>

            {/* Image Preview Container */}
            <motion.div
              className="scanner-container"
              animate={!selectedPhoto && !scanning ? {
                borderColor: ["rgba(197, 168, 128, 0.2)", "rgba(197, 168, 128, 0.8)", "rgba(197, 168, 128, 0.2)"]
              } : {}}
              transition={!selectedPhoto && !scanning ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
              style={{
                width: '100%',
                maxWidth: '340px',
                height: '340px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px dashed var(--accent-gold)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              {/* Scan Line Sweeper */}
              <AnimatePresence>
                {scanning && (
                  <motion.div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: "linear-gradient(90deg, transparent, #C5A880, transparent)",
                      boxShadow: "0 0 10px rgba(197,168,128,0.7)",
                      zIndex: 10,
                    }}
                    initial={{ top: "0%", opacity: 0 }}
                    animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                    transition={{
                      top: { duration: DURATION.crawl, ease: EASING.linear, repeat: Infinity },
                      opacity: { duration: DURATION.crawl, times: [0, 0.05, 0.95, 1], repeat: Infinity },
                    }}
                    exit={{ opacity: 0, transition: { duration: DURATION.fast } }}
                  />
                )}
              </AnimatePresence>

              {/* Scanning Progress Overlay */}
              <AnimatePresence>
                {scanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.fast }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      backgroundColor: 'rgba(28, 28, 28, 0.45)',
                      zIndex: 5,
                      gap: '12px'
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      color: '#FCFBF7',
                      fontSize: '18px',
                      letterSpacing: '0.05em'
                    }}>
                      AI Scanning...
                    </span>

                    {/* Progress Bar */}
                    <div style={{
                      width: '180px',
                      height: '2px',
                      background: 'rgba(252, 251, 247, 0.2)',
                      borderRadius: '1px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        style={{
                          height: '100%',
                          background: '#C5A880',
                          originX: 0,
                          width: '100%'
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: progress / 100 }}
                        transition={{ duration: 0.1, ease: 'easeOut' }}
                      />
                    </div>

                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#C5A880',
                      fontFamily: 'var(--font-display)'
                    }}>
                      {Math.round(progress)}%
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedPhoto ? (
                <img
                  src={selectedPhoto}
                  alt="Target analysis"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: scanning ? 0.3 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', padding: '24px' }}>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '50%', border: '1px solid var(--border-light)' }}>
                    <Camera size={28} color="var(--accent-gold)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: '14px', color: 'var(--text-primary)' }}>Drag & drop image here</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>Supports JPG, PNG up to 10MB</p>
                  </div>
                  <motion.label
                    className="btn-secondary"
                    style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}
                    {...btnSecondaryHoverProps}
                  >
                    Browse Files
                    <input type="file" onChange={handlePhotoUpload} accept="image/*" style={{ display: 'none' }} />
                  </motion.label>
                </div>
              )}
            </motion.div>

            {/* Quick Test Samples */}
            {!selectedPhoto && !scanning && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '340px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or select a demo portrait:</span>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {SAMPLE_PORTRAITS.map((p, idx) => (
                    <motion.div
                      key={idx}
                      onClick={() => handleSelectSample(p.url)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-light)',
                        width: '60px',
                        height: '60px'
                      }}
                      whileHover={{ scale: 1.05, borderColor: 'var(--accent-gold)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            {selectedPhoto && (
              <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '340px' }}>
                <motion.button
                  id="btn-scan-reset"
                  onClick={() => { setSelectedPhoto(null); setReport(null); setActiveScanReport(null); }}
                  className="btn-secondary"
                  disabled={scanning}
                  style={{ flex: 1, padding: '12px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', justifyContent: 'center' }}
                  {...(scanning ? {} : btnSecondaryHoverProps)}
                >
                  <RefreshCw size={12} /> Reset
                </motion.button>
                <motion.button
                  id="btn-scan-run"
                  onClick={executeScan}
                  disabled={scanning}
                  className="btn-primary"
                  style={{ flex: 2, padding: '12px 0', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', justifyContent: 'center' }}
                  {...(scanning ? {} : btnPrimaryHoverProps)}
                >
                  {scanning ? 'Analyzing look...' : 'Run Diagnostics'} <Sparkles size={12} />
                </motion.button>
              </div>
            )}
          </GlassCard>

          {/* Right Panel: Diagnostic Report */}
          <AnimatePresence>
            {report && (
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: DURATION.slow, ease: EASING.luxury }}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >

                {/* Overall Score */}
                <GlassCard hover={false} style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--accent-gold)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '32px'
                }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Diagnostic Report</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Generated on {report.date}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <ScoreRing score={report.overallScore} color="var(--accent-gold)" size={64} strokeWidth={4} />
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health Score</span>
                  </div>
                </GlassCard>

                {/* Detailed Metrics Staggered Reveal */}
                <motion.div
                  variants={diagnosticContainer}
                  initial="hidden"
                  animate="show"
                  className="metrics-grid"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
                >
                  {/* Skin Hydration Card */}
                  <motion.div variants={diagnosticCardVariant}>
                    <GlassCard hover={false} style={{ display: 'flex', gap: '16px', padding: '20px', alignItems: 'center', height: '100%' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)' }}>
                          <Smile size={16} />
                          <h4 style={{ fontWeight: 600, fontSize: '14.5px', fontFamily: 'var(--font-serif)' }}>Skin Hydration</h4>
                        </div>
                        <span className="badge badge-verified" style={{ fontSize: '10px' }}>
                          {report.metrics.skinCondition.label}
                        </span>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '4px' }}>
                          {report.metrics.skinCondition.details}
                        </p>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        <ScoreRing score={report.metrics.skinCondition.score} color="var(--accent-gold)" size={56} />
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Face Architecture Card */}
                  <motion.div variants={diagnosticCardVariant}>
                    <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', alignItems: 'flex-start', height: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)' }}>
                        <Heart size={16} />
                        <h4 style={{ fontWeight: 600, fontSize: '14.5px', fontFamily: 'var(--font-serif)' }}>Face Architecture</h4>
                      </div>
                      <span className="badge badge-ai" style={{ fontSize: '10px' }}>
                        {report.metrics.faceShape.label}
                      </span>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '4px' }}>
                        {report.metrics.faceShape.details}
                      </p>
                    </GlassCard>
                  </motion.div>

                  {/* Hair Cuticle Health Card */}
                  <motion.div variants={diagnosticCardVariant}>
                    <GlassCard hover={false} style={{ display: 'flex', gap: '16px', padding: '20px', alignItems: 'center', height: '100%' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                          <Scissors size={16} />
                          <h4 style={{ fontWeight: 600, fontSize: '14.5px', fontFamily: 'var(--font-serif)' }}>Hair Cuticle Health</h4>
                        </div>
                        <span className="badge badge-pending" style={{ fontSize: '10px' }}>
                          {report.metrics.hairTexture.label}
                        </span>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '4px' }}>
                          {report.metrics.hairTexture.details}
                        </p>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        <ScoreRing score={report.metrics.hairTexture.score} color="var(--accent-rose)" size={56} />
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Undertone Glow Card */}
                  <motion.div variants={diagnosticCardVariant}>
                    <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '20px', alignItems: 'flex-start', height: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)' }}>
                        <Sparkles size={16} />
                        <h4 style={{ fontWeight: 600, fontSize: '14.5px', fontFamily: 'var(--font-serif)' }}>Undertone Glow</h4>
                      </div>
                      <span className="badge badge-verified" style={{ fontSize: '10px' }}>
                        {report.metrics.styleSuitability.label}
                      </span>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.5', marginTop: '4px' }}>
                        {report.metrics.styleSuitability.details}
                      </p>
                    </GlassCard>
                  </motion.div>
                </motion.div>

                {/* Recommendations */}
                <motion.div variants={diagnosticCardVariant}>
                  <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Clinical Routine Advice</h3>
                    <ul style={{ paddingLeft: '20px', fontSize: '13.5px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {report.recommendations.map((rec, i) => (
                        <li key={i} style={{ listStyleType: 'circle', paddingLeft: '4px' }}>{rec}</li>
                      ))}
                    </ul>
                  </GlassCard>
                </motion.div>

                {/* Service Recommendations Link */}
                <motion.div variants={diagnosticCardVariant}>
                  <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>Recommended Salon Treatments</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {report.suggestedServices.map((srvName, idx) => (
                        <motion.div
                          key={idx}
                          onClick={() => setCurrentView('marketplace')}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '14px 20px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13.5px'
                          }}
                          whileHover={{ borderColor: 'var(--accent-gold)', backgroundColor: 'rgba(197, 168, 128, 0.02)', x: 4 }}
                          transition={{ duration: DURATION.fast, ease: EASING.subtle }}
                        >
                          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{srvName}</span>
                          <span style={{ color: 'var(--accent-gold)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Find Artist <Plus size={14} />
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
};

export default AIBeautyScan;
