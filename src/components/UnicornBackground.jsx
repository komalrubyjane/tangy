import React from "react";
import UnicornScene from "unicornstudio-react";

// Performance optimized with dpi=0.75 for 60fps+
// Watermark hidden by physically shifting the bottom 100px of the canvas off-screen
const UnicornBackground = () => {
  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        // We make the height 100px taller than the viewport and hide overflow
        // This physically pushes the bottom watermark off the screen entirely
        height: 'calc(100vh + 100px)', 
        zIndex: -1, 
        pointerEvents: 'none',
        background: '#0a0a0a',
        overflow: 'hidden'
      }}
    >
      <UnicornScene
        projectId="x0RCc5vcUYNYLMYi5Amy"
        width="100%"
        height="100%"
        scale={1}
        dpi={0.75} /* Reduced from 1.5 to 0.75 to hit 60fps easily */
        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.9/dist/unicornStudio.umd.js"
      />
    </div>
  );
};

export default UnicornBackground;
