// ─── App.jsx (Updated) ───────────────────────────────────────────────────────
// Replace your existing App.jsx with this file.
// Components used (place in src/components/):
//   UnicornBackground.jsx  — unchanged from your original
//   PaymentModal.jsx       — NEW (replace with the PaymentModal.jsx output)
//   Volunteer.jsx          — NEW (replace with the Volunteer.jsx output)
//   AdminDashboard.jsx     — NEW (replace with the AdminDashboard.jsx output)
//   TVPlayer.jsx           — NEW (replace with the RetroTV/TVPlayer.jsx output)

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
import TVPlayer from "./src/components/RetroTV/TVPlayer.jsx";
import UserProfile from "./src/pages/UserProfile";
import AuthModal from "./src/components/AuthModal";
import { useAuth } from "./src/contexts/AuthContext";

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

// Custom hook to trigger hover state automatically on scroll for mobile devices
function useAutoHover(amount = 0.35) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount, margin: "0px 0px -10% 0px" });
  const [isMouseHovered, setIsMouseHovered] = useState(false);
  
  const isHovered = isMobile ? isInView : isMouseHovered;

  const hoverProps = isMobile ? {} : {
    onMouseEnter: () => setIsMouseHovered(true),
    onMouseLeave: () => setIsMouseHovered(false),
  };

  return { ref, isHovered, hoverProps, isInView };
}

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
  const { ref, isHovered, hoverProps } = useAutoHover(0.5);
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
    if (hoverProps.onMouseLeave) hoverProps.onMouseLeave();
  };

  const handleMouseEnter = () => {
    if (hoverProps.onMouseEnter) hoverProps.onMouseEnter();
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      animate={{ x: position.x, y: position.y, scale: isHovered ? 1.05 : 1 }}
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
  const modal = useModal();
  const { user, logout } = useAuth();

  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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
      background: "rgba(8,8,8,0.97)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(200,255,43,0.08)",
      transition: "border-color 0.35s ease",
      padding: "0 5vw",
      display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src="/logo.svg"
          alt="Tangy Sessions Logo"
          style={{ height: 48, cursor: "pointer" }}
          onClick={() => scrollTo("home")}
        />
      </div>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="nav-links">
        {links.map(l => (
          <button key={l} onClick={() => scrollTo(l)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.65rem", letterSpacing: "0.25em", fontFamily: "'Space Mono', monospace", textTransform: "uppercase", transition: "color 0.2s", padding: "4px 0" }}
            onMouseEnter={e => e.target.style.color = "#C8FF2B"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>
            {l}
          </button>
        ))}
        {/* Auth CTA */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => { navigate('/profile'); setMenuOpen(false); }} style={{
              width: 36, height: 36, borderRadius: 0,
              background: 'var(--tangy-amber, #C8FF2B)',
              border: '1px solid #ffffff', cursor: 'pointer',
              fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '0.85rem',
              color: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {user.name?.[0] || 'U'}
            </button>
            <button onClick={() => { logout(); setMenuOpen(false); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.65rem", letterSpacing: "0.25em", fontFamily: "'Space Mono', monospace", textTransform: "uppercase" }}>
              EXIT
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => modal.openAuth()}
              style={{ background: "none", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 0 }}>
              LOGIN
            </button>
            <button onClick={() => scrollTo("Events")}
              style={{ background: "#C8FF2B", border: "none", color: "#080808", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "8px 20px", borderRadius: 0, transition: "opacity 0.2s" }}
              onMouseEnter={e => e.target.style.opacity = "0.85"}
              onMouseLeave={e => e.target.style.opacity = "1"}>
              BUY TICKETS
            </button>
          </div>
        )}
      </div>

      {/* Hamburger */}
      <button onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: "none", background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "1rem", cursor: "pointer", padding: "6px 10px", borderRadius: 0 }}
        className="hamburger">
        {menuOpen ? "✕" : "☰"}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: "fixed", top: 64, left: 0, right: 0,
              background: "rgba(8,8,8,0.99)",
              backdropFilter: "blur(20px)",
              padding: "20px 5vw 28px",
              display: "flex", flexDirection: "column", gap: 0,
              borderBottom: "1px solid rgba(200,255,43,0.1)",
              zIndex: 999,
            }}>
            {links.map(l => (
              <button key={l} onClick={() => scrollTo(l)}
                style={{ background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: "0.75rem", textAlign: "left", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "'Space Mono', monospace", padding: "16px 0" }}>
                {l}
              </button>
            ))}
            {user ? (
              <div style={{ display: 'flex', gap: 16, marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
                <button onClick={() => { navigate('/profile'); setMenuOpen(false); }}
                  style={{ background: "#C8FF2B", border: "none", color: "#080808", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px", borderRadius: 0, flex: 1 }}>
                  PROFILE
                </button>
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px", borderRadius: 0, flex: 1 }}>
                  LOGOUT
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 16, marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
                <button onClick={() => { modal.openAuth(); setMenuOpen(false); }}
                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px", borderRadius: 0, flex: 1 }}>
                  LOGIN
                </button>
                <button onClick={() => scrollTo("Events")}
                  style={{ background: "#C8FF2B", border: "none", color: "#080808", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px", borderRadius: 0, flex: 1 }}>
                  TICKETS
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}


// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const gramophoneHover = useAutoHover(0.4);
  const radioHover      = useAutoHover(0.4);

  const sectionRef     = useRef(null);
  const flareRef       = useRef(null);
  const targetOffset   = useRef({ x: 0, y: 0 });
  const currentOffset  = useRef({ x: 0, y: 0 });
  const rafId          = useRef(null);

  // Mouse parallax — desktop only
  useEffect(() => {
    if (isMobile || isLowEndDevice) return;
    const onMouseMove = (e) => {
      const { innerWidth: W, innerHeight: H } = window;
      targetOffset.current = { x: (e.clientX / W - 0.5) * 2, y: (e.clientY / H - 0.5) * 2 };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    let lastTime = 0;
    const tick = (time) => {
      if (time - lastTime < 16) { rafId.current = requestAnimationFrame(tick); return; }
      lastTime = time;
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * 0.06;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * 0.06;
      const tx = currentOffset.current.x * 14;
      const ty = currentOffset.current.y * 14;
      if (flareRef.current) flareRef.current.style.transform = `translate(calc(-50% + ${tx * 4}px), calc(-50% + ${ty * 4}px))`;
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', onMouseMove); cancelAnimationFrame(rafId.current); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      style={{
        position: 'relative',
        minHeight: '100svh',
        background: '#080808',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Photo collage background ── */}
      <div style={{ position:'absolute', inset:0, zIndex:0, display:'grid', gridTemplateColumns:'repeat(5,1fr)', gridTemplateRows:'repeat(3,1fr)', gap:2, opacity:0.12 }}>
        {['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80','https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80','https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80','https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80','https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&q=80','https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80','https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80','https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80','https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80','https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80','https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=400&q=80','https://images.unsplash.com/photo-1504509546545-e000b4a62425?w=400&q=80','https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80','https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80','https://images.unsplash.com/photo-1571266028243-e4d6af6ce84e?w=400&q=80'].map((src,i) => (
          <div key={i} style={{ overflow:'hidden' }}><img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', filter:'grayscale(0.7) contrast(1.2)' }} loading="eager" /></div>
        ))}
      </div>
      <div style={{ position:'absolute', inset:0, background:'rgba(8,8,8,0.88)', zIndex:1 }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(8,8,8,0.55) 0%, transparent 55%, rgba(8,8,8,0.95) 100%)', zIndex:2 }} />

      {/* Cursor flare */}
      {!isMobile && (
        <div ref={flareRef} style={{ position:'absolute', zIndex:3, pointerEvents:'none', width:'35vw', height:'35vw', borderRadius:'50%', background:'radial-gradient(circle, rgba(200,255,43,0.07) 0%, transparent 70%)', transform:'translate(-50%,-50%)', top:'50%', left:'50%', willChange:'transform' }} />
      )}

      {/* Top marquee strip */}
      <div style={{ position:'absolute', top:64, left:0, right:0, overflow:'hidden', borderTop:'1px solid rgba(200,255,43,0.15)', borderBottom:'1px solid rgba(200,255,43,0.08)', background:'rgba(200,255,43,0.04)', zIndex:5, paddingBlock:6 }}>
        <div className="marquee-track" style={{ gap:0 }}>
          {Array(4).fill('UNDERGROUND MUSIC  ·  ANCIENT SPACES  ·  TANGY SESSIONS  ·  HYDERABAD  ·  EST. 2025  ·  ').map((t,i) => (
            <span key={i} style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.65rem', letterSpacing:'0.3em', color:'#C8FF2B', textTransform:'uppercase', paddingRight:'4rem', whiteSpace:'nowrap', opacity:0.8 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Left vertical label */}
      <div style={{ position:'absolute', left:0, top:'50%', transform:'translateX(-50%) translateY(-50%) rotate(-90deg)', zIndex:5, fontFamily:"'Space Mono', monospace", fontSize:'0.6rem', letterSpacing:'0.4em', color:'rgba(200,255,43,0.4)', textTransform:'uppercase', whiteSpace:'nowrap', pointerEvents:'none' }}>
        SRL-001 // HYD-2025
      </div>

      {/* Gramophone — bottom-left decal */}
      <motion.div
        ref={gramophoneHover.ref}
        {...gramophoneHover.hoverProps}
        className="hero-gramophone"
        initial={{ opacity:0, rotate:-12, scale:0.7 }}
        animate={{ opacity:1, rotate: gramophoneHover.isHovered ? -2 : -8, scale: gramophoneHover.isHovered ? 1.08 : 1 }}
        transition={{ duration:1.2, delay:0.6, ease:'easeOut' }}
        style={{ position:'absolute', bottom:'6%', left:'2vw', width:'clamp(70px, 9vw, 150px)', filter:'drop-shadow(0 15px 25px rgba(0,0,0,0.9))', zIndex:6, cursor:'pointer' }}
      >
        <img src="/gramophone.png" alt="Vintage Gramophone" style={{ width:'100%', height:'auto', display:'block' }} />
      </motion.div>

      {/* ── Two-column hero content ───────────────────────────────────────── */}
      <div className="hero-inner">

        {/* LEFT — Text content */}
        <div className="hero-left" style={{ position:'relative', zIndex:6 }}>
          <motion.div initial={{ opacity:0, x:-60 }} animate={{ opacity:1, x:0 }} transition={{ duration:1.0, ease:[0.16,1,0.3,1] }}>
            <div style={{ fontFamily:"'Space Mono', monospace", fontSize:'clamp(0.55rem, 1.1vw, 0.75rem)', letterSpacing:'0.5em', color:'#C8FF2B', textTransform:'uppercase', marginBottom:10 }}>
              — LIVE MUSIC UNDERGROUND
            </div>
            <h1 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(3.2rem, 13vw, 14rem)', lineHeight:0.88, letterSpacing:'0.02em', color:'#fff', margin:0, textShadow:'0 0 120px rgba(200,255,43,0.08)' }}>
              TANGY
            </h1>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'2vw', flexWrap:'wrap' }}>
              <h1 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:'clamp(3.2rem, 13vw, 14rem)', lineHeight:0.88, letterSpacing:'0.02em', margin:0, WebkitTextStroke:'2px #C8FF2B', WebkitTextFillColor:'transparent' }}>
                SESSIONS
              </h1>
              <div style={{ display:'flex', flexDirection:'column', gap:5, paddingBottom:6, opacity:0.65 }}>
                <div style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.52rem', letterSpacing:'0.25em', color:'#C8FF2B', textTransform:'uppercase' }}>ADMIT ONE</div>
                <div style={{ display:'flex', gap:2, height:20 }}>
                  {[3,1,2,4,1,3,2,1,4,2,1,3,2,4,1].map((w,i) => <div key={i} style={{ width:w*2, height:'100%', background:'#C8FF2B', opacity:0.55 }} />)}
                </div>
                <div style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.45rem', color:'rgba(255,255,255,0.3)', letterSpacing:'0.15em' }}>TS-HYD-2025</div>
              </div>
            </div>
          </motion.div>

          {/* Subline + CTAs */}
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.9, ease:[0.16,1,0.3,1] }} style={{ display:'flex', alignItems:'center', gap:'4vw', marginTop:24, flexWrap:'wrap' }}>
            <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:'clamp(0.88rem, 1.8vw, 1.3rem)', color:'rgba(255,255,255,0.5)', margin:0, letterSpacing:'0.08em', maxWidth:340 }}>
              Where sound meets stillness.<br />Ancient spaces. Underground culture.
            </p>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <MagneticButton onClick={() => document.getElementById('events')?.scrollIntoView({ behavior:'smooth' })} style={{ padding:'14px 30px', background:'#C8FF2B', color:'#080808', border:'none', borderRadius:0, cursor:'pointer', fontFamily:"'Bebas Neue', sans-serif", letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'1rem', fontWeight:700 }}>
                GET TICKETS
              </MagneticButton>
              <MagneticButton onClick={() => document.getElementById('volunteer')?.scrollIntoView({ behavior:'smooth' })} style={{ padding:'14px 30px', background:'transparent', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:0, cursor:'pointer', fontFamily:"'Bebas Neue', sans-serif", letterSpacing:'0.15em', textTransform:'uppercase', fontSize:'1rem' }}>
                JOIN COMMUNITY
              </MagneticButton>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6, duration:0.8 }}>
            <HeroStats />
          </motion.div>
        </div>

        {/* RIGHT — TV column */}
        <div className="hero-right">
          {/* Radio — floats above TV, desktop only */}
          <motion.div
            ref={radioHover.ref}
            {...radioHover.hoverProps}
            className="hero-radio-decal"
            initial={{ opacity:0, scale:0.8, rotate:-6 }}
            animate={{
              opacity:1,
              scale: radioHover.isHovered ? 1.07 : 1,
              rotate: radioHover.isHovered ? 0 : -4,
              y: radioHover.isInView ? [0, -10, 0] : 0,
              filter: radioHover.isHovered ? 'drop-shadow(0 0 22px rgba(200,255,43,0.4))' : 'drop-shadow(0 16px 24px rgba(0,0,0,0.85))',
            }}
            transition={{ opacity:{ duration:1, delay:0.3 }, scale:{ duration:0.5 }, y:{ duration:6, repeat:Infinity, ease:'easeInOut' } }}
          >
            <img src="/radio.png" alt="Vintage Boombox" style={{ width:'100%', height:'auto', display:'block' }} />
            <div style={{ position:'absolute', bottom:-8, right:-6, background:'#FF2E52', color:'#fff', fontFamily:"'Space Mono', monospace", fontSize:'0.45rem', padding:'2px 6px', letterSpacing:'0.18em', transform:'rotate(5deg)', boxShadow:'0 3px 10px rgba(0,0,0,0.6)' }}>
              ANALOG SOUND
            </div>
          </motion.div>

          {/* The TV itself */}
          <TVPlayer />
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:6, borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 5vw' }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.55rem', color:'rgba(255,255,255,0.22)', letterSpacing:'0.2em' }}>BANSILAL STEPWELL · HYDERABAD</div>
        <motion.div animate={{ y:[0,5,0] }} transition={{ repeat:Infinity, duration:2 }} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:5 }} onClick={() => document.getElementById('events')?.scrollIntoView({ behavior:'smooth' })}>
          <div style={{ width:1, height:28, background:'linear-gradient(to bottom, transparent, #C8FF2B)' }} />
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:'0.5rem', color:'#C8FF2B', letterSpacing:'0.3em', textTransform:'uppercase' }}>SCROLL</div>
        </motion.div>
      </div>

      {/* ── Hero layout CSS ── */}
      <style>{`
        .hero-inner {
          position: relative;
          z-index: 6;
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 32px;
          padding: 120px 5vw 80px;
          min-height: 100svh;
          box-sizing: border-box;
        }
        .hero-left  { display: flex; flex-direction: column; justify-content: center; }
        .hero-right {
          display: flex; flex-direction: column;
          align-items: center; gap: 0;
          position: relative;
        }
        .hero-radio-decal {
          position: relative;
          width: clamp(90px, 11vw, 140px);
          align-self: flex-end;
          margin-right: 10%;
          margin-bottom: -12px;
          z-index: 8;
          cursor: pointer;
        }
        .tangy-tv-wrapper {
          width: 100%;
          max-width: 560px;
        }

        /* Tablet */
        @media (max-width: 1100px) {
          .hero-inner { grid-template-columns: 1fr 1fr; gap: 20px; padding: 110px 3vw 70px; }
          .tangy-tv-wrapper { max-width: 440px; }
        }

        /* Mobile: single column, TV below content */
        @media (max-width: 768px) {
          .hero-inner {
            grid-template-columns: 1fr;
            padding: 100px 5vw 72px;
            align-items: flex-start;
            gap: 28px;
          }
          .hero-right {
            width: 100%;
            align-items: center;
          }
          .hero-radio-decal {
            display: none; /* hidden on mobile */
          }
          .tangy-tv-wrapper {
            width: 100%;
            max-width: 380px;
          }
        }
      `}</style>
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
function ValueBlock({ val, idx }) {
  const { ref, isHovered, hoverProps } = useAutoHover(0.4);
  return (
    <motion.div
      ref={ref}
      {...hoverProps}
      className="editorial-val-block"
      initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      style={{ display: "flex", alignItems: "center", gap: "5vw", padding: "48px 0", borderBottom: "1px dashed rgba(255,255,255,0.08)", position: "relative", cursor: "default" }}
    >
      <div className="val-bg-num" style={{ position: "absolute", right: idx % 2 === 0 ? "2vw" : "auto", left: idx % 2 !== 0 ? "2vw" : "auto", fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(6rem, 14vw, 12rem)", color: "rgba(200,255,43,0.04)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
        {val.num}
      </div>
      <div style={{ flex: 1, zIndex: 1 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#C8FF2B", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 12 }}>{val.num} // VALUE</div>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", margin: "0 0 16px", letterSpacing: "0.05em" }}>{val.title}</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", lineHeight: 1.75, maxWidth: 500, margin: 0 }}>{val.text}</p>
      </div>
      <motion.div className="val-image" animate={{ scale: isHovered ? 1.03 : 1 }} style={{ width: "clamp(120px, 18vw, 240px)", height: "clamp(100px, 14vw, 180px)", overflow: "hidden", flexShrink: 0, order: idx % 2 === 0 ? 1 : -1, filter: "grayscale(0.4)" }}>
        <img src={val.img} alt={val.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" decoding="async" />
      </motion.div>
    </motion.div>
  );
}

function WhyTangy() {
  const radioHover = useAutoHover(0.4);
  const vinylHover = useAutoHover(0.4);
  return (
    <section id="why-tangy" style={{ background: "#080808", padding: "0", position: "relative", overflow: "hidden" }}>

      {/* DIAGONAL BANNER HEADER */}
      <div style={{ background: "#C8FF2B", padding: "40px 5vw", position: "relative", overflow: "hidden", marginBottom: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 20px)" }} />
        <div className="banner-inner" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem, 10vw, 9rem)", lineHeight: 0.9, color: "#080808", margin: 0, letterSpacing: "0.02em" }}>
            WHY TANGY?
          </h2>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "rgba(8,8,8,0.5)", letterSpacing: "0.3em", textTransform: "uppercase", maxWidth: 220, textAlign: "right" }}>
            A COMMUNITY BUILT AROUND MUSIC, CREATIVITY AND MEANINGFUL EXPERIENCES.
          </div>
        </div>
      </div>

      {/* MANIFESTO BLOCK */}
      <div className="manifesto-block" style={{ padding: "80px 5vw 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
        {/* Floating Radio Decal in WhyTangy */}
        <motion.div
          ref={radioHover.ref}
          {...radioHover.hoverProps}
          initial={{ opacity: 0, rotate: 12, scale: 0.8 }}
          whileInView={{ opacity: 1, rotate: 8, scale: 1 }}
          viewport={{ once: true }}
          animate={{ rotate: radioHover.isHovered ? 0 : 8, scale: radioHover.isHovered ? 1.05 : 1 }}
          style={{
            position: "absolute",
            top: 20,
            right: "5vw",
            width: "clamp(130px, 18vw, 220px)",
            filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.9))",
            zIndex: 2,
            cursor: "pointer",
          }}
        >
          <img src="/radio.png" alt="Vintage Boombox" style={{ width: "100%", height: "auto" }} />
          <div style={{
            position: "absolute",
            top: -8,
            left: -8,
            background: "#C8FF2B",
            color: "#080808",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.5rem",
            padding: "2px 6px",
            letterSpacing: "0.15em",
            fontWeight: "bold"
          }}>
            TAPE 01
          </div>
        </motion.div>

        <div className="manifesto-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr", gap: "5vw", alignItems: "start" }}>
          <div className="vertical-label" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "#C8FF2B", letterSpacing: "0.35em", textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)", paddingBlock: 8 }}>
            01 / PHILOSOPHY
          </div>
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(1.4rem, 3vw, 2.4rem)", color: "rgba(255,255,255,0.9)", lineHeight: 1.5, margin: 0, borderLeft: "3px solid #C8FF2B", paddingLeft: "4vw", maxWidth: 800 }}
          >
            "Tangy Sessions was born from a simple belief: The most meaningful experiences happen when people slow down."
          </motion.blockquote>
        </div>
      </div>

      {/* BODY TEXT STRIP */}
      <div className="body-text-strip" style={{ padding: "40px 5vw 80px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="body-two-col" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5vw" }}>
          {[
            "In a world filled with endless scrolling, constant notifications, and digital noise, we wanted to create something different. Not another event. Not another lineup. Not another night out.",
            "Tangy is an invitation to pause. To listen more deeply. To connect more honestly. To experience music, art, and community in a way that feels real."
          ].map((text, i) => (
            <motion.p key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.7 }}
              style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", lineHeight: 1.85, margin: 0 }}>
              {text}
            </motion.p>
          ))}
        </div>
      </div>

      {/* VALUES — full-width stacked editorial blocks */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 5vw", position: "relative" }}>
        
        {/* SPINNING VINYL DECAL ACCENT */}
        <motion.div
          ref={vinylHover.ref}
          {...vinylHover.hoverProps}
          className="vinyl-decal"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          animate={{ scale: vinylHover.isHovered ? 1.1 : 1 }}
          style={{
            position: "absolute",
            top: -40,
            left: "-4vw",
            width: "clamp(120px, 16vw, 220px)",
            zIndex: 3,
            cursor: "pointer",
            filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.9))",
          }}
        >
          <motion.img
            src="/vinyl.png"
            alt="Vinyl Record"
            animate={{ rotate: vinylHover.isInView ? 360 : 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </motion.div>

        {[
          { num: "01", title: "SOUND", text: "Immersive sonic experiences curated to be felt, not simply heard.", img: "/gallery/tangy5.jpg" },
          { num: "02", title: "STILLNESS", text: "A reminder to slow down, stay present, and reconnect with yourself.", img: "/gallery/tangy1.jpg" },
          { num: "03", title: "COMMUNITY", text: "A collective of artists, creators, volunteers, and attendees brought together through meaningful experiences.", img: "/gallery/tngy7.jpg" },
        ].map((val, idx) => (
          <ValueBlock key={val.title} val={val} idx={idx} />
        ))}
      </div>

      {/* STATISTICS STRIP */}
      <div style={{ background: "#111111", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "48px 5vw", marginTop: 40 }} className="stats-strip">
        <div className="stats-4col" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { endStr: "10000+", label: "ATTENDEES", duration: 2.5 },
            { endStr: "50+",    label: "ARTISTS",   duration: 2.0 },
            { endStr: "25+",    label: "SESSIONS",  duration: 1.8 },
            { endStr: null,     label: "COMMUNITY" }
          ].map((stat, idx) => (
            <motion.div key={stat.label} className="stat-item" style={{ borderLeft: idx > 0 ? "1px solid rgba(255,255,255,0.06)" : "none", paddingLeft: idx > 0 ? 32 : 0 }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.12, duration: 0.6 }}>
              <div className="stat-num" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#C8FF2B", lineHeight: 1 }}>
                {stat.endStr === null ? <GrowingTypewriter delay={idx * 150} /> : <CountUpNumber endStr={stat.endStr} delay={idx * 150} duration={stat.duration} />}
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 8 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* EDITORIAL FULL-WIDTH STATEMENT */}
      <div style={{ overflow: "hidden", padding: "60px 0 0" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 10vw, 11rem)", lineHeight: 0.9, color: "rgba(255,255,255,0.06)", whiteSpace: "nowrap", userSelect: "none", letterSpacing: "0.02em", textAlign: "center", paddingBottom: 60 }}>
          SOUND · STILLNESS · COMMUNITY
        </div>
      </div>
    </section>
  );
}


