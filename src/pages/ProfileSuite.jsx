/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars */
import { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import UserAvatar from '../components/UserAvatar';
import GlassCard from '../components/GlassCard';
import { pageVariants, btnPrimaryHoverProps, btnSecondaryHoverProps, tabHoverProps } from '../styles/motion';
import { ArrowLeft, Camera, User, FileText, Settings, Shield, Plus, Trash2, Check, X, Calendar, MapPin, Mail, Phone, Clock, Award, Briefcase } from 'lucide-react';

const ProfileSuite = ({ setCurrentView }) => {
  const { currentUser, updateUserData, showToast } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('personal');

  // Form edit states
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingRoleData, setIsEditingRoleData] = useState(false);

  // Form temporary values
  const [tempFullName, setTempFullName] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempPhone, setTempPhone] = useState('');
  const [tempDob, setTempDob] = useState('');
  const [tempGender, setTempGender] = useState('Female');
  const [tempLocation, setTempLocation] = useState('');

  // Role based temporary values: Customer
  const [tempSkinType, setTempSkinType] = useState('Normal');
  const [tempHairType, setTempHairType] = useState('Normal');
  const [tempFocus, setTempFocus] = useState('General Maintenance');
  const [tempProductPref, setTempProductPref] = useState('None');
  const [tempAddress, setTempAddress] = useState('');
  const [tempSavedSalons, setTempSavedSalons] = useState('');

  // Role based temporary values: Professional
  const [tempBusinessName, setTempBusinessName] = useState('');
  const [tempProTitle, setTempProTitle] = useState('');
  const [tempExperience, setTempExperience] = useState(5);
  const [tempWorkingHours, setTempWorkingHours] = useState('');
  const [tempCertifications, setTempCertifications] = useState('');
  const [tempServicesOffered, setTempServicesOffered] = useState([]);

  // Cropper States
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadedImageSrc, setUploadedImageSrc] = useState(null);
  const [cropZoom, setCropZoom] = useState(1.0);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

  // Sync temp values when currentUser changes or editing is toggled
  useEffect(() => {
    if (currentUser) {
      setTempFullName(currentUser.fullName || currentUser.name || '');
      setTempUsername(currentUser.username || '');
      setTempEmail(currentUser.email || '');
      setTempPhone(currentUser.phone || '');
      setTempDob(currentUser.profile?.dob || '');
      setTempGender(currentUser.profile?.gender || 'Female');
      setTempLocation(currentUser.location || currentUser.profile?.location || 'Pune');

      // Customer specific sync
      const prefs = currentUser.profile?.preferences || {};
      setTempSkinType(prefs.skinType || 'Normal');
      setTempHairType(prefs.hairType || 'Normal');
      setTempFocus(prefs.focus || 'General Maintenance');
      setTempProductPref(prefs.productPref || 'None');
      setTempAddress(prefs.address || '');
      setTempSavedSalons(prefs.savedSalons || '');

      // Professional specific sync
      setTempBusinessName(currentUser.profile?.businessName || '');
      setTempProTitle(currentUser.profile?.professionalTitle || 'Partner Stylist');
      setTempExperience(currentUser.profile?.experienceYears || 5);
      setTempWorkingHours(currentUser.dashboardData?.schedule?.hours || '10:00 AM - 06:00 PM');
      setTempCertifications(currentUser.profile?.certifications || '');
      setTempServicesOffered(currentUser.profile?.servicesOffered || ['Hair Styling']);
    }
  }, [currentUser, isEditingInfo, isEditingRoleData]);

  // Canvas Drawing Effect
  useEffect(() => {
    if (showCropModal && uploadedImageSrc && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = uploadedImageSrc;
      img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate dimensions to fit and crop centered
        const minDim = Math.min(img.width, img.height);
        const drawWidth = (img.width / minDim) * canvas.width * cropZoom;
        const drawHeight = (img.height / minDim) * canvas.height * cropZoom;

        // Offset coordinates
        const x = (canvas.width - drawWidth) / 2 + cropX;
        const y = (canvas.height - drawHeight) / 2 + cropY;

        // Fill canvas background
        ctx.fillStyle = '#FCFBF7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      };
    }
  }, [showCropModal, uploadedImageSrc, cropZoom, cropX, cropY]);

  if (!currentUser) return null;

  // Actions
  const handleSavePersonalInfo = () => {
    if (!tempFullName.trim()) {
      showToast('Full Name cannot be empty.', 'error');
      return;
    }
    if (!tempEmail.trim() || !tempEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    const updatedFields = {
      fullName: tempFullName,
      name: tempFullName, // compatibility alias
      username: tempUsername.trim() || tempFullName.toLowerCase().replace(/\s+/g, '_'),
      email: tempEmail.trim(),
      phone: tempPhone.trim(),
      location: tempLocation.trim(),
      profile: {
        ...currentUser.profile,
        gender: tempGender,
        dob: tempDob,
        location: tempLocation.trim()
      }
    };

    updateUserData(currentUser.id, updatedFields);
    setIsEditingInfo(false);
  };

  const handleSaveRoleData = () => {
    let updatedFields = {};

    if (currentUser.role === 'customer') {
      updatedFields = {
        profile: {
          ...currentUser.profile,
          preferences: {
            skinType: tempSkinType,
            hairType: tempHairType,
            focus: tempFocus,
            productPref: tempProductPref,
            address: tempAddress,
            savedSalons: tempSavedSalons
          }
        },
        dashboardData: {
          ...currentUser.dashboardData,
          preferences: {
            skinType: tempSkinType,
            hairType: tempHairType,
            focus: tempFocus,
            productPref: tempProductPref
          }
        }
      };
    } else if (currentUser.role === 'professional') {
      updatedFields = {
        profile: {
          ...currentUser.profile,
          businessName: tempBusinessName,
          professionalTitle: tempProTitle,
          experienceYears: parseInt(tempExperience, 10) || 5,
          certifications: tempCertifications,
          servicesOffered: tempServicesOffered
        },
        dashboardData: {
          ...currentUser.dashboardData,
          schedule: {
            ...currentUser.dashboardData?.schedule,
            hours: tempWorkingHours
          }
        }
      };
    }

    updateUserData(currentUser.id, updatedFields);
    setIsEditingRoleData(false);
  };

  const handleAvatarFileSelection = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImageSrc(event.target.result);
      setCropZoom(1.0);
      setCropX(0);
      setCropY(0);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCroppedAvatar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const base64Data = canvas.toDataURL('image/jpeg', 0.85);
    updateUserData(currentUser.id, {
      avatarUrl: base64Data,
      avatar: base64Data // compatibility alias
    });
    setShowCropModal(false);
    setUploadedImageSrc(null);
  };

  const handleRemoveAvatar = () => {
    if (confirm('Are you sure you want to reset your profile picture to the initials avatar?')) {
      updateUserData(currentUser.id, {
        avatarUrl: '',
        avatar: '' // compatibility alias
      });
    }
  };

  // Add Portfolio Image for Professionals
  const handlePortfolioFileSelection = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      const currentPortfolio = currentUser.profile?.portfolio || [];
      const updatedPortfolio = [...currentPortfolio, base64];

      updateUserData(currentUser.id, {
        profile: {
          ...currentUser.profile,
          portfolio: updatedPortfolio
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePortfolioItem = (indexToDelete) => {
    if (confirm('Remove this portfolio image from your profile?')) {
      const currentPortfolio = currentUser.profile?.portfolio || [];
      const updatedPortfolio = currentPortfolio.filter((_, idx) => idx !== indexToDelete);

      updateUserData(currentUser.id, {
        profile: {
          ...currentUser.profile,
          portfolio: updatedPortfolio
        }
      });
    }
  };

  const toggleSpecialtySelection = (specialty) => {
    setTempServicesOffered(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const getDashboardViewName = () => {
    if (currentUser.role === 'customer') return 'customerDashboard';
    if (currentUser.role === 'professional') return 'professionalDashboard';
    return 'adminDashboard';
  };

  return (
    <motion.div
      className="page-container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        minHeight: 'calc(100vh - 81px)'
      }}
    >
      {/* Header back bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.button
          onClick={() => setCurrentView(getDashboardViewName())}
          className="btn-secondary"
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          {...btnSecondaryHoverProps}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </motion.button>
        <h1 style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>
          Profile Suite
        </h1>
      </div>

      {/* Grid Layout */}
      <div className="mobile-stack-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>

        {/* Left Side: Avatar Control & Tab Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Avatar Panel */}
          <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
              <div
                style={{
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid rgba(197, 168, 128, 0.4)',
                  boxShadow: '0 4px 20px rgba(197, 168, 128, 0.15)'
                }}
                className="profile-suite-avatar-wrapper"
              >
                <UserAvatar user={currentUser} size={120} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  borderRadius: '50%',
                  padding: '6px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Camera size={14} />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>{currentUser.fullName}</h3>
              <p style={{ fontSize: '10px', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginTop: '4px' }}>
                {currentUser.role}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Member since {new Date(currentUser.createdAt || 1719014400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarFileSelection}
              style={{ display: 'none' }}
              accept="image/*"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '8px' }}>
              <motion.button
                onClick={() => fileInputRef.current.click()}
                className="btn-primary"
                style={{ width: '100%', padding: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                {...btnPrimaryHoverProps}
              >
                Upload Photo
              </motion.button>
              {currentUser.avatarUrl && (
                <motion.button
                  onClick={handleRemoveAvatar}
                  className="btn-secondary"
                  style={{ width: '100%', padding: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-rose)', borderColor: 'var(--accent-rose)' }}
                  {...btnSecondaryHoverProps}
                >
                  Remove Photo
                </motion.button>
              )}
            </div>
          </GlassCard>

          {/* Sub Navigation Tabs */}
          <GlassCard hover={false} style={{ display: 'flex', flexDirection: 'column', padding: '12px', gap: '4px' }}>
            <motion.button
              onClick={() => setActiveSubTab('personal')}
              className={`sidebar-tab ${activeSubTab === 'personal' ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                background: activeSubTab === 'personal' ? 'rgba(197, 168, 128, 0.05)' : 'transparent',
                color: activeSubTab === 'personal' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: activeSubTab === 'personal' ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: activeSubTab === 'personal' ? '3px solid var(--accent-gold)' : '3px solid transparent'
              }}
              {...tabHoverProps(activeSubTab === 'personal')}
            >
              <User size={16} /> Personal Information
            </motion.button>
            <motion.button
              onClick={() => setActiveSubTab('account')}
              className={`sidebar-tab ${activeSubTab === 'account' ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                background: activeSubTab === 'account' ? 'rgba(197, 168, 128, 0.05)' : 'transparent',
                color: activeSubTab === 'account' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: activeSubTab === 'account' ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: activeSubTab === 'account' ? '3px solid var(--accent-gold)' : '3px solid transparent'
              }}
              {...tabHoverProps(activeSubTab === 'account')}
            >
              <Settings size={16} /> Account Information
            </motion.button>
            <motion.button
              onClick={() => setActiveSubTab('roleData')}
              className={`sidebar-tab ${activeSubTab === 'roleData' ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: 'none',
                background: activeSubTab === 'roleData' ? 'rgba(197, 168, 128, 0.05)' : 'transparent',
                color: activeSubTab === 'roleData' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontSize: '13.5px',
                fontWeight: activeSubTab === 'roleData' ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: activeSubTab === 'roleData' ? '3px solid var(--accent-gold)' : '3px solid transparent'
              }}
              {...tabHoverProps(activeSubTab === 'roleData')}
            >
              <FileText size={16} /> {currentUser.role === 'customer' ? 'Beauty Preferences' : currentUser.role === 'professional' ? 'Stylist Details' : 'Admin Permissions'}
            </motion.button>
            {currentUser.role === 'professional' && (
              <motion.button
                onClick={() => setActiveSubTab('portfolio')}
                className={`sidebar-tab ${activeSubTab === 'portfolio' ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeSubTab === 'portfolio' ? 'rgba(197, 168, 128, 0.05)' : 'transparent',
                  color: activeSubTab === 'portfolio' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontSize: '13.5px',
                  fontWeight: activeSubTab === 'portfolio' ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderLeft: activeSubTab === 'portfolio' ? '3px solid var(--accent-gold)' : '3px solid transparent'
                }}
                {...tabHoverProps(activeSubTab === 'portfolio')}
              >
                <Briefcase size={16} /> Portfolio Gallery
              </motion.button>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Tab View Content panels */}
        <div style={{ flex: 1 }}>

          {/* TAB: PERSONAL INFORMATION */}
          {activeSubTab === 'personal' && (
            <GlassCard hover={false} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Personal Information</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Update your core personal contact details</p>
                </div>
                {!isEditingInfo ? (
                  <motion.button
                    onClick={() => setIsEditingInfo(true)}
                    className="btn-primary"
                    style={{ padding: '8px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    {...btnPrimaryHoverProps}
                  >
                    Edit Details
                  </motion.button>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button
                      onClick={() => setIsEditingInfo(false)}
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      {...btnSecondaryHoverProps}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSavePersonalInfo}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)', color: 'var(--text-primary)' }}
                      {...btnPrimaryHoverProps}
                    >
                      Save Changes
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Personal Fields Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

                {/* Full Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Full Name</label>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      className="input-field"
                      value={tempFullName}
                      onChange={(e) => setTempFullName(e.target.value)}
                    />
                  ) : (
                    <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.fullName}</p>
                  )}
                </div>

                {/* Username */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Username</label>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      className="input-field"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                    />
                  ) : (
                    <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>@{currentUser.username}</p>
                  )}
                </div>

                {/* Email Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</label>
                  {isEditingInfo ? (
                    <input
                      type="email"
                      className="input-field"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                    />
                  ) : (
                    <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Phone Number</label>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      className="input-field"
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                    />
                  ) : (
                    <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.phone || "Not Configured"}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Date of Birth</label>
                  {isEditingInfo ? (
                    <input
                      type="date"
                      className="input-field"
                      value={tempDob}
                      onChange={(e) => setTempDob(e.target.value)}
                    />
                  ) : (
                    <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.profile?.dob || "Not Provided"}</p>
                  )}
                </div>

                {/* Gender */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Gender</label>
                  {isEditingInfo ? (
                    <select
                      className="input-field"
                      value={tempGender}
                      onChange={(e) => setTempGender(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : (
                    <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.profile?.gender || "Not Specified"}</p>
                  )}
                </div>

                {/* Location */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Service Location</label>
                  {isEditingInfo ? (
                    <input
                      type="text"
                      className="input-field"
                      value={tempLocation}
                      onChange={(e) => setTempLocation(e.target.value)}
                    />
                  ) : (
                    <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.location || "Pune"}</p>
                  )}
                </div>

              </div>
            </GlassCard>
          )}

          {/* TAB: ACCOUNT INFORMATION */}
          {activeSubTab === 'account' && (
            <GlassCard hover={false} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Account Information</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Inspect system records and access metadata</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Account Type:</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--accent-gold)', letterSpacing: '0.05em' }}>{currentUser.role}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Email Verification:</span>
                  <span style={{ fontSize: '13.5px', color: '#6A994E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Shield size={14} /> Verified via GlamGo Crypt ID ✓
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Account Created Date:</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {new Date(currentUser.createdAt || 1719014400000).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Identity Provider:</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-primary)' }}>GlamGo Secure Credential ID</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* TAB: ROLE BASED PREFERENCES */}
          {activeSubTab === 'roleData' && (
            <GlassCard hover={false} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>
                    {currentUser.role === 'customer' ? 'Beauty Preferences & Saved Salons' : currentUser.role === 'professional' ? 'Stylist Business Catalog Details' : 'Administrator Capabilities'}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {currentUser.role === 'customer' ? 'Configure skin/hair diagnostics and notes' : currentUser.role === 'professional' ? 'Manage rates, schedule, and certifications' : 'Security permissions dashboard'}
                  </p>
                </div>

                {currentUser.role !== 'admin' && (
                  !isEditingRoleData ? (
                    <motion.button
                      onClick={() => setIsEditingRoleData(true)}
                      className="btn-primary"
                      style={{ padding: '8px 20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      {...btnPrimaryHoverProps}
                    >
                      Edit Settings
                    </motion.button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <motion.button
                        onClick={() => setIsEditingRoleData(false)}
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        {...btnSecondaryHoverProps}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={handleSaveRoleData}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)', color: 'var(--text-primary)' }}
                        {...btnPrimaryHoverProps}
                      >
                        Save Changes
                      </motion.button>
                    </div>
                  )
                )}
              </div>

              {/* CUSTOMER CUSTOM VIEW */}
              {currentUser.role === 'customer' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

                  {/* Skin Type */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Skin Type</label>
                    {isEditingRoleData ? (
                      <select
                        className="input-field"
                        value={tempSkinType}
                        onChange={(e) => setTempSkinType(e.target.value)}
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="Dry">Dry</option>
                        <option value="Dry & Sensitive">Dry & Sensitive</option>
                        <option value="Oily">Oily</option>
                        <option value="Oily & Acne-Prone">Oily & Acne-Prone</option>
                        <option value="Combination">Combination</option>
                        <option value="Normal">Normal</option>
                        <option value="Sensitive">Sensitive</option>
                      </select>
                    ) : (
                      <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.profile?.preferences?.skinType || "Normal"}</p>
                    )}
                  </div>

                  {/* Hair Type */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Hair Profile Type</label>
                    {isEditingRoleData ? (
                      <select
                        className="input-field"
                        value={tempHairType}
                        onChange={(e) => setTempHairType(e.target.value)}
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Thick, Straight">Thick, Straight</option>
                        <option value="Fine, Thin">Fine, Thin</option>
                        <option value="Dry, Wavy">Dry, Wavy</option>
                        <option value="Color-Treated, Wavy">Color-Treated, Wavy</option>
                        <option value="Curly, Textured">Curly, Textured</option>
                      </select>
                    ) : (
                      <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.profile?.preferences?.hairType || "Normal"}</p>
                    )}
                  </div>

                  {/* Beauty Focus Goal */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>AI Beauty Focus Goal</label>
                    {isEditingRoleData ? (
                      <input
                        type="text"
                        className="input-field"
                        value={tempFocus}
                        onChange={(e) => setTempFocus(e.target.value)}
                      />
                    ) : (
                      <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.profile?.preferences?.focus || "General Maintenance"}</p>
                    )}
                  </div>

                  {/* Product Preferences */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Product Preferences</label>
                    {isEditingRoleData ? (
                      <input
                        type="text"
                        className="input-field"
                        value={tempProductPref}
                        onChange={(e) => setTempProductPref(e.target.value)}
                      />
                    ) : (
                      <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.profile?.preferences?.productPref || "None"}</p>
                    )}
                  </div>

                  {/* Saved Salons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Saved Salons / Favorites</label>
                    {isEditingRoleData ? (
                      <input
                        type="text"
                        className="input-field"
                        value={tempSavedSalons}
                        onChange={(e) => setTempSavedSalons(e.target.value)}
                        placeholder="e.g. Salon Luxe Pune, Glam Studio"
                      />
                    ) : (
                      <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.profile?.preferences?.savedSalons || "None Saved"}</p>
                    )}
                  </div>

                  {/* Personal Delivery Address */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Personal Delivery Address</label>
                    {isEditingRoleData ? (
                      <textarea
                        rows={3}
                        className="input-field"
                        value={tempAddress}
                        onChange={(e) => setTempAddress(e.target.value)}
                        style={{ resize: 'vertical' }}
                      />
                    ) : (
                      <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{currentUser.profile?.preferences?.address || "No Address Saved"}</p>
                    )}
                  </div>

                </div>
              )}

              {/* PROFESSIONAL CUSTOM VIEW */}
              {currentUser.role === 'professional' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

                  {/* Business Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Business Name</label>
                    {isEditingRoleData ? (
                      <input
                        type="text"
                        className="input-field"
                        value={tempBusinessName}
                        onChange={(e) => setTempBusinessName(e.target.value)}
                      />
                    ) : (
                      <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.profile?.businessName || "Independent Stylist Studio"}</p>
                    )}
                  </div>

                  {/* Professional Title */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Professional Title</label>
                    {isEditingRoleData ? (
                      <input
                        type="text"
                        className="input-field"
                        value={tempProTitle}
                        onChange={(e) => setTempProTitle(e.target.value)}
                      />
                    ) : (
                      <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.profile?.professionalTitle || "Partner Stylist"}</p>
                    )}
                  </div>

                  {/* Experience Years */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Experience (Years)</label>
                    {isEditingRoleData ? (
                      <input
                        type="number"
                        className="input-field"
                        value={tempExperience}
                        onChange={(e) => setTempExperience(e.target.value)}
                      />
                    ) : (
                      <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.profile?.experienceYears || 5} Years</p>
                    )}
                  </div>

                  {/* Working Hours */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Working Hours</label>
                    {isEditingRoleData ? (
                      <input
                        type="text"
                        className="input-field"
                        value={tempWorkingHours}
                        onChange={(e) => setTempWorkingHours(e.target.value)}
                      />
                    ) : (
                      <p style={{ fontSize: '14.5px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentUser.dashboardData?.schedule?.hours || "10:00 AM - 06:00 PM"}</p>
                    )}
                  </div>

                  {/* Services offered checkboxes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', gridColumn: '1 / -1', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Specialty Scope (Services Offered)</label>
                    {isEditingRoleData ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {["Hair Styling", "Facials", "Makeup", "Nails", "MedSpa", "Laser & Skin Care", "Bridal Specialist"].map((spec) => {
                          const isSelected = tempServicesOffered.includes(spec);
                          return (
                            <div
                              key={spec}
                              onClick={() => toggleSpecialtySelection(spec)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: '6px',
                                border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-light)',
                                background: isSelected ? 'rgba(197, 168, 128, 0.05)' : 'transparent',
                                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              {spec} {isSelected && '✓'}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(currentUser.profile?.servicesOffered || ["Hair Styling"]).map(s => (
                          <span key={s} className="badge badge-ai" style={{ fontSize: '11px', padding: '4px 10px' }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certifications and Licences */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Certifications & Licences</label>
                    {isEditingRoleData ? (
                      <textarea
                        rows={3}
                        className="input-field"
                        value={tempCertifications}
                        onChange={(e) => setTempCertifications(e.target.value)}
                        placeholder="e.g. CIDESCO Certified Skin Therapist, L'Oreal Hair Coloring Expert Diploma"
                        style={{ resize: 'vertical' }}
                      />
                    ) : (
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{currentUser.profile?.certifications || "No Certifications Saved"}</p>
                    )}
                  </div>

                </div>
              )}

              {/* ADMIN CUSTOM VIEW */}
              {currentUser.role === 'admin' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>System Control Profile Access</span>
                    <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontWeight: 600 }}>Regional Super Administrator</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Security Privileges & Capability Keys</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                      {["Audit Database Engine", "Verify Marketplace Providers", "Global Session Disconnection", "System Configuration Write", "Reset Seed Database States"].map(perm => (
                        <span key={perm} className="badge badge-verified" style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(110, 163, 78, 0.05)', color: '#4B7B34', border: '1px solid rgba(110, 163, 78, 0.2)' }}>
                          🛡️ {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          )}

          {/* TAB: PORTFOLIO IMAGES (PROFESSIONAL ONLY) */}
          {activeSubTab === 'portfolio' && currentUser.role === 'professional' && (
            <GlassCard hover={false} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Portfolio Gallery</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Manage visual styling portfolios displayed to clients on the marketplace</p>
                </div>

                <motion.button
                  onClick={() => portfolioInputRef.current.click()}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}
                  {...btnPrimaryHoverProps}
                >
                  <Plus size={14} /> Add Image
                </motion.button>
              </div>

              <input
                type="file"
                ref={portfolioInputRef}
                onChange={handlePortfolioFileSelection}
                style={{ display: 'none' }}
                accept="image/*"
              />

              {/* Portfolio Grid */}
              {currentUser.profile?.portfolio && currentUser.profile.portfolio.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                  {currentUser.profile.portfolio.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        aspectRatio: '1/1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-light)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                      }}
                      className="portfolio-gallery-item"
                    >
                      <img
                        src={img}
                        alt={`Portfolio item ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      {/* Delete Overlay button */}
                      <button
                        onClick={() => handleDeletePortfolioItem(idx)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(28,28,28,0.7)',
                          color: '#FCFBF7',
                          border: 'none',
                          borderRadius: '50%',
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#A04E4E'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(28,28,28,0.7)'}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0', border: '1px dashed var(--border-light)', borderRadius: '6px' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>No styling images added to your portfolio yet.</p>
                  <motion.button
                    onClick={() => portfolioInputRef.current.click()}
                    className="btn-secondary"
                    style={{ marginTop: '16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    {...btnSecondaryHoverProps}
                  >
                    Select files to upload
                  </motion.button>
                </div>
              )}
            </GlassCard>
          )}

        </div>

      </div>

      {/* CROP & RESIZE PHOTO MODAL */}
      <AnimatePresence>
        {showCropModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(28, 28, 28, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                width: '100%',
                maxWidth: '450px',
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(197, 168, 128, 0.3)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-luxury)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>Adjust Profile Photo</h3>
                <button
                  onClick={() => { setShowCropModal(false); setUploadedImageSrc(null); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Canvas Preview Circle */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                <div style={{
                  width: '202px',
                  height: '202px',
                  borderRadius: '50%',
                  border: '1px solid var(--accent-gold)',
                  boxShadow: '0 4px 15px rgba(197, 168, 128, 0.15)',
                  overflow: 'hidden',
                  background: '#FCFBF7'
                }}>
                  <canvas
                    ref={canvasRef}
                    width={200}
                    height={200}
                    style={{ borderRadius: '50%' }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Zoom Scale</span>
                    <span>{cropZoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.1"
                    value={cropZoom}
                    onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-gold)', height: '4px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Horizontal Shift</span>
                    <span>{cropX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="2"
                    value={cropX}
                    onChange={(e) => setCropX(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--accent-gold)', height: '4px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Vertical Shift</span>
                    <span>{cropY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="2"
                    value={cropY}
                    onChange={(e) => setCropY(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--accent-gold)', height: '4px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <motion.button
                  onClick={() => { setShowCropModal(false); setUploadedImageSrc(null); }}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  {...btnSecondaryHoverProps}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleSaveCroppedAvatar}
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)', color: 'var(--text-primary)' }}
                  {...btnPrimaryHoverProps}
                >
                  Apply & Save
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ProfileSuite;
