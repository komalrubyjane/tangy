// ─── App.jsx (Updated) ───────────────────────────────────────────────────────
// Replace your existing App.jsx with this file.
// Components used (place in src/components/):
//   UnicornBackground.jsx  — unchanged from your original
//   PaymentModal.jsx       — NEW (replace with the PaymentModal.jsx output)
//   Volunteer.jsx          — NEW (replace with the Volunteer.jsx output)
//   AdminDashboard.jsx     — NEW (replace with the AdminDashboard.jsx output)

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import UnicornBackground from "./src/components/UnicornBackground";
import Volunteer from "./src/components/Volunteer";
import ArtistRegister from "./src/components/ArtistRegister";
import AdminDashboard from "./src/components/AdminDashboard";
import ArtistPortal from "./TangyArtistPortal";
import { ModalProvider, useModal } from "./src/components/ModalProvider";
import ArtistDetails from "./src/components/ArtistDetails";
import EventDetails from "./src/pages/EventDetails";
import VolunteerDetails from "./src/pages/VolunteerDetails";

// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e, i) { console.error("[TangySessions]", e, i); }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: 40, textAlign: "center", background: "#080808", border: "1px solid #ff4d6d", borderRadius: 12, margin: 20, color: "#ff4d6d", fontFamily: "monospace" }}>
        <div style={{ fontSize: "2rem" }}>⚠</div>
        <div style={{ fontWeight: 700 }}>{this.props.name || "Component"} failed to load.</div>
        <button onClick={() => this.setState({ hasError: false })} style={{ marginTop: 14, padding: "8px 20px", background: "transparent", border: "1px solid #ff4d6d", color: "#ff4d6d", borderRadius: 6, cursor: "pointer" }}>Retry</button>
      </div>
    );
    return this.props.children;
  }
}


// ─── PERFORMANCE UTILS ────────────────────────────────────────────────────────
// Detect low-end devices once at module load (avoids repeated checks)
const isLowEndDevice = (() => {
  if (typeof window === "undefined") return false;
  const mem = navigator.deviceMemory; // GB, undefined on Firefox/Safari
  const cores = navigator.hardwareConcurrency || 4;
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  // Flag as low-end: <2 GB RAM, single/dual core, or prefers-reduced-motion
  return prefersReduced || cores <= 2 || (mem !== undefined && mem < 2) || (isMobile && cores <= 4);
})();

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  typeof navigator !== "undefined" ? navigator.userAgent : ""
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EVENTS = [
  { id: 1, slug: "vol-1", name: "Tangy Sessions Vol. 1", date: "Aug 15, 2025", time: "7:00 PM", location: "Bansilal Stepwell", desc: "An immersive night of underground electronic music echoing through ancient stone corridors.", price: 799, tags: ["Deep House", "Ambient"], capacity: 200 },
  { id: 2, slug: "vol-2", name: "Tangy Sessions Vol. 2", date: "Sep 20, 2025", time: "8:00 PM", location: "Bansilal Stepwell", desc: "Deep house and ambient textures meet centuries-old architecture for a transcendent experience.", price: 999, tags: ["House", "Experimental"], capacity: 250 },
  { id: 3, slug: "solstice", name: "Tangy Sessions: Solstice", date: "Dec 21, 2025", time: "6:30 PM", location: "Bansilal Stepwell", desc: "A winter solstice special — the longest night, the deepest sounds.", price: 1299, tags: ["Techno", "Dark Ambient"], capacity: 180 },
];

const ARTISTS = [
  { id: 1, name: "KRYZEN",   role: "Deep House DJ",       img: "/artists/artist1.jpg", color: "#C8FF2B", bio: "Architect of hypnotic, 4-hour deep house journeys. Influenced by Berlin minimalism and classical structure, KRYZEN's sets blur the boundary between time and trance.",   genre: "Deep House / Hypnotic Techno", location: "Mumbai, India",     followers: "24.5K", performances: "140+" },
  { id: 2, name: "Aura.wav", role: "Ambient Producer",     img: "/artists/artist2.jpg", color: "#06b6d4", bio: "Crafts breathtaking sonic landscapes from field recordings, modular synths, and processing algorithms. Aura.wav's work translates nature's chaos into crystalline sound.",   genre: "Ambient / IDM",               location: "Bangalore, India",  followers: "18.2K", performances: "98+" },
  { id: 3, name: "SONDER",   role: "Live Electronic",     img: "/artists/artist3.jpg", color: "#C8FF2B", bio: "Live modular synthesis meets rhythm machines — every performance built entirely from patch cables and analog hardware. No presets. No laptops. Pure human emotion.",        genre: "Live Modular / Experimental", location: "New Delhi, India",  followers: "31.0K", performances: "165+" },
  { id: 4, name: "Ritvik",   role: "Classical Fusion",    img: "/artists/artist4.jpg", color: "#06b6d4", bio: "Carnatic ragas reimagined through electronic processing. Ritvik bridges centuries-old devotion with underground club dynamics — vocal purity meets synthesis power.",    genre: "Classical Fusion / Electronic", location: "Chennai, India",  followers: "42.1K", performances: "210+" },
  { id: 5, name: "ZEPH",    role: "Techno DJ",            img: "/artists/artist5.jpg", color: "#f59e0b", bio: "Berlin-inspired techno fused with South Asian percussion. ZEPH's high-energy mechanical rituals push subwoofers to their limits with mridangam-meets-modular madness.",  genre: "Techno / Experimental",       location: "Kochi, India",      followers: "15.7K", performances: "78+" },
  { id: 6, name: "Noctis",  role: "Dark Ambient",         img: "/artists/artist6.jpg", color: "#ef4444", bio: "Sonic architect of midnight soundscapes and drone textures. Noctis creates monolithic walls of sub-drone and processed industrial feedback — music felt as physical weight.", genre: "Dark Ambient / Drone",         location: "Kolkata, India",    followers: "12.8K", performances: "60+" },
  { id: 7, name: "Priya K", role: "Vocalist",              img: "/artists/artist7.jpg", color: "#ec4899", bio: "Haunting vocals weaving through electronic beats. Priya K combines dreamlike vocal sequences with modular pitch-shifting and driving deep house for a deeply personal club experience.", genre: "Vocal / Dream House",          location: "Hyderabad, India",  followers: "53.4K", performances: "132+" },
  { id: 8, name: "AXIOM",   role: "Bass Music",           img: "/artists/artist8.jpg", color: "#10b981", bio: "Sub-frequencies that you feel before you hear. AXIOM draws from UK dubstep and experimental glitch to build sets that test the physical boundaries of heavyweight sound systems.", genre: "Bass Music / Leftfield",       location: "Pune, India",       followers: "28.9K", performances: "105+" },
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

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const SpotifyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.894-.978-.335.076-.668-.135-.744-.47-.076-.335.135-.668.47-.744 3.856-.88 7.15-.5 9.822 1.137.295.18.387.563.206.858zm1.225-2.72c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.076-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.666-1.112 8.232-.57 11.346 1.347.367.227.487.708.26 1.074zm.107-2.834C14.428 8.788 8.647 8.6 5.275 9.623c-.53.16-1.09-.14-1.25-.67-.16-.53.14-1.09.67-1.25 3.863-1.172 10.233-.96 14.26 1.43.477.283.633.9.35 1.378-.283.478-.9.633-1.378.35v-.002z"/></svg>
);

const SoundCloudIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}><path d="M12 4c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1s1-.45 1-1V5c0-.55-.45-1-1-1zm5 4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1s1-.45 1-1V9c0-.55-.45-1-1-1zm-10 3c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1zm15-1c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1v-4c0-.55-.45-1-1-1zM2 12c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1s1-.45 1-1v-1c0-.55-.45-1-1-1z"/></svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

function SectionBackgroundText() {
  return null;
}

