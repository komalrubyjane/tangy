import React from "react";
import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  typeof navigator !== "undefined" ? navigator.userAgent : ""
);

function useAutoHover(amount = 0.35) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount, margin: "0px 0px -10% 0px" });
  const [isMouseHovered, setIsMouseHovered] = useState(false);
  
  const isHovered = isMobile ? isInView : isMouseHovered;

  const hoverProps = isMobile ? {} : {
    onMouseEnter: () => setIsMouseHovered(true),
    onMouseLeave: () => setIsMouseHovered(false),
  };

  return { ref, isHovered, hoverProps };
}

export default function Volunteer() {
  const btnHover = useAutoHover(0.5);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/volunteer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="volunteer" style={{ background: "#080808", padding: "120px 5vw", position: "relative", overflow: "hidden", contain: "paint layout" }}>
      {/* Background Graphic Lines / Torn paper effect simulated via grid */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", zIndex: 0, background: "repeating-linear-gradient(45deg, #fff, #fff 10px, transparent 10px, transparent 20px)" }} />
      
      {/* Moving Marquee Text */}
      <div style={{ position: "absolute", top: 20, left: 0, right: 0, overflow: "hidden", whiteSpace: "nowrap", opacity: 0.15, zIndex: 0 }}>
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 15, repeat: Infinity }}
          style={{ display: "inline-block", fontSize: "clamp(4rem, 10vw, 8rem)", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em", color: "#C8FF2B", willChange: "transform", transform: "translateZ(0)" }}
        >
          CO-CREATE THE RITUAL • JOIN THE COLLECTIVE • CO-CREATE THE RITUAL • JOIN THE COLLECTIVE • 
        </motion.div>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1300, margin: "0 auto" }}>
        
        {/* Asymmetric layout with large poster-like visuals */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "6vw", alignItems: "center" }} className="vol-teaser-grid">
          
          {/* Right Column becomes Left, asymmetric and overlapping */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative" }}
          >
            <div style={{
              position: "relative",
              border: "2px solid #C8FF2B",
              padding: "10px",
              background: "#111111",
              transform: "rotate(-2deg)",
            }}>
              <img src="/gallery/tangy6.jpg" alt="Join Collective" loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block", filter: "grayscale(1) contrast(1.2)" }} />
              
              {/* Overlapping Graffiti/Ticket Graphic stamp */}
              <div style={{
                position: "absolute",
                top: -30,
                right: -20,
                background: "#FF2E52",
                color: "#080808",
                padding: "8px 16px",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.2rem",
                letterSpacing: "0.1em",
                transform: "rotate(6deg)",
                boxShadow: "5px 5px 0px #080808",
                fontWeight: "bold",
              }}>
                BUILD THE STORY
              </div>

              {/* Barcode Accent */}
              <div style={{ display: "flex", gap: 3, height: 40, marginTop: 12, justifyContent: "center", opacity: 0.8 }}>
                {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 1, 2].map((w, idx) => (
                  <div key={idx} style={{ width: w, height: "100%", background: "#C8FF2B" }} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Left Content Column with bold typography */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", flexDirection: "column", gap: 28 }}
          >
            <div style={{ alignSelf: "flex-start", background: "#2A593E", color: "#C8FF2B", padding: "6px 14px", fontSize: "0.72rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: "bold", fontFamily: "monospace" }}>
              NOT EVERYONE JUST ARRIVES
            </div>

            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.5rem, 7vw, 6.5rem)",
              color: "#fff",
              lineHeight: 0.9,
              margin: 0,
              letterSpacing: "0.01em",
            }}>
              SOME PEOPLE<br />
              <span style={{ color: "#C8FF2B" }}>HELP CREATE</span><br />
              THE MAGIC.
            </h2>

            <div style={{ borderTop: "2px dashed rgba(255,255,255,0.15)", paddingTop: 20 }}>
              <p style={{ color: "#A4A4A4", fontSize: "1rem", lineHeight: 1.8, margin: 0 }}>
                Tangy Sessions is built on shared presence, hand-crafted detail, and mutual devotion. We gather to shape silent sanctuaries and electric musical rituals. If you have the curiosity to create, we invite you to build this story with us.
              </p>
            </div>

            {/* Poster CTA Button */}
            <div style={{ marginTop: 8 }}>
              <motion.button
                ref={btnHover.ref}
                {...btnHover.hoverProps}
                onClick={handleNavigate}
                animate={{ 
                  scale: btnHover.isHovered ? 1.05 : 1, 
                  backgroundColor: btnHover.isHovered ? "#C8FF2B" : "transparent", 
                  color: btnHover.isHovered ? "#080808" : "#C8FF2B", 
                  boxShadow: btnHover.isHovered ? "0 0 30px rgba(200, 255, 43, 0.4)" : "none" 
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "20px 48px",
                  background: "transparent",
                  color: "#C8FF2B",
                  border: "2px solid #C8FF2B",
                  borderRadius: 0,
                  cursor: "pointer",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.4rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                }}
              >
                APPLY TO VOLUNTEER →
              </motion.button>
            </div>

          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .vol-teaser-grid {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
        }
      `}</style>
    </section>
  );
}
