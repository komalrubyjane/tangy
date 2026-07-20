import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ArtistRegister() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/artist");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="artist-register" style={{ background: "transparent", padding: "clamp(120px, 14vw, 200px) 5vw", position: "relative", overflow: "hidden" }}>
      {/* Background Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at center, transparent 30%, rgba(5, 5, 5, 0.25) 95%), rgba(5, 5, 5, 0.15)",
        zIndex: 0,
        pointerEvents: "none",
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "55vw",
        height: "55vh",
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)",
        filter: "blur(90px)",
        zIndex: 0,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "6vw", alignItems: "center" }} className="artist-spotlight-grid">
          
          {/* Left Side (60%) - Cinematic Performance Image with floating tags */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative" }}
          >
            <div style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid rgba(139, 92, 246, 0.18)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
              height: "clamp(350px, 45vw, 550px)",
            }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: "url('/gallery/tangy5.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(5,5,5,0.65), transparent)",
              }} />
            </div>

            {/* Floating Element 1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "15%",
                left: "-5%",
                background: "rgba(15, 15, 18, 0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
                borderRadius: 12,
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 15px 30px rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ color: "#8B5CF6" }}>🎤</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#fff", letterSpacing: "0.05em" }}>
                Live Music
              </span>
            </motion.div>

            {/* Floating Element 2 */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              style={{
                position: "absolute",
                bottom: "15%",
                right: "-5%",
                background: "rgba(15, 15, 18, 0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
                borderRadius: 12,
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 15px 30px rgba(0,0,0,0.5)",
                zIndex: 2,
              }}
            >
              <span style={{ color: "#8B5CF6" }}>🏛</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#fff", letterSpacing: "0.05em" }}>
                Heritage Venues
              </span>
            </motion.div>

            {/* Floating Element 3 */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{
                position: "absolute",
                bottom: "-5%",
                left: "20%",
                background: "rgba(15, 15, 18, 0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(139, 92, 246, 0.25)",
                borderRadius: 12,
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 15px 30px rgba(0,0,0,0.5)",
                zIndex: 2,
              }}
            >
              <span style={{ color: "#8B5CF6" }}>✦</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#fff", letterSpacing: "0.05em" }}>
                Curated Performances
              </span>
            </motion.div>
          </motion.div>

          {/* Right Side (40%) - Spotlight Information & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.3em", color: "#8B5CF6", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "700" }}>
              PERFORM WITH TANGY • ARTIST OPPORTUNITIES
            </div>

            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 5.5vw, 5rem)",
              color: "#fff",
              lineHeight: 0.95,
              margin: 0,
              letterSpacing: "0.02em",
            }}>
              YOUR MUSIC<br />
              <span style={{ WebkitTextStroke: "1px rgba(139, 92, 246, 0.6)", WebkitTextFillColor: "transparent" }}>
                BELONGS HERE.
              </span>
            </h2>

            <div style={{ height: 2, width: 48, background: "linear-gradient(to right, #8B5CF6, #06b6d4)", borderRadius: 1 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
                We're always looking for musicians, bands, singer-songwriters, instrumentalists, producers, and spoken-word artists who create meaningful live experiences.
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
                If your music connects with people and reflects the intimate spirit of Tangy Sessions, we'd love to hear from you.
              </p>
            </div>

            {/* Feature Highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
              {[
                { icon: "🎤", text: "Curated Live Performances" },
                { icon: "🏛", text: "Perform at Hyderabad's Heritage Venues" },
                { icon: "🌍", text: "Become Part of a Creative Community" }
              ].map((feat, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: "1.3rem" }}>{feat.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.92rem", fontWeight: "500", fontFamily: "inherit" }}>
                    {feat.text}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              <div>
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
                  Apply as an Artist →
                </motion.button>
              </div>
              <span style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.78rem", lineHeight: 1.5, fontFamily: "inherit" }}>
                Applications are reviewed by our curation team. Selected artists will be contacted via email.
              </span>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .artist-spotlight-grid {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
        }
      `}</style>
    </section>
  );
}