function MagneticButton({ children, onClick, style, className }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      style={{
        ...style,
        position: "relative",
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

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

  const links = ["Home", "Why Tangy", "Events", "Gallery", "Community", "Contact"];

  const scrollTo = (id) => {
    if (id === "Community") {
      let target = "volunteer";
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" }), 120);
        setMenuOpen(false);
        return;
      }
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
      return;
    }
    let target = id.toLowerCase().replace(" ", "-");
    if (target === "contact") target = "get-in-touch";
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
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(200, 255, 43,0.15)" : "none",
      transition: "all 0.35s ease", padding: "0 5vw",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
    }}>
      <img
        src="/logo.svg"
        alt="Tangy Sessions Logo"
        style={{ height: 58, cursor: "pointer" }}
        onClick={() => scrollTo("home")}
      />

      {/* Desktop links */}
      <div style={{ display: "flex", gap: 28 }} className="nav-links">
        {links.map(l => (
          <button key={l} onClick={() => scrollTo(l)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.65)", cursor: "pointer", fontSize: "0.78rem", letterSpacing: "0.14em", fontFamily: "inherit", textTransform: "uppercase", transition: "color 0.2s, transform 0.2s", padding: "4px 0" }}
            onMouseEnter={e => { e.target.style.color = "#C8FF2B"; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.65)"; e.target.style.transform = "none"; }}>
            {l}
          </button>
        ))}
      </div>


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

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const flareRef = useRef(null);
  // On mobile/low-end: skip mouse-tracking state entirely (no React re-renders)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // On mobile, reduce video quality by lowering resolution via CSS
    if (isMobile) {
      v.style.imageRendering = "auto";
    }
    v.play().catch(() => { v.muted = true; v.play().catch(() => setVideoError(true)); });

    // Pause video when tab is hidden to save battery
    const onVisibilityChange = () => {
      document.hidden ? v.pause() : v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // Mouse parallax — disabled entirely on mobile/low-end for performance
  useEffect(() => {
    if (isMobile || isLowEndDevice) return; // Skip RAF loop on mobile

    const onMouseMove = (e) => {
      const { innerWidth: W, innerHeight: H } = window;
      targetOffset.current = {
        x: (e.clientX / W - 0.5) * 2,
        y: (e.clientY / H - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let lastTime = 0;
    const tick = (time) => {
      // Throttle to 30fps on low-end, 60fps on capable devices
      if (time - lastTime < (isLowEndDevice ? 33 : 16)) {
        rafId.current = requestAnimationFrame(tick);
        return;
      }
      lastTime = time;

      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * 0.06;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * 0.06;

      const STRENGTH = 14;
      const tx = currentOffset.current.x * STRENGTH;
      const ty = currentOffset.current.y * STRENGTH;

      // Direct DOM manipulation — zero React re-renders in the hot loop
      if (flareRef.current) {
        flareRef.current.style.transform = `translate(calc(-50% + ${tx * 4}px), calc(-50% + ${ty * 4}px))`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#080808" }}>
      {/* Localized Pinterest Background Video (Watermark-Free, Fully Loopable, High Performance) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          imageRendering: "auto",
          zIndex: 0,
        }}
      >
        <source src="/pinterest-bg.mp4" type="video/mp4" />
      </video>

      {/* Layered overlays for rich cinematic contrast & text legibility */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.55)", zIndex: 1 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 50%, #080808 100%)", zIndex: 2 }} />

      {/* Cursor-driven light flare — hidden on mobile (zero overhead) */}
      {!isMobile && (
        <div
          ref={flareRef}
          style={{
            position: "absolute", zIndex: 3, pointerEvents: "none",
            width: "40vw", height: "40vw", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200, 255, 43,0.08) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            top: "50%", left: "50%",
            willChange: "transform",
          }}
        />
      )}

      {/* Ambient Purple Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 0.96, 1.03, 1],
          opacity: [0.35, 0.45, 0.3, 0.4, 0.35],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          height: "60vh",
          background: "radial-gradient(circle, rgba(200, 255, 43,0.12) 0%, rgba(200, 255, 43,0.03) 50%, transparent 80%)",
          filter: "blur(100px)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 4, textAlign: "center", padding: "0 24px", maxWidth: 800, margin: "0 auto" }}>
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0, ease: "easeOut" }}
          style={{ fontSize: "clamp(0.65rem, 1.4vw, 0.85rem)", letterSpacing: "0.55em", color: "#C8FF2B", textTransform: "uppercase", marginBottom: 24, fontFamily: "monospace" }}>
          Est. 2025 · Hyderabad
        </motion.div>

        {/* Floating Headline */}
        <motion.div
          animate={{
            y: [-4, 4, -4],
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut",
            }
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1.2, ease: "easeOut" }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(4rem, 13vw, 10rem)",
              lineHeight: 0.92,
              letterSpacing: "0.04em",
              color: "#fff",
              margin: 0,
              textShadow: "0 0 100px rgba(200, 255, 43,0.2)",
            }}
          >
            TANGY<br />
            <span style={{
              background: "linear-gradient(to bottom, #d8b4fe, #ffffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}>
              SESSIONS
            </span>
          </motion.h1>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 1.0, ease: "easeOut" }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(1rem, 2.5vw, 1.5rem)", color: "rgba(255,255,255,0.65)", marginTop: 40, letterSpacing: "0.1em" }}>
          Where sound meets stillness.
        </motion.p>

        {/* Buttons Row with Magnetic Hover Effect */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 1.0, ease: "easeOut" }}
          style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
          <MagneticButton
            onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              padding: "15px 40px", background: "#C8FF2B", color: "#fff", border: "none",
              borderRadius: 30, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.12em",
              textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 700,
              boxShadow: "0 0 30px rgba(200, 255, 43,0.35)", transition: "background-color 0.3s ease",
            }}
          >
            Explore Events
          </MagneticButton>
          <MagneticButton
            onClick={() => document.getElementById("volunteer")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              padding: "15px 40px", background: "transparent", color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)", borderRadius: 30,
              cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.12em",
              textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 700,
              transition: "border-color 0.3s ease, color 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#A4A4A4"; e.currentTarget.style.color = "#A4A4A4"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
          >
            Join Community
          </MagneticButton>
        </motion.div>

        {/* Trust Metrics — animated */}
        <HeroStats />

        {/* Manifesto Line */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 1.0, ease: "easeOut" }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(0.85rem, 1.8vw, 1.05rem)",
            color: "rgba(255,255,255,0.4)",
            marginTop: "40px",
            letterSpacing: "0.08em",
            lineHeight: 1.6,
          }}
        >
          "A community built around music, creativity and meaningful experiences."
        </motion.p>

      </div>

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: 0.4, cursor: "pointer" }}
        onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}>
        <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, #C8FF2B)" }} />
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#C8FF2B", textTransform: "uppercase" }}>Scroll</div>
      </motion.div>
    </section>
  );
}

// ─── HERO STATS ─────────────────────────────────────────────────────────────────
// Typewriter label: types each character then kills cursor
function TypewriterLabel({ text, delay = 0, speed = 50 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const triggered = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          let i = 0;
          const start = () => {
            setTimeout(() => {
              const tick = () => {
                i++;
                setDisplayed(text.slice(0, i));
                if (i < text.length) setTimeout(tick, speed);
                else setDone(true);
              };
              tick();
            }, delay);
          };
          start();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [text, delay, speed]);

  return (
    <span ref={ref} style={{ display: "inline-block", minWidth: `${text.length}ch` }}>
      {displayed}
      {!done && (
        <span style={{
          display: "inline-block",
          width: "1px",
          height: "0.7em",
          background: "rgba(200, 255, 43,0.8)",
          marginLeft: "1px",
          verticalAlign: "middle",
          animation: "blinkCursor 0.7s step-end infinite",
        }} />
      )}
    </span>
  );
}

// Count-up number that eases out over ~2 seconds
function CountUpNumber({ endStr, delay = 0, duration = 2.2 }) {
  const numMatch = endStr.match(/^(\d+)(.*)$/);
  const endVal = numMatch ? parseInt(numMatch[1], 10) : null;
  const suffix = numMatch ? numMatch[2] : "";

  const [count, setCount] = useState(0);
  const triggered = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    if (endVal === null) return; // non-numeric (Growing Community handled separately)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          setTimeout(() => {
            const totalFrames = Math.round(duration * 60);
            let frame = 0;
            const tick = () => {
              frame++;
              const progress = frame / totalFrames;
              const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
              setCount(Math.round(endVal * ease));
              if (frame < totalFrames) requestAnimationFrame(tick);
              else setCount(endVal);
            };
            requestAnimationFrame(tick);
          }, delay);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [endVal, delay, duration]);

  if (endVal === null) return null;
  return <span ref={ref}>{count}{suffix}</span>;
}

