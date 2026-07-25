import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';

const MUSIC_GENRES = [
  "INDIE", "CLASSICAL", "ELECTRONIC", "HOUSE", "TECHNO", "AMBIENT", 
  "FOLK", "JAZZ", "ROCK", "EXPERIMENTAL", "SUFI", "LIVE INSTRUMENTAL", "OTHER"
];

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23111111'/><circle cx='50' cy='40' r='20' fill='%23C8FF2B'/><path d='M20 90 C20 65 80 65 80 90' stroke='%23C8FF2B' stroke-width='6' fill='none'/></svg>";

export default function Onboarding() {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('edit') === 'true';

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    locality: '',
    state: '',
    pincode: '',
    nearbyAlerts: false,
    interests: [],
    latitude: null,
    longitude: null,
    avatarUrl: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/');
      return;
    }
    
    if (user.profileCompleted && !isEdit) {
      navigate('/'); // Or returnTo
      return;
    }
    
    // Fetch any existing mock data
    profileService.getProfile(user.id).then(prof => {
      if (prof) {
        setForm(prev => ({
          ...prev,
          fullName: prof.fullName || '',
          username: prof.username || '',
          dateOfBirth: prof.dateOfBirth || '',
          gender: prof.gender || '',
          city: prof.city || '',
          locality: prof.locality || '',
          state: prof.state || '',
          pincode: prof.pincode || '',
          nearbyAlerts: prof.nearbyAlerts || false,
          interests: prof.interests || [],
          latitude: prof.latitude || null,
          longitude: prof.longitude || null,
          avatarUrl: prof.avatarUrl || ''
        }));
      }
    });
  }, [user, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setForm(prev => ({ ...prev, avatarUrl: URL.createObjectURL(file) }));
    }
  };

  const toggleInterest = (genre) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(genre)
        ? prev.interests.filter(g => g !== genre)
        : [...prev.interests, genre]
    }));
  };

  const handleUseCurrentLocation = () => {
    setLoadingLoc(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: "Hyderabad (Resolved)", // mock geocoding
            pincode: "500001",
            state: "Telangana"
          }));
          setLoadingLoc(false);
        },
        (error) => {
          setLoadingLoc(false);
          alert("Location access denied or failed. Please enter location manually.");
        }
      );
    } else {
      setLoadingLoc(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const cleanFullName = form.fullName.trim() || user.name || "Tangy Member";
    const cleanUsername = form.username.trim() || (user.email ? user.email.split('@')[0] : 'member');
    const cleanDob = form.dateOfBirth || "2000-01-01";
    const cleanCity = form.city.trim() || "Hyderabad";
    const cleanPincode = form.pincode.trim() || "500001";
    const finalAvatarUrl = form.avatarUrl || DEFAULT_AVATAR;

    try {
      let avatar = finalAvatarUrl;
      if (avatarFile) {
        avatar = await profileService.uploadAvatar(user.id, avatarFile);
      }

      const updatedProfileData = {
        ...form,
        fullName: cleanFullName,
        username: cleanUsername,
        dateOfBirth: cleanDob,
        city: cleanCity,
        pincode: cleanPincode,
        avatarUrl: avatar,
        profileCompleted: true
      };

      await profileService.updateProfile(user.id, updatedProfileData);

      // Update session local storage to reflect profileCompleted
      const updatedUser = { ...user, profileCompleted: true, name: cleanFullName };
      localStorage.setItem('tangy_mock_session', JSON.stringify(updatedUser));
      if (refreshUser) refreshUser();
      
      let returnTo = sessionStorage.getItem('tangy_onboarding_return');

      if (isEdit) {
        // Edit mode: go straight back to profile, no animation
        window.location.replace('/profile');
      } else {
        // New user: show success animation then redirect
        setSuccess(true);
        setTimeout(() => {
          const returnTo = sessionStorage.getItem('tangy_onboarding_return');
          sessionStorage.removeItem('tangy_onboarding_return');
          window.location.replace(returnTo && !returnTo.includes('/onboarding') ? returnTo : '/profile');
        }, 600);
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', color: '#C8FF2B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace" }}>
        LOADING...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100svh', background: '#080808', color: '#fff',
      fontFamily: "'Space Mono', monospace", padding: '100px 5vw 80px',
      position: 'relative'
    }}>
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080808', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.h1 initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 8vw, 6rem)', color: '#C8FF2B', letterSpacing: '0.05em' }}>
              PROFILE CREATED
            </motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 20, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>
              WELCOME TO TANGY. ENTERING...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Top bar exit option */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <button type="button" onClick={() => window.location.href = '/profile'} style={{
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', 
            cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', 
            letterSpacing: '0.1em'
          }}>
            ← BACK TO PROFILE
          </button>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ color: '#C8FF2B', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: 12 }}>
            {isEdit ? 'MEMBER PROFILE' : 'WELCOME TO TANGY'}
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 7vw, 5rem)', letterSpacing: '0.05em', margin: '0 0 16px 0' }}>
            {isEdit ? 'EDIT PROFILE' : 'PROFILE SETUP'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: 500 }}>
            {isEdit ? 'Update your personal details, location, and music preferences.' : 'Your Tangy identity starts here. Before you enter, tell us a little about yourself.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          
          {/* PROFILE PHOTO */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: 32 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: 24 }}>PROFILE PICTURE</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ 
                width: 100, height: 100, borderRadius: '50%', background: '#222', 
                border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <img src={form.avatarUrl || DEFAULT_AVATAR} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <label style={{ 
                  display: 'inline-block', background: 'transparent', border: '1px solid #C8FF2B', color: '#C8FF2B', 
                  padding: '8px 16px', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.05em' 
                }}>
                  UPLOAD PHOTO
                  <input type="file" accept="image/png, image/jpeg, image/webp" style={{ display: 'none' }} onChange={handleAvatarChange} />
                </label>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>JPG, PNG, WEBP allowed.</div>
                {errors.avatarUrl && <div style={{ color: '#ff2e52', fontSize: '0.75rem', marginTop: 8 }}>{errors.avatarUrl}</div>}
              </div>
            </div>
          </div>

          {/* PERSONAL DETAILS */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: 32 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: 24 }}>PERSONAL DETAILS</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>FULL NAME *</label>
                <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} 
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 0', fontSize: '1rem', outline: 'none' }} />
                {errors.fullName && <div style={{ color: '#ff2e52', fontSize: '0.75rem', marginTop: 4 }}>{errors.fullName}</div>}
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>USERNAME *</label>
                <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} 
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 0', fontSize: '1rem', outline: 'none' }} />
                {errors.username && <div style={{ color: '#ff2e52', fontSize: '0.75rem', marginTop: 4 }}>{errors.username}</div>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>DATE OF BIRTH *</label>
                <input type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} 
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 0', fontSize: '1rem', outline: 'none' }} />
                {errors.dateOfBirth && <div style={{ color: '#ff2e52', fontSize: '0.75rem', marginTop: 4 }}>{errors.dateOfBirth}</div>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>GENDER (OPTIONAL)</label>
                <input type="text" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} placeholder="e.g. Female, Male, Non-binary"
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 0', fontSize: '1rem', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>{user.email ? `EMAIL: ${user.email} (VERIFIED)` : `MOBILE: ${user.phone} (VERIFIED)`}</div>
            </div>
          </div>

          {/* LOCATION */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: 32 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: 12 }}>YOUR LOCATION</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 24, lineHeight: 1.5 }}>
              Your location helps us show nearby Tangy Sessions and event alerts.
            </p>

            <button type="button" onClick={handleUseCurrentLocation} style={{
              background: 'rgba(200,255,43,0.1)', border: '1px solid #C8FF2B', color: '#C8FF2B',
              padding: '12px 24px', cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.05em',
              marginBottom: 32, display: 'inline-flex', alignItems: 'center', gap: 12
            }}>
              {loadingLoc ? 'LOCATING...' : 'USE MY CURRENT LOCATION'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>OR ENTER MANUALLY</div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>CITY *</label>
                <input type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} 
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 0', fontSize: '1rem', outline: 'none' }} />
                {errors.city && <div style={{ color: '#ff2e52', fontSize: '0.75rem', marginTop: 4 }}>{errors.city}</div>}
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>AREA / LOCALITY</label>
                <input type="text" value={form.locality} onChange={e => setForm({...form, locality: e.target.value})} 
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 0', fontSize: '1rem', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>STATE</label>
                <input type="text" value={form.state} onChange={e => setForm({...form, state: e.target.value})} 
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 0', fontSize: '1rem', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>PINCODE *</label>
                <input type="text" value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value})} 
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 0', fontSize: '1rem', outline: 'none' }} />
                {errors.pincode && <div style={{ color: '#ff2e52', fontSize: '0.75rem', marginTop: 4 }}>{errors.pincode}</div>}
              </div>
            </div>
            
            <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="checkbox" id="nearbyAlerts" checked={form.nearbyAlerts} onChange={e => setForm({...form, nearbyAlerts: e.target.checked})} 
                style={{ width: 18, height: 18, accentColor: '#C8FF2B', cursor: 'pointer' }} />
              <label htmlFor="nearbyAlerts" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
                Notify me when Tangy is happening near me
              </label>
            </div>
          </div>

          {/* MUSIC PREFERENCES */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: 32 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '0.05em', marginBottom: 12 }}>WHAT DO YOU LISTEN TO?</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: 24 }}>Select your genres to get personalized recommendations. (Optional)</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {MUSIC_GENRES.map(genre => {
                const selected = form.interests.includes(genre);
                return (
                  <button type="button" key={genre} onClick={() => toggleInterest(genre)} style={{
                    background: selected ? 'rgba(200,255,43,0.15)' : 'transparent',
                    border: `1px solid ${selected ? '#C8FF2B' : 'rgba(255,255,255,0.2)'}`,
                    color: selected ? '#C8FF2B' : 'rgba(255,255,255,0.6)',
                    padding: '8px 16px', borderRadius: 0, cursor: 'pointer',
                    fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em'
                  }}>
                    {genre}
                  </button>
                )
              })}
            </div>
          </div>

          <button type="submit" onClick={handleSubmit} disabled={submitting} style={{
            background: '#C8FF2B', color: '#080808', border: 'none', padding: '16px 32px',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.1em',
            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, width: '100%',
            transition: 'background 0.3s'
          }}>
            {submitting ? 'SAVING PROFILE...' : isEdit ? 'SAVE CHANGES' : 'COMPLETE SETUP'}
          </button>
        </form>
      </div>
    </div>
  );
}
