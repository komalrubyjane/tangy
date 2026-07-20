import React, { useState, useEffect } from "react";

// Detect mobile/low-end once
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const cores = navigator.hardwareConcurrency || 4;
const mem = navigator.deviceMemory;
const isLowEnd = isMobile && (cores <= 4 || (mem !== undefined && mem < 4));

export default function UnicornBackground() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Hide video/effects entirely on very low-end devices to prevent frame drops
    if (cores <= 2 || (mem !== undefined && mem < 2)) {
      setHidden(true);
    }
  }, []);

  if (hidden) {
    // Fallback: pure CSS gradient — zero GPU overhead
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        zIndex: -1, pointerEvents: "none",
        background: "radial-gradient(ellipse at 25% 40%, rgba(139,92,246,0.06), transparent 55%), radial-gradient(ellipse at 75% 60%, rgba(139,92,246,0.04), transparent 55%), #050505",
      }} />
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      zIndex: -1, pointerEvents: "none", background: "#050505", overflow: "hidden",
    }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          opacity: 0.6, // maintain same atmospheric backdrop feel
        }}
      >
        <source src="/A_dreamy_hand_drawn_anime_styl.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

