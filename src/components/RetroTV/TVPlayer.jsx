import React from 'react';
import { motion } from 'framer-motion';
import { useTVPlayer, TV_STATE } from './useTVPlayer.js';
import TVHeader from './TVHeader.jsx';
import TVControls from './TVControls.jsx';
import CRTOverlay from './CRTOverlay.jsx';

// ─── OSD (On-Screen Display) overlays ─────────────────────────────────────────
function OSD({ tvState }) {
  if (tvState === TV_STATE.BOOTING) {
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        justifyContent: 'flex-start', padding: '10% 8%', pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", color: '#C8FF2B',
          textShadow: '0 0 10px #C8FF2B, 0 0 20px rgba(200,255,43,0.4)',
          animation: 'tvFlicker 3s infinite',
          lineHeight: 1.6,
        }}>
          <div style={{ fontSize: 'clamp(0.55rem, 1.5vw, 0.9rem)', letterSpacing: '0.18em', marginBottom: 6 }}>
            TANGY SESSIONS TV
          </div>
          <div style={{ fontSize: 'clamp(0.45rem, 1.2vw, 0.72rem)', letterSpacing: '0.15em', opacity: 0.7, marginBottom: 12 }}>
            BOOTING...
          </div>
          <div style={{ fontSize: 'clamp(0.4rem, 1vw, 0.62rem)', letterSpacing: '0.12em', opacity: 0.5 }}>
            SEARCHING FOR SIGNAL...
          </div>
        </div>
        <div style={{
          marginTop: 'auto', display: 'flex', gap: 12, alignItems: 'center',
          fontFamily: "'Space Mono', monospace",
        }}>
          <div style={{ fontSize: '0.5rem', color: '#ff2e52', letterSpacing: '0.15em', animation: 'blinkDot 1s infinite', display: 'flex', alignItems: 'center', gap: 4 }}>
            REC ●
          </div>
          <div style={{ fontSize: '0.5rem', color: '#C8FF2B', letterSpacing: '0.15em' }}>
            LIVE
          </div>
        </div>
      </div>
    );
  }

  if (tvState === TV_STATE.SWITCHING) {
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        justifyContent: 'flex-start', padding: '10% 8%', pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", color: '#ff9d00',
          textShadow: '0 0 10px #ff9d00',
          animation: 'tvFlicker 1s infinite',
          fontSize: 'clamp(0.5rem, 1.3vw, 0.75rem)',
          letterSpacing: '0.15em',
        }}>
          SWITCHING CHANNEL...
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace", color: '#ff9d00',
          fontSize: 'clamp(0.4rem, 1vw, 0.6rem)', letterSpacing: '0.1em',
          opacity: 0.6, marginTop: 6,
        }}>
          TUNING...
        </div>
      </div>
    );
  }

  return null;
}

// ─── TV Screen ─────────────────────────────────────────────────────────────────
function TVScreen({ videoRef, tvState, isPowered }) {
  return (
    <div style={{
      position: 'relative',
      background: '#000',
      borderRadius: 10,
      overflow: 'hidden',
      aspectRatio: '16/9',
      width: '100%',
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.95)',
    }}>
      {isPowered ? (
        <>
          <video
            ref={videoRef}
            muted
            playsInline
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'brightness(1.05) contrast(1.1) saturate(1.1)',
            }}
          />
          <CRTOverlay active />
          <OSD tvState={tvState} />
        </>
      ) : (
        /* Power OFF — dark screen with faint static */
        <div style={{
          width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at center, #111 0%, #050505 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: '0.6rem',
            letterSpacing: '0.2em', color: 'rgba(255,255,255,0.06)',
          }}>NO SIGNAL</div>
        </div>
      )}
    </div>
  );
}

// ─── Main TVPlayer Component ───────────────────────────────────────────────────
export default function TVPlayer() {
  const tv = useTVPlayer();

  return (
    <>
      {/* Global CSS animations needed by this component tree */}
      <style>{`
        @keyframes crtSweep { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes noiseShift {
          0%   { background-position: 0px 0px; }
          25%  { background-position: -10px 5px; }
          50%  { background-position: 5px -8px; }
          75%  { background-position: -5px 10px; }
          100% { background-position: 8px -5px; }
        }
        @keyframes tvFlicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.7; }
          97% { opacity: 1; }
          98% { opacity: 0.4; }
          99% { opacity: 0.9; }
        }
        @keyframes tvGlowPulse {
          0%, 100% { opacity: 0.5; box-shadow: 0 0 40px rgba(200,255,43,0.15), 0 0 80px rgba(200,255,43,0.05); }
          50% { opacity: 0.8; box-shadow: 0 0 60px rgba(200,255,43,0.25), 0 0 120px rgba(200,255,43,0.1); }
        }
        .tv-player-wrapper { position: absolute; right: 4vw; top: 50%; transform: translateY(-50%); z-index: 7; pointer-events: auto; }
        @media (max-width: 1100px) { .tv-player-wrapper { right: 2vw; } }
        @media (max-width: 900px) {
          .tv-player-wrapper {
            position: relative; right: auto; top: auto; transform: none;
            width: min(94vw, 480px); margin: 28px auto 0;
          }
        }
      `}</style>

      <div className="tv-player-wrapper">
        {/* Ambient glow blob behind TV */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%', right: '10%', bottom: '-5%',
          background: 'radial-gradient(ellipse, rgba(200,255,43,0.12) 0%, transparent 70%)',
          filter: 'blur(24px)',
          zIndex: -1, pointerEvents: 'none',
          animation: 'tvGlowPulse 4s ease-in-out infinite',
        }} />

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 'clamp(300px, 34vw, 520px)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
          }}
        >
          {/* Header */}
          <TVHeader
            tvState={tv.tvState}
            channelNumber={tv.channelNumber}
            isPowered={tv.isPowered}
          />

          {/* Chassis */}
          <div style={{
            background: 'linear-gradient(160deg, #1c1c1c 0%, #111 50%, #0d0d0d 100%)',
            border: '1px solid rgba(200,255,43,0.12)',
            borderTop: 'none', borderBottom: 'none',
            padding: '14px 14px 10px',
          }}>
            <TVScreen
              videoRef={tv.videoRef}
              tvState={tv.tvState}
              isPowered={tv.isPowered}
            />
          </div>

          {/* Controls */}
          <TVControls
            tvState={tv.tvState}
            isPowered={tv.isPowered}
            currentVideo={tv.currentVideo}
            channelNumber={tv.channelNumber}
            totalVideos={tv.totalVideos}
            isPlaying={tv.isPlaying}
            isMuted={tv.isMuted}
            volume={tv.volume}
            currentTime={tv.currentTime}
            duration={tv.duration}
            knobAngle={tv.knobAngle}
            play={tv.play}
            pause={tv.pause}
            seek={tv.seek}
            changeVolume={tv.changeVolume}
            toggleMute={tv.toggleMute}
            nextChannel={tv.nextChannel}
            prevChannel={tv.prevChannel}
            togglePower={tv.togglePower}
            requestFullscreen={tv.requestFullscreen}
          />
        </motion.div>
      </div>
    </>
  );
}
