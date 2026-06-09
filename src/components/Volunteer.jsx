import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Volunteer() {
  const navigate = useNavigate();

  return (
    <section id="volunteer" style={{ background: "transparent", padding: "120px 5vw", perspective: "1000px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.35em", color: "#7c3aed", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Join The Tangy Crew</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Ready to Create Magic?
        </h2>
        <motion.div initial={{ width: 0 }} whileInView={{ width: 48 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
          style={{ height: 2, background: "linear-gradient(to right, #7c3aed, #06b6d4)", margin: "18px auto 0", borderRadius: 2 }} />
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem", marginTop: 20, maxWidth: 500, margin: "20px auto 0", lineHeight: 1.7 }}>
          Help create unforgettable experiences, meet incredible people, gain backstage access, and become part of the Tangy Sessions community.
        </p>
      </motion.div>

      {/* Perks row */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 60 }}>
        {[["🎟️", "Free Entry"], ["🎒", "Merch Kit"], ["🎭", "Backstage"], ["🤝", "Networking"]].map(([icon, label]) => (
          <motion.div key={label}
            whileHover={{ scale: 1.05, borderColor: "rgba(124,58,237,0.5)" }}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
              background: "linear-gradient(135deg, rgba(8,8,12,0.75) 0%, rgba(8,8,12,0.50) 100%)",
              backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(124,58,237,0.22)",
              borderRadius: 40, fontSize: "0.82rem", color: "rgba(255,255,255,0.7)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}>
            <span>{icon}</span><span>{label}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        style={{ textAlign: "center" }}>
        <motion.button
          onClick={() => { navigate("/volunteer"); window.scrollTo(0, 0); }}
          whileHover={{ scale: 1.05, backgroundColor: "#6d28d9" }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "16px 40px",
            background: "#7c3aed",
            color: "#fff", border: "none", borderRadius: 30,
            cursor: "pointer", fontFamily: "inherit", fontSize: "1rem",
            fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
            boxShadow: "0 10px 30px rgba(124,58,237,0.4)",
          }}>
          Wanna Be a Part of It?
        </motion.button>
      </motion.div>
    </section>
  );
}
