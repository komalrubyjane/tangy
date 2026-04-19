// ─── App.jsx (Updated) ───────────────────────────────────────────────────────
// Replace your existing App.jsx with this file.
// Components used (place in src/components/):
//   UnicornBackground.jsx  — unchanged from your original
//   PaymentModal.jsx       — NEW (replace with the PaymentModal.jsx output)
//   Volunteer.jsx          — NEW (replace with the Volunteer.jsx output)
//   AdminDashboard.jsx     — NEW (replace with the AdminDashboard.jsx output)

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import UnicornBackground from "./src/components/UnicornBackground";
import PaymentModal from "./src/components/PaymentModal";
import Volunteer from "./src/components/Volunteer";
import AdminDashboard from "./src/components/AdminDashboard";

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e, i) { console.error("[TangySessions]", e, i); }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: 40, textAlign: "center", background: "#0a0a0a", border: "1px solid #ff4d6d", borderRadius: 12, margin: 20, color: "#ff4d6d", fontFamily: "monospace" }}>
        <div style={{ fontSize: "2rem" }}>⚠</div>
        <div style={{ fontWeight: 700 }}>{this.props.name || "Component"} failed to load.</div>
        <button onClick={() => this.setState({ hasError: false })} style={{ marginTop: 14, padding: "8px 20px", background: "transparent", border: "1px solid #ff4d6d", color: "#ff4d6d", borderRadius: 6, cursor: "pointer" }}>Retry</button>
      </div>
    );
    return this.props.children;
  }
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4200);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }) {
  const colors = { info: "#7c3aed", success: "#10b981", error: "#ef4444", warning: "#f59e0b" };
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: "#111", border: `1px solid ${colors[t.type] || colors.info}`,
              color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: "0.87rem",
              boxShadow: `0 0 20px ${colors[t.type]}44`, maxWidth: 320, fontFamily: "inherit",
            }}>
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EVENTS = [
  { id: 1, name: "Tangy Sessions Vol. 1", date: "Aug 15, 2025", time: "7:00 PM", location: "Bansilal Stepwell", desc: "An immersive night of underground electronic music echoing through ancient stone corridors.", price: 799, tags: ["Deep House", "Ambient"], capacity: 200 },
  { id: 2, name: "Tangy Sessions Vol. 2", date: "Sep 20, 2025", time: "8:00 PM", location: "Bansilal Stepwell", desc: "Deep house and ambient textures meet centuries-old architecture for a transcendent experience.", price: 999, tags: ["House", "Experimental"], capacity: 250 },
  { id: 3, name: "Tangy Sessions: Solstice", date: "Dec 21, 2025", time: "6:30 PM", location: "Bansilal Stepwell", desc: "A winter solstice special — the longest night, the deepest sounds.", price: 1299, tags: ["Techno", "Dark Ambient"], capacity: 180 },
];

const ARTISTS = [
  { id: 1, name: "KRYZEN", role: "Deep House DJ", img: "/artists/artist1.jpg", color: "#7c3aed", bio: "Known for hypnotic 4-hour sets that blur time." },
  { id: 2, name: "Aura.wav", role: "Ambient Producer", img: "/artists/artist2.jpg", color: "#06b6d4", bio: "Crafts sonic landscapes from field recordings & synths." },
  { id: 3, name: "SONDER", role: "Live Electronic", img: "/artists/artist3.jpg", color: "#a855f7", bio: "Live modular synthesis meets rhythm machines." },
  { id: 4, name: "Ritvik", role: "Classical Fusion", img: "/artists/artist4.jpg", color: "#06b6d4", bio: "Carnatic ragas reimagined through electronic processing." },
  { id: 5, name: "ZEPH", role: "Techno DJ", img: "/artists/artist5.jpg", color: "#f59e0b", bio: "Berlin-inspired techno fused with South Asian percussion." },
  { id: 6, name: "Noctis", role: "Dark Ambient", img: "/artists/artist6.jpg", color: "#ef4444", bio: "Sonic architect of midnight soundscapes and drone textures." },
  { id: 7, name: "Priya K", role: "Vocalist", img: "/artists/artist7.jpg", color: "#ec4899", bio: "Haunting vocals that weave through electronic beats." },
  { id: 8, name: "AXIOM", role: "Bass Music", img: "/artists/artist8.jpg", color: "#10b981", bio: "Sub-frequencies that you feel before you hear." },
];

