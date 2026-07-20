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
        background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
        filter: "blur(90px)",
        zIndex: 0,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "5vw", alignItems: "center" }} className="artist-register-grid">
          
          {/* Left Column: Info & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.4em", color: "#8B5CF6", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "600" }}>
              JOIN THE LINEUP • PERFORM AT TANGY
            </div>

            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              color: "#fff",
              lineHeight: 0.95,
              margin: 0,
              letterSpacing: "0.02em",
            }}>
              ARTIST<br />
              <span style={{ WebkitTextStroke: "1px rgba(139, 92, 246, 0.6)", WebkitTextFillColor: "transparent" }}>
                REGISTRATION
              </span>
            </h2>

            <div style={{ height: 2, width: 48, background: "linear-gradient(to right, #8B5CF6, #06b6d4)", borderRadius: 1 }} />

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
              "Where raw talent meets unforgettable experiences."
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
                Tangy Sessions is always looking for artists who create meaningful live experiences. Whether you're a solo musician, band, instrumentalist, singer-songwriter, producer, or spoken-word artist, we'd love to hear your story.
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
                Every application is personally reviewed by our curation team. Selected artists will be invited to perform at our intimate music sessions across Hyderabad's most iconic heritage venues.
              </p>
            </div>

            {/* Feature Points with Modern Icons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
              {[
                { icon: "🎤", label: "Curated Live Performances" },
                { icon: "🏛", label: "Perform at Heritage Venues" },
                { icon: "🌍", label: "Join a Growing Artist Community" }
              ].map((feat, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: "1.3rem" }}>{feat.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.92rem", fontWeight: "500", fontFamily: "inherit" }}>
                    {feat.label}
                  </span>
                </div>
              ))}
            </div>

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
                Apply as an Artist →
              </motion.button>
            </div>
          </motion.div>

          {/* Right Column: Visually Appealing Collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ position: "relative", height: 500, width: "100%" }}
            className="artist-collage-container"
          >
            {/* Card 1: Artist Performing */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, zIndex: 10, rotate: -2 }}
              style={{
                position: "absolute",
                top: "5%",
                left: "5%",
                width: "55%",
                height: "55%",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                background: "rgba(10,8,18,0.5)",
                backdropFilter: "blur(8px)",
                cursor: "pointer",
              }}
            >
              <img src="/gallery/tangy5.jpg" alt="Artist Performing" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>

            {/* Card 2: Audience Enjoying */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              whileHover={{ scale: 1.05, zIndex: 10, rotate: 2 }}
              style={{
                position: "absolute",
                bottom: "5%",
                right: "5%",
                width: "52%",
                height: "52%",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                background: "rgba(10,8,18,0.5)",
                backdropFilter: "blur(8px)",
                zIndex: 2,
                cursor: "pointer",
              }}
            >
              <img src="/gallery/tangy1.jpg" alt="Audience Enjoying" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>

            {/* Card 3: Heritage Architecture / lighting */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              whileHover={{ scale: 1.05, zIndex: 10, rotate: -4 }}
              style={{
                position: "absolute",
                top: "40%",
                left: "-5%",
                width: "42%",
                height: "42%",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 15px 30px rgba(0,0,0,0.5)",
                background: "rgba(10,8,18,0.5)",
                backdropFilter: "blur(8px)",
                zIndex: 3,
                cursor: "pointer",
              }}
            >
              <img src="/gallery/tngy7.jpg" alt="Heritage Venue Lighting" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .artist-register-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .artist-collage-container {
            height: 380px !important;
            max-width: 480px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
