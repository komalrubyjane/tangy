import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import UnicornBackground from "./src/components/UnicornBackground";
import PaymentModal from "./src/components/PaymentModal";
import Volunteer from "./src/components/Volunteer";
import AdminDashboard from "./src/components/AdminDashboard";

// ─── ERROR BOUNDARY ────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("[TangySessions] Section crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "40px", textAlign: "center", background: "#0a0a0a",
          border: "1px solid #ff4d6d", borderRadius: "12px", margin: "20px",
          color: "#ff4d6d", fontFamily: "monospace"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⚠</div>
          <div style={{ fontWeight: 700 }}>Section failed to load</div>
          <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "6px" }}>
            {this.props.name || "Component"} encountered an error.
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: "14px", padding: "8px 20px", background: "transparent",
              border: "1px solid #ff4d6d", color: "#ff4d6d", borderRadius: "6px",
              cursor: "pointer", fontFamily: "monospace"
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── TOAST SYSTEM ──────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);
  return { toasts, show };
}

function ToastContainer({ toasts }) {
  const colors = { info: "#7c3aed", success: "#10b981", error: "#ef4444", warning: "#f59e0b" };
  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: "#111", border: `1px solid ${colors[t.type] || colors.info}`,
          color: "#fff", padding: "12px 20px", borderRadius: "10px", fontSize: "0.87rem",
          boxShadow: `0 0 20px ${colors[t.type]}44`, maxWidth: "320px",
          animation: "fadeSlideUp 0.3s ease", fontFamily: "inherit"
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── SAFE IMAGE ─────────────────────────────────────────────────────────────
function SafeImage({ src, alt, fallback, style, className }) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (errored) {
    return (
      <div style={{
        ...style, background: "linear-gradient(135deg,#1a1a2e,#16213e)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#444", fontSize: "0.8rem", fontFamily: "monospace"
      }}>
        {fallback || "🎵"}
      </div>
    );
  }
  return (
    <>
      {!loaded && (
        <div style={{ ...style, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 28, height: 28, border: "2px solid #7c3aed", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}
      <img
        src={src} alt={alt}
        style={{ ...style, display: loaded ? "block" : "none" }}
        className={className}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        loading="lazy"
      />
    </>
  );
}

// ─── DATA ───────────────────────────────────────────────────────────────────
const EVENTS = [
  { id: 1, name: "Tangy Sessions Vol. 1", date: "Aug 15, 2025", time: "7:00 PM", location: "Bansilal Stepwell", desc: "An immersive night of underground electronic music echoing through ancient stone corridors.", price: 799 },
  { id: 2, name: "Tangy Sessions Vol. 2", date: "Sep 20, 2025", time: "8:00 PM", location: "Bansilal Stepwell", desc: "Deep house and ambient textures meet centuries-old architecture for a transcendent experience.", price: 999 },
  { id: 3, name: "Tangy Sessions: Solstice", date: "Dec 21, 2025", time: "6:30 PM", location: "Bansilal Stepwell", desc: "A winter solstice special — the longest night, the deepest sounds.", price: 1299 },
];

const ARTISTS = [
  { id: 1, name: "KRYZEN", role: "Deep House DJ", emoji: "🎧", color: "#7c3aed" },
  { id: 2, name: "Aura.wav", role: "Ambient Producer", emoji: "🌊", color: "#06b6d4" },
  { id: 3, name: "SONDER", role: "Live Electronic", emoji: "⚡", color: "#a855f7" },
  { id: 4, name: "Ritvik", role: "Classical Fusion", emoji: "🎻", color: "#06b6d4" },
];

const GALLERY = [
  { id: 1, type: "img", emoji: "🏛️", label: "Stepwell Entrance" },
  { id: 2, type: "img", emoji: "🎶", label: "Stage Setup" },
  { id: 3, type: "img", emoji: "💜", label: "Crowd Vibes" },
  { id: 4, type: "img", emoji: "🌙", label: "Night Ambience" },
  { id: 5, type: "img", emoji: "🎛️", label: "DJ Booth" },
  { id: 6, type: "img", emoji: "✨", label: "Light Show" },
];

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
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
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id.toLowerCase());
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      setMenuOpen(false);
      return;
    }
    try {
      const el = document.getElementById(id.toLowerCase());
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    } catch (e) {
      console.warn("Scroll failed:", e);
    }
  };
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(124,58,237,0.2)" : "none",
      transition: "all 0.4s ease", padding: "0 5vw",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px"
    }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.15em", color: "#fff", cursor: "pointer" }}
        onClick={() => scrollTo("home")}>
        TANGY<span style={{ color: "#7c3aed" }}>.</span>
      </div>
      <div style={{ display: "flex", gap: "28px" }} className="nav-links">
        {links.map(l => (
          <button key={l} onClick={() => scrollTo(l)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.75)", cursor: "pointer", fontSize: "0.8rem", letterSpacing: "0.12em", fontFamily: "inherit", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#7c3aed"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.75)"}
          >{l}</button>
        ))}
      </div>
      <button onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: "none", background: "none", border: "none", color: "#fff", fontSize: "1.4rem", cursor: "pointer" }}
        className="hamburger">☰</button>
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, background: "rgba(10,10,10,0.98)",
          backdropFilter: "blur(12px)", padding: "20px 5vw", display: "flex", flexDirection: "column", gap: "16px"
        }}>
          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l)}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "1rem", textAlign: "left", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "inherit" }}>
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onBook }) {
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = async () => {
      try {
        await v.play();
      } catch (e) {
        console.warn("[Hero] Autoplay blocked:", e.message);
        // Try muted play as fallback
        try { v.muted = true; await v.play(); } catch {}
      }
    };
    tryPlay();
  }, []);

  return (
    <section id="home" style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#0a0a0a" }}>
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
          onCanPlay={() => setVideoLoaded(true)}
          onError={(e) => {
            console.error("[Hero] Video failed:", e);
            setVideoError(true);
          }}
        >
          <source src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" type="video/mp4" />
        </video>
      ) : (
        // Fallback: animated gradient background
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "radial-gradient(ellipse at 30% 50%, #7c3aed22 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, #06b6d422 0%, transparent 60%), #0a0a0a",
          animation: "pulse 4s ease-in-out infinite"
        }} />
      )}
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1 }} />
      {/* Grain */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, opacity: 0.04,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "128px"
      }} />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 3, textAlign: "center", padding: "0 24px" }}>
        <div style={{ fontSize: "clamp(0.7rem, 1.5vw, 0.9rem)", letterSpacing: "0.5em", color: "#7c3aed", textTransform: "uppercase", marginBottom: "20px", fontFamily: "monospace", animation: "fadeSlideUp 0.8s ease both" }}>
          Est. 2025 · Hyderabad
        </div>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(4rem, 12vw, 9rem)",
          lineHeight: 0.95, letterSpacing: "0.05em", color: "#fff",
          margin: 0, animation: "fadeSlideUp 0.8s 0.15s ease both",
          textShadow: "0 0 80px rgba(124,58,237,0.4)"
        }}>
          TANGY<br /><span style={{ color: "#7c3aed" }}>SESSIONS</span>
        </h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
          fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: "rgba(255,255,255,0.7)",
          marginTop: "20px", letterSpacing: "0.08em", animation: "fadeSlideUp 0.8s 0.3s ease both"
        }}>
          Music beneath history
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "40px", flexWrap: "wrap", animation: "fadeSlideUp 0.8s 0.45s ease both" }}>
          <button onClick={onBook} style={{
            padding: "14px 36px", background: "#7c3aed", color: "#fff", border: "none",
            borderRadius: "4px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em",
            textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 600,
            transition: "all 0.3s", boxShadow: "0 0 30px rgba(124,58,237,0.5)"
          }}
            onMouseEnter={e => { e.target.style.background = "#6d28d9"; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.background = "#7c3aed"; e.target.style.transform = "none"; }}>
            Book Tickets
          </button>
          <button onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })} style={{
            padding: "14px 36px", background: "transparent", color: "#fff",
            border: "1px solid rgba(255,255,255,0.35)", borderRadius: "4px",
            cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em",
            textTransform: "uppercase", fontSize: "0.85rem", transition: "all 0.3s"
          }}
            onMouseEnter={e => { e.target.style.borderColor = "#06b6d4"; e.target.style.color = "#06b6d4"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.35)"; e.target.style.color = "#fff"; }}>
            Explore Events
          </button>
        </div>
        {videoError && (
          <div style={{ marginTop: "16px", fontSize: "0.72rem", color: "#f59e0b", fontFamily: "monospace", opacity: 0.7 }}>
            ⚠ Video unavailable — fallback background active
          </div>
        )}
      </div>
      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", opacity: 0.5 }}>
        <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, transparent, #7c3aed)", animation: "pulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
function Events({ onBook }) {
  return (
    <section id="events" style={{ background: "transparent", padding: "100px 5vw", perspective: "1000px" }}>
      <SectionHeader label="Calendar" title="Upcoming Events" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginTop: "60px" }}>
        {EVENTS.map((ev, i) => (
          <EventCard key={ev.id} ev={ev} delay={i * 0.15} onBook={onBook} />
        ))}
      </div>
    </section>
  );
}

