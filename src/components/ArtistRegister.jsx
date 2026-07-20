import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArtistRegister({ toast }) {
  const [form, setForm] = useState({ name: "", email: "", genre: "", link: "", description: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Artist/Band Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email address is required";
    if (!form.genre.trim()) errs.genre = "Genre/Performance Type is required";
    if (!form.link.trim()) errs.link = "Music/Portfolio link is required";
    return errs;
  };

  const handleRegister = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      if (toast) toast({ message: "Check the registration form for errors", type: "error" });
      return;
    }
    setLoading(true);
    // Simulate API registration call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      if (toast) toast({ message: "Artist application submitted! 🎵", type: "success" });
      setForm({ name: "", email: "", genre: "", link: "", description: "" });
      setTimeout(() => setSuccess(false), 6000);
    }, 1200);
  };

  const inp = field => ({
    width: "100%", padding: "14px 18px",
    background: "rgba(0,0,0,0.55)",
    border: `1px solid ${errors[field] ? "#ef4444" : "rgba(139, 92, 246, 0.25)"}`,
    borderRadius: 8, color: "#fff", fontSize: "0.88rem", fontFamily: "inherit",
    outline: "none", boxSizing: "border-box", marginBottom: 4, transition: "all 0.25s",
  });

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
          
          {/* Left: Info details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.4em", color: "#8B5CF6", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "600" }}>
              Join the Lineup • Perform at Tangy
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
              "Where raw talent meets historical architectural resonance."
            </p>

            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
              Are you an electronic music producer, ambient sound architect, visual designer, or classical-fusion instrumentalist looking to share your sounds in Hyderabad's premier acoustic stepwell sanctuary? Fill out your information to connect with our booking curators.
            </p>
          </motion.div>

          {/* Right: Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            style={{
              background: "linear-gradient(135deg, rgba(8,8,12,0.7) 0%, rgba(8,8,12,0.45) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "40px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
              position: "relative",
            }}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 20 }}>🎵</div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#fff", margin: "0 0 10px", letterSpacing: "0.06em" }}>Application Received!</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    Thank you for applying. Our curation team will listen to your work and get in touch if your sound matches our upcoming session vibes.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ marginBottom: 14 }}>
                    <input
                      placeholder="Artist / Band Name"
                      value={form.name}
                      onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                      style={inp("name")}
                    />
                    {errors.name && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 4 }}>⚠ {errors.name}</div>}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <input
                      placeholder="Email Address"
                      type="email"
                      value={form.email}
                      onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                      style={inp("email")}
                    />
                    {errors.email && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 4 }}>⚠ {errors.email}</div>}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <input
                      placeholder="Genre (e.g. Deep House, Dark Ambient, Modular)"
                      value={form.genre}
                      onChange={e => setForm(prev => ({ ...prev, genre: e.target.value }))}
                      style={inp("genre")}
                    />
                    {errors.genre && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 4 }}>⚠ {errors.genre}</div>}
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <input
                      placeholder="Music Link (SoundCloud, Spotify, Mixcloud, YouTube)"
                      value={form.link}
                      onChange={e => setForm(prev => ({ ...prev, link: e.target.value }))}
                      style={inp("link")}
                    />
                    {errors.link && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 4 }}>⚠ {errors.link}</div>}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <textarea
                      placeholder="Tell us about your live setup, instruments, or general musical path..."
                      value={form.description}
                      onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      style={{ ...inp("description"), resize: "vertical" }}
                    />
                  </div>

                  <motion.button
                    onClick={handleRegister}
                    disabled={loading}
                    whileHover={{ scale: 1.02, backgroundColor: "#7C3AED" }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%", padding: 15, background: "#8B5CF6", color: "#fff",
                      border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                      letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.85rem",
                      fontWeight: 700, boxShadow: "0 10px 25px rgba(139, 92, 246, 0.25)",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    {loading ? "Submitting..." : "Apply to Perform"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .artist-register-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </section>
  );
}
