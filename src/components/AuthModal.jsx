import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { login } = useAuth();
  const [method, setMethod] = useState('email'); // 'email' | 'phone'
  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState(1); // 1: input, 2: otp
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (step === 1) {
      if (!identifier) {
        setError('Please enter your details');
        setLoading(false);
        return;
      }
      // simulate sending OTP
      setTimeout(() => {
        setStep(2);
        setLoading(false);
      }, 600);
    } else {
      // Verify OTP
      const res = await login(method, identifier, otp);
      if (res.success) {
        onClose();
        if (res.user.profileCompleted) {
          if (onSuccess) onSuccess(res.user);
        } else {
          if (!location.pathname.includes('/onboarding')) {
            sessionStorage.setItem('tangy_onboarding_return', location.pathname);
          }
          navigate('/onboarding');
        }
        
        setTimeout(() => {
          setStep(1);
          setIdentifier('');
          setOtp('');
        }, 500);
      } else {
        setError(res.error);
      }
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
        padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          style={{
            background: '#111',
            border: '1px solid rgba(200,255,43,0.2)',
            width: '100%', maxWidth: 400,
            padding: 32, position: 'relative',
          }}
        >
          {/* Close Btn */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
            fontSize: 24, cursor: 'pointer'
          }}>×</button>

          <div style={{ fontFamily: "'Space Mono', monospace", color: '#C8FF2B', fontSize: '0.6rem', letterSpacing: '0.2em', marginBottom: 12 }}>
            SECURE ACCESS
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', color: '#fff', margin: '0 0 24px 0', letterSpacing: '0.05em' }}>
            {step === 1 ? 'JOIN THE INNER CIRCLE' : 'VERIFY IDENTITY'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {step === 1 && (
              <>
                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <button type="button" onClick={() => { setMethod('email'); setIdentifier(''); setError(''); }} style={{
                    flex: 1, padding: 12, background: method === 'email' ? 'rgba(200,255,43,0.1)' : 'transparent',
                    border: `1px solid ${method === 'email' ? '#C8FF2B' : 'rgba(255,255,255,0.2)'}`,
                    color: method === 'email' ? '#C8FF2B' : '#fff', cursor: 'pointer',
                    fontFamily: "'Space Mono', monospace", fontSize: '0.7rem'
                  }}>EMAIL</button>
                  <button type="button" onClick={() => { setMethod('phone'); setIdentifier(''); setError(''); }} style={{
                    flex: 1, padding: 12, background: method === 'phone' ? 'rgba(200,255,43,0.1)' : 'transparent',
                    border: `1px solid ${method === 'phone' ? '#C8FF2B' : 'rgba(255,255,255,0.2)'}`,
                    color: method === 'phone' ? '#C8FF2B' : '#fff', cursor: 'pointer',
                    fontFamily: "'Space Mono', monospace", fontSize: '0.7rem'
                  }}>MOBILE</button>
                </div>
                
                <input 
                  type={method === 'email' ? 'email' : 'tel'} 
                  placeholder={method === 'email' ? 'your@email.com' : '+91 99999 99999'}
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: 16, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontFamily: "'Space Mono', monospace", fontSize: '0.9rem',
                    outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#C8FF2B'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'Space Mono', monospace" }}>
                  Code sent to {identifier}
                </div>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP (use 123456)"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: 16, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontFamily: "'Space Mono', monospace", fontSize: '1rem',
                    letterSpacing: '0.2em', textAlign: 'center', outline: 'none'
                  }}
                  onFocus={e => e.target.style.borderColor = '#C8FF2B'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </>
            )}

            {error && <div style={{ color: '#ff2e52', fontSize: '0.75rem', fontFamily: "'Space Mono', monospace" }}>{error}</div>}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 16, background: '#C8FF2B', color: '#000',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: '0.1em',
              marginTop: 10, opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'PROCESSING...' : (step === 1 ? 'SEND CODE' : 'VERIFY & ENTER')}
            </button>
            
            {step === 2 && (
              <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }} style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem',
                textDecoration: 'underline'
              }}>
                Back
              </button>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
