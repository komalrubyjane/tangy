import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Volunteer() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/volunteer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="volunteer" style={{ background: "transparent", padding: "clamp(120px, 14vw, 200px) 5vw", position: "relative", overflow: "hidden" }}>
      {/* Background Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at center, transparent 30%, #050505 95%), rgba(5, 5, 5, 0.85)",
        zIndex: 0,
        pointerEvents: "none",
      }} />

      {/* Ambient purple/pink blur glow */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "55vw",
        height: "55vh",
        background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        filter: "blur(90px)",
        zIndex: 0,
        pointerEvents: "none",
      }} />

      {/* Giant Background text */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(8rem, 22vw, 32rem)",
        color: "#8B5CF6",
        opacity: 0.02,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        userSelect: "none",
        zIndex: 0,
        filter: "blur(2px)",
      }}>
        COLLECTIVE
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5vw", alignItems: "center" }} className="vol-teaser-grid">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.4em", color: "#a78bfa", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "600" }}>
              The Collective • Co-Create the Ritual
            </div>
            
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              color: "#fff",
              lineHeight: 0.95,
              margin: 0,
              letterSpacing: "0.02em",
            }}>
              NOT EVERYONE<br />
              <span style={{ WebkitTextStroke: "1px rgba(167,139,250,0.6)", WebkitTextFillColor: "transparent" }}>
                JUST ARRIVES.
              </span>
            </h2>

            <div style={{ height: 2, width: 48, background: "linear-gradient(to right, #8B5CF6, #EC4899)", borderRadius: 1 }} />

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.6,
              margin: 0,
              borderLeft: "2px solid #8B5CF6",
              paddingLeft: 24,
            }}>
              "Some attend the sessions. Others co-create the magic."
            </p>

            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
              Tangy Sessions is built on shared presence, hand-crafted detail, and mutual devotion. We gather to shape silent sanctuaries and electric musical rituals. If you have the curiosity to create, we invite you to build this story with us.
            </p>

            <div style={{ marginTop: 12 }}>
              <motion.button
                onClick={handleNavigate}
                whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(139, 92, 246, 0.45)", backgroundColor: "#7C3AED" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "16px 44px",
                  background: "#8B5CF6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 30,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.25)",
                  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                Join The Collective
              </motion.button>
            </div>
          </motion.div>

          {/* Right: Immersive Image Frame */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative" }}
          >
            <div style={{
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
              height: "clamp(300px, 40vw, 500px)",
            }}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6 }}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: "url('/gallery/tangy3.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(5,5,5,0.7), transparent)",
              }} />
            </div>

            {/* Overlapping small visual accent */}
            <div style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              background: "rgba(11, 11, 15, 0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 8,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 15px 30px rgba(0,0,0,0.5)",
            }}>
              <span style={{ color: "#a78bfa", fontSize: "1.2rem" }}>✦</span>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.1rem",
                color: "#fff",
                letterSpacing: "0.1em",
              }}>
                CREATIVE MOVEMENT
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .vol-teaser-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
