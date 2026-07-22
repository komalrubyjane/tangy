import React, { useEffect, useRef } from "react";

export default function UnicornBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let t = 0;

    const orbs = [
      { x: 0.15, y: 0.25, r: 0.38, color: "rgba(200,255,43,0.06)" },
      { x: 0.85, y: 0.15, r: 0.32, color: "rgba(255,46,82,0.04)" },
      { x: 0.5, y: 0.75, r: 0.42, color: "rgba(200,255,43,0.04)" },
      { x: 0.8, y: 0.7, r: 0.28, color: "rgba(255,255,255,0.025)" },
    ];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // Low-end / mobile optimization check
    const isMobileOrLowEnd = (() => {
      if (typeof window === "undefined") return false;
      const mem = navigator.deviceMemory;
      const cores = navigator.hardwareConcurrency || 4;
      const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const isMob = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return prefersReduced || cores <= 2 || (mem !== undefined && mem < 2) || isMob;
    })();

    let raf;
    const renderFrame = (time) => {
      ctx.clearRect(0, 0, w, h);
      orbs.forEach((o, i) => {
        const ox = o.x * w + Math.sin(t * 0.7 + i * 1.3) * w * 0.04;
        const oy = o.y * h + Math.cos(t * 0.5 + i * 1.7) * h * 0.04;
        const r = o.r * Math.min(w, h);
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        grad.addColorStop(0, o.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });
    };

    if (isMobileOrLowEnd) {
      // Draw once for static low-power performance
      renderFrame(0);
    } else {
      let lastTime = 0;
      const draw = (time) => {
        if (time - lastTime >= 33) { // Cap at ~30 FPS for desktop smooth efficiency
          t += 0.003;
          lastTime = time;
          renderFrame(time);
        }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        background: "#080808",
        overflow: "hidden",
      }}
    >
      {/* Animated canvas orbs */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 1,
        }}
      />

      {/* Subtle grain texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px",
          pointerEvents: "none",
        }}
      />

      {/* Static grid lines — editorial feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(200,255,43,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,255,43,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
