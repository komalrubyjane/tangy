import React from 'react';
import { TV_STATE } from './useTVPlayer.js';
import { toTitle } from './playlist.js';

// Format seconds to M:SS
function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Single Control Button ─────────────────────────────────────────────────────
function CtrlBtn({ label, onClick, highlight, disabled, title }) {
  return (
    <button
      title={title || label}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: highlight ? 'rgba(200,255,43,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${highlight ? 'rgba(200,255,43,0.5)' : 'rgba(255,255,255,0.08)'}`,
        color: disabled ? '#333' : (highlight ? '#C8FF2B' : '#aaa'),
        padding: '6px 10px',
        borderRadius: 4,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'Space Mono', monospace",
        fontSize: '0.7rem',
        letterSpacing: '0.05em',
        transition: 'all 0.15s',
        minWidth: 36,
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        if (!disabled) { e.currentTarget.style.background = 'rgba(200,255,43,0.18)'; e.currentTarget.style.color = '#C8FF2B'; }
      }}
      onMouseLeave={e => {
        if (!disabled) { e.currentTarget.style.background = highlight ? 'rgba(200,255,43,0.15)' : 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = highlight ? '#C8FF2B' : '#aaa'; }
      }}
    >
      {label}
    </button>
  );
}

// ─── Vintage Knob ─────────────────────────────────────────────────────────────
function Knob({ label, value, min, max, angle, onChange, onStepLeft, onStepRight }) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    if (dx > 0) onStepRight?.();
    else onStepLeft?.();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.45rem', letterSpacing: '0.2em', color: 'rgba(200,255,43,0.5)', textTransform: 'uppercase' }}>
        {label}
      </div>
      {/* Knob body */}
      <div
        onClick={handleClick}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #4a4a4a 0%, #1a1a1a 60%, #111 100%)',
          border: '2px solid rgba(200,255,43,0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.8), inset 0 1px 3px rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
          transform: `rotate(${angle}deg)`,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Indicator line */}
        <div style={{
          position: 'absolute', top: 4, left: '50%',
          transform: 'translateX(-50%)',
          width: 2, height: 10, background: '#C8FF2B',
          borderRadius: 1,
        }} />
      </div>
      {/* Sub-label */}
      {onChange && (
        <input
          type="range" min={min} max={max} step="0.01"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            width: 60, accentColor: '#C8FF2B', cursor: 'pointer',
            appearance: 'none', height: 3,
            background: `linear-gradient(to right, #C8FF2B ${(value - min) / (max - min) * 100}%, rgba(255,255,255,0.1) 0%)`,
            outline: 'none', border: 'none',
          }}
        />
      )}
    </div>
  );
}

// ─── Main TVControls Component ────────────────────────────────────────────────
export default function TVControls({
  tvState, isPowered,
  currentVideo, channelNumber, totalVideos,
  isPlaying, isMuted, volume, currentTime, duration,
  knobAngle,
  play, pause, seek, changeVolume, toggleMute,
  nextChannel, prevChannel, togglePower, requestFullscreen,
}) {
  const canControl = isPowered && tvState === TV_STATE.PLAYING;
  const videoTitle = toTitle(currentVideo?.filename || 'Tangy Sessions');

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(180deg, #0d0d0d 0%, #111 40%, #1a1a1a 100%)',
      border: '1px solid rgba(200,255,43,0.15)',
      borderTop: '1px solid rgba(200,255,43,0.1)',
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>

      {/* ── Row 1: Now Playing Info ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 6 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.45rem', letterSpacing: '0.2em', color: 'rgba(200,255,43,0.5)', textTransform: 'uppercase' }}>
            NOW PLAYING
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.08em', color: isPowered ? '#fff' : '#333', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isPowered ? videoTitle : '— — —'}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontFamily: "'Space Mono', monospace" }}>
          <div style={{ fontSize: '0.62rem', color: '#C8FF2B' }}>
            CH {String(isPowered ? channelNumber : 0).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)' }}>
            {isPowered ? `${String(channelNumber).padStart(2, '0')} / ${String(totalVideos).padStart(2, '0')}` : '-- / --'}
          </div>
        </div>
      </div>

      {/* ── Row 2: Progress Bar ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', minWidth: 30 }}>
          {formatTime(currentTime)}
        </span>
        <div style={{ flex: 1, position: 'relative', height: 6, cursor: canControl ? 'pointer' : 'not-allowed' }}
          onClick={e => {
            if (!canControl || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            seek(pct * duration);
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            background: canControl ? '#C8FF2B' : '#333',
            borderRadius: 3, transition: 'width 0.2s linear',
          }} />
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', minWidth: 30 }}>
          {formatTime(duration)}
        </span>
      </div>

      {/* ── Row 3: Button Row + Knobs ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>

        {/* Playback buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <CtrlBtn label="⏮" title="Previous Channel" onClick={prevChannel} disabled={!canControl} />
          {isPlaying
            ? <CtrlBtn label="⏸" title="Pause" onClick={pause} disabled={!canControl} highlight />
            : <CtrlBtn label="▶" title="Play" onClick={play} disabled={!isPowered} highlight />
          }
          <CtrlBtn label="⏭" title="Next Channel" onClick={nextChannel} disabled={!canControl} />
          <CtrlBtn label={isMuted ? '🔇' : '🔊'} title={isMuted ? 'Unmute' : 'Mute'} onClick={toggleMute} disabled={!isPowered} />
          <CtrlBtn label="⛶" title="Fullscreen" onClick={requestFullscreen} disabled={!canControl} />
        </div>

        {/* Knobs */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
          {/* Volume Knob */}
          <Knob
            label="VOL"
            value={volume} min={0} max={1}
            angle={-135 + volume * 270}
            onChange={changeVolume}
          />
          {/* Channel Knob */}
          <Knob
            label="CH"
            angle={knobAngle}
            onStepLeft={prevChannel}
            onStepRight={nextChannel}
          />
        </div>

        {/* Power Button */}
        <button
          onClick={togglePower}
          title={isPowered ? 'Power Off' : 'Power On'}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: isPowered
              ? 'radial-gradient(circle, #ff2e52 0%, #aa0020 100%)'
              : 'radial-gradient(circle, #333 0%, #1a1a1a 100%)',
            border: `2px solid ${isPowered ? 'rgba(255,46,82,0.5)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: isPowered ? '0 0 12px rgba(255,46,82,0.5)' : '0 2px 6px rgba(0,0,0,0.6)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.9rem',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          ⏻
        </button>
      </div>

      {/* ── Row 4: Volume slider ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.45rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>VOL</span>
        <input
          type="range" min={0} max={1} step="0.01"
          value={isMuted ? 0 : volume}
          onChange={e => changeVolume(parseFloat(e.target.value))}
          disabled={!isPowered}
          style={{ flex: 1, accentColor: '#C8FF2B', cursor: isPowered ? 'pointer' : 'not-allowed' }}
        />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.45rem', color: 'rgba(255,255,255,0.3)' }}>
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>
    </div>
  );
}
