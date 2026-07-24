import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { loyaltyService } from '../services/loyaltyService';
import { referralService } from '../services/referralService';
import { locationService } from '../services/locationService';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [loyalty, setLoyalty] = useState({ points: 0, history: [] });
  const [referrals, setReferrals] = useState({ totalReferrals: 0 });
  const [alertsOn, setAlertsOn] = useState(false);

  useEffect(() => {
    if (user) {
      loyaltyService.getTangyPoints().then(setLoyalty);
      setReferrals(referralService.getReferralStats());
    }
  }, [user]);

  if (!user) return null;

  const referralLink = `${window.location.origin}/?ref=${referralService.getReferralCode()}`;

  const handleCopyLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Tangy Sessions',
        text: 'Join me at Tangy Sessions and get exclusive underground music access.',
        url: referralLink,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
    }
  };

  const handleToggleAlerts = async () => {
    if (!alertsOn) {
      try {
        await locationService.requestLocationPermission();
        setAlertsOn(true);
        alert('Nearby event alerts enabled!');
      } catch (e) {
        alert('Location access is off. Enable it anytime to receive nearby Tangy event alerts.');
      }
    } else {
      setAlertsOn(false);
    }
  };

  return (
    <div style={{
      padding: '120px 5vw 80px',
      minHeight: '100svh',
      background: '#080808',
      color: '#fff',
      fontFamily: "'Space Mono', monospace"
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        {/* Back to Home Button */}
        <div style={{ marginBottom: 32 }}>
          <button onClick={() => window.location.href = '/'} style={{
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.6)', 
            cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', 
            letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8, padding: 0
          }}>
            ← BACK TO HOME
          </button>
        </div>

        {/* Header */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 24, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ color: '#C8FF2B', fontSize: '0.7rem', letterSpacing: '0.2em' }}>TANGY MEMBER</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '4px 0 8px', letterSpacing: '0.05em' }}>
              {user.name}
            </h1>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Member since {user.memberSince}</div>
          </div>
          <button onClick={logout} style={{
            background: 'transparent', border: '1px solid rgba(255,46,82,0.5)', color: '#ff2e52',
            padding: '8px 16px', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em'
          }}>LOGOUT</button>
        </div>

        {/* Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          
          {/* Points Card */}
          <div style={{ background: '#111', border: '1px solid rgba(200,255,43,0.2)', padding: 24 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: 12 }}>TANGY POINTS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'radial-gradient(circle, #C8FF2B 0%, #7da600 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>TP</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: '#C8FF2B', lineHeight: 1 }}>{loyalty.points}</div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 12 }}>Your Tangy loyalty balance</div>
          </div>

          {/* Activity / Referral */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: 24 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: 20 }}>YOUR ACTIVITY</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.85rem' }}>
              <span>Events attended</span><span>0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.85rem' }}>
              <span>Referrals</span><span style={{ color: '#C8FF2B' }}>{referrals.totalReferrals}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>Volunteer sessions</span><span>0</span>
            </div>
          </div>

          {/* Refer a Friend */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: 24, gridColumn: '1 / -1' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: 12 }}>REFER & EARN</div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: 20, maxWidth: 500 }}>
              Share Tangy Sessions with your network. Earn 5 Tangy Points for every successful referral.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', color: '#C8FF2B', fontSize: '0.8rem', userSelect: 'all', flex: 1, minWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {referralLink}
              </div>
              <button onClick={handleCopyLink} style={{
                background: '#C8FF2B', color: '#000', border: 'none', padding: '0 24px', cursor: 'pointer',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', minHeight: 44, flexShrink: 0
              }}>SHARE LINK</button>
            </div>
          </div>

          {/* Location Alerts */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: 24, gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: 8 }}>NEARBY EVENT ALERTS</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', maxWidth: 400 }}>Get notified when Tangy is happening near you. Location is only accessed when enabled.</div>
            </div>
            <button onClick={handleToggleAlerts} style={{
              background: alertsOn ? 'rgba(200,255,43,0.1)' : 'transparent',
              border: alertsOn ? '1px solid #C8FF2B' : '1px solid rgba(255,255,255,0.2)',
              color: alertsOn ? '#C8FF2B' : '#fff',
              padding: '12px 24px', cursor: 'pointer', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem', minHeight: 44
            }}>
              {alertsOn ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Exclusive Offers */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: 24, gridColumn: '1 / -1' }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.15em', marginBottom: 20 }}>EXCLUSIVE OFFERS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              {[
                { title: 'EARLY ACCESS', cost: 10 },
                { title: 'MEMBER TICKET DROP', cost: 20 },
                { title: 'BACKSTAGE DRAW', cost: 50 }
              ].map((offer, i) => (
                <div key={i} style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.05)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '0.05em' }}>{offer.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.75rem', color: '#C8FF2B' }}>{offer.cost} TP</span>
                    <button style={{
                      background: 'transparent', border: '1px solid rgba(200,255,43,0.3)', color: '#C8FF2B',
                      padding: '6px 12px', fontSize: '0.65rem', cursor: loyalty.points >= offer.cost ? 'pointer' : 'not-allowed', opacity: loyalty.points >= offer.cost ? 1 : 0.5
                    }}>
                      REDEEM
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
