import React from 'react';
import { TV_STATE } from './useTVPlayer.js';

export default function TVHeader({ tvState, channelNumber, isPowered }) {
  const isLive = tvState === TV_STATE.PLAYING;
  const isSwitching = tvState === TV_STATE.SWITCHING;
  const isBooting = tvState === TV_STATE.BOOTING;

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #111 50%, #0d0d0d 100%)',
      border: '1px solid rgba(200,255,43,0.15)',
      borderBottom: 'none',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      fontFamily: "'Space Mono', monospace",
      flexWrap: 'wrap',
      rowGap: 6,
    }}>
      {/* LEFT: Brand */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.18em', color: '#C8FF2B', textTransform: 'uppercase' }}>
          TANGY SESSIONS
        </div>
        <div style={{ fontSize: '0.5rem', letterSpacing: '0.22em', color: 'rgba(200,255,43,0.5)', textTransform: 'uppercase' }}>
          LIVE ARCHIVE · EST.2025
        </div>
      </div>

      {/* CENTER: Channel + Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          background: 'rgba(200,255,43,0.08)',
          border: '1px solid rgba(200,255,43,0.2)',
          padding: '3px 10px',
          fontSize: '0.62rem',
          letterSpacing: '0.2em',
          color: '#C8FF2B',
        }}>
          CH {String(isPowered ? channelNumber : '--').padStart(2, '0')}
        </div>
        {isPowered && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.55rem', letterSpacing: '0.15em', color: isLive ? '#C8FF2B' : '#ff2e52' }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: isBooting ? '#ff2e52' : isSwitching ? '#ff9d00' : isLive ? '#C8FF2B' : '#444',
              boxShadow: isLive ? '0 0 8px #C8FF2B' : isSwitching ? '0 0 8px #ff9d00' : isBooting ? '0 0 8px #ff2e52' : 'none',
              animation: (isBooting || isSwitching) ? 'blinkDot 0.8s infinite' : isLive ? 'blinkDot 2s infinite' : 'none',
            }} />
            {isBooting ? 'BOOTING' : isSwitching ? 'TUNING' : isLive ? 'LIVE' : 'STANDBY'}
          </div>
        )}
      </div>

      {/* RIGHT: Signal + REC */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(200,255,43,0.45)' }}>
          SIGNAL {isPowered ? '100%' : '0%'}
        </div>
        {isPowered && isLive && (
          <div style={{
            fontSize: '0.5rem', letterSpacing: '0.15em', color: '#ff2e52',
            display: 'flex', alignItems: 'center', gap: 4,
            animation: 'blinkDot 1s infinite',
          }}>
            REC ●
          </div>
        )}
      </div>
    </div>
  );
}
