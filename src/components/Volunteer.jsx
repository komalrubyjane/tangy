import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function SectionBackgroundText() {
  return null;
}

export default function Volunteer() {
  const navigate = useNavigate();

  return (
    <section id="volunteer" style={{ background: "transparent", padding: "clamp(140px, 15vw, 220px) 5vw", position: "relative", overflow: "hidden", perspective: "1000px" }}>
      <SectionBackgroundText text="TANGY" />
      
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at center, transparent 30%, #050505 95%), rgba(5, 5, 5, 0.85)",
        zIndex: 0,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.4em", color: "#8B5CF6", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14, fontWeight: "600" }}>Co-Create The Ritual</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "rgba(255,255,255,0.92)", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Join the Community
          </h2>
          <motion.div initial={{ width: 0 }} whileInView={{ width: 48 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
            style={{ height: 2, background: "linear-gradient(to right, #8B5CF6, #A855F7)", margin: "18px auto 0", borderRadius: 2 }} />
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.9rem, 2vw, 1.15rem)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", marginTop: 28, maxWidth: 650, margin: "28px auto 0", lineHeight: 1.8 }}>
            "This movement is built by hand, heart, and shared devotion. We co-create silent sanctuaries and electric pulses. Join the community to become part of the stillness and the sound."
          </p>
        </motion.div>

        {/* Perks Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32, maxWidth: 1100, margin: "0 auto 64px" }}>
          {[
            { icon: "✨", title: "Meaningful Connections", desc: "Connect with like-minded dreamers, artists, and creators." },
            { icon: "🎵", title: "Behind The Scenes Access", desc: "Work side-by-side with artists and the production team." },
            { icon: "🎨", title: "Creative Collaboration", desc: "Contribute your art, set design, visuals, or music to the movement." },
            { icon: "🌱", title: "Grow With Tangy", desc: "Develop skills and build a sanctuary for sound and stillness." }
          ].map((perk, i) => (
            <motion.div
              key={perk.title}
              whileHover={{ y: -6, borderColor: "rgba(139, 92, 246, 0.3)", boxShadow: "0 20px 40px rgba(0,0,0,0.7), 0 0 25px rgba(139, 92, 246, 0.15)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                background: "rgba(15, 15, 15, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 24,
                padding: "36px 28px",
                textAlign: "center",
                boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
                transition: "all 0.3s ease",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 16 }}>{perk.icon}</div>
              <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.35rem", color: "rgba(255,255,255,0.92)", margin: "0 0 8px", letterSpacing: "0.06em" }}>{perk.title}</h4>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, margin: 0 }}>{perk.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{ display: "flex", justifyContent: "center" }}>
          <motion.button
            onClick={() => { navigate("/volunteer"); window.scrollTo(0, 0); }}
            whileHover={{ scale: 1.03, backgroundColor: "#A855F7", boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "16px 44px",
              background: "#8B5CF6",
              color: "#fff", border: "none", borderRadius: 30,
              cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem",
              fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
            Join the Community
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
