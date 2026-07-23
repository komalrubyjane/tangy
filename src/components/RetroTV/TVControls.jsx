import React from 'react';

// Shared small button style
const btnBase = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  minWidth: 44, minHeight: 44, padding: '6px 10px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 4, cursor: 'pointer', fontSize: '0.85rem',
  color: '#888', fontFamily: "'Space Mono', monospace",
  transition: 'all 0.15s', userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
};

function Btn({ label, title, onClick, disabled, active }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...btnBase,
        color:      disabled ? '#2a2a2a' : active ? '#C8FF2B' : '#888',
        background: active ? 'rgba(200,255,43,0.12)' : btnBase.background,
        border:     active ? '1px solid rgba(200,255,43,0.35)' : btnBase.border,
        cursor:     disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </button>
  );
}

// ─── Rotating Knob (drag-controlled for VOL, click-step for CH) ──────────────
function Knob({ label, angle, onLeft, onRight, onDrag }) {
  const knobRef = React.useRef(null);
  const dragStart = React.useRef(null); // { y, angle }

  const handlePointerDown = (e) => {
    if (!onDrag) return; // CH knob: use click only
    e.preventDefault();
    knobRef.current.setPointerCapture(e.pointerId);
    dragStart.current = { y: e.clientY, angle };
  };

  const handlePointerMove = (e) => {
    if (!dragStart.current || !onDrag) return;
    const dy = dragStart.current.y - e.clientY; // up = positive
    // 200px of drag covers full 270° range → maps to 0–1 volume
    const delta = dy / 200;
    onDrag(delta);
  };

  const handlePointerUp = () => { dragStart.current = null; };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <div style={{
        fontFamily:"'Space Mono', monospace", fontSize:'0.4rem',
        letterSpacing:'0.18em', color:'rgba(200,255,43,0.4)', textTransform:'uppercase',
      }}>{label}</div>
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={!onDrag ? (e => {
          const rect = e.currentTarget.getBoundingClientRect();
          (e.clientX > rect.left + rect.width / 2 ? onRight : onLeft)?.();
        }) : undefined}
        style={{
          width:44, height:44, borderRadius:'50%',
          cursor: onDrag ? 'ns-resize' : 'pointer',
          background:'radial-gradient(circle at 35% 35%, #4a4a4a 0%, #1e1e1e 55%, #111 100%)',
          border:'2px solid rgba(200,255,43,0.22)',
          boxShadow:'0 4px 14px rgba(0,0,0,0.75), inset 0 1px 3px rgba(255,255,255,0.1)',
          position:'relative',
          transform:`rotate(${angle}deg)`,
          transition: onDrag ? 'none' : 'transform 0.3s ease',
          touchAction:'none',
          userSelect:'none',
        }}
      >
        {/* Indicator dot */}
        <div style={{
          position:'absolute', top:4, left:'50%', transform:'translateX(-50%)',
          width:3, height:10, background:'#C8FF2B', borderRadius:2,
          boxShadow:'0 0 5px #C8FF2B',
        }} />
      </div>
    </div>
  );
}

function formatTime(s) {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

// ─── TVKnobs ─────────────────────────────────────────────────────────────────
export function TVKnobs({ volume, knobAngle, changeVolume, nextChannel, prevChannel }) {
  // Track accumulated drag delta so angle matches actual volume
  const volRef = React.useRef(volume);
  volRef.current = volume;

  const handleVolDrag = (delta) => {
    const next = Math.min(1, Math.max(0, volRef.current + delta));
    changeVolume(next);
    volRef.current = next;
  };

  // VOL angle: maps 0→1 to -135°→+135° (270° total sweep)
  const volAngle = -135 + volume * 270;

  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:20, flexShrink:0 }}>
      <Knob label="VOL" angle={volAngle} onDrag={handleVolDrag} />
      <Knob label="CH"  angle={knobAngle} onLeft={prevChannel} onRight={nextChannel} />
    </div>
  );
}

// ─── Power Button ─────────────────────────────────────────────────────────────
function PowerBtn({ isPowered, togglePower }) {
  return (
    <button
      onClick={togglePower}
      title={isPowered ? 'Power Off' : 'Power On'}
      style={{
        width:40, height:40, borderRadius:'50%', border:'none',
        background: isPowered
          ? 'radial-gradient(circle, #ff2e52 0%, #8b0010 100%)'
          : 'radial-gradient(circle, #2a2a2a 0%, #111 100%)',
        boxShadow: isPowered ? '0 0 14px rgba(255,46,82,0.55)' : '0 2px 6px rgba(0,0,0,0.5)',
        cursor:'pointer', fontSize:'1rem', flexShrink:0,
        transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center',
        minWidth:44, minHeight:44,
      }}
    >⏻</button>
  );
}

