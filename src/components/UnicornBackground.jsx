import React, { useState, useEffect } from "react";
import UnicornScene from "unicornstudio-react";

// Detect mobile/low-end once
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const cores = navigator.hardwareConcurrency || 4;
const mem = navigator.deviceMemory;
const isLowEnd = isMobile && (cores <= 4 || (mem !== undefined && mem < 4));

export default function UnicornBackground() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Hide 3D scene entirely on very low-end devices to prevent frame drops
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
        background: "radial-gradient(ellipse at 25% 40%, rgba(124,58,237,0.12), transparent 55%), radial-gradient(ellipse at 75% 60%, rgba(6,182,212,0.08), transparent 55%), #090909",
      }} />
    );
  }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      zIndex: -1, pointerEvents: "none", background: "#0a0a0a", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "calc(100% + 70px)" }}>
        <UnicornScene
          projectId="x0RCc5vcUYNYLMYi5Amy"
          width="100%"
          height="100%"
          scale={1}
          dpi={isLowEnd ? 0.4 : isMobile ? 0.55 : 0.75}
          fps={isLowEnd ? 24 : isMobile ? 30 : 60}
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.9/dist/unicornStudio.umd.js"
        />
      </div>
    </div>
  );
}
