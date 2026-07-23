import React from 'react';

// ─── CRTOverlay ────────────────────────────────────────────────────────────────
// Pure visual effect layer — CRT scanlines, glass reflection, noise, VHS, flicker
// Rendered absolutely on top of the video. pointer-events: none throughout.

export default function CRTOverlay({ active = true }) {
  if (!active) return null;

  return (
    <>
      {/* 1) Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px)',
        borderRadius: 'inherit',
      }} />

      {/* 2) RGB chromatic aberration / scanline moving stripe */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
        background: 'linear-gradient(180deg, transparent 0%, rgba(200,255,43,0.01) 50%, transparent 100%)',
        animation: 'crtSweep 8s linear infinite',
        borderRadius: 'inherit',
      }} />

      {/* 3) Vignette + screen curvature illusion */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4,
        background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)',
        borderRadius: 'inherit',
      }} />

      {/* 4) Glass reflection */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0.02) 100%)',
        borderRadius: 'inherit',
      }} />

      {/* 5) VHS color shift overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
        mixBlendMode: 'screen',
        background: 'linear-gradient(90deg, rgba(255,0,0,0.015) 0%, rgba(0,255,0,0.01) 50%, rgba(0,0,255,0.015) 100%)',
        borderRadius: 'inherit',
      }} />

      {/* 6) Noise / grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6,
        opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
        animation: 'noiseShift 0.5s steps(1) infinite',
        borderRadius: 'inherit',
      }} />

      {/* 7) Bloom/glow — very subtle inner edge glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 7,
        boxShadow: 'inset 0 0 30px rgba(200,255,43,0.04)',
        borderRadius: 'inherit',
      }} />
    </>
  );
}