// ─── Main TVControls ──────────────────────────────────────────────────────────
export default function TVControls({
  tvState, isPowered,
  currentVideo, channelNumber, totalVideos,
  isPlaying, isMuted, volume, currentTime, duration, knobAngle,
  play, pause, seek, changeVolume, toggleMute,
  nextChannel, prevChannel, togglePower, requestFullscreen,
}) {
  const canPlay    = isPowered;
  const canSeek    = isPowered && tvState === 'PLAYING';
  const titleText  = currentVideo?.filename
    ? currentVideo.filename.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 35)
    : '— — —';
  const progress   = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div style={{
      background:'linear-gradient(180deg, #0d0d0d 0%, #131313 100%)',
      border:'1px solid rgba(200,255,43,0.12)',
      borderTop:'none', padding:'12px 14px',
      display:'flex', flexDirection:'column', gap:10,
      fontFamily:"'Space Mono', monospace",
    }}>

      {/* Row 1 — Now Playing info */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
        <div style={{ minWidth:0, flex:1 }}>
          <div style={{ fontSize:'0.4rem', letterSpacing:'0.2em', color:'rgba(200,255,43,0.45)', marginBottom:2 }}>
            NOW PLAYING
          </div>
          <div style={{
            fontSize:'clamp(0.55rem, 1.4vw, 0.72rem)', color: isPowered ? '#fff' : '#333',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>
            {isPowered ? titleText : '— — —'}
          </div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ fontSize:'0.6rem', color:'#C8FF2B', letterSpacing:'0.12em' }}>
            CH {String(isPowered ? channelNumber : '--').padStart(2,'0')}
          </div>
          <div style={{ fontSize:'0.45rem', color:'rgba(255,255,255,0.28)', letterSpacing:'0.1em' }}>
            {isPowered && totalVideos ? `${String(channelNumber).padStart(2,'0')} / ${String(totalVideos).padStart(2,'0')}` : '--/--'}
          </div>
        </div>
      </div>

      {/* Row 2 — Progress bar */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:'0.45rem', color:'rgba(255,255,255,0.3)', minWidth:28 }}>
          {formatTime(currentTime)}
        </span>
        <div
          style={{ flex:1, height:5, background:'rgba(255,255,255,0.06)', borderRadius:3, cursor: canSeek ? 'pointer' : 'default', position:'relative' }}
          onClick={e => {
            if (!canSeek || !duration) return;
            const r = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - r.left) / r.width) * duration);
          }}
        >
          <div style={{ position:'absolute', top:0, left:0, height:'100%', borderRadius:3,
            width:`${progress}%`, background: canSeek ? '#C8FF2B' : '#2a2a2a', transition:'width 0.2s linear' }} />
        </div>
        <span style={{ fontSize:'0.45rem', color:'rgba(255,255,255,0.3)', minWidth:28, textAlign:'right' }}>
          {formatTime(duration)}
        </span>
      </div>

      {/* Row 3 — Buttons + Knobs + Power */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>

        {/* Playback row */}
        <div style={{ display:'flex', alignItems:'center', gap:4, flexWrap:'wrap' }}>
          <Btn label="⏮" title="Previous" onClick={prevChannel} disabled={!canPlay} />
          {isPlaying
            ? <Btn label="⏸" title="Pause"  onClick={pause}       disabled={!canPlay} active />
            : <Btn label="▶" title="Play"   onClick={play}        disabled={!canPlay} active />
          }
          <Btn label="⏭" title="Next"       onClick={nextChannel} disabled={!canPlay} />
          <Btn label={isMuted ? '🔇' : '🔊'} title={isMuted ? 'Unmute' : 'Mute'} onClick={toggleMute} disabled={!canPlay} />
          <Btn label="⛶"  title="Fullscreen" onClick={requestFullscreen} disabled={!canPlay} />
        </div>

        {/* Knobs */}
        <TVKnobs
          volume={volume} knobAngle={knobAngle}
          changeVolume={changeVolume}
          nextChannel={nextChannel} prevChannel={prevChannel}
        />

        {/* Power */}
        <PowerBtn isPowered={isPowered} togglePower={togglePower} />
      </div>

    </div>
  );
}
