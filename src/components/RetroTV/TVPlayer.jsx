import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useTVPlayer } from './useTVPlayer.js';
import TVHeader from './TVHeader.jsx';
import TVScreen from './TVScreen.jsx';
import TVControls from './TVControls.jsx';

// ─── CSS animations injected once ────────────────────────────────────────────
const TV_STYLES = `
  @keyframes tvFlicker {
    0%, 94%, 100% { opacity: 1; }
    95% { opacity: 0.75; }
    96% { opacity: 1; }
    98% { opacity: 0.5; }
    99% { opacity: 0.95; }
  }
  @keyframes tvGlowPulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 0.8; }
  }
`;

// ─── TVPlayer — the assembled component ──────────────────────────────────────
export default function TVPlayer() {
  const tv = useTVPlayer();
  const wrapRef = useRef(null);

  // Pause when completely scrolled out of view (performance)
  const isVisible = useInView(wrapRef, { margin: '300px 0px 300px 0px' });
  React.useEffect(() => {
    const video = tv.videoRef.current;
    if (!video || !tv.isPowered) return;
    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible, tv.isPowered]);

  return (
    <>
      <style>{TV_STYLES}</style>

      {/* Ambient glow behind the whole TV block */}
      <div style={{
        position: 'absolute',
        top: '15%', bottom: '-8%', right: '2vw', left: '38%',
        background: 'radial-gradient(ellipse, rgba(200,255,43,0.10) 0%, transparent 68%)',
        filter: 'blur(30px)', zIndex: 4, pointerEvents: 'none',
        animation: 'tvGlowPulse 5s ease-in-out infinite',
      }} />

      {/* TV wrapper — floats gently, lives in the hero grid as a normal flex child */}
      <motion.div
        ref={wrapRef}
        className="tangy-tv-wrapper"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 28px 64px rgba(0,0,0,0.85)',
          willChange: 'transform',
        }}
      >
        <TVHeader
          tvState={tv.tvState}
          channelNumber={tv.channelNumber}
          isPowered={tv.isPowered}
        />

        {/* Chassis */}
        <div style={{
          background: 'linear-gradient(160deg, #1c1c1c 0%, #111 60%, #0c0c0c 100%)',
          border: '1px solid rgba(200,255,43,0.10)',
          borderTop: 'none', borderBottom: 'none',
          padding: '10px 10px 8px',
        }}>
          <TVScreen
            videoRef={tv.videoRef}
            tvState={tv.tvState}
            isPowered={tv.isPowered}
            channelNumber={tv.channelNumber}
          />
        </div>

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
    </>
  );
}