function EventCard({ ev, delay, onBook }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
      whileHover={{ 
        scale: 1.02, 
        rotateY: 5, 
        rotateX: -5,
        boxShadow: "0 25px 60px rgba(124,58,237,0.25)",
        borderColor: "rgba(124,58,237,0.6)",
        background: "rgba(124,58,237,0.08)"
      }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px", padding: "32px",
        transformStyle: "preserve-3d",
        cursor: "pointer"
      }}>
      <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", color: "#7c3aed", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "12px", transform: "translateZ(30px)" }}>
        {ev.date} · {ev.time}
      </div>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff", margin: "0 0 8px", letterSpacing: "0.05em", transform: "translateZ(40px)" }}>{ev.name}</h3>
      <div style={{ fontSize: "0.8rem", color: "#06b6d4", marginBottom: "12px", letterSpacing: "0.1em", transform: "translateZ(30px)" }}>📍 {ev.location}</div>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", lineHeight: 1.65, marginBottom: "24px", transform: "translateZ(20px)" }}>{ev.desc}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", transform: "translateZ(40px)" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#fff" }}>
          ₹{ev.price}
        </div>
        <motion.button onClick={() => onBook(ev)} style={{
          padding: "10px 24px", background: "#7c3aed", color: "#fff", border: "none",
          borderRadius: "4px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.08em",
          textTransform: "uppercase", fontSize: "0.78rem"
        }}
          whileHover={{ scale: 1.05, backgroundColor: "#6d28d9" }}
          whileTap={{ scale: 0.95 }}>
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── ARTISTS ─────────────────────────────────────────────────────────────────
function Artists() {
  return (
    <section id="artists" style={{ background: "transparent", padding: "100px 5vw", perspective: "800px" }}>
      <SectionHeader label="Lineup" title="Artist Roster" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", marginTop: "60px" }}>
        {ARTISTS.map((a, i) => <ArtistCard key={a.id} a={a} delay={i * 0.15} />)}
      </div>
    </section>
  );
}