const GALLERY = [
  { id: 1, img: "/gallery/tangy1.jpg", label: "Stepwell Entrance" },
  { id: 2, img: "/gallery/tabgy2.jpg", label: "Stage Setup" },
  { id: 3, img: "/gallery/tangy3.jpg", label: "Crowd Vibes" },
  { id: 4, img: "/gallery/tangy4.jpg", label: "Night Ambience" },
  { id: 5, img: "/gallery/tangy5.jpg", label: "DJ Booth" },
  { id: 6, img: "/gallery/tangy6.jpg", label: "Light Show" },
  { id: 7, img: "/gallery/tngy7.jpg", label: "The Descent" },
  { id: 8, img: "/gallery/tangy8.jpg", label: "Sound Check" },
  { id: 9, img: "/gallery/tangy9.jpg", label: "After Hours" },
  { id: 10, img: "/gallery/tangy10.jpg", label: "Sonic Rituals" },
];

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Home", "Events", "Artists", "Gallery", "Tickets", "Volunteer", "Contact"];

  const scrollTo = (id) => {
    const target = id.toLowerCase();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" }), 120);
      setMenuOpen(false);
      return;
    }
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(9,9,9,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(124,58,237,0.15)" : "none",
      transition: "all 0.35s ease", padding: "0 5vw",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
    }}>
      <div
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "#fff", cursor: "pointer" }}
        onClick={() => scrollTo("home")}>
        TANGY<span style={{ color: "#7c3aed" }}>.</span>
      </div>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: 28 }} className="nav-links">
        {links.map(l => (
          <button key={l} onClick={() => scrollTo(l)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.65)", cursor: "pointer", fontSize: "0.78rem", letterSpacing: "0.14em", fontFamily: "inherit", textTransform: "uppercase", transition: "color 0.2s, transform 0.2s", padding: "4px 0" }}
            onMouseEnter={e => { e.target.style.color = "#7c3aed"; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.65)"; e.target.style.transform = "none"; }}>
            {l}
          </button>
        ))}
      </div>

      {/* Admin link */}
      <button onClick={() => navigate("/admin")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 6, color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: "0.72rem", letterSpacing: "0.1em", transition: "all 0.2s", cursor: "pointer", fontFamily: "inherit" }}
        className="nav-admin"
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#7c3aed"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
        ⚙ Admin
      </button>

      {/* Hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: "none", background: "none", border: "none", color: "#fff", fontSize: "1.4rem", cursor: "pointer" }}
        className="hamburger">
        {menuOpen ? "✕" : "☰"}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ position: "fixed", top: 64, left: 0, right: 0, background: "rgba(9,9,9,0.98)", backdropFilter: "blur(16px)", padding: "20px 5vw 28px", display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map(l => (
              <button key={l} onClick={() => scrollTo(l)}
                style={{ background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.75)", cursor: "pointer", fontSize: "1rem", textAlign: "left", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit", padding: "14px 0" }}>
                {l}
              </button>
            ))}
            <button onClick={() => { navigate("/admin"); setMenuOpen(false); }} style={{ background: "none", border: "none", color: "#7c3aed", textDecoration: "none", fontSize: "0.85rem", padding: "14px 0", letterSpacing: "0.1em", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>⚙ Admin Dashboard</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onBook }) {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => { v.muted = true; v.play().catch(() => setVideoError(true)); });
  }, []);

  return (
    <section id="home" style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#090909" }}>
      {!videoError ? (
        <video ref={videoRef} autoPlay loop muted playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          onError={() => setVideoError(true)}>
          <source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" />
        </video>
      ) : (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse at 30% 50%, #7c3aed1a, transparent 60%), radial-gradient(ellipse at 70% 50%, #06b6d41a, transparent 60%), #090909" }} />
      )}
      {/* Layered overlays */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.58)", zIndex: 1 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, #090909)", zIndex: 2 }} />
      {/* Grain */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, opacity: 0.035, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: 128 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 4, textAlign: "center", padding: "0 24px", maxWidth: 800, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          style={{ fontSize: "clamp(0.65rem, 1.4vw, 0.85rem)", letterSpacing: "0.55em", color: "#7c3aed", textTransform: "uppercase", marginBottom: 20, fontFamily: "monospace" }}>
          Est. 2025 · Hyderabad
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 13vw, 10rem)", lineHeight: 0.92, letterSpacing: "0.04em", color: "#fff", margin: 0, textShadow: "0 0 100px rgba(124,58,237,0.35)" }}>
          TANGY<br /><span style={{ color: "#7c3aed", WebkitTextStroke: "1px rgba(124,58,237,0.3)" }}>SESSIONS</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: "rgba(255,255,255,0.6)", marginTop: 20, letterSpacing: "0.1em" }}>
          Music beneath history
        </motion.p>

        {/* Event pills */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          {["Aug 15", "Sep 20", "Dec 21"].map(d => (
            <span key={d} style={{ padding: "5px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>
              {d}
            </span>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
          <button onClick={onBook} style={{
            padding: "15px 40px", background: "#7c3aed", color: "#fff", border: "none",
            borderRadius: 4, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.12em",
            textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 600,
            boxShadow: "0 0 40px rgba(124,58,237,0.45)", transition: "all 0.25s",
          }}
            onMouseEnter={e => { e.target.style.background = "#6d28d9"; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(124,58,237,0.5)"; }}
            onMouseLeave={e => { e.target.style.background = "#7c3aed"; e.target.style.transform = "none"; e.target.style.boxShadow = "0 0 40px rgba(124,58,237,0.45)"; }}>
            Book Tickets
          </button>
          <button onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })} style={{
            padding: "15px 40px", background: "transparent", color: "#fff",
            border: "1px solid rgba(255,255,255,0.25)", borderRadius: 4,
            cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.12em",
            textTransform: "uppercase", fontSize: "0.85rem", transition: "all 0.25s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = "#06b6d4"; e.target.style.color = "#06b6d4"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.25)"; e.target.style.color = "#fff"; }}>
            Explore Events
          </button>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: 0.4, cursor: "pointer" }}
        onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, #7c3aed)" }} />
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7c3aed", textTransform: "uppercase" }}>Scroll</div>
      </motion.div>
    </section>
  );
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
function Events({ onBook }) {
  return (
    <section id="events" style={{ background: "transparent", padding: "100px 5vw" }}>
      <SectionHeader label="Calendar" title="Upcoming Events" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginTop: 60 }}>
        {EVENTS.map((ev, i) => <EventCard key={ev.id} ev={ev} delay={i * 0.15} onBook={onBook} />)}
      </div>
    </section>
  );
}

function EventCard({ ev, delay, onBook }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay, type: "spring", bounce: 0.3 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(124,58,237,0.06)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14, padding: 32, cursor: "pointer",
        boxShadow: hovered ? "0 24px 60px rgba(124,58,237,0.18)" : "none",
        transition: "all 0.35s ease",
        display: "flex", flexDirection: "column", gap: 0,
      }}>
      {/* Date + time */}
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", color: "#7c3aed", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>
        {ev.date} · {ev.time}
      </div>
      {/* Title */}
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.85rem", color: "#fff", margin: "0 0 10px", letterSpacing: "0.04em", lineHeight: 1.1 }}>
        {ev.name}
      </h3>
      {/* Location */}
      <div style={{ fontSize: "0.78rem", color: "#06b6d4", marginBottom: 14, letterSpacing: "0.08em" }}>
        📍 {ev.location}
      </div>
      {/* Tags */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {ev.tags.map(tag => (
          <span key={tag} style={{ padding: "3px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>
            {tag}
          </span>
        ))}
      </div>
      {/* Description */}
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.87rem", lineHeight: 1.7, marginBottom: 28, flex: 1 }}>
        {ev.desc}
      </p>
      {/* Capacity indicator */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginBottom: 6, letterSpacing: "0.1em" }}>
          <span>AVAILABILITY</span><span>{ev.capacity} max</span>
        </div>
        <div style={{ height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
          <motion.div initial={{ width: 0 }} whileInView={{ width: "60%" }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ height: "100%", borderRadius: 2, background: "linear-gradient(to right, #7c3aed, #06b6d4)" }} />
        </div>
      </div>
      {/* Price + CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>From</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff", letterSpacing: "0.04em" }}>₹{ev.price}</div>
        </div>
        <motion.button onClick={() => onBook(ev)}
          whileHover={{ scale: 1.05, backgroundColor: "#6d28d9" }} whileTap={{ scale: 0.95 }}
          style={{ padding: "11px 26px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.78rem", fontWeight: 600 }}>
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── ARTISTS ──────────────────────────────────────────────────────────────────
function Artists() {
  return (
    <section id="artists" style={{ background: "transparent", padding: "100px 5vw" }}>
      <SectionHeader label="Lineup" title="Artist Roster" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginTop: 60 }}>
        {ARTISTS.map((a, i) => <ArtistCard key={a.id} a={a} delay={i * 0.15} />)}
      </div>
    </section>
  );
}

function ArtistCard({ a, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay, type: "spring", bounce: 0.35 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        textAlign: "center", padding: "40px 24px 32px",
        background: hov ? `${a.color}0d` : "rgba(255,255,255,0.02)",
        border: `1px solid ${hov ? a.color + "44" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, cursor: "pointer",
        boxShadow: hov ? `0 20px 50px ${a.color}18` : "none",
        transition: "all 0.35s ease",
      }}>
      <motion.div
        animate={{ boxShadow: hov ? `0 0 40px ${a.color}55` : "none" }}
        style={{ width: 100, height: 100, borderRadius: "50%", margin: "0 auto 20px", border: `2px solid ${hov ? a.color : "rgba(255,255,255,0.08)"}`, overflow: "hidden", transition: "border-color 0.3s", flexShrink: 0 }}>
        <img src={a.img} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: hov ? "brightness(1.1)" : "brightness(0.85) saturate(0.9)", transition: "filter 0.35s" }} />
      </motion.div>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.65rem", color: "#fff", margin: "0 0 6px", letterSpacing: "0.08em" }}>{a.name}</h3>
      <div style={{ fontSize: "0.72rem", color: a.color, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>{a.role}</div>
      <AnimatePresence>
        {hov && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            {a.bio}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────
function Gallery() {
  const [lightbox, setLightbox] = useState(null);
  const handleKeyDown = useCallback(e => { if (e.key === "Escape") setLightbox(null); }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section id="gallery" style={{ background: "transparent", padding: "100px 5vw" }}>
      <SectionHeader label="Memories" title="Gallery" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginTop: 60 }}>
        {GALLERY.map((item, i) => (
          <motion.div key={item.id} onClick={() => setLightbox(item)}
            initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ scale: 1.03, borderColor: "rgba(124,58,237,0.4)" }}
            style={{
              aspectRatio: "4/3", borderRadius: 10, cursor: "pointer", overflow: "hidden",
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
              transition: "border-color 0.3s",
            }}>
            <img src={item.img} alt={item.label} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease, filter 0.5s ease", filter: "brightness(0.8) saturate(0.9)" }}
              onMouseEnter={e => { e.target.style.transform = "scale(1.08)"; e.target.style.filter = "brightness(1) saturate(1.1)"; }}
              onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.filter = "brightness(0.8) saturate(0.9)"; }}
            />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 16px 14px", background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)", fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{item.label}</div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div onClick={() => setLightbox(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(10px)" }}>
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }} onClick={e => e.stopPropagation()} className="lightbox-inner"
              style={{ background: "#0d0d0d", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20, overflow: "hidden", boxShadow: "0 0 120px rgba(124,58,237,0.18)", maxWidth: "90vw", maxHeight: "85vh" }}>
              <img src={lightbox.img} alt={lightbox.label} style={{ display: "block", maxWidth: "90vw", maxHeight: "75vh", objectFit: "contain", borderRadius: "20px 20px 0 0" }} />
              <div style={{ padding: "18px 28px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#fff", letterSpacing: "0.1em" }}>{lightbox.label}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", marginTop: 6, fontFamily: "monospace", letterSpacing: "0.1em" }}>ESC to close</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── TICKETS ──────────────────────────────────────────────────────────────────
function Tickets({ toast, selectedEvent }) {
  const [form, setForm] = useState({ event: selectedEvent?.id || "", qty: 1, name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (selectedEvent) setForm(f => ({ ...f, event: selectedEvent.id }));
  }, [selectedEvent]);

  const selectedEv = EVENTS.find(e => e.id === Number(form.event));
  const total = selectedEv ? selectedEv.price * form.qty : 0;

  const validate = () => {
    const errs = {};
    if (!form.event) errs.event = "Please select an event";
    if (!form.name.trim()) errs.name = "Name required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required";
    if (!form.qty || form.qty < 1) errs.qty = "Minimum 1 ticket";
    if (form.qty > 10) errs.qty = "Maximum 10 tickets";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) { toast("Please fix the errors above", "error"); return; }
    setShowModal(true);
  };

  const inp = field => ({
    width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${errors[field] ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 8, color: "#fff", fontSize: "0.88rem", fontFamily: "inherit",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  });

  return (
    <section id="tickets" style={{ background: "transparent", padding: "100px 5vw" }}>
      <SectionHeader label="Reserve" title="Book Tickets" />
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", bounce: 0.3 }}
        style={{ maxWidth: 520, margin: "60px auto 0", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(124,58,237,0.18)", borderRadius: 18, padding: "40px 36px" }}>

        {/* Event */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>Select Event</label>
          <select value={form.event} onChange={e => { setForm(f => ({ ...f, event: e.target.value })); setErrors(er => ({ ...er, event: null })); }}
            style={{ ...inp("event"), appearance: "none" }}>
            <option value="" style={{ background: "#0d0d0d" }}>— Choose an event —</option>
            {EVENTS.map(e => <option key={e.id} value={e.id} style={{ background: "#0d0d0d" }}>{e.name} · {e.date}</option>)}
          </select>
          {errors.event && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 6 }}>⚠ {errors.event}</div>}
        </div>

        {/* Name + Email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
          {["name", "email"].map(f => (
            <div key={f}>
              <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>{f}</label>
              <input placeholder={f === "name" ? "Full name" : "Email"} value={form[f]}
                onChange={e => { setForm(x => ({ ...x, [f]: e.target.value })); setErrors(er => ({ ...er, [f]: null })); }}
                style={inp(f)}
                onFocus={e => e.target.style.borderColor = "#7c3aed"}
                onBlur={e => e.target.style.borderColor = errors[f] ? "#ef4444" : "rgba(255,255,255,0.1)"}
              />
              {errors[f] && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors[f]}</div>}
            </div>
          ))}
        </div>

        {/* Quantity */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>Quantity (max 10)</label>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setForm(f => ({ ...f, qty: Math.max(1, f.qty - 1) }))}
              style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>−</button>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#fff", minWidth: 32, textAlign: "center" }}>{form.qty}</div>
            <button onClick={() => setForm(f => ({ ...f, qty: Math.min(10, f.qty + 1) }))}
              style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+</button>
            {errors.qty && <div style={{ color: "#ef4444", fontSize: "0.73rem" }}>⚠ {errors.qty}</div>}
          </div>
        </div>

        {/* Total */}
        <div style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.18)", borderRadius: 10, padding: "18px 20px", marginBottom: 26 }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginBottom: 8 }}>
            <span>Price per ticket</span><span>₹{selectedEv?.price ?? "—"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.7rem", letterSpacing: "0.04em", color: "#fff" }}>
            <span>Total</span><span style={{ color: "#7c3aed" }}>₹{total || "—"}</span>
          </div>
        </div>

        <motion.button onClick={handleSubmit} whileHover={{ scale: 1.02, backgroundColor: "#6d28d9" }} whileTap={{ scale: 0.97 }}
          style={{ width: "100%", padding: 16, background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.9rem", fontWeight: 600, boxShadow: "0 0 30px rgba(124,58,237,0.35)" }}>
          Proceed to Payment →
        </motion.button>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>
          🔒 Secure · Instant confirmation · Free cancellation within 24h
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && <PaymentModal amount={total} event={selectedEv} onClose={() => setShowModal(false)}
          onSuccess={() => { toast("Tickets confirmed! See you at the Stepwell. 🎵", "success"); setForm({ event: "", qty: 1, name: "", email: "" }); }} />}
      </AnimatePresence>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  const stats = [["3", "Sessions"], ["1200+", "Attendees"], ["12", "Artists"], ["1", "Stepwell"]];
  return (
    <section id="about" style={{ background: "transparent", padding: "100px 5vw" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ fontSize: "0.68rem", letterSpacing: "0.35em", color: "#7c3aed", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 16 }}>Our Story</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff", margin: "0 0 36px", letterSpacing: "0.04em" }}>About Tangy Sessions</h2>
          {[
            "Tangy Sessions was born from a single belief: that music hits differently when the walls around you have centuries of stories to tell.",
            "We host underground electronic music events deep inside the Bansilal Stepwell — a monument where geometry, water, and silence converge. The result is something you can't recreate in a nightclub: a resonance that is both ancient and electric.",
            "Each edition is curated with obsessive care — the right artists, the right frequencies, the right hour of night. No VIP egos. Just you, the music, and five hundred years of stone.",
          ].map((p, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
              style={{ color: i === 0 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.4)", fontSize: i === 0 ? "1.05rem" : "0.92rem", lineHeight: 1.85, marginBottom: 20 }}>
              {p}
            </motion.p>
          ))}
        </motion.div>

        <div style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 60, flexWrap: "wrap" }}>
          {stats.map(([n, l], i) => (
            <motion.div key={l}
              initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.08 }} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#7c3aed", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 6 }}>{l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact({ toast }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Invalid email address";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSend = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) { toast("Check the form for errors", "error"); return; }
    setSent(true);
    toast("Message sent! We'll be in touch. 🎵", "success");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  const inp = field => ({
    width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${errors[field] ? "#ef4444" : "rgba(255,255,255,0.09)"}`,
    borderRadius: 8, color: "#fff", fontSize: "0.88rem", fontFamily: "inherit",
    outline: "none", boxSizing: "border-box", marginBottom: 4, transition: "all 0.25s",
  });

  return (
    <section id="contact" style={{ background: "transparent", padding: "100px 5vw" }}>
      <SectionHeader label="Connect" title="Get In Touch" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 60, marginTop: 60, maxWidth: 1000, margin: "60px auto 0" }}>

        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          {[["Location", "Bansilal Stepwell", "Hyderabad, Telangana, India"], ["Contact", "hello@tangysessions.in", ""]].map(([title, line1, line2]) => (
            <div key={title} style={{ marginBottom: 30 }}>
              <div style={{ color: "#7c3aed", fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>{title}</div>
              <div style={{ color: "#fff", fontSize: "0.95rem" }}>{line1}</div>
              {line2 && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>{line2}</div>}
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
            {["Instagram", "Spotify", "SoundCloud"].map(s => (
              <motion.button key={s} onClick={() => toast(`Opening ${s}...`, "info")}
                whileHover={{ scale: 1.05, borderColor: "#7c3aed", color: "#7c3aed" }} whileTap={{ scale: 0.95 }}
                style={{ padding: "9px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", letterSpacing: "0.08em", transition: "all 0.2s" }}>
                {s}
              </motion.button>
            ))}
          </div>
          <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(124,58,237,0.2)", height: 220 }}>
            <iframe title="Bansilal Stepwell" src="https://maps.google.com/maps?q=Bansilal+Baoli+Stepwell+Hyderabad+Telangana&t=&z=16&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.8) contrast(0.9)" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </motion.div>

        {/* Right */}
        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "60px 20px", background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 16 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ fontSize: "3rem", marginBottom: 16 }}>✅</motion.div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff" }}>Message Sent</div>
                <div style={{ color: "rgba(255,255,255,0.45)", marginTop: 8 }}>We'll get back to you shortly.</div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {["name", "email"].map(f => (
                  <div key={f} style={{ marginBottom: 14 }}>
                    <input placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={form[f]}
                      onChange={e => { setForm(x => ({ ...x, [f]: e.target.value })); setErrors(er => ({ ...er, [f]: null })); }}
                      style={inp(f)}
                      onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                      onBlur={e => { e.target.style.borderColor = errors[f] ? "#ef4444" : "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                    />
                    {errors[f] && <div style={{ color: "#ef4444", fontSize: "0.72rem" }}>⚠ {errors[f]}</div>}
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <textarea placeholder="Your message" value={form.message} rows={5}
                    onChange={e => { setForm(x => ({ ...x, message: e.target.value })); setErrors(er => ({ ...er, message: null })); }}
                    style={{ ...inp("message"), resize: "vertical" }}
                    onFocus={e => { e.target.style.borderColor = "#7c3aed"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                    onBlur={e => { e.target.style.borderColor = errors.message ? "#ef4444" : "rgba(255,255,255,0.09)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
                  />
                  {errors.message && <div style={{ color: "#ef4444", fontSize: "0.72rem" }}>⚠ {errors.message}</div>}
                </div>
                <motion.button onClick={handleSend} whileHover={{ scale: 1.02, backgroundColor: "#6d28d9" }} whileTap={{ scale: 0.97 }}
                  style={{ width: "100%", padding: 14, background: "#7c3aed", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 600 }}>
                  Send Message
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "transparent", borderTop: "1px solid rgba(124,58,237,0.1)", padding: "60px 5vw 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.1em", color: "#fff", marginBottom: 8 }}>
            TANGY<span style={{ color: "#7c3aed" }}>.</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", fontStyle: "italic" }}>Music beneath history.</div>
        </div>
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
          {[["Explore", ["Events", "Artists", "Gallery"]], ["Connect", ["Instagram", "Spotify", "Contact"]]].map(([title, items]) => (
            <div key={title}>
              <div style={{ color: "#7c3aed", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>{title}</div>
              {items.map(item => (
                <div key={item} style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.83rem", marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.73rem" }}>© 2025 Tangy Sessions. All rights reserved.</div>
        <div style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.73rem" }}>Bansilal Stepwell, Hyderabad</div>
      </div>
    </footer>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ label, title }) {
  return (
    <motion.div initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} style={{ textAlign: "center" }}>
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.38em", color: "#7c3aed", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>{label}</div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff", margin: 0, letterSpacing: "0.04em" }}>{title}</h2>
      <motion.div initial={{ width: 0 }} whileInView={{ width: 48 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
        style={{ height: 2, background: "linear-gradient(to right, #7c3aed, #06b6d4)", margin: "18px auto 0", borderRadius: 2 }} />
    </motion.div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage() {
  const { toasts, show: toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const scrollToTickets = (ev) => {
    setSelectedEvent(ev || null);
    setTimeout(() => document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  return (
    <div style={{ background: "transparent", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#fff", position: "relative" }}>
      <UnicornBackground />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { -webkit-tap-highlight-color: transparent; overflow-x: hidden; }
        ::selection { background: rgba(124,58,237,0.35); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #090909; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 2px; }
        input, select, textarea, button { font-family: inherit; }

        /* Removed transform: translateZ(0) to fix stacking context issues with background */
        img { content-visibility: auto; }
        video { content-visibility: auto; }

        @media (max-width: 700px) {
          .nav-links, .nav-admin { display: none !important; }
          .hamburger { display: block !important; }
          #events > div:last-child { grid-template-columns: 1fr !important; }
          #artists > div:last-child { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          #gallery > div:nth-child(2) { grid-template-columns: repeat(2, 1fr) !important; }
          #tickets > div { padding: 24px 18px !important; }
          #contact > div:last-child { grid-template-columns: 1fr !important; gap: 36px !important; }
          .lightbox-inner { padding: 36px 24px !important; }
        }
        @media (max-width: 400px) {
          #artists > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />
      <ErrorBoundary name="Hero"><Hero onBook={() => scrollToTickets()} /></ErrorBoundary>
      <ErrorBoundary name="Events"><Events onBook={scrollToTickets} /></ErrorBoundary>
      <ErrorBoundary name="Artists"><Artists /></ErrorBoundary>
      <ErrorBoundary name="Gallery"><Gallery /></ErrorBoundary>
      <ErrorBoundary name="Tickets"><Tickets toast={toast} selectedEvent={selectedEvent} /></ErrorBoundary>
      <ErrorBoundary name="About"><About /></ErrorBoundary>
      <ErrorBoundary name="Volunteer"><Volunteer toast={toast} /></ErrorBoundary>
      <ErrorBoundary name="Contact"><Contact toast={toast} /></ErrorBoundary>
      <Footer />
      <ToastContainer toasts={toasts} />
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
