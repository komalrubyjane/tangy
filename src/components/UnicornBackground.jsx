import React from "react";
import UnicornScene from "unicornstudio-react";

export default function UnicornBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', background: '#0a0a0a', overflow: 'hidden' }}>
      {/* 
        We make the inner container slightly taller (calc(100% + 70px)) than the screen.
        Since the watermark is anchored to the bottom, it gets pushed down into the extra 70px.
        The outer div's 'overflow: hidden' completely chops it off, making it invisible.
      */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% + 70px)' }}>
        <UnicornScene
          projectId="x0RCc5vcUYNYLMYi5Amy"
          width="100%"
          height="100%"
          scale={1}
          dpi={0.75}
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.9/dist/unicornStudio.umd.js"
        />
      </div>
    </div>
  );
}