function ArtistCard({ a, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 10,
        rotateX: -10,
        backgroundColor: `${a.color}11`,
        borderColor: a.color + "55",
        boxShadow: `0 30px 60px ${a.color}22`
      }}
      style={{
        textAlign: "center", padding: "40px 24px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px", cursor: "pointer",
        transformStyle: "preserve-3d"
      }}>
      <motion.div style={{
        width: "90px", height: "90px", borderRadius: "50%", margin: "0 auto 20px",
        background: `radial-gradient(circle, ${a.color}44, ${a.color}11)`,
        border: `2px solid rgba(255,255,255,0.1)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2.5rem", transform: "translateZ(50px)"
      }}
      whileHover={{ borderColor: a.color, boxShadow: `0 0 30px ${a.color}55`, scale: 1.1 }}>
        {a.emoji}
      </motion.div>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#fff", margin: "0 0 6px", letterSpacing: "0.08em", transform: "translateZ(30px)" }}>{a.name}</h3>
      <div style={{ fontSize: "0.75rem", color: a.color, letterSpacing: "0.15em", textTransform: "uppercase", transform: "translateZ(20px)" }}>{a.role}</div>
    </motion.div>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────
function Gallery() {
  const [lightbox, setLightbox] = useState(null);
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") setLightbox(null);
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
  return (
    <section id="gallery" style={{ background: "transparent", padding: "100px 5vw", perspective: "1200px" }}>
      <SectionHeader label="Memories" title="Gallery" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px", marginTop: "60px" }}>
        {GALLERY.map((item, i) => (
          <GalleryItem key={item.id} item={item} delay={i * 0.1} onClick={() => setLightbox(item)} />
        ))}
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.div onClick={() => setLightbox(null)} 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 2000,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              backdropFilter: "blur(8px)"
            }}>
            <motion.div 
              initial={{ scale: 0.5, rotateY: 90 }} 
              animate={{ scale: 1, rotateY: 0 }} 
              exit={{ scale: 0.5, rotateY: -90, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="lightbox-inner"
              style={{
                background: "#111", border: "1px solid rgba(124,58,237,0.3)", borderRadius: "16px",
                padding: "60px 80px", textAlign: "center",
                boxShadow: "0 0 100px rgba(124,58,237,0.2)"
              }}>
              <motion.div style={{ fontSize: "5rem", marginBottom: "16px" }}
                animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                {lightbox.emoji}
              </motion.div>
              <div style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.1em" }}>{lightbox.label}</div>
              <div style={{ color: "#555", fontSize: "0.75rem", marginTop: "8px", fontFamily: "monospace" }}>Press ESC to close</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function GalleryItem({ item, delay, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8, rotateZ: -5 }}
      whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.05, 
        rotateZ: 2,
        borderColor: "rgba(124,58,237,0.4)",
        boxShadow: "0 25px 50px rgba(124,58,237,0.25)"
      }}
      style={{
        aspectRatio: "4/3", borderRadius: "10px", cursor: "pointer", overflow: "hidden",
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
        gap: "12px",
        transformStyle: "preserve-3d"
      }}>
      <motion.div style={{ fontSize: "3rem", transform: "translateZ(40px)" }}
        whileHover={{ scale: 1.2 }}>
        {item.emoji}
      </motion.div>
      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", transform: "translateZ(20px)" }}>
        {item.label}
      </div>
    </motion.div>
  );
}

// ─── TICKETS ─────────────────────────────────────────────────────────────────
function Tickets({ toast, selectedEvent }) {
  const [form, setForm] = useState({ event: selectedEvent?.id || "", qty: 1 });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEvent) setForm(f => ({ ...f, event: selectedEvent.id }));
  }, [selectedEvent]);

  const selectedEv = EVENTS.find(e => e.id === Number(form.event));
  const total = selectedEv ? selectedEv.price * form.qty : 0;

  const validate = () => {
    const errs = {};
    if (!form.event) errs.event = "Please select an event";
    if (!form.qty || form.qty < 1) errs.qty = "Minimum 1 ticket";
    if (form.qty > 10) errs.qty = "Maximum 10 tickets per booking";
    return errs;
  };

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast("Please fix the errors above", "error");
      return;
    }
    setShowModal(true);
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${errors[field] ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
    borderRadius: "8px", color: "#fff", fontSize: "0.9rem", fontFamily: "inherit",
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s"
  });

  return (
    <section id="tickets" style={{ background: "transparent", padding: "100px 5vw", perspective: "1000px" }}>
      <SectionHeader label="Reserve" title="Book Tickets" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
        whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
        viewport={{ once: true }} transition={{ type: "spring", bounce: 0.4 }}
        whileHover={{ boxShadow: "0 40px 80px rgba(124,58,237,0.15)" }}
        style={{ maxWidth: "520px", margin: "60px auto 0", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "16px", padding: "40px", transformStyle: "preserve-3d" }}>
        
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px", transform: "translateZ(20px)" }}>
            Select Event
          </label>
          <select value={form.event} onChange={e => { setForm(f => ({ ...f, event: e.target.value })); setErrors(er => ({ ...er, event: null })); }}
            style={{ ...fieldStyle("event"), appearance: "none" }}>
            <option value="" style={{ background: "#0a0a0a" }}>— Choose an event —</option>
            {EVENTS.map(e => <option key={e.id} value={e.id} style={{ background: "#0a0a0a" }}>{e.name} · {e.date}</option>)}
          </select>
          {errors.event && <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "6px" }}>⚠ {errors.event}</div>}
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px", transform: "translateZ(20px)" }}>
            Quantity (max 10)
          </label>
          <input type="number" min="1" max="10" value={form.qty}
            onChange={e => { setForm(f => ({ ...f, qty: parseInt(e.target.value) || 1 })); setErrors(er => ({ ...er, qty: null })); }}
            style={fieldStyle("qty")} />
          {errors.qty && <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "6px" }}>⚠ {errors.qty}</div>}
        </div>

        <motion.div 
          whileHover={{ translateY: -5, boxShadow: "0 10px 30px rgba(124,58,237,0.15)" }}
          style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "10px", padding: "20px", marginBottom: "28px", transform: "translateZ(30px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "8px" }}>
            <span>Price per ticket</span>
            <span>₹{selectedEv?.price ?? "—"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.05em" }}>
            <span>Total</span>
            <span style={{ color: "#7c3aed" }}>₹{total || "—"}</span>
          </div>
        </motion.div>

        <motion.button onClick={handleSubmit} disabled={loading}
          whileHover={!loading ? { scale: 1.02, backgroundColor: "#6d28d9" } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          style={{
            width: "100%", padding: "16px", background: loading ? "#4c1d95" : "#7c3aed",
            color: "#fff", border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.9rem",
            fontWeight: 600, transition: "background 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            transform: "translateZ(40px)"
          }}>
          {loading ? (
            <><span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Processing...</>
          ) : "Proceed to Payment"}
        </motion.button>
      </motion.div>
      <AnimatePresence>
        {showModal && <PaymentModal amount={total} event={selectedEv} onClose={() => setShowModal(false)} onSuccess={() => { toast("Tickets Booked! See you at the Stepwell.", "success"); setForm({event: "", qty: 1}); }} />}
      </AnimatePresence>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section id="about" style={{ background: "transparent", padding: "100px 5vw", perspective: "1000px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }} style={{ fontSize: "0.72rem", letterSpacing: "0.35em", color: "#7c3aed", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "16px" }}>Our Story</motion.div>
        
        <motion.h2 initial={{ opacity: 0, rotateX: -30 }} whileInView={{ opacity: 1, rotateX: 0 }} transition={{ delay: 0.1, type: "spring" }} viewport={{ once:true }} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff", margin: "0 0 32px", letterSpacing: "0.05em" }}>
          About Tangy Sessions
        </motion.h2>
        
        <motion.p initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} viewport={{ once:true }} style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "20px" }}>
          Tangy Sessions was born from a single belief: that music hits differently when the walls around you have centuries of stories to tell.
        </motion.p>
        
        <motion.p initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} viewport={{ once:true }} style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: "20px" }}>
          We host underground electronic music events deep inside the Bansilal Stepwell — a monument where geometry, water, and silence converge. The result is something you can't recreate in a nightclub: a resonance that is both ancient and electric.
        </motion.p>
        
        <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} viewport={{ once:true }} style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.95rem", lineHeight: 1.8 }}>
          Each edition is curated with obsessive care — the right artists, the right frequencies, the right hour of night. No VIP egos. Just you, the music, and five hundred years of stone.
        </motion.p>
        
        <div style={{ display: "flex", gap: "40px", justifyContent: "center", marginTop: "60px", flexWrap: "wrap", transformStyle: "preserve-3d" }}>
          {[["3", "Sessions"], ["1200+", "Attendees"], ["12", "Artists"], ["1", "Stepwell"]].map(([n, l], i) => (
            <motion.div key={l} 
              initial={{ opacity: 0, scale: 0.5, rotateY: 90 }} 
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }} 
              viewport={{ once:true }} transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.1, translateY: -10 }}
              style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "#7c3aed", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: "6px" }}>{l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact({ toast }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address";
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

  const inp = (field) => ({
    width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)",
    border: `1px solid ${errors[field] ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "8px", color: "#fff", fontSize: "0.9rem", fontFamily: "inherit",
    outline: "none", boxSizing: "border-box", marginBottom: "4px",
    transition: "all 0.3s"
  });

  return (
    <section id="contact" style={{ background: "transparent", padding: "100px 5vw", perspective: "1000px" }}>
      <SectionHeader label="Connect" title="Get In Touch" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "60px", marginTop: "60px", maxWidth: "1000px", margin: "60px auto 0" }}>
        
        {/* Left */}
        <motion.div 
          initial={{ opacity: 0, x: -50, rotateY: 20 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}>
          <div style={{ marginBottom: "32px", transform: "translateZ(20px)" }}>
            <div style={{ color: "#7c3aed", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "8px" }}>Location</div>
            <div style={{ color: "#fff", fontSize: "1.05rem" }}>Bansilal Stepwell</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>Hyderabad, Telangana, India</div>
          </div>
          <div style={{ marginBottom: "32px", transform: "translateZ(20px)" }}>
            <div style={{ color: "#7c3aed", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "8px" }}>Contact</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>hello@tangysessions.in</div>
          </div>
          <div className="social-btns" style={{ display: "flex", gap: "16px", marginTop: "32px", transform: "translateZ(30px)" }}>
            {["Instagram", "Spotify", "SoundCloud"].map((s, i) => (
              <motion.button key={s} onClick={() => toast(`Opening ${s}...`, "info")}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.1, borderColor: "#7c3aed", color: "#7c3aed" }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: "10px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", letterSpacing: "0.08em" }}>
                {s}
              </motion.button>
            ))}
          </div>
          
          <motion.div 
            whileHover={{ boxShadow: "0 20px 40px rgba(124,58,237,0.25)", borderColor: "rgba(124,58,237,0.4)" }}
            style={{ marginTop: "32px", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(124,58,237,0.2)", height: "220px", transform: "translateZ(40px)", position: "relative" }}>
            <iframe
              title="Bansilal Stepwell Location"
              src="https://maps.google.com/maps?q=Bansilal+Baoli+Stepwell+Hyderabad+Telangana&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.8) contrast(0.9)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </motion.div>

        {/* Right — form */}
        <motion.div 
          initial={{ opacity: 0, x: 50, rotateY: -20 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}>
          
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, rotateY: -90 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 90 }}
                style={{ textAlign: "center", padding: "60px 20px", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px" }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ fontSize: "3rem", marginBottom: "16px" }}>✅</motion.div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff" }}>Message Sent</div>
                <div style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>We'll get back to you shortly.</div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {["name", "email"].map(f => (
                  <div key={f} style={{ marginBottom: "16px" }}>
                    <input placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={form[f]}
                      onChange={e => { setForm(x => ({ ...x, [f]: e.target.value })); setErrors(er => ({ ...er, [f]: null })); }}
                      style={inp(f)} 
                      onFocus={(e) => { e.target.style.borderColor = "#7c3aed"; e.target.style.background="rgba(255,255,255,0.08)"; }}
                      onBlur={(e) => { e.target.style.borderColor = errors[f] ? "#ef4444" : "rgba(255,255,255,0.1)"; e.target.style.background="rgba(255,255,255,0.04)"; }}/>
                    {errors[f] && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: "4px" }}>⚠ {errors[f]}</motion.div>}
                  </div>
                ))}
                <div style={{ marginBottom: "20px" }}>
                  <textarea placeholder="Your message" value={form.message} rows={5}
                    onChange={e => { setForm(x => ({ ...x, message: e.target.value })); setErrors(er => ({ ...er, message: null })); }}
                    style={{ ...inp("message"), resize: "vertical" }} 
                    onFocus={(e) => { e.target.style.borderColor = "#7c3aed"; e.target.style.background="rgba(255,255,255,0.08)"; }}
                    onBlur={(e) => { e.target.style.borderColor = errors.message ? "#ef4444" : "rgba(255,255,255,0.1)"; e.target.style.background="rgba(255,255,255,0.04)"; }}/>
                  {errors.message && <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: "4px" }}>⚠ {errors.message}</motion.div>}
                </div>
                <motion.button onClick={handleSend}
                  whileHover={{ scale: 1.02, backgroundColor: "#6d28d9", boxShadow: "0 10px 20px rgba(124,58,237,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%", padding: "14px", background: "#7c3aed", color: "#fff", border: "none",
                    borderRadius: "8px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em",
                    textTransform: "uppercase", fontSize: "0.85rem", transform: "translateZ(20px)"
                  }}>
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

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "transparent", borderTop: "1px solid rgba(124,58,237,0.15)", padding: "60px 5vw 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px", marginBottom: "48px" }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.12em", color: "#fff", marginBottom: "8px" }}>
            TANGY<span style={{ color: "#7c3aed" }}>.</span>
          </div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", fontStyle: "italic" }}>Music beneath history.</div>
        </div>
        <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
          {[
            ["Explore", ["Events", "Artists", "Gallery"]],
            ["Connect", ["Instagram", "Spotify", "Contact"]]
          ].map(([title, items]) => (
            <div key={title}>
              <div style={{ color: "#7c3aed", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "16px" }}>{title}</div>
              {items.map(item => (
                <div key={item} style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginBottom: "10px", cursor: "pointer" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>© 2025 Tangy Sessions. All rights reserved.</div>
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>Bansilal Stepwell, Hyderabad</div>
      </div>
    </footer>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function SectionHeader({ label, title }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      style={{ textAlign: "center", marginBottom: "8px" }}>
      <div style={{ fontSize: "0.7rem", letterSpacing: "0.35em", color: "#7c3aed", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "14px" }}>{label}</div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff", margin: 0, letterSpacing: "0.05em" }}>{title}</h2>
      <motion.div 
        initial={{ width: 0 }} 
        whileInView={{ width: "48px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ height: "2px", background: "linear-gradient(to right, #7c3aed, #06b6d4)", margin: "18px auto 0", borderRadius: "2px" }} />
    </motion.div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

function LandingPage() {
  const { toasts, show: toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const scrollToTickets = (ev) => {
    setSelectedEvent(ev || null);
    setTimeout(() => {
      document.getElementById("tickets")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div style={{ background: "transparent", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#fff", position: "relative" }}>
      <UnicornBackground />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        * { box-sizing: border-box; margin:0; padding:0; }
        html { scroll-behavior: smooth; }
        body { -webkit-tap-highlight-color: transparent; }
        img, video { max-width: 100%; }
        input, select, textarea, button { font-family: inherit; }
        ::selection { background: rgba(124,58,237,0.35); }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#0a0a0a; }
        ::-webkit-scrollbar-thumb { background:#7c3aed; border-radius:2px; }

        /* ─── MOBILE BREAKPOINT ─── */
        @media (max-width: 700px) {
          .nav-links { display: none !important; }
          .hamburger { display: block !important; }

          /* Sections */
          #home { min-height: 100svh; }
          #events, #artists, #gallery, #tickets, #about, #contact { padding: 70px 5vw !important; }

          /* Hero buttons stacked */
          #home > div > div > div {
            flex-direction: column !important;
            align-items: center !important;
          }
          #home button { width: 100% !important; max-width: 320px; }

          /* Events: single column */
          #events > div:last-child {
            grid-template-columns: 1fr !important;
          }

          /* Artists: 2 columns on mobile */
          #artists > div:last-child {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px !important;
          }

          /* Gallery: 2 columns */
          #gallery > div:nth-child(2) {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }

          /* Tickets form: full width */
          #tickets > div { padding: 24px 16px !important; margin: 30px 0 0 !important; max-width: 100% !important; }

          /* About stats: wrap tight */
          #about div[style*='gap: 40px'] { gap: 24px !important; }

          /* Contact grid: single column */
          #contact > div:last-child {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }

          /* Footer flex-col */
          footer > div:first-child { flex-direction: column !important; gap: 24px !important; }
          footer > div:first-child > div:last-child { flex-direction: column !important; gap: 24px !important; }

          /* Gallery lightbox */
          .lightbox-inner { padding: 36px 24px !important; }

          /* Social buttons wrap */
          .social-btns { flex-wrap: wrap !important; }
        }

        /* ─── SMALL MOBILE ─── */
        @media (max-width: 400px) {
          #artists > div:last-child {
            grid-template-columns: 1fr !important;
          }
          #gallery > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <Navbar />
      <ErrorBoundary name="Hero">
        <Hero onBook={() => scrollToTickets()} />
      </ErrorBoundary>
      <ErrorBoundary name="Events">
        <Events onBook={scrollToTickets} />
      </ErrorBoundary>
      <ErrorBoundary name="Artists">
        <Artists />
      </ErrorBoundary>
      <ErrorBoundary name="Gallery">
        <Gallery />
      </ErrorBoundary>
      <ErrorBoundary name="Tickets">
        <Tickets toast={toast} selectedEvent={selectedEvent} />
      </ErrorBoundary>
      <ErrorBoundary name="About">
        <About />
      </ErrorBoundary>
      <ErrorBoundary name="Volunteer">
        <Volunteer toast={toast} />
      </ErrorBoundary>
      <ErrorBoundary name="Contact">
        <Contact toast={toast} />
      </ErrorBoundary>
      <Footer />
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