// Growing Community typewriter for the "number" slot
function GrowingTypewriter({ delay = 0 }) {
  const full = "Growing Community";
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const triggered = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          let i = 0;
          setTimeout(() => {
            const tick = () => {
              i++;
              setDisplayed(full.slice(0, i));
              if (i < full.length) setTimeout(tick, 48);
              else setDone(true);
            };
            tick();
          }, delay);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <span ref={ref} style={{ display: "inline-block", minWidth: `${full.length}ch` }}>
      {displayed}
      {!done && (
        <span style={{
          display: "inline-block",
          width: "1px",
          height: "0.85em",
          background: "rgba(200, 255, 43,0.8)",
          marginLeft: "2px",
          verticalAlign: "middle",
          animation: "blinkCursor 0.7s step-end infinite",
        }} />
      )}
    </span>
  );
}

const STATS = [
  { type: "count", endStr: "10000+", label: "ATTENDEES",  duration: 2.5 },
  { type: "count", endStr: "50+",    label: "ARTISTS",    duration: 2.0 },
  { type: "count", endStr: "25+",    label: "SESSIONS",   duration: 1.8 },
  { type: "grow",                   label: "COMMUNITY" },
];

function HeroStats() {
  const [hovered, setHovered] = useState(null);
  const BASE_DELAY = 650; // ms after page load before stats phase starts
  const STAGGER = 150;    // ms between each stat

  return (
    <>
      <style>{`
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.8, ease: "easeOut" }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "28px",
          marginTop: "88px",
          flexWrap: "wrap",
        }}
      >
        {STATS.map((stat, idx) => {
          const entryDelay = BASE_DELAY + idx * STAGGER; // ms for count + typewriter
          const isHov = hovered === idx;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <span style={{ width: "1px", height: "28px", background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
              )}
              <div
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "default",
                  transition: "transform 0.3s ease",
                  transform: isHov ? "scale(1.05)" : "scale(1)",
                }}
              >
                {/* Number / Growing text */}
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                  color: "#fff",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  textShadow: isHov ? "0 0 20px rgba(200, 255, 43,0.55)" : "none",
                  transition: "text-shadow 0.3s ease",
                  whiteSpace: "nowrap",
                }}>
                  {stat.type === "count" ? (
                    <CountUpNumber endStr={stat.endStr} delay={entryDelay} duration={stat.duration} />
                  ) : (
                    <GrowingTypewriter delay={entryDelay} />
                  )}
                </span>
                {/* Label typewriter */}
                <span style={{
                  fontSize: "clamp(0.55rem, 1.2vw, 0.65rem)",
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontFamily: "monospace",
                }}>
                  <TypewriterLabel
                    text={stat.label}
                    delay={entryDelay + 200}
                    speed={52}
                  />
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </motion.div>
    </>
  );
}

// ─── WHY TANGY ─────────────────────────────────────────────────────────────────
function WhyTangy() {
  return (
    <section id="why-tangy" style={{ background: "transparent", padding: "clamp(140px, 15vw, 220px) 5vw", position: "relative", overflow: "hidden" }}>
      <SectionBackgroundText text="TANGY" />

      {/* Background Overlay matching Join the Community */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at center, transparent 30%, rgba(5, 5, 5, 0.25) 95%), rgba(5, 5, 5, 0.15)",
        zIndex: 0,
        pointerEvents: "none",
      }} />

      {/* Ambient Purple Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60vw",
          height: "60vh",
          background: "radial-gradient(circle, rgba(200, 255, 43,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.4em", color: "#C8FF2B", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14, fontWeight: "600" }}>
            Our Philosophy
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "rgba(255,255,255,0.92)", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Why Tangy?
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ height: 2, background: "linear-gradient(to right, #C8FF2B, #C8FF2B)", marginTop: 18, borderRadius: 2 }}
          />
        </motion.div>

        {/* Two-Column Layout */}
        <div className="why-tangy-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 64, alignItems: "center" }}>
          
          {/* LEFT — Manifesto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(1.15rem, 2.5vw, 1.6rem)",
              color: "rgba(255,255,255,0.95)",
              lineHeight: 1.6,
              marginBottom: 10,
              borderLeft: "2px solid #C8FF2B",
              paddingLeft: 24,
            }}>
              "Tangy Sessions was born from a simple belief: The most meaningful experiences happen when people slow down."
            </p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
              In a world filled with endless scrolling, constant notifications, and digital noise, we wanted to create something different. Not another event. Not another lineup. Not another night out.
            </p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
              Tangy is an <span style={{ color: "#fff", fontWeight: "600" }}>invitation to pause</span>. To listen more deeply. To connect more honestly. To experience music, art, and community in a way that feels real.
            </p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
              Every session is carefully curated to bring together creators, dreamers, artists, volunteers, and curious minds in spaces that encourage presence, conversation, creativity, and wonder.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              {[
                "We believe music has the power to transform a space.",
                "We believe community is built through shared experiences.",
                "We believe the most beautiful moments are often the ones that cannot be captured by a screen."
              ].map((belief, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: "#C8FF2B", fontSize: "1.2rem", lineHeight: 1.1 }}>✦</span>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", lineHeight: 1.5, fontWeight: "500" }}>{belief}</span>
                </div>
              ))}
            </div>

            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.8, marginTop: 12, margin: 0 }}>
              Whether you arrive alone or with friends, whether you come for the music, the atmosphere, or the people you have yet to meet, Tangy exists to create moments that stay with you long after the night ends.
            </p>
          </motion.div>

          {/* RIGHT — Visual Storytelling Collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="why-tangy-collage"
            style={{ position: "relative", height: 550, width: "100%" }}
          >
            {/* Image 1: Performing (DJ Booth) */}
            <motion.div
              style={{
                position: "absolute",
                top: "5%",
                left: "10%",
                width: "60%",
                height: "60%",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
              }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              transition={{ duration: 0.4 }}
            >
              <img src="/gallery/tangy5.jpg" alt="Artist Performing" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>
            
            {/* Image 2: Crowd/Connection */}
            <motion.div
              style={{
                position: "absolute",
                bottom: "5%",
                right: "5%",
                width: "55%",
                height: "55%",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
                zIndex: 2,
              }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              transition={{ duration: 0.4 }}
            >
              <img src="/gallery/tangy1.jpg" alt="Crowd Connecting" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>

            {/* Image 3: Environment/Descent */}
            <motion.div
              style={{
                position: "absolute",
                top: "40%",
                left: "-5%",
                width: "40%",
                height: "40%",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                zIndex: 3,
              }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              transition={{ duration: 0.4 }}
            >
              <img src="/gallery/tngy7.jpg" alt="Event Ambience" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>
          </motion.div>

        </div>

        {/* VALUES SECTION (3 Premium Cards) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, marginTop: 88, width: "100%" }}>
          {[
            { title: "SOUND", text: "Immersive sonic experiences curated to be felt, not simply heard." },
            { title: "STILLNESS", text: "A reminder to slow down, stay present, and reconnect with yourself." },
            { title: "COMMUNITY", text: "A collective of artists, creators, volunteers, and attendees brought together through meaningful experiences." }
          ].map((val, idx) => (
            <motion.div
              key={val.title}
              whileHover={{ y: -6, borderColor: "rgba(200, 255, 43, 0.3)", boxShadow: "0 20px 40px rgba(0,0,0,0.7)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              style={{
                background: "rgba(15, 15, 15, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 24,
                padding: "40px 32px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Purple top accent line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#C8FF2B" }} />

              <div style={{ fontSize: "0.72rem", color: "#C8FF2B", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12, fontFamily: "monospace", fontWeight: "600" }}>
                0{idx + 1} // Value
              </div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "rgba(255,255,255,0.92)", margin: "0 0 14px", letterSpacing: "0.06em" }}>{val.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>{val.text}</p>
            </motion.div>
          ))}
        </div>

        {/* STATISTICS ROW */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, marginTop: 88, width: "100%", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px 0" }}>
          {[
            { endStr: "10000+", label: "ATTENDEES", duration: 2.5 },
            { endStr: "50+",    label: "ARTISTS",   duration: 2.0 },
            { endStr: "25+",     label: "SESSIONS",  duration: 1.8 },
            { endStr: null,    label: "COMMUNITY" }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              style={{ textAlign: "center" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#C8FF2B", lineHeight: 1 }}>
                {stat.endStr === null
                  ? <GrowingTypewriter delay={idx * 150} />
                  : <CountUpNumber endStr={stat.endStr} delay={idx * 150} duration={stat.duration} />}
              </div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginTop: 8 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* EDITORIAL STATEMENT */}
        <div style={{
          width: "100%",
          textAlign: "center",
          marginTop: 88,
          userSelect: "none",
          pointerEvents: "none",
        }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 9.5vw, 11rem)",
            lineHeight: 0.85,
            letterSpacing: "0.02em",
            color: "rgba(255, 255, 255, 0.45)",
            margin: 0,
            textTransform: "uppercase",
          }}>
            SOUND. STILLNESS. COMMUNITY.
          </h2>
        </div>

      </div>

      <style>{`
        @media (max-width: 991px) {
          .why-tangy-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .why-tangy-collage { height: 450px !important; max-width: 500px; margin: 0 auto; }
        }
      `}</style>
    </section>
  );
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
function Events() {
  return (
    <section id="events" style={{ background: "transparent", padding: "clamp(140px, 15vw, 220px) 5vw" }}>
      <SectionHeader label="Calendar" title="Upcoming Events" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginTop: 60 }}>
        {EVENTS.map((ev, i) => <EventCard key={ev.id} ev={ev} delay={i * 0.15} />)}
      </div>
    </section>
  );
}

function EventCard({ ev, delay }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay, type: "spring", bounce: 0.3 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#181818" : "#111111",
        border: hovered ? "1.5px solid #C8FF2B" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: 0, cursor: "pointer",
        boxShadow: hovered
          ? "0 24px 60px rgba(0,0,0,0.85), 0 0 35px rgba(200, 255, 43, 0.12)"
          : "0 12px 32px rgba(0,0,0,0.6)",
        transform: hovered ? "translateY(-5px) rotate(0.5deg)" : "translateY(0) rotate(0deg)",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", flexDirection: "column", gap: 0,
        position: "relative",
        overflow: "hidden"
      }}>
      
      {/* Ticket Body Content */}
      <div style={{ padding: "30px 24px 20px" }}>
        {/* Date + time */}
        <div style={{ fontSize: "0.68rem", letterSpacing: "0.25em", color: "#C8FF2B", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>
          {ev.date} · {ev.time}
        </div>
        {/* Title */}
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#fff", margin: "0 0 8px", letterSpacing: "0.06em", lineHeight: 1.1 }}>
          {ev.name}
        </h3>
        {/* Location */}
        <div style={{ fontSize: "0.78rem", color: "#A4A4A4", marginBottom: 14, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 4 }}>
          <span>📍</span> <span>{ev.location}</span>
        </div>
        {/* Tags */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {ev.tags.map(tag => (
            <span key={tag} style={{ padding: "3px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, fontSize: "0.65rem", color: "#A4A4A4", letterSpacing: "0.08em", fontFamily: "monospace" }}>
              {tag}
            </span>
          ))}
        </div>
        {/* Description */}
        <p style={{ color: "#A4A4A4", fontSize: "0.85rem", lineHeight: 1.6, marginBottom: 20 }}>
          {ev.desc}
        </p>
      </div>

      {/* Ticket Perforation Dashed Separator */}
      <div style={{ display: "flex", alignItems: "center", position: "relative", width: "100%", height: 20, zIndex: 2 }}>
        {/* Left Cutout */}
        <div style={{ position: "absolute", left: -10, width: 20, height: 20, borderRadius: "50%", background: "#080808", borderRight: "1px solid rgba(255,255,255,0.08)" }} />
        {/* Dashed Line */}
        <div style={{ width: "100%", height: 1, borderTop: "1px dashed rgba(255,255,255,0.15)", margin: "0 15px" }} />
        {/* Right Cutout */}
        <div style={{ position: "absolute", right: -10, width: 20, height: 20, borderRadius: "50%", background: "#080808", borderLeft: "1px solid rgba(255,255,255,0.08)" }} />
      </div>

      {/* Stub / Bottom portion */}
      <div style={{ padding: "20px 24px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.01)" }}>
        <div>
          <div style={{ fontSize: "0.62rem", color: "#A4A4A4", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>Ticket Stub</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff", letterSpacing: "0.04em" }}>₹{ev.price}</div>
        </div>

        {/* Pseudo-Barcode element */}
        <div style={{ display: "flex", gap: 2, height: 32, opacity: 0.5 }}>
          {[1, 3, 2, 4, 1, 3, 2, 1, 4, 2, 1].map((w, idx) => (
            <div key={idx} style={{ width: w, height: "100%", background: "#fff" }} />
          ))}
        </div>

        <motion.button
          onClick={() => navigate(`/events/${ev.slug}`)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{
            padding: "10px 20px",
            background: hovered ? "#C8FF2B" : "transparent",
            color: hovered ? "#080808" : "#fff",
            border: hovered ? "1px solid #C8FF2B" : "1px solid rgba(255,255,255,0.2)",
            borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
            letterSpacing: "0.1em", textTransform: "uppercase",
            fontSize: "0.75rem", fontWeight: 700,
            transition: "all 0.25s",
          }}
        >
          Book Stub →
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── ARTIST MODAL ─────────────────────────────────────────────────────────────────
function ArtistModal({ artist, onClose }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Lock body scroll + Escape key
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    // Autofocus the close button for a11y
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  // Focus trap
  const handleModalKeyDown = (e) => {
    if (e.key !== "Tab") return;
    const focusable = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  const SOCIALS = [
    { label: "Spotify",    icon: <SpotifyIcon />,    href: "https://spotify.com" },
    { label: "SoundCloud", icon: <SoundCloudIcon />, href: "https://soundcloud.com" },
    { label: "Instagram",  icon: <InstagramIcon />,  href: "https://instagram.com" },
  ];

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="artist-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 9998,
        }}
      />

      {/* Modal panel */}
      <motion.div
        key="artist-modal-panel"
        className="artist-modal-inner"
        role="dialog"
        aria-modal="true"
        aria-label={`${artist.name} artist profile`}
        ref={modalRef}
        onKeyDown={handleModalKeyDown}
        initial={{ opacity: 0, x: "-50%", y: "-48%", scale: 0.96 }}
        animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
        exit={{ opacity: 0, x: "-50%", y: "-48%", scale: 0.96 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          zIndex: 9999,
          width: "90vw",
          maxWidth: 1100,
          maxHeight: "85vh",
          overflowY: "auto",
          overflowX: "hidden",
          background: "linear-gradient(160deg, rgba(10,8,18,0.97) 0%, rgba(4,4,8,0.99) 100%)",
          border: `1px solid ${artist.color}44`,
          borderRadius: 20,
          boxShadow: `0 50px 120px rgba(0,0,0,0.92), 0 0 60px ${artist.color}14, inset 0 1px 0 rgba(255,255,255,0.06)`,
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          scrollbarWidth: "thin",
          scrollbarColor: `${artist.color}44 transparent`,
        }}
      >
        <style>{`
          @media (max-width: 900px) {
            .artist-modal-inner {
              width: 92vw !important;
            }
          }
          @media (max-width: 600px) {
            .artist-modal-inner {
              width: 95vw !important;
              height: auto !important;
              max-height: 90vh !important;
            }
          }
          .artist-modal-inner::-webkit-scrollbar { width: 4px; }
          .artist-modal-inner::-webkit-scrollbar-thumb { background: ${artist.color}55; border-radius: 4px; }
        `}</style>

        {/* Ambient glow orb */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 320, height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${artist.color}18 0%, transparent 70%)`,
          filter: "blur(40px)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Header strip */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px",
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(10,8,18,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid rgba(255,255,255,0.05)`,
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "0.85rem", letterSpacing: "0.3em",
            color: artist.color, textTransform: "uppercase",
          }}>
            Tangy Sessions · Artist Profile
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close artist profile"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%",
              width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.7)",
              fontSize: "1rem", lineHeight: 1,
              transition: "all 0.25s ease",
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = artist.color; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = artist.color; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            ✕
          </button>
        </div>

        {/* Hero: avatar + identity */}
        <div style={{
          display: "flex", alignItems: "center", gap: 24,
          padding: "24px 24px 20px",
          borderBottom: `1px solid ${artist.color}22`,
          position: "relative", zIndex: 1,
        }}>
          {/* Avatar */}
          <div style={{
            flexShrink: 0,
            width: 96, height: 96,
            borderRadius: "50%",
            border: `2px solid ${artist.color}88`,
            overflow: "hidden",
            boxShadow: `0 0 30px ${artist.color}44`,
          }}>
            <img
              src={artist.img}
              alt={artist.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Name / role / meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              margin: "0 0 4px", letterSpacing: "0.06em",
              color: "#fff",
            }}>{artist.name}</h2>
            <div style={{
              fontSize: "0.7rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: artist.color,
              fontFamily: "monospace", marginBottom: 10, fontWeight: 600,
            }}>{artist.genre || artist.role}</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: artist.location || "India" },
                { label: `${artist.followers || "—"} followers` },
                { label: `${artist.performances || "—"} shows` },
              ].map(({ label }) => (
                <span key={label} style={{
                  fontSize: "0.72rem", color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.06em",
                }}>{label}</span>
              ))}
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            flexShrink: 0,
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: 20, padding: "6px 12px",
            alignSelf: "flex-start",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "artistStatusPulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: "0.62rem", letterSpacing: "0.15em", color: "#10b981", textTransform: "uppercase", fontFamily: "monospace", fontWeight: 600 }}>Active</span>
          </div>
        </div>

        {/* Bio */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${artist.color}18`, position: "relative", zIndex: 1 }}>
          <p style={{
            fontSize: "0.9rem", color: "rgba(255,255,255,0.72)",
            lineHeight: 1.75, margin: 0,
          }}>{artist.bio}</p>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          background: `${artist.color}18`,
          margin: "0 0 0",
          position: "relative", zIndex: 1,
        }}>
          {[
            { label: "Followers",    value: artist.followers || "—" },
            { label: "Performances", value: artist.performances || "—" },
            { label: "Genre",        value: (artist.genre || artist.role).split("/")[0].trim() },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: "rgba(10,8,18,0.97)",
              padding: "16px 20px",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.35rem", color: artist.color,
                letterSpacing: "0.05em", lineHeight: 1,
              }}>{value}</div>
              <div style={{
                fontSize: "0.62rem", letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.38)",
                textTransform: "uppercase", marginTop: 5, fontFamily: "monospace",
              }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Social links + Close CTA */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
          padding: "20px 24px 28px",
          position: "relative", zIndex: 1,
        }}>
          {/* Social icons */}
          <div style={{ display: "flex", gap: 12 }}>
            {SOCIALS.map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 40, height: 40,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = artist.color + "33"; e.currentTarget.style.borderColor = artist.color; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Dismiss button */}
          <button
            onClick={onClose}
            style={{
              padding: "10px 28px",
              background: `linear-gradient(135deg, ${artist.color} 0%, ${artist.color}cc 100%)`,
              border: "none", borderRadius: 24,
              color: "#fff", fontSize: "0.78rem",
              fontFamily: "inherit", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: `0 8px 24px ${artist.color}44`,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 14px 32px ${artist.color}55`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 24px ${artist.color}44`; }}
          >
            Close Profile
          </button>
        </div>
      </motion.div>

      <style>{`
        @keyframes artistStatusPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
          50%       { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }
      `}</style>
    </AnimatePresence>
  );
}

