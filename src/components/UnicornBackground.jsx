import React, { useState, useEffect } from "react";

// Detect mobile/low-end once
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const cores = navigator.hardwareConcurrency || 4;
const mem = navigator.deviceMemory;
const isLowEnd = isMobile && (cores <= 4 || (mem !== undefined && mem < 4));

export default function UnicornBackground() {
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
        preload="auto"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%) translateZ(0)",
          opacity: 0.6,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        <source src="/A_dreamy_hand_drawn_anime_styl.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

