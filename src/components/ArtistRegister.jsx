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
    <section id="artist-register" style={{ background: "#080808", padding: "120px 0 100px", position: "relative", overflow: "hidden" }}>
      {/* Background Decal Pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(200, 255, 43, 0.05) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

      {/* FLORAL VIOLIN DECAL — bottom right corner */}
      <motion.div
        initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
        whileInView={{ opacity: 1, rotate: -14, scale: 1 }}
        viewport={{ once: true }}
        animate={{ y: [0, -10, 0] }}
        transition={{ y: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}
        whileHover={{ scale: 1.08, rotate: -4 }}
        style={{
          position: "absolute",
          bottom: "5%",
          right: "2vw",
          width: "clamp(110px, 15vw, 220px)",
          filter: "drop-shadow(0 20px 35px rgba(0,0,0,0.85))",
          zIndex: 0,
          cursor: "pointer",
          opacity: 0.85,
        }}
      >
        <img src="/violin.png" alt="Floral Violin" style={{ width: "100%", height: "auto", display: "block" }} />
      </motion.div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1300, margin: "0 auto", padding: "0 5vw" }}>
        
        {/* TOP EDITORIAL BADGE */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", color: "#C8FF2B", textTransform: "uppercase" }}>
            // PERFORM WITH TANGY //
          </div>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em" }}>
            CALL FOR CREATORS 2025
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "5vw", alignItems: "center" }} className="artist-spotlight-grid">
          
          {/* LEFT SIDE — Brutalist Frame with Tape Stamps */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            style={{ position: "relative" }}
          >
            <div style={{
              position: "relative",
              border: "1px solid rgba(200,255,43,0.3)",
              background: "#111",
              padding: 12,
              boxShadow: "0 30px 70px rgba(0,0,0,0.9)",
              transform: "rotate(-1deg)"
            }}>
              {/* Tape Stamp Top */}
              <div style={{
                position: "absolute",
                top: -14,
                left: 30,
                background: "rgba(200, 255, 43, 0.25)",
                border: "1px dashed #C8FF2B",
                padding: "3px 18px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.55rem",
                color: "#C8FF2B",
                letterSpacing: "0.2em",
                transform: "rotate(-3deg)",
                zIndex: 3
              }}>
                STAGE SPOTLIGHT
              </div>

              {/* Photo Container */}
              <div style={{
                position: "relative",
                height: "clamp(350px, 42vw, 500px)",
                overflow: "hidden",
                background: "#080808",
              }}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: "url('/gallery/tangy5.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "grayscale(0.3) contrast(1.1)",
                  }}
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 60%)",
                }} />

                {/* Bottom Overlay Label inside photo */}
                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#C8FF2B", letterSpacing: "0.25em" }}>LIVE ACOUSTICS</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff", lineHeight: 1 }}>BANSILAL STEPWELL</div>
                  </div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 8px" }}>
                    HYD // IN
                  </div>
                </div>
              </div>
            </div>

            {/* Brutalist Tag Badge floating */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                bottom: -20,
                right: -15,
                background: "#C8FF2B",
                color: "#080808",
                padding: "10px 18px",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.1rem",
                letterSpacing: "0.1em",
                boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
                zIndex: 4,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>✦</span> OPEN CURATION
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE — Magazine Typography & Action */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <div>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.2rem, 7vw, 5.8rem)",
                color: "#fff",
                lineHeight: 0.9,
                margin: 0,
                letterSpacing: "0.02em",
              }}>
                YOUR MUSIC<br />
                <span style={{
                  WebkitTextStroke: "2px #C8FF2B",
                  WebkitTextFillColor: "transparent",
                }}>
                  BELONGS HERE.
                </span>
              </h2>
            </div>

            <div style={{ height: 2, width: 60, background: "#C8FF2B" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
                We are constantly scouting musicians, bands, singer-songwriters, modular synthesists, producers, and spoken-word performers who create raw, immersive live moments.
              </p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
                If your sound resonates with ancient stone walls and intimate audiences, submit your portfolio to join our upcoming lineup.
              </p>
            </div>

            {/* Feature Highlights Block */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 0", borderTop: "1px dashed rgba(255,255,255,0.1)", borderBottom: "1px dashed rgba(255,255,255,0.1)" }}>
              {[
                { label: "01 // FORMAT", text: "Unplugged, Electronic & Experimental Live Sets" },
                { label: "02 // STAGE",  text: "Hyderabad's Ancient & Heritage Venues" },
                { label: "03 // NETWORK", text: "Connect with India's Curation Collective" }
              ].map((feat, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "#C8FF2B", letterSpacing: "0.2em", width: 90, flexShrink: 0 }}>{feat.label}</span>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.88rem", fontFamily: "'Space Mono', monospace" }}>
                    {feat.text}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
              <div>
                <motion.button
                  onClick={handleNavigate}
                  whileHover={{ scale: 1.02, backgroundColor: "#d7ff54" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: "18px 40px",
                    background: "#C8FF2B",
                    color: "#080808",
                    border: "none",
                    borderRadius: 0,
                    cursor: "pointer",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.25rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.2s ease",
                  }}
                >
                  APPLY AS AN ARTIST <span>→</span>
                </motion.button>
              </div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
                * APPLICATIONS REVIEWED ON A ROLLING BASIS BY OUR CURATION TEAM.
              </div>
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