// ─── EVENTS ───────────────────────────────────────────────────────────────────
function Events() {
  const modal = useModal();
  const { user } = useAuth();
  
  return (
    <section id="events" style={{ background: "#080808", padding: "120px 0 80px", position: "relative", overflow: "hidden" }}>
      {/* Section Header */}
      <div style={{ padding: "0 5vw", marginBottom: 60, position: "relative" }}>
        {/* Radio Decal in Events */}
        <motion.div
          className="events-radio"
          initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
          whileInView={{ opacity: 1, rotate: -10, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ rotate: 0, scale: 1.08 }}
          style={{
            position: "absolute",
            top: -20,
            right: "8vw",
            width: "clamp(120px, 15vw, 200px)",
            filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.85))",
            zIndex: 3,
            cursor: "pointer"
          }}
        >
          <img src="/radio.png" alt="Vintage Boombox" style={{ width: "100%", height: "auto" }} />
          <div style={{
            position: "absolute",
            bottom: -6,
            right: -6,
            background: "#C8FF2B",
            color: "#080808",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.48rem",
            padding: "2px 6px",
            letterSpacing: "0.15em",
            fontWeight: "bold"
          }}>
            LIVE TUNES
          </div>
        </motion.div>

        <div style={{ display: "flex", alignItems: "baseline", gap: "4vw", flexWrap: "wrap" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", color: "#C8FF2B", textTransform: "uppercase", writingMode: "horizontal-tb" }}>
            // UPCOMING DROPS //
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: 0.9, color: "#fff", margin: 0, letterSpacing: "0.02em" }}>
            EVENTS
          </h2>
          <div style={{ flex: 1, height: 2, background: "linear-gradient(to right, #C8FF2B, transparent)", minWidth: 40, marginBottom: 16, alignSelf: "center" }} />
        </div>
      </div>

      {/* Ticket Stack */}
      <div className="ticket-stack" style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 5vw" }}>
        
        {/* INNER CIRCLE BANNER */}
        {!user && (
          <div style={{
            background: "#111", border: "1px dashed rgba(200,255,43,0.3)", padding: "24px 32px",
            marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 20
          }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#C8FF2B", letterSpacing: "0.05em", lineHeight: 1 }}>JOIN THE INNER CIRCLE</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginTop: 8, maxWidth: 500, lineHeight: 1.5 }}>
                Earn Tangy Points. Get early ticket access. Receive nearby event alerts. Unlock member-only drops.
              </div>
            </div>
            <button onClick={() => modal.openAuth()} 
              style={{
                background: "transparent", border: "1px solid #C8FF2B", color: "#C8FF2B",
                padding: "10px 20px", cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.1em"
              }}>
              JOIN TANGY
            </button>
          </div>
        )}

        {EVENTS.map((ev, i) => <EventCard key={ev.id} ev={ev} delay={i * 0.15} index={i} />)}
      </div>
    </section>
  );
}

