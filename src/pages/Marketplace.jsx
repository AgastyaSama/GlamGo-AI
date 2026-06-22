/* eslint-disable no-unused-vars */
import { useContext, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import RatingStars from '../components/RatingStars';
import MatchScore from '../components/MatchScore';
import UserAvatar from '../components/UserAvatar';
import { calculateMatchScore } from '../services/ai';
import { staggerContainer, staggerChild, btnPrimaryHoverProps, btnSecondaryHoverProps, pillHoverProps, DURATION, EASING } from '../styles/motion';
import { Search, MapPin, Sparkles, Briefcase, Clock } from 'lucide-react';

const normalizeString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, ""); // removes spaces, &, punctuation
};

const matchCategory = (cat1, cat2) => {
  const norm1 = normalizeString(cat1);
  const norm2 = normalizeString(cat2);
  return norm1.includes(norm2) || norm2.includes(norm1);
};

const Marketplace = ({ setCurrentView, setSelectedProId }) => {
  const { professionals, users, services, selectedCity, setSelectedCity } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Makeup", "Hair Styling", "Nails", "Facials", "MedSpa", "Laser & Skin Care"];

  // Maintain separate variables as requested:
  // allProfessionals represents the original source data, which is never mutated.
  const allProfessionals = professionals;

  // Filter professionals list using correct step-by-step data flow:
  // original data -> category filter -> search filter -> render cards
  const filteredProfessionals = useMemo(() => {
    let result = allProfessionals;

    // 1. Filter by location / city
    result = result.filter(pro => {
      const userDetails = users.find(u => u.id === pro.id);
      return userDetails && userDetails.location === selectedCity;
    });

    // 2. Category Filter (normalized)
    if (selectedCategory !== "All") {
      result = result.filter(pro => {
        const targetCategory = selectedCategory;

        // Check if specialty contains the category
        const hasSpecialty = pro.specialty && pro.specialty.some(spec =>
          matchCategory(spec, targetCategory)
        );

        // Check if any service category matches
        const proServices = services.filter(s => s.professionalId === pro.id);
        const hasService = proServices.some(s => s.category &&
          matchCategory(s.category, targetCategory)
        );

        return hasSpecialty || hasService;
      });
    }

    // 3. Search Filter (runs on category-filtered result)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(pro => {
        const userDetails = users.find(u => u.id === pro.id);
        if (!userDetails) return false;

        const matchesName = userDetails.name.toLowerCase().includes(query);
        const matchesBio = pro.biography.toLowerCase().includes(query);
        const matchesSpec = pro.specialty.some(s => s.toLowerCase().includes(query));
        return matchesName || matchesBio || matchesSpec;
      });
    }

    // Map match score and sort results
    return result.map(pro => {
      const categoryFilters = selectedCategory !== "All" ? [selectedCategory] : [];
      const matchScore = calculateMatchScore(pro, categoryFilters);
      return { ...pro, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [allProfessionals, users, services, selectedCity, selectedCategory, searchQuery]);

  const recommendedProfessionals = useMemo(() => {
    const categoryFilters = selectedCategory !== "All" ? [selectedCategory] : [];
    return allProfessionals
      .filter(pro => {
        const userDetails = users.find(u => u.id === pro.id);
        return userDetails && userDetails.location === selectedCity && pro.verified !== false;
      })
      .map(pro => {
        const matchScore = calculateMatchScore(pro, categoryFilters);
        return { ...pro, matchScore };
      })
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [allProfessionals, users, selectedCity, selectedCategory]);

  const renderProfessionalCard = (pro, isStaggered = true) => {
    const user = users.find(u => u.id === pro.id);
    const cardContent = (
      <GlassCard
        onClick={() => {
          setSelectedProId(pro.id);
          setCurrentView('professionalProfile');
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          minHeight: '520px',
          position: 'relative',
          overflow: 'hidden',
          padding: '24px',
          boxSizing: 'border-box',
          cursor: 'pointer'
        }}
      >
        {/* Top Section */}
        <div>
          {/* Match Score Badge absolute top right */}
          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <MatchScore score={pro.matchScore} />
          </div>

          {/* Centered Profile Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
            <UserAvatar
              user={user}
              size={80}
              style={{
                border: '2px solid var(--accent-gold)',
                boxShadow: '0 4px 12px rgba(197, 168, 128, 0.2)'
              }}
            />

            <h3 style={{
              fontSize: '20px',
              fontWeight: 600,
              fontFamily: 'var(--font-serif)',
              marginTop: '16px',
              marginBottom: '4px',
              textAlign: 'center',
              color: 'var(--text-primary)'
            }}>
              {user?.name}
            </h3>

            <p style={{
              color: 'var(--text-muted)',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '8px'
            }}>
              <MapPin size={10} color="var(--accent-gold)" /> {selectedCity}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <RatingStars rating={pro.rating} count={pro.reviewCount} />
            </div>
          </div>

          {/* Divider line */}
          <div style={{ height: '1px', background: 'var(--border-light)', margin: '18px 0' }} />

          {/* Professional biography / description */}
          <p style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            textAlign: 'center',
            margin: '0 0 16px 0',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '65px'
          }}>
            {pro.biography}
          </p>

          {/* Tags (Specialties) */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            justifyContent: 'center',
            minHeight: '52px',
            alignContent: 'flex-start',
            marginBottom: '16px'
          }}>
            {pro.specialty.map(spec => (
              <span
                key={spec}
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500
                }}
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom section with specs & button */}
        <div>
          {/* Specifications grid */}
          <div style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rate Starts At</span>
              <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>₹{pro.hourlyRate}/hr</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience</span>
              <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>{pro.experienceYears} Years</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Response</span>
              <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>{pro.responseTimeMinutes} min</span>
            </div>
          </div>

          {/* View Profile CTA Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProId(pro.id);
              setCurrentView('professionalProfile');
            }}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px 0',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600
            }}
            {...btnPrimaryHoverProps}
          >
            View Profile & Services
          </motion.button>
        </div>
      </GlassCard>
    );

    if (isStaggered) {
      return (
        <motion.div key={pro.id} variants={staggerChild} style={{ height: '100%' }}>
          {cardContent}
        </motion.div>
      );
    }
    return (
      <div key={pro.id} style={{ height: '100%' }}>
        {cardContent}
      </div>
    );
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 81px)', padding: '60px 0' }} className="bg-gradient-radial">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

        {/* Elegant Boutique Banner — scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          transition={{ duration: DURATION.slow, ease: EASING.luxury }}
        >
          <GlassCard
            hover={false}
            className="mobile-stack-flex"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-2xl) var(--space-2xl)',
              gap: 'var(--space-xl)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span className="badge badge-ai" style={{ alignSelf: 'flex-start' }}>Aesthetic Curator Active</span>
              <h2 style={{ fontSize: '26px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Bespoke Consultation Services</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '620px', lineHeight: '1.6' }}>
                Consult our concierge specialist to curate a tailored beauty ritual matching your style preferences and scheduling.
              </p>
            </div>
            <motion.button
              onClick={() => setCurrentView('chatConcierge')}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '13px', flexShrink: 0 }}
              {...btnPrimaryHoverProps}
            >
              Consult AI Concierge <Sparkles size={14} />
            </motion.button>
          </GlassCard>
        </motion.div>

        {/* Filters Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Elite Professionals in {selectedCity}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginTop: '4px' }}>
              Showing {filteredProfessionals.length} verified boutique partners.
            </p>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Search Field */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by stylist, specialized treatment, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '40px', borderBottom: '1px solid var(--border-dark)', fontSize: '14.5px' }}
            />
          </div>

          {/* City Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(28, 28, 28, 0.015)',
            border: '1px solid var(--border-light)',
            borderRadius: '6px',
            padding: '6px 16px'
          }}>
            <MapPin size={14} color="var(--accent-gold)" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '13px' }}
            >
              <option value="Pune" style={{ background: 'var(--bg-secondary)' }}>Pune</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', overflowX: 'auto', paddingBottom: 'var(--space-sm)' }}>
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="category-pill"
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'var(--accent-gold)' : 'var(--border-light)',
                background: selectedCategory === cat ? 'var(--accent-gold)' : 'rgba(28, 28, 28, 0.015)',
                color: selectedCategory === cat ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-display)',
                transition: 'border-color 0.2s, background-color 0.2s, color 0.2s'
              }}
              {...pillHoverProps}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Professionals List Grid — staggered entrance */}
        {filteredProfessionals.length > 0 && (
          <motion.div
            key={selectedCategory + "_" + searchQuery}
            variants={staggerContainer(0.08, 0.05)}
            initial="initial"
            animate="animate"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '32px'
            }}
          >
            {filteredProfessionals.map((pro) => renderProfessionalCard(pro, true))}
          </motion.div>
        )}

        {filteredProfessionals.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', width: '100%', marginTop: '20px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: EASING.luxury }}
              style={{ width: '100%', maxWidth: '580px', margin: '0 auto' }}
            >
              <GlassCard
                hover={false}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 32px',
                  textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  border: '1px dashed var(--accent-gold)',
                  borderRadius: '8px',
                  boxShadow: 'var(--glass-shadow)'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(197, 168, 128, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  border: '1px solid rgba(197, 168, 128, 0.25)'
                }}>
                  <Search size={24} color="var(--accent-gold)" />
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}>
                  No professionals found
                </h3>
                <p style={{
                  fontSize: '13.5px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  marginBottom: '20px',
                  maxWidth: '380px'
                }}>
                  We couldn't find matches for "{selectedCategory !== 'All' ? selectedCategory : ''}" {searchQuery ? `matching "${searchQuery}"` : ''} in {selectedCity}.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <motion.button
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                    className="btn-secondary"
                    style={{
                      padding: '10px 20px',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600
                    }}
                    {...btnSecondaryHoverProps}
                  >
                    Reset Filters
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentView('chatConcierge')}
                    className="btn-primary"
                    style={{
                      padding: '10px 20px',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600
                    }}
                    {...btnPrimaryHoverProps}
                  >
                    Ask AI Concierge <Sparkles size={12} />
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Recommended Styling Partners */}
            {recommendedProfessionals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '32px', textAlign: 'center' }}>
                  <span className="badge badge-verified" style={{ marginBottom: '8px' }}>Expert Selection</span>
                  <h3 style={{ fontSize: '22px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>
                    Top-Rated Partners in {selectedCity}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginTop: '4px' }}>
                    These certified artists are highly recommended and available for booking
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '32px',
                  marginTop: '12px'
                }}>
                  {recommendedProfessionals.map((pro) => renderProfessionalCard(pro, false))}
                </div>
              </motion.div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Marketplace;