// ─── ARTISTS ─────────────────────────────────────────────────────────────────
function Artists() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [activeArtist, setActiveArtist] = useState(null);

  const GENRES = ["All", "Deep House", "Ambient", "Live Electronic", "Classical Fusion", "Techno", "Dark Ambient", "Bass Music"];

  const filteredArtists = ARTISTS.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      a.bio.toLowerCase().includes(search.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" ||
      a.role.toLowerCase().includes(selectedGenre.toLowerCase()) ||
      a.bio.toLowerCase().includes(selectedGenre.toLowerCase()) ||
      (a.genre || "").toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  return (
    <section id="artists" style={{ background: "transparent", padding: "clamp(140px, 15vw, 220px) 5vw", position: "relative", overflow: "hidden" }}>
      <SectionBackgroundText text="TANGY" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <SectionHeader label="Lineup" title="Artist Roster" />

        {/* Search & Genre Filter */}
        <div style={{
          marginTop: 40, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 24, width: "100%",
          maxWidth: 720, margin: "40px auto 0",
        }}>
          <div style={{ position: "relative", width: "100%" }}>
            <span style={{
              position: "absolute", left: 20, top: "50%",
              transform: "translateY(-50%)", fontSize: "1.05rem",
              color: "rgba(255,255,255,0.4)", pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search artists by name or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "16px 20px 16px 52px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(200, 255, 43,0.18)",
                borderRadius: 30, color: "#fff",
                fontSize: "0.9rem", outline: "none",
                fontFamily: "inherit", backdropFilter: "blur(12px)",
                transition: "all 0.35s ease",
                boxSizing: "border-box",
              }}
              onFocus={e => { e.target.style.borderColor = "#C8FF2B"; e.target.style.boxShadow = "0 0 20px rgba(200, 255, 43,0.2)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(200, 255, 43,0.18)"; e.target.style.boxShadow = "none"; }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute", right: 20, top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent", border: "none",
                  color: "rgba(255,255,255,0.4)", cursor: "pointer",
                  fontSize: "0.85rem", fontFamily: "inherit",
                }}
              >✕</button>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {GENRES.map((g) => {
              const active = selectedGenre === g;
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  style={{
                    padding: "8px 18px",
                    background: active ? "linear-gradient(135deg,#C8FF2B,#C8FF2B)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? "#C8FF2B" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 20, color: active ? "#fff" : "rgba(255,255,255,0.6)",
                    fontSize: "0.75rem", fontWeight: 600,
                    fontFamily: "inherit", cursor: "pointer",
                    letterSpacing: "0.05em",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    boxShadow: active ? "0 8px 20px rgba(200, 255, 43,0.3)" : "none",
                  }}
                >{g}</button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {filteredArtists.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 24, marginTop: 60,
          }}>
            {filteredArtists.map((a, i) => (
              <ArtistCard key={a.id} a={a} delay={i * 0.08} onOpen={() => setActiveArtist(a)} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center", padding: "80px 20px",
              background: "rgba(255,255,255,0.01)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 24, marginTop: 60,
              maxWidth: 600, margin: "60px auto 0",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🎵</div>
            <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.8rem", letterSpacing: "0.08em", color: "#fff", margin: "0 0 8px" }}>No Artists Found</h3>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", margin: "0 0 24px", lineHeight: 1.5 }}>
              No match for &quot;{search}&quot; in {selectedGenre === "All" ? "any genre" : selectedGenre}.
            </p>
            <button
              onClick={() => { setSearch(""); setSelectedGenre("All"); }}
              style={{
                padding: "10px 24px", background: "transparent",
                border: "1px solid #C8FF2B", borderRadius: 20,
                color: "#fff", fontSize: "0.8rem",
                fontFamily: "inherit", cursor: "pointer", fontWeight: 600,
              }}
            >Reset Filters</button>
          </motion.div>
        )}
      </div>

      {/* Portal-style modal: rendered at end of section to avoid stacking context issues */}
      <AnimatePresence>
        {activeArtist && (
          <ArtistModal
            artist={activeArtist}
            onClose={() => setActiveArtist(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ArtistCard({ a, delay, onOpen }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`View ${a.name} artist profile`}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, type: "spring", stiffness: 100, damping: 14 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      style={{
        textAlign: "center",
        padding: "28px 20px",
        position: "relative",
        overflow: "hidden",
        background: hov
          ? `linear-gradient(135deg, rgba(8,8,12,0.95) 0%, ${a.color}18 100%)`
          : "linear-gradient(135deg, rgba(8,8,12,0.88) 0%, rgba(24,24,24,0.7) 100%)",
        backdropFilter: "blur(12px) saturate(140%)",
        WebkitBackdropFilter: "blur(12px) saturate(140%)",
        border: `1px solid ${hov ? a.color + "77" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        cursor: "pointer",
        boxShadow: hov
          ? `0 24px 60px rgba(0,0,0,0.85), 0 0 35px ${a.color}25, inset 0 1px 0 rgba(255,255,255,0.12)`
          : "0 10px 28px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.38s cubic-bezier(0.16,1,0.3,1)",
        userSelect: "none",
        outline: "none",
        minHeight: 0,
      }}
    >
      {/* Sheen */}
      <div style={{
        position: "absolute", top: 0,
        left: hov ? "140%" : "-100%",
        width: "50%", height: "100%",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent)",
        transform: "skewX(-25deg)",
        transition: hov ? "left 0.7s cubic-bezier(0.2,0.8,0.2,1)" : "none",
        pointerEvents: "none",
      }} />

      {/* Glow node */}
      <div style={{
        position: "absolute", top: "-15%", left: "-15%",
        width: "45%", height: "45%",
        borderRadius: "50%", background: a.color,
        filter: "blur(28px)",
        opacity: hov ? 0.22 : 0.05,
        transition: "opacity 0.4s",
        pointerEvents: "none",
      }} />

      {/* Card header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <span style={{ fontSize: "0.58rem", fontFamily: "monospace", letterSpacing: "0.2em", color: "rgba(255,255,255,0.28)" }}>TS-A0{a.id}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", boxShadow: hov ? "0 0 7px #10b981" : "none" }} />
          <span style={{ fontSize: "0.52rem", fontFamily: "monospace", letterSpacing: "0.15em", color: "rgba(255,255,255,0.38)", textTransform: "uppercase", fontWeight: "bold" }}>ACTIVE</span>
        </div>
      </div>

      {/* Avatar */}
      <div style={{
        width: 96, height: 96,
        borderRadius: "50%",
        margin: "0 auto 18px",
        border: `2px solid ${hov ? a.color : "rgba(255,255,255,0.1)"}`,
        overflow: "hidden",
        transition: "border-color 0.4s, box-shadow 0.4s",
        boxShadow: hov ? `0 0 22px ${a.color}55` : "none",
      }}>
        <img
          src={a.img} alt={a.name}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            filter: hov ? "brightness(1.1)" : "brightness(0.8) saturate(0.85)",
            transition: "filter 0.4s, transform 0.5s",
            transform: hov ? "scale(1.1)" : "scale(1)",
          }}
        />
      </div>

      <h3 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "1.65rem", color: "#fff",
        margin: "0 0 5px", letterSpacing: "0.08em",
        textShadow: hov ? `0 0 18px ${a.color}44` : "none",
        transition: "text-shadow 0.4s",
      }}>{a.name}</h3>

      <div style={{
        fontSize: "0.65rem", color: hov ? "#fff" : a.color,
        letterSpacing: "0.2em", textTransform: "uppercase",
        marginBottom: 12, fontWeight: 600, fontFamily: "monospace",
        transition: "color 0.4s",
      }}>{a.role}</div>

      <p style={{
        fontSize: "0.78rem", color: "rgba(255,255,255,0.48)",
        lineHeight: 1.6, margin: "0 0 16px",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {a.bio}
      </p>

      {/* Social Icons on Hover */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        marginTop: "16px",
        opacity: hov ? 1 : 0,
        transform: hov ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {[
          { icon: <SpotifyIcon />, name: "Spotify" },
          { icon: <SoundCloudIcon />, name: "SoundCloud" },
          { icon: <InstagramIcon />, name: "Instagram" }
        ].map((soc, idx) => (
          <span
            key={idx}
            style={{
              color: "rgba(255,255,255,0.45)",
              cursor: "pointer",
              transition: "color 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = a.color; e.currentTarget.style.transform = "scale(1.18)" }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.transform = "scale(1)" }}
            onClick={(e) => { e.stopPropagation(); navigate(`/artists/${a.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`); }}
          >
            {soc.icon}
          </span>
        ))}
      </div>
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
    <section id="gallery" style={{ background: "transparent", padding: "clamp(140px, 15vw, 220px) 5vw", position: "relative", overflow: "hidden" }}>
      <SectionBackgroundText text="TANGY" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <SectionHeader label="Memories" title="Gallery" />
        
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "40px",
          marginTop: 60,
          justifyContent: "center",
          alignItems: "center",
        }}>
          {GALLERY.map((item, i) => {
            const rotation = (i % 3 === 0) ? -3 : (i % 3 === 1) ? 2 : 4;
            const tapeAngle = (i % 2 === 0) ? -15 : 12;
            
            return (
              <motion.div 
                key={item.id}
                onClick={() => setLightbox(item)}
                initial={{ opacity: 0, scale: 0.9, y: 30 }} 
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                style={{
                  background: "#181818",
                  padding: "16px 16px 40px 16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 15px 30px rgba(0,0,0,0.5)",
                  transform: `rotate(${rotation}deg)`,
                  cursor: "pointer",
                  width: "280px",
                  position: "relative",
                  flexShrink: 0,
                  transition: "transform 0.3s ease, border-color 0.3s"
                }}
              >
                {/* Visual Tape Effect */}
                <div style={{
                  position: "absolute",
                  top: "-15px",
                  left: "50%",
                  transform: `translateX(-50%) rotate(${tapeAngle}deg)`,
                  width: "80px",
                  height: "24px",
                  background: "rgba(200, 255, 43, 0.25)",
                  backdropFilter: "blur(2px)",
                  border: "1px dashed rgba(200, 255, 43, 0.5)",
                  zIndex: 2
                }} />

                {/* Polaroid Image Box */}
                <div style={{ overflow: "hidden", background: "#080808", height: "200px" }}>
                  <img 
                    src={item.img} 
                    alt={item.label} 
                    loading="lazy" 
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) contrast(1.1)", transition: "filter 0.4s, transform 0.4s" }}
                    onMouseEnter={e => { e.target.style.filter = "none"; e.target.style.transform = "scale(1.05)"; }}
                    onMouseLeave={e => { e.target.style.filter = "grayscale(1) contrast(1.1)"; e.target.style.transform = "scale(1)"; }}
                  />
                </div>

                {/* Polaroid Text Tag */}
                <div style={{ marginTop: 16, fontFamily: "monospace", fontSize: "0.75rem", color: "#A4A4A4", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div onClick={() => setLightbox(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(12px)" }}>
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }} onClick={e => e.stopPropagation()} className="lightbox-inner"
              style={{ background: "#111111", border: "1px solid rgba(200, 255, 43,0.3)", borderRadius: 24, overflow: "hidden", boxShadow: "0 0 120px rgba(200, 255, 43,0.18)", maxWidth: "90vw", maxHeight: "85vh" }}>
              <img src={lightbox.img} alt={lightbox.label} style={{ display: "block", maxWidth: "90vw", maxHeight: "75vh", objectFit: "contain", borderRadius: "24px 24px 0 0" }} />
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

// (Tickets section removed from homepage — booking now happens on Event Details pages)

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  const [active, setActive] = useState(0);

  const founders = [
    {
      role: "Founder",
      name: "Arjuna\nVisionary & Creator",
      image: "/arjun.png",
      bio: "Born from an obsession with underground sound and ancient spaces. Tangy Sessions exists because Arjuna refused to let music stay ordinary.",
      color: "#C8FF2B",
    },
    {
      role: "Co-Founder",
      name: "Deepa\nCurator & Director",
      image: "/deepa.jpg",
      bio: "Every artist, every setlist, every moment of silence between drops — Deepa crafts with obsessive care to ensure each session is a masterpiece.",
      color: "#06b6d4",
    },
  ];

  const stats = [["25+", "Sessions"], ["10000+", "Attendees"], ["50+", "Artists"], ["1", "Stepwell"]];

  return (
    <section id="about" style={{ background: "#080808", padding: "140px 5vw", position: "relative", overflow: "hidden" }}>
      {/* Background Graphic elements */}
      <div style={{ position: "absolute", top: "10%", right: "-5%", fontFamily: "'Bebas Neue', sans-serif", fontSize: "16rem", color: "rgba(200,255,43,0.02)", pointerEvents: "none", userSelect: "none" }}>
        CREATIVE
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1300, margin: "0 auto" }}>
        
        {/* Asymmetrical magazine spread header */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 80 }}>
          <span style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#C8FF2B", letterSpacing: "0.4em", textTransform: "uppercase" }}>01 // MANIFESTO</span>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 10vw, 8rem)", color: "#fff", lineHeight: 0.9, margin: 0, textTransform: "uppercase" }}>
            SOUND. STILLNESS. <br />
            <span style={{ WebkitTextStroke: "1px #C8FF2B", WebkitTextFillColor: "transparent" }}>COMMUNITY.</span>
          </h2>
        </div>

        <div id="about-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 64, alignItems: "start" }}>
          
          {/* Asymmetric Left side - Story details */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: "flex", flexDirection: "column", gap: 32 }}
          >
            <div style={{ borderLeft: "4px solid #C8FF2B", paddingLeft: 24 }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", color: "rgba(255,255,255,0.95)", lineHeight: 1.6, margin: 0 }}>
                Tangy Sessions is a cultural movement designed to bring people together through the power of curated music, shared presence, and authentic connection.
              </p>
            </div>
            
            <p style={{ color: "#A4A4A4", fontSize: "1rem", lineHeight: 1.8, margin: 0 }}>
              We create sanctuaries for deep listening and creative expression—spaces where sound guides us back to stillness, and every collective beat becomes a meaningful, shared experience.
            </p>

            {/* Asymmetrical Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, background: "#111111", padding: 32, border: "1px solid rgba(255,255,255,0.06)", marginTop: 20 }}>
              {stats.map(([n, l], idx) => (
                <div key={l} style={{ borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: 12 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem", color: "#C8FF2B", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", color: "#A4A4A4", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Asymmetric Right side - Portrait Layout */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            {founders.map((f, i) => (
              <motion.div
                key={f.role}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                onMouseEnter={() => setActive(i)}
                style={{
                  background: "#181818",
                  border: active === i ? "1px solid #C8FF2B" : "1px solid rgba(255,255,255,0.08)",
                  padding: 24,
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                  transition: "all 0.3s ease",
                  transform: active === i ? "rotate(-1deg) scale(1.02)" : "none",
                }}
              >
                <img 
                  src={f.image} 
                  alt={f.role} 
                  style={{
                    width: 90,
                    height: 120,
                    objectFit: "cover",
                    filter: active === i ? "none" : "grayscale(1)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s ease"
                  }}
                />
                <div>
                  <span style={{ fontSize: "0.62rem", letterSpacing: "0.2em", color: "#C8FF2B", textTransform: "uppercase", fontFamily: "monospace", fontWeight: "bold" }}>
                    {f.role}
                  </span>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#fff", margin: "4px 0 8px" }}>
                    {f.name.split('\n')[0]}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#A4A4A4", lineHeight: 1.5, margin: 0 }}>
                    {f.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Founder Quote rebuilt as an editorial pull-out block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            marginTop: 100,
            borderTop: "1px dashed rgba(255,255,255,0.15)",
            borderBottom: "1px dashed rgba(255,255,255,0.15)",
            padding: "50px 20px",
            textAlign: "center",
            position: "relative"
          }}
        >
          <div style={{ position: "absolute", left: 10, top: 10, fontSize: "0.72rem", color: "#C8FF2B", fontFamily: "monospace" }}>[NOTE.S01]</div>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(1.4rem, 3.5vw, 2.5rem)",
            color: "#fff",
            lineHeight: 1.5,
            margin: "0 auto",
            maxWidth: 1000
          }}>
            "We are not building events. We are creating spaces where people can feel something real."
          </p>
          <div style={{ marginTop: 24, fontSize: "0.85rem", letterSpacing: "0.25em", color: "#C8FF2B", textTransform: "uppercase", fontFamily: "'Bebas Neue', sans-serif" }}>
            — Arjuna & Deepa
          </div>
        </motion.div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          #about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}


// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact({ toast }) {
    const [form, setForm] = useState({ name: "", email: "", message: "", subscribe: false });
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(false);
    const [isFormFocused, setIsFormFocused] = useState(false);
  
    const validate = () => {
      const errs = {};
      if (!form.name.trim()) errs.name = "Name is required";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Invalid email address";
      if (!form.subscribe && !form.message.trim()) errs.message = "Message is required if not subscribing to the newsletter";
      return errs;
    };
  
    const handleSend = () => {
      const errs = validate();
      setErrors(errs);
      if (Object.keys(errs).length) { toast({ message: "Check the form for errors", type: "error" }); return; }
      setSent(true);
      if (form.subscribe && !form.message.trim()) {
        toast({ message: "Subscribed to Tangy Letter! ✉️", type: "success" });
      } else {
        toast({ message: "Message sent! We'll be in touch. 🎵", type: "success" });
      }
      setForm({ name: "", email: "", message: "", subscribe: false });
      setTimeout(() => setSent(false), 5000);
    };
  
    const inp = field => ({
      width: "100%", padding: "14px 18px",
      background: "rgba(0,0,0,0.55)",
      border: `1px solid ${errors[field] ? "#ef4444" : "rgba(200, 255, 43,0.2)"}`,
      borderRadius: 8, color: "#fff", fontSize: "0.88rem", fontFamily: "inherit",
      outline: "none", boxSizing: "border-box", marginBottom: 4, transition: "all 0.25s",
    });
  
    return (
      <section id="get-in-touch" style={{ background: "transparent", padding: "clamp(140px, 15vw, 220px) 5vw", position: "relative", overflow: "hidden" }}>
        <SectionBackgroundText text="TANGY" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <SectionHeader label="Connect" title="Get In Touch" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, marginTop: 60, maxWidth: 900, margin: "60px auto 0" }}>
  
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{
                background: "linear-gradient(135deg, rgba(24,24,24,0.7) 0%, rgba(24,24,24,0.45) 100%)",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: "32px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}>
              {[["Location", "Bansilal Stepwell", "Hyderabad, Telangana, India"], ["Contact", "hello@tangysessions.in", ""]].map(([title, line1, line2]) => (
                <div key={title} style={{ marginBottom: 24 }}>
                  <div style={{ color: "#C8FF2B", fontSize: "0.72rem", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8, fontWeight: "600" }}>{title}</div>
                  <div style={{ color: "#fff", fontSize: "0.95rem" }}>{line1}</div>
                  {line2 && <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>{line2}</div>}
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                {["Instagram", "Spotify", "SoundCloud"].map(s => (
                  <motion.button key={s} onClick={() => toast({ message: `Opening ${s}...`, type: "info" })}
                    whileHover={{ scale: 1.05, borderColor: "#C8FF2B", color: "#C8FF2B" }} whileTap={{ scale: 0.95 }}
                    style={{ padding: "9px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", letterSpacing: "0.08em", transition: "all 0.2s" }}>
                    {s}
                  </motion.button>
                ))}
              </div>
              <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(200, 255, 43,0.2)", height: 200 }}>
                <iframe title="Bansilal Stepwell" src="https://maps.google.com/maps?q=Bansilal+Baoli+Stepwell+Hyderabad+Telangana&t=&z=16&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.8) contrast(0.9)" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </motion.div>
  
            {/* Right */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{
                background: "linear-gradient(135deg, rgba(24,24,24,0.7) 0%, rgba(24,24,24,0.45) 100%)",
                backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                border: isFormFocused ? "1px solid rgba(200, 255, 43,0.45)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: "32px",
                boxShadow: isFormFocused
                  ? "0 24px 60px rgba(0,0,0,0.85), 0 0 30px rgba(200, 255, 43,0.18), inset 0 1px 0 rgba(255,255,255,0.1)"
                  : "0 12px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
                transition: "all 0.4s ease",
              }}>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    style={{ textAlign: "center", padding: "60px 20px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12 }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} style={{ fontSize: "3rem", marginBottom: 16 }}>✅</motion.div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff" }}>{form.subscribe ? "Subscribed!" : "Message Sent"}</div>
                    <div style={{ color: "rgba(255,255,255,0.45)", marginTop: 8 }}>{form.subscribe ? "You are now on the list for Tangy Sessions updates." : "We'll get back to you shortly."}</div>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {["name", "email"].map(f => (
                      <div key={f} style={{ marginBottom: 14 }}>
                        <input placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={form[f]}
                          onChange={e => { setForm(x => ({ ...x, [f]: e.target.value })); setErrors(er => ({ ...er, [f]: null })); }}
                          style={inp(f)}
                          onFocus={e => { setIsFormFocused(true); e.target.style.borderColor = "#C8FF2B"; e.target.style.background = "rgba(200, 255, 43,0.06)"; e.target.style.boxShadow = "0 0 0 3px rgba(200, 255, 43,0.12)"; }}
                          onBlur={e => { setIsFormFocused(false); e.target.style.borderColor = errors[f] ? "#ef4444" : "rgba(200, 255, 43,0.2)"; e.target.style.background = "rgba(0,0,0,0.55)"; e.target.style.boxShadow = "none"; }}
                        />
                        {errors[f] && <div style={{ color: "#ef4444", fontSize: "0.72rem" }}>⚠ {errors[f]}</div>}
                      </div>
                    ))}
                    <div style={{ marginBottom: 14 }}>
                      <textarea placeholder="Your message (optional if subscribing to Tangy Letter)" value={form.message} rows={4}
                        onChange={e => { setForm(x => ({ ...x, message: e.target.value })); setErrors(er => ({ ...er, message: null })); }}
                        style={{ ...inp("message"), resize: "vertical" }}
                        onFocus={e => { setIsFormFocused(true); e.target.style.borderColor = "#C8FF2B"; e.target.style.background = "rgba(200, 255, 43,0.06)"; e.target.style.boxShadow = "0 0 0 3px rgba(200, 255, 43,0.12)"; }}
                        onBlur={e => { setIsFormFocused(false); e.target.style.borderColor = errors.message ? "#ef4444" : "rgba(200, 255, 43,0.2)"; e.target.style.background = "rgba(0,0,0,0.55)"; e.target.style.boxShadow = "none"; }}
                      />
                      {errors.message && <div style={{ color: "#ef4444", fontSize: "0.72rem" }}>⚠ {errors.message}</div>}
                    </div>
                    
                    {/* Newsletter Checkbox */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, cursor: "pointer", userSelect: "none" }}
                      onClick={() => setForm(x => ({ ...x, subscribe: !x.subscribe }))}>
                      <input type="checkbox" checked={form.subscribe} onChange={() => {}} 
                        style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#C8FF2B" }} />
                      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.78)" }}>
                        Subscribe to <strong>Tangy Letter</strong> for session updates
                      </span>
                    </div>

                    <MagneticButton onClick={handleSend}
                      style={{ width: "100%", padding: 15, background: "#C8FF2B", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 700, boxShadow: "0 0 20px rgba(200, 255, 43,0.25)" }}>
                      {form.subscribe && !form.message.trim() ? "Subscribe" : "Send Message"}
                    </MagneticButton>
                  </motion.div>
                )}
              </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
        background: "linear-gradient(135deg, rgba(7,7,7,0.75) 0%, rgba(15,15,15,0.60) 100%)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderTop: "1px solid rgba(200, 255, 43,0.18)",
        padding: "60px 5vw 32px",
        position: "relative",
        zIndex: 1,
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40, marginBottom: 48 }}>
        <div>
          <img
            src="/logo.svg"
            alt="Tangy Sessions Logo"
            style={{ height: 56, marginBottom: 8 }}
          />
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", fontStyle: "italic" }}>Music beneath history.</div>
        </div>
        <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
          {[["Explore", ["Events", "Artists", "Gallery"]], ["Connect", ["Instagram", "Spotify", "Contact"]]].map(([title, items]) => (
            <div key={title}>
              <div style={{ color: "#C8FF2B", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>{title}</div>
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
      <div style={{ fontSize: "0.68rem", letterSpacing: "0.38em", color: "#C8FF2B", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>{label}</div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff", margin: 0, letterSpacing: "0.04em" }}>{title}</h2>
      <motion.div initial={{ width: 0 }} whileInView={{ width: 48 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
        style={{ height: 2, background: "linear-gradient(to right, #C8FF2B, #06b6d4)", margin: "18px auto 0", borderRadius: 2 }} />
    </motion.div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ showArtistOverlay = false }) {
  const modal = useModal();
  const toast = modal.toast;

  return (
    <div style={{ background: "transparent", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#fff", position: "relative" }}>
      <UnicornBackground />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { -webkit-tap-highlight-color: transparent; overflow-x: hidden; }
        
        /* Ensure smooth scrolling offsets for the fixed top navigation bar */
        section {
          scroll-margin-top: 80px;
        }

        /* Hide Unicorn Studio error boxes/overlays if loading fails, falling back to a clean background */
        .unicorn-error-box,
        [class*="unicorn-error"],
        [id*="unicorn-error"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .unicorn-wrapper a, a[href*="unicorn.studio"] { display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; }
        ::selection { background: rgba(200, 255, 43,0.35); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #C8FF2B; border-radius: 2px; }
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

        /* ── Performance optimizations ───────────────────────────────── */
        /* Defer rendering of below-fold sections until near viewport */
        #events, #artists, #gallery, #tickets, #about, #volunteer, #contact {
          content-visibility: auto;
          contain-intrinsic-size: 0 600px;
        }
        /* Smooth momentum scrolling on iOS */
        body { -webkit-overflow-scrolling: touch; }

        /* GPU compositing layer for fixed background */
        #unicorn-bg { transform: translateZ(0); }

        /* Respect user's reduced-motion preference — disable all animations */

        /* True Masonry Grid flow */
        .masonry-grid {
          column-count: 3;
          column-gap: 24px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .masonry-grid {
            column-count: 2;
            column-gap: 16px;
          }
        }
        @media (max-width: 600px) {
          .masonry-grid {
            column-count: 1;
          }
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 24px;
        }
      `}</style>

      <Navbar />
      <ErrorBoundary name="Hero"><Hero /></ErrorBoundary>
      <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, transparent, rgba(200, 255, 43,0.12) 50%, transparent)", margin: "0 auto" }} />
      <ErrorBoundary name="WhyTangy"><WhyTangy /></ErrorBoundary>
      <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, transparent, rgba(200, 255, 43,0.12) 50%, transparent)", margin: "0 auto" }} />
      <ErrorBoundary name="Events"><Events /></ErrorBoundary>
      <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, transparent, rgba(200, 255, 43,0.12) 50%, transparent)", margin: "0 auto" }} />
      <ErrorBoundary name="Gallery"><Gallery /></ErrorBoundary>
      <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, transparent, rgba(200, 255, 43,0.12) 50%, transparent)", margin: "0 auto" }} />
      <ErrorBoundary name="About"><About /></ErrorBoundary>
      <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, transparent, rgba(200, 255, 43,0.12) 50%, transparent)", margin: "0 auto" }} />
      <ErrorBoundary name="Volunteer"><Volunteer /></ErrorBoundary>
      <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, transparent, rgba(200, 255, 43,0.12) 50%, transparent)", margin: "0 auto" }} />
      <ErrorBoundary name="ArtistRegister"><ArtistRegister toast={toast} /></ErrorBoundary>
      <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, transparent, rgba(200, 255, 43,0.12) 50%, transparent)", margin: "0 auto" }} />
      <ErrorBoundary name="Contact"><Contact toast={toast} /></ErrorBoundary>
      <Footer />

      {showArtistOverlay && (
        <ErrorBoundary name="ArtistDetails">
          <ArtistDetails />
        </ErrorBoundary>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const host = window.location.hostname;
  const isAdminSubdomain = host.startsWith('admin.') || host === 'admin.localhost';
  const isArtistSubdomain = host.startsWith('artist.') || host === 'artist.localhost';

  let content;
  if (isAdminSubdomain) {
    content = <AdminDashboard />;
  } else if (isArtistSubdomain) {
    content = <ArtistPortal />;
  } else {
    content = (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/artist" element={<ArtistPortal />} />
        <Route path="/artists/:id" element={<LandingPage showArtistOverlay={true} />} />
        <Route path="/events/:slug" element={<EventDetails />} />
        <Route path="/volunteer" element={<VolunteerDetails />} />
      </Routes>
    );
  }

  return (
    <ModalProvider>
      {content}
    </ModalProvider>
  );
}