function EventCard({ ev, delay, index }) {
  const { ref, isHovered, hoverProps } = useAutoHover(0.4);
  const navigate = useNavigate();
  const serialNum = `TS-${String(ev.id).padStart(3, '0')}`;
  return (
    <motion.div
      ref={ref}
      {...hoverProps}
      className="ticket-card"
      initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -0.5 : 0.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -0.3 : 0.3 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        background: isHovered ? "#131313" : "#0e0e0e",
        border: isHovered ? "1px solid rgba(200,255,43,0.5)" : "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        minHeight: 140,
        transform: `rotate(${index % 2 === 0 ? -0.3 : 0.3}deg)`,
      }}
    >
      {/* Shine effect on hover */}
      {isHovered && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 30%, rgba(200,255,43,0.05) 50%, transparent 70%)", animation: "shineSwipe 0.6s ease forwards", pointerEvents: "none", zIndex: 10 }} />
      )}

      {/* LEFT STUB */}
      <div className="ticket-stub-left" style={{ background: isHovered ? "#C8FF2B" : "#111111", minWidth: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 12px", borderRight: `1px dashed ${isHovered ? '#080808' : 'rgba(255,255,255,0.12)'}`, gap: 8, transition: "background 0.3s, border-color 0.3s", position: "relative" }}>
        {/* Cutout circles */}
        <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", width: 20, height: 20, borderRadius: "50%", background: "#080808" }} />
        <div style={{ position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)", width: 20, height: 20, borderRadius: "50%", background: "#080808" }} />
        <div className="admit-one" style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.3em", color: isHovered ? "#080808" : "#C8FF2B", textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)", transition: "color 0.3s" }}>ADMIT ONE</div>
        <div className="ticket-num" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: isHovered ? "#080808" : "#fff", lineHeight: 1, transition: "color 0.3s" }}>0{ev.id}</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.45rem", color: isHovered ? "rgba(8,8,8,0.5)" : "rgba(255,255,255,0.3)", letterSpacing: "0.2em", transition: "color 0.3s" }}>{serialNum}</div>
      </div>

      {/* MAIN BODY */}
      <div className="ticket-body" style={{ flex: 1, padding: "24px 28px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#C8FF2B", letterSpacing: "0.3em", textTransform: "uppercase" }}>{ev.date} · {ev.time}</div>
          {ev.tags.map(tag => (
            <span key={tag} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", padding: "2px 8px", border: "1px solid rgba(200,255,43,0.2)", color: "rgba(200,255,43,0.6)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{tag}</span>
          ))}
        </div>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#fff", margin: 0, letterSpacing: "0.04em", lineHeight: 1 }}>{ev.name}</h3>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em" }}>📍 {ev.location} · CAP. {ev.capacity}</div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", lineHeight: 1.6, margin: 0, maxWidth: 500 }}>{ev.desc}</p>
      </div>

      {/* RIGHT STUB */}
      <div className="ticket-stub-right" style={{ minWidth: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "20px 16px", borderLeft: "1px dashed rgba(255,255,255,0.08)", gap: 12 }}>
        {/* Barcode */}
        <div style={{ display: "flex", gap: 1.5, height: 48, alignItems: "flex-end" }}>
          {[3,1,2,4,1,3,2,1,4,2,1,3,2,1,4,3,1].map((w,i) => (
            <div key={i} style={{ width: w*1.5, height: `${60 + (i%3)*20}%`, background: "rgba(255,255,255,0.4)" }} />
          ))}
        </div>
        {/* Price */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", marginBottom: 2 }}>PRICE</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#C8FF2B" }}>₹{ev.price}</div>
        </div>
        {/* CTA */}
        <motion.button
          className="ticket-book-btn"
          onClick={() => navigate(`/events/${ev.slug}`)}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{ padding: "8px 14px", background: isHovered ? "#C8FF2B" : "transparent", color: isHovered ? "#080808" : "#C8FF2B", border: "1px solid #C8FF2B", borderRadius: 0, cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", fontSize: "0.8rem", transition: "all 0.25s" }}
        >
          BOOK →
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
  const violinHover = useAutoHover(0.4);
  const [lightbox, setLightbox] = useState(null);
  const handleKeyDown = useCallback(e => { if (e.key === "Escape") setLightbox(null); }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Desktop Masonry: Distribute items across 3 columns
  const cols = [[], [], []];
  GALLERY.forEach((item, i) => cols[i % 3].push({ ...item, globalIdx: i }));

  // Mobile Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);

  const PER_SLIDE = 3;
  const mobileSlides = [];
  for (let i = 0; i < GALLERY.length; i += PER_SLIDE) {
    mobileSlides.push(GALLERY.slice(i, i + PER_SLIDE));
  }
  const total = mobileSlides.length;

  const goTo = (idx) => {
    const n = Math.max(0, Math.min(total - 1, idx));
    setCurrentSlide(n);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: n * scrollRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const onScroll = () => {
    if (!scrollRef.current) return;
    const n = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
    setCurrentSlide(n);
  };

  // Single photo tile for mobile carousel
  const PhotoTile = ({ item, style }) => {
    const { ref, isHovered, hoverProps } = useAutoHover(0.5);
    return item ? (
      <div
        ref={ref}
        {...hoverProps}
        onClick={() => setLightbox(item)}
        style={{ position: "relative", overflow: "hidden", cursor: "pointer", background: "#080808", ...style }}
      >
        <img
          src={item.img} alt={item.label} loading="lazy" decoding="async"
          style={{ 
            width: "100%", height: "100%", objectFit: "cover", display: "block", 
            transition: "filter 0.4s, transform 0.5s",
            filter: isHovered ? "grayscale(0) brightness(1)" : "grayscale(20%) brightness(0.78)",
            transform: isHovered ? "scale(1.05)" : "scale(1)"
          }}
        />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 12px 10px", background: "linear-gradient(to top, rgba(0,0,0,0.88), transparent)", fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", color: "#C8FF2B", letterSpacing: "0.22em", textTransform: "uppercase" }}>
        {item.label}
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, width: 12, height: 12, borderTop: "2px solid #C8FF2B", borderLeft: "2px solid #C8FF2B" }} />
    </div>
    ) : <div style={{ background: "#0d0d0d", ...style }} />;
  };

  return (
    <section id="gallery" style={{ background: "#0a0a0a", padding: "120px 0 80px", position: "relative", overflow: "hidden" }}>

      {/* SECTION HEADER */}
      <div style={{ padding: "0 5vw", marginBottom: 60, position: "relative" }}>
        {/* Floating Violin Decal */}
        <motion.div
          ref={violinHover.ref}
          {...violinHover.hoverProps}
          className="gallery-violin"
          initial={{ opacity: 0, x: 40, rotate: 15 }}
          whileInView={{ opacity: 1, x: 0, rotate: 10 }}
          viewport={{ once: true }}
          animate={{ y: violinHover.isInView ? [0, -10, 0] : 0, scale: violinHover.isHovered ? 1.08 : 1, rotate: violinHover.isHovered ? 0 : 10 }}
          transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
          style={{
            position: "absolute",
            top: -30,
            right: "5vw",
            width: "clamp(100px, 14vw, 200px)",
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.8))",
            zIndex: 3,
            cursor: "pointer",
          }}
        >
          <img src="/violin.png" alt="Floral Violin" style={{ width: "100%", height: "auto", display: "block" }} />
        </motion.div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", color: "#C8FF2B", textTransform: "uppercase", marginBottom: 12 }}>
            — ARCHIVE —
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: 0.9, color: "#fff", margin: 0, letterSpacing: "0.02em" }}>
            GALLERY
          </h2>
        </div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, #C8FF2B, transparent)" }} />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.3em" }}>MOMENTS FROM THE SESSIONS</div>
        </div>
      </div>

      {/* MASONRY GRID */}
      {isMobile ? (
        <div style={{ position: "relative", overflow: "hidden" }}>
          <style>{`
            .gal-track::-webkit-scrollbar { display: none; }
            .gal-track { scrollbar-width: none; -ms-overflow-style: none; width: 100%; }
          `}</style>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5vw", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em" }}>← SWIPE →</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em" }}>
              {String(currentSlide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </div>
          </div>

          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="gal-track"
            style={{
              display: "flex",
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {mobileSlides.map((slide, si) => {
              const bigLeft = si % 2 === 0;
              const [a, b, c] = slide;
              return (
                <div
                  key={si}
                  style={{
                    minWidth: "100%",
                    flexShrink: 0,
                    scrollSnapAlign: "start",
                    padding: "0 5vw",
                    boxSizing: "border-box",
                    display: "grid",
                    gridTemplateColumns: bigLeft ? "58% 42%" : "42% 58%",
                    gridTemplateRows: "1fr 1fr",
                    gap: 3,
                    height: "clamp(240px, max(42vw, 38vh), 480px)",
                  }}
                >
                  {bigLeft ? (
                    <>
                      <PhotoTile item={a} style={{ gridColumn: "1", gridRow: "1 / 3" }} />
                      <PhotoTile item={b} style={{ gridColumn: "2", gridRow: "1" }} />
                      <PhotoTile item={c} style={{ gridColumn: "2", gridRow: "2" }} />
                    </>
                  ) : (
                    <>
                      <PhotoTile item={b} style={{ gridColumn: "1", gridRow: "1" }} />
                      <PhotoTile item={c} style={{ gridColumn: "1", gridRow: "2" }} />
                      <PhotoTile item={a} style={{ gridColumn: "2", gridRow: "1 / 3" }} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="masonry-outer" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, padding: "0 5vw" }}>
          {cols.map((col, colIdx) => (
            <div key={colIdx} className="masonry-col">
              {col.map((item, rowIdx) => {
                const rotations = [-2, 1, -1, 2, -3, 1.5];
                const rot = rotations[(colIdx * 3 + rowIdx) % rotations.length];
                const isTall = (colIdx + rowIdx) % 3 === 0;
                return (
                  <motion.div
                    key={item.id}
                    className="polaroid-photo"
                    onClick={() => setLightbox(item)}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: (colIdx * 0.1 + rowIdx * 0.05) }}
                    style={{
                      background: "#151515",
                      padding: "12px 12px 36px",
                      border: "1px solid rgba(255,255,255,0.06)",
                      cursor: "pointer",
                      transform: `rotate(${rot}deg)`,
                      position: "relative",
                      overflow: "visible",
                    }}
                  >
                    {/* Tape effect */}
                    {rowIdx % 2 === 0 && (
                      <div style={{ position: "absolute", top: -10, left: "50%", transform: `translateX(-50%) rotate(${rot * -1.5}deg)`, width: 60, height: 18, background: "rgba(200,255,43,0.2)", border: "1px dashed rgba(200,255,43,0.4)", zIndex: 2 }} />
                    )}
                    {/* Red TANGY stamp on alternating items */}
                    {(colIdx + rowIdx) % 4 === 0 && (
                      <div style={{ position: "absolute", top: 8, right: 8, fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.7rem", color: "#FF2E52", border: "1.5px solid #FF2E52", padding: "2px 6px", letterSpacing: "0.2em", transform: "rotate(12deg)", opacity: 0.7, zIndex: 3 }}>TANGY</div>
                    )}
                    {/* Photo */}
                    <div style={{ overflow: "hidden", height: isTall ? "240px" : "160px", background: "#080808", position: "relative" }}>
                      <img
                        src={item.img}
                        alt={item.label}
                        loading="lazy" decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.6) contrast(1.1)", transition: "filter 0.4s, transform 0.5s" }}
                        onMouseEnter={e => { e.target.style.filter = "grayscale(0) contrast(1.05)"; e.target.style.transform = "scale(1.05)"; }}
                        onMouseLeave={e => { e.target.style.filter = "grayscale(0.6) contrast(1.1)"; e.target.style.transform = "scale(1)"; }}
                      />
                    </div>
                    {/* Label */}
                    <div style={{ marginTop: 12, fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                      {item.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div onClick={() => setLightbox(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(16px)" }}>
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }} onClick={e => e.stopPropagation()} className="lightbox-inner"
              style={{ background: "#111111", border: "1px solid rgba(200, 255, 43,0.3)", overflow: "hidden", boxShadow: "0 0 120px rgba(200, 255, 43,0.18)", maxWidth: "90vw", maxHeight: "85vh" }}>
              <img src={lightbox.img} alt={lightbox.label} style={{ display: "block", maxWidth: "90vw", maxHeight: "75vh", objectFit: "contain" }} />
              <div style={{ padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#fff", letterSpacing: "0.1em" }}>{lightbox.label}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", letterSpacing: "0.2em" }}>ESC TO CLOSE</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}



// ─── ABOUT ────────────────────────────────────────────────────────────────────
function FounderCardBlock({ f, i }) {
  const { ref, isHovered, hoverProps } = useAutoHover(0.5);
  return (
    <motion.div
      ref={ref}
      {...hoverProps}
      className="founder-card"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.15 }}
      style={{
        background: "#181818",
        border: isHovered ? "1px solid #C8FF2B" : "1px solid rgba(255,255,255,0.08)",
        padding: 24,
        display: "flex",
        gap: 20,
        alignItems: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
        transition: "all 0.3s ease",
        transform: isHovered ? "rotate(-1deg) scale(1.02)" : "none",
      }}
    >
      <img 
        src={f.image} 
        alt={f.role} 
        style={{
          width: 90,
          height: 120,
          objectFit: "cover",
          filter: isHovered ? "none" : "grayscale(1)",
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
  );
}

function About() {
  const gramophoneHover = useAutoHover(0.4);

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
            <div className="about-stats" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, background: "#111111", padding: 32, border: "1px solid rgba(255,255,255,0.06)", marginTop: 20 }}>
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
              <FounderCardBlock key={f.role} f={f} i={i} />
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

          {/* GRAMOPHONE DECAL */}
          <motion.div
            ref={gramophoneHover.ref}
            {...gramophoneHover.hoverProps}
            initial={{ opacity: 0, x: -30, rotate: 10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 6 }}
            viewport={{ once: true }}
            animate={{ y: gramophoneHover.isInView ? [0, -8, 0] : 0, scale: gramophoneHover.isHovered ? 1.06 : 1, rotate: gramophoneHover.isHovered ? 0 : 6 }}
            transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
            style={{
              position: "absolute",
              left: "2vw",
              bottom: 0,
              width: "clamp(90px, 12vw, 180px)",
              filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.85))",
              zIndex: 2,
              cursor: "pointer",
              opacity: 0.9,
            }}
          >
            <img src="/gramophone.png" alt="Vintage Gramophone" style={{ width: "100%", height: "auto", display: "block" }} />
          </motion.div>
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
function ContactSocialBtn({ s, toast }) {
  const { ref, isHovered, hoverProps } = useAutoHover(0.5);
  return (
    <motion.button 
      ref={ref}
      {...hoverProps}
      onClick={() => toast({ message: `Opening ${s}...`, type: "info" })}
      animate={{ scale: isHovered ? 1.05 : 1, borderColor: isHovered ? "#C8FF2B" : "rgba(255,255,255,0.1)", color: isHovered ? "#C8FF2B" : "rgba(255,255,255,0.5)" }}
      whileTap={{ scale: 0.95 }}
      style={{ padding: "9px 18px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: "0.78rem", letterSpacing: "0.08em", transition: "all 0.2s" }}
    >
      {s}
    </motion.button>
  );
}

function Contact({ toast }) {
    const vinylHover = useAutoHover(0.4);
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

        {/* VINYL DECAL — spinning in top right of Contact */}
        <motion.div
          ref={vinylHover.ref}
          {...vinylHover.hoverProps}
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          animate={{ scale: vinylHover.isHovered ? 1.1 : 1 }}
          style={{
            position: "absolute",
            top: "8%",
            right: "4vw",
            width: "clamp(100px, 14vw, 190px)",
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.8))",
            zIndex: 2,
            cursor: "pointer",
          }}
        >
          <motion.img
            src="/vinyl.png"
            alt="Vinyl Record"
            animate={{ rotate: vinylHover.isInView ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </motion.div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <SectionHeader label="Connect" title="Get In Touch" />
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, marginTop: 60, maxWidth: 900, margin: "60px auto 0" }}>
  
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
                  <ContactSocialBtn key={s} s={s} toast={toast} />
                ))}
              </div>
              <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(200, 255, 43,0.2)", height: 200 }}>
                <iframe title="Bansilal Stepwell" src="https://maps.google.com/maps?q=Bansilal+Baoli+Stepwell+Hyderabad+Telangana&t=&z=16&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.8) contrast(0.9)" }} allowFullScreen loading="lazy" decoding="async" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </motion.div>
  
            {/* Right */}
            <motion.div className="contact-form" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
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
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                    
                    {/* Name input */}
                    <div style={{ position: "relative" }}>
                      <input 
                        type="text"
                        placeholder="NAME"
                        value={form.name}
                        onChange={e => { setForm(x => ({ ...x, name: e.target.value })); setErrors(er => ({ ...er, name: null })); }}
                        onFocus={() => setIsFormFocused(true)}
                        onBlur={() => setIsFormFocused(false)}
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          borderBottom: errors.name ? "1px solid #FF2E52" : "1px solid rgba(255,255,255,0.15)",
                          padding: "16px 0",
                          color: "#fff",
                          fontSize: "1rem",
                          fontFamily: "inherit",
                          outline: "none",
                          transition: "all 0.3s ease",
                          borderColor: isFormFocused ? "#C8FF2B" : "rgba(255,255,255,0.15)"
                        }}
                      />
                      {errors.name && <div style={{ color: "#FF2E52", fontSize: "0.72rem", marginTop: 6, fontFamily: "monospace" }}>⚠ {errors.name}</div>}
                    </div>

                    {/* Email input */}
                    <div style={{ position: "relative" }}>
                      <input 
                        type="email"
                        placeholder="EMAIL"
                        value={form.email}
                        onChange={e => { setForm(x => ({ ...x, email: e.target.value })); setErrors(er => ({ ...er, email: null })); }}
                        onFocus={() => setIsFormFocused(true)}
                        onBlur={() => setIsFormFocused(false)}
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          borderBottom: errors.email ? "1px solid #FF2E52" : "1px solid rgba(255,255,255,0.15)",
                          padding: "16px 0",
                          color: "#fff",
                          fontSize: "1rem",
                          fontFamily: "inherit",
                          outline: "none",
                          transition: "all 0.3s ease",
                          borderColor: isFormFocused ? "#C8FF2B" : "rgba(255,255,255,0.15)"
                        }}
                      />
                      {errors.email && <div style={{ color: "#FF2E52", fontSize: "0.72rem", marginTop: 6, fontFamily: "monospace" }}>⚠ {errors.email}</div>}
                    </div>

                    {/* Message input */}
                    <div style={{ position: "relative" }}>
                      <textarea 
                        placeholder="YOUR MESSAGE (OPTIONAL)"
                        value={form.message}
                        rows={3}
                        onChange={e => { setForm(x => ({ ...x, message: e.target.value })); setErrors(er => ({ ...er, message: null })); }}
                        onFocus={() => setIsFormFocused(true)}
                        onBlur={() => setIsFormFocused(false)}
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: "none",
                          borderBottom: errors.message ? "1px solid #FF2E52" : "1px solid rgba(255,255,255,0.15)",
                          padding: "16px 0",
                          color: "#fff",
                          fontSize: "1rem",
                          fontFamily: "inherit",
                          outline: "none",
                          resize: "none",
                          transition: "all 0.3s ease",
                          borderColor: isFormFocused ? "#C8FF2B" : "rgba(255,255,255,0.15)"
                        }}
                      />
                      {errors.message && <div style={{ color: "#FF2E52", fontSize: "0.72rem", marginTop: 6, fontFamily: "monospace" }}>⚠ {errors.message}</div>}
                    </div>
                    
                    {/* Newsletter check wrapper */}
                    <div 
                      style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none" }}
                      onClick={() => setForm(x => ({ ...x, subscribe: !x.subscribe }))}
                    >
                      <input 
                        type="checkbox" 
                        checked={form.subscribe} 
                        onChange={() => {}} 
                        style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#C8FF2B" }} 
                      />
                      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
                        SUBSCRIBE TO <strong style={{ color: "#fff" }}>TANGY LETTER</strong>
                      </span>
                    </div>

                    <MagneticButton onClick={handleSend}
                      style={{ 
                        width: "100%", 
                        padding: "18px", 
                        background: "#C8FF2B", 
                        color: "#080808", 
                        border: "none", 
                        cursor: "pointer", 
                        fontFamily: "'Bebas Neue', sans-serif", 
                        letterSpacing: "0.15em", 
                        textTransform: "uppercase", 
                        fontSize: "1.2rem", 
                        boxShadow: "0 10px 30px rgba(200, 255, 43, 0.15)",
                        transition: "all 0.3s ease"
                      }}>
                      {form.subscribe && !form.message.trim() ? "SUBSCRIBE // ENLIST" : "SEND TRANSMISSION"}
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

function FooterLink({ item }) {
  const { ref, isHovered, hoverProps } = useAutoHover(0.5);
  return (
    <div 
      ref={ref}
      {...hoverProps}
      style={{ fontFamily: "'Space Mono', monospace", color: isHovered ? "#C8FF2B" : "rgba(255,255,255,0.25)", fontSize: "0.7rem", marginBottom: 10, cursor: "pointer", transition: "color 0.2s", letterSpacing: "0.1em" }}
    >{item}</div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const radioHover = useAutoHover(0.4);
  return (
    <footer style={{ background: "#080808", borderTop: "1px solid rgba(200,255,43,0.1)", position: "relative", zIndex: 1, overflow: "hidden" }}>
      {/* Radio Decal in Footer */}
      <motion.div
        ref={radioHover.ref}
        {...radioHover.hoverProps}
        animate={{ scale: radioHover.isHovered ? 1.1 : 1, rotate: radioHover.isHovered ? 0 : -6 }}
        style={{
          position: "absolute",
          top: 30,
          right: "4vw",
          width: "clamp(100px, 14vw, 180px)",
          opacity: 0.85,
          transform: "rotate(-6deg)",
          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.8))",
          zIndex: 2,
          cursor: "pointer",
        }}
      >
        <img src="/radio.png" alt="Vintage Boombox" style={{ width: "100%", height: "auto" }} />
      </motion.div>

      {/* MASSIVE BRAND NAME */}
      <div style={{ padding: "80px 5vw 0", overflow: "hidden" }}>
        <div className="footer-brand" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(5rem, 18vw, 14rem)", lineHeight: 0.85, color: "rgba(255,255,255,0.06)", letterSpacing: "0.02em", userSelect: "none", whiteSpace: "nowrap" }}>
          TANGY SESSIONS
        </div>
      </div>

      {/* SCROLLING MARQUEE */}
      <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "10px 0", margin: "0 0 48px" }}>
        <div className="marquee-track-rev" style={{ gap: 0 }}>
          {Array(4).fill("UNDERGROUND  ·  HYDERABAD  ·  EST.2025  ·  SOUND  ·  STILLNESS  ·  COMMUNITY  ·  ").map((t, i) => (
            <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.35em", color: "rgba(200,255,43,0.3)", textTransform: "uppercase", paddingRight: "4rem", whiteSpace: "nowrap" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* BOTTOM INFO ROW */}
      <div className="footer-cols" style={{ padding: "0 5vw 48px", display: "grid", gridTemplateColumns: "1fr auto auto", gap: "5vw", alignItems: "start", flexWrap: "wrap" }}>
        {/* Left: Logo + tagline */}
        <div>
          <img src="/logo.svg" alt="Tangy Sessions Logo" style={{ height: 44, marginBottom: 12 }} />
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "0.9rem", color: "rgba(255,255,255,0.3)" }}>Music beneath history.</div>
        </div>
        {/* Middle: Links */}
        {[["Explore", ["Events", "Artists", "Gallery"]], ["Connect", ["Instagram", "Spotify", "Contact"]]].map(([title, items]) => (
          <div key={title}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#C8FF2B", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16 }}>{title}</div>
            {items.map(item => (
              <FooterLink key={item} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* COPYRIGHT BAR */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "20px 5vw", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.15)", fontSize: "0.55rem", letterSpacing: "0.2em" }}>© 2025 TANGY SESSIONS. ALL RIGHTS RESERVED.</div>
        <div style={{ fontFamily: "'Space Mono', monospace", color: "rgba(255,255,255,0.15)", fontSize: "0.55rem", letterSpacing: "0.2em" }}>BANSILAL STEPWELL, HYDERABAD</div>
      </div>
    </footer>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ label, title }) {
  return (
    <motion.div initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} style={{ textAlign: "left" }}>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.38em", color: "#C8FF2B", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", color: "#fff", margin: 0, letterSpacing: "0.02em", lineHeight: 0.9 }}>{title}</h2>
      <div style={{ height: 2, background: "#C8FF2B", marginTop: 16, width: 48 }} />
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes marqueeScroll { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
        @keyframes marqueeFast { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
        @keyframes shineSwipe { 0% { left: -80%; } 100% { left: 120%; } }
        @keyframes clipReveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0% 0 0); } }
        @keyframes slideUp { from { opacity: 0; transform: translate3d(0, 40px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ticketFloat { 0%,100% { transform: translate3d(0, 0, 0) rotate(-0.5deg); } 50% { transform: translate3d(0, -6px, 0) rotate(0.5deg); } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 20px rgba(200,255,43,0.2); } 50% { box-shadow: 0 0 40px rgba(200,255,43,0.5); } }
        @keyframes blinkCursor { 50% { opacity: 0; } }
        @keyframes scanline { 0% { transform: translate3d(0, -100%, 0); } 100% { transform: translate3d(0, 100vh, 0); } }

        /* TV animations are now handled inside TVPlayer.jsx */
        @keyframes blinkDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        @keyframes tvFlicker { 0%, 95%, 100% { opacity: 1; } 96% { opacity: 0.7; } 97% { opacity: 1; } 98% { opacity: 0.4; } 99% { opacity: 0.9; } }
        @keyframes textFlicker { 0%,100% { opacity:1; } 92% { opacity:1; } 93% { opacity:0.4; } 94% { opacity:1; } 96% { opacity:0.7; } 97% { opacity:1; } }
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-size-adjust: 100%; }
        body { -webkit-tap-highlight-color: transparent; overflow-x: hidden; width: 100%; background: #080808; }
        
        section { scroll-margin-top: 80px; overflow-x: hidden; position: relative; contain: paint layout; }

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
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #C8FF2B; border-radius: 0; }
        input, select, textarea, button { font-family: inherit; }

        img { content-visibility: auto; }

        .marquee-track { display: flex; width: max-content; animation: marqueeScroll 22s linear infinite; will-change: transform; transform: translateZ(0); }
        .marquee-track-fast { display: flex; width: max-content; animation: marqueeFast 12s linear infinite; will-change: transform; transform: translateZ(0); }
        .marquee-track-rev { display: flex; width: max-content; animation: marqueeScroll 26s linear infinite reverse; will-change: transform; transform: translateZ(0); }

        .ticket-card { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s, border-color 0.35s; will-change: transform; }
        .ticket-card:hover { transform: translateY(-8px) rotate(0deg) !important; box-shadow: 0 30px 80px rgba(0,0,0,0.9), 0 0 40px rgba(200,255,43,0.15) !important; border-color: rgba(200,255,43,0.5) !important; }

        .polaroid-photo { transition: transform 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease; }
        .polaroid-photo:hover { z-index: 20 !important; box-shadow: 0 20px 60px rgba(0,0,0,0.8) !important; }

        .editorial-val-block { border-left: 0px solid #C8FF2B; transition: border-left-width 0.3s, background 0.3s; }
        .editorial-val-block:hover { border-left-width: 4px; background: #111111 !important; }

        .founder-img { filter: grayscale(0.6) contrast(1.1); transition: filter 0.4s ease, transform 0.4s ease; }
        .founder-img:hover { filter: grayscale(0) contrast(1.1); transform: scale(1.02) rotate(0deg) !important; }

        /* Hardware acceleration for mobile performance */
        motion-div, [style*="position: absolute"] { transform: translateZ(0); }

        /* Responsive Breakpoints for Mobile & Tablet */
        @media (max-width: 868px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          .ticket-card { flex-direction: column !important; transform: none !important; }
          .ticket-stub-right { border-left: none !important; border-top: 1px dashed rgba(255,255,255,0.08) !important; flex-direction: row !important; width: 100% !important; padding: 14px 20px !important; }
          .about-founder-grid { flex-direction: column !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .footer-brand { font-size: clamp(3.5rem, 15vw, 6rem) !important; }
          
          /* Gallery masonry responsive 1 column on small phones, 2 on tablets */
          #gallery > div:nth-child(2) { grid-template-columns: repeat(2, 1fr) !important; }

          /* Responsive Decal Scaling */
          [src*="radio.png"], [src*="vinyl.png"], [src*="gramophone.png"], [src*="violin.png"] {
            max-width: 110px !important;
            opacity: 0.75 !important;
          }
        }

        @media (max-width: 580px) {
          #gallery > div:nth-child(2) { grid-template-columns: 1fr !important; }
          .editorial-val-block { flex-direction: column !important; align-items: flex-start !important; }
          
          [src*="radio.png"], [src*="vinyl.png"], [src*="gramophone.png"], [src*="violin.png"] {
            max-width: 80px !important;
            opacity: 0.65 !important;
          }
        }

        #events, #artists, #gallery, #tickets, #about, #volunteer, #contact {
          content-visibility: auto;
          contain-intrinsic-size: 0 600px;
        }
        body { -webkit-overflow-scrolling: touch; }
        #unicorn-bg { transform: translateZ(0); }

        .masonry-col { display: flex; flex-direction: column; gap: 16px; }

        /* ═══════════════════════════════════════════════════════════════
           TABLET  ≤ 868px
        ═══════════════════════════════════════════════════════════════ */
        @media (max-width: 868px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
          #about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .footer-brand { font-size: clamp(3.5rem, 15vw, 6rem) !important; }
          [src*="radio.png"], [src*="vinyl.png"], [src*="gramophone.png"], [src*="violin.png"] {
            max-width: 100px !important; opacity: 0.7 !important;
          }
          #gallery .masonry-outer { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ═══════════════════════════════════════════════════════════════
           MOBILE  ≤ 600px  — PRIMARY FIXES
        ═══════════════════════════════════════════════════════════════ */
        @media (max-width: 600px) {

          /* 1. GLOBAL */
          html, body { max-width: 100vw; overflow-x: hidden; }
          section { scroll-margin-top: 64px !important; }

          /* 2. HERO — show radio smaller, repositioned so it fills the top void */
          .hero-radio {
            width: clamp(110px, 30vw, 160px) !important;
            top: 6% !important;
            right: 3vw !important;
            opacity: 0.8 !important;
          }
          .hero-gramophone { opacity: 0.3 !important; width: 60px !important; bottom: 3% !important; left: 2vw !important; }
          /* Tighten hero on mobile — 100vh leaves too much empty space above the text */
          #home {
            overflow: hidden !important;
            height: auto !important;
            min-height: 100svh !important;
            padding-bottom: 56px !important;
          }

          /* 3. WHY TANGY — banner */
          #why-tangy .banner-inner { flex-direction: column !important; gap: 6px !important; }
          #why-tangy .banner-inner > div { max-width: 100% !important; text-align: left !important; }

          /* 4. WHY TANGY — manifesto */
          #why-tangy .manifesto-grid { grid-template-columns: 1fr !important; }
          #why-tangy .vertical-label { display: none !important; }

          /* 5. WHY TANGY — body two-col */
          #why-tangy .body-two-col { grid-template-columns: 1fr !important; gap: 20px !important; }

          /* 6. VALUES — stack vertically, image on top */
          .editorial-val-block {
            flex-direction: column !important;
            gap: 16px !important;
            padding: 28px 0 !important;
            align-items: flex-start !important;
          }
          .editorial-val-block .val-image {
            width: 100% !important; height: 140px !important; order: -1 !important;
          }
          .editorial-val-block .val-bg-num { display: none !important; }
          .vinyl-decal { display: none !important; }
          .editorial-val-block h3 { font-size: clamp(2rem, 9vw, 3rem) !important; }

          /* 7. STATS STRIP — 2×2 grid */
          .stats-4col {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0 !important;
          }
          .stats-4col > div {
            border-left: none !important;
            padding: 20px 16px !important;
            border-bottom: 1px solid rgba(255,255,255,0.06) !important;
          }
          .stats-4col > div:nth-child(2),
          .stats-4col > div:nth-child(4) {
            border-left: 1px solid rgba(255,255,255,0.06) !important;
          }
          .stats-4col .stat-num { font-size: clamp(1.8rem, 8vw, 2.8rem) !important; }

          /* 8. GALLERY — 2-column collage (hide 3rd col, redistribute) */
          #gallery .masonry-outer {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 3px !important;
            padding: 0 3vw !important;
          }
          #gallery .masonry-outer > div:nth-child(3) { display: none !important; }
          .polaroid-photo {
            transform: none !important;
            padding: 8px 8px 28px !important;
          }
          .polaroid-photo:hover { transform: none !important; box-shadow: none !important; }
          .gallery-violin { display: none !important; }
          #gallery .section-header { margin-bottom: 28px !important; }

          /* 9. EVENT CARDS — compact horizontal strip layout */
          .ticket-card {
            flex-direction: column !important;
            transform: none !important;
            min-height: unset !important;
          }
          .ticket-card:hover { transform: none !important; box-shadow: none !important; }
          .ticket-stub-left {
            flex-direction: row !important;
            min-width: unset !important;
            width: 100% !important;
            padding: 10px 16px !important;
            border-right: none !important;
            border-bottom: 1px dashed rgba(255,255,255,0.12) !important;
            justify-content: flex-start !important;
            gap: 14px !important;
          }
          .ticket-stub-left .admit-one { writing-mode: horizontal-tb !important; transform: none !important; }
          .ticket-stub-left .ticket-num { font-size: 1.4rem !important; }
          .ticket-body { padding: 14px 16px !important; gap: 6px !important; }
          .ticket-body h3 { font-size: clamp(1.4rem, 6vw, 2rem) !important; }
          .ticket-body p { display: none !important; }
          .ticket-stub-right {
            border-left: none !important;
            border-top: 1px dashed rgba(255,255,255,0.08) !important;
            flex-direction: row !important;
            width: 100% !important;
            padding: 10px 16px !important;
            justify-content: space-between !important;
            align-items: center !important;
            min-width: unset !important;
          }
          .ticket-book-btn { padding: 10px 22px !important; font-size: 0.9rem !important; }
          .events-radio { display: none !important; }
          #events { padding-top: 64px !important; padding-bottom: 48px !important; }
          #events .ticket-stack { padding: 0 4vw !important; gap: 8px !important; }

          /* 10. ABOUT */
          #about { padding: 60px 5vw !important; }
          #about h2 { font-size: clamp(2.5rem, 10vw, 5rem) !important; }
          #about .about-stats { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; padding: 20px !important; }
          .founder-card { flex-direction: column !important; gap: 20px !important; }
          .founder-card img { width: 100% !important; height: 260px !important; max-height: none !important; object-fit: cover !important; object-position: center top !important; }

          /* 11. CONTACT */
          .contact-grid { gap: 28px !important; }
          .contact-form input, .contact-form textarea, .contact-form select {
            font-size: 16px !important;
          }
          .contact-form button[type="submit"] { width: 100% !important; }

          /* 12. FOOTER */
          .footer-brand { font-size: clamp(2.8rem, 13vw, 4.5rem) !important; }
          .footer-cols { flex-direction: column !important; gap: 24px !important; }

          /* 13. DECORATIVE DECALS */
          [src*="radio.png"] { max-width: 70px !important; opacity: 0.45 !important; }
          [src*="violin.png"] { display: none !important; }
          [src*="vinyl.png"] { display: none !important; }
          [src*="gramophone.png"] { max-width: 60px !important; opacity: 0.35 !important; }

          /* 14. GALLERY — section padding */
          #gallery { padding-top: 60px !important; padding-bottom: 48px !important; }
        }

        /* ═══════════════════════════════════════════════════════════════
           TINY PHONES  ≤ 380px
        ═══════════════════════════════════════════════════════════════ */
        @media (max-width: 380px) {
          .stats-4col .stat-num { font-size: clamp(1.5rem, 7vw, 2.2rem) !important; }
          #about h2 { font-size: clamp(2rem, 9vw, 3.5rem) !important; }
          .ticket-body h3 { font-size: clamp(1.2rem, 5.5vw, 1.8rem) !important; }
          #gallery .masonry-outer { padding: 0 2vw !important; }
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
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    );
  }

  return (
    <ModalProvider>
      {content}
    </ModalProvider>
  );
}
