import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VolunteerForm from "../components/VolunteerForm";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { margin: 0; padding: 0; overflow-x: hidden; background: #080808; }
    body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    .vol-page { background: #080808; min-height: 100vh; color: #fff; overflow-x: hidden; font-family: 'DM Sans', system-ui, sans-serif; }
    ::selection { background: rgba(200,255,43,0.35); }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #080808; }
    ::-webkit-scrollbar-thumb { background: #C8FF2B; }

    @keyframes floatUp {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      10% { opacity: 0.6; }
      90% { opacity: 0.4; }
      100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
    }
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    @keyframes marqueeScroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    .vol-panel { transition: all 0.5s cubic-bezier(0.16,1,0.3,1); border-left: 3px solid transparent; }
    .vol-panel:hover { background: #111 !important; border-left-color: #C8FF2B !important; }
    .vol-panel:hover .vol-panel-img { transform: scale(1.04) !important; }
    .vol-panel-img { transition: transform 0.7s cubic-bezier(0.16,1,0.3,1); }

    @media (max-width: 768px) {
      .vol-editorial-grid { grid-template-columns: 1fr !important; }
      .vol-panels-row { flex-direction: column !important; }
    }
    @media (max-width: 600px) {
      .vol-nav { padding: 0 16px !important; }
      .vol-stat-row { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
    }
  `}</style>
);

/* ─── FLOATING PARTICLES ─────────────────────────────────────────────────────── */
const Particles = ({ count = 14 }) => {
  const particles = useRef(
    [...Array(count)].map(() => ({
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 15 + 12,
      delay: Math.random() * 10,
    }))
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {particles.current.map((p, i) => (
        <div key={i} style={{
          position: "absolute", bottom: "-5%", left: p.left,
          width: p.size, height: p.size,
          background: "#C8FF2B", opacity: 0.5,
          animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
};

/* ─── COUNT UP HOOK ──────────────────────────────────────────────────────────── */
function useCountUp(target, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─── TYPEWRITER HOOK ────────────────────────────────────────────────────────── */
function useTypewriter(text, speed = 50, start = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!start) return;
    setDisplayed(""); setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(timer); setDone(true); }
    }, speed);
    return () => clearInterval(timer);
  }, [start, text, speed]);
  return { displayed, done };
}

/* ─── STAT NUMBER ────────────────────────────────────────────────────────────── */
const StatNumber = ({ target, suffix = "+", label, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [triggered, setTriggered] = useState(false);
  useEffect(() => { if (inView) setTimeout(() => setTriggered(true), delay); }, [inView, delay]);
  const count = useCountUp(target, 2000, triggered);
  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={triggered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(4rem, 9vw, 8rem)",
          lineHeight: 0.95, color: "#C8FF2B",
        }}
      >
        {count}{suffix}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }} animate={triggered ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 8 }}
      >
        {label}
      </motion.div>
    </div>
  );
};

/* ─── TYPEWRITER STAT ────────────────────────────────────────────────────────── */
const TypewriterStat = ({ text, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [triggered, setTriggered] = useState(false);
  useEffect(() => { if (inView) setTimeout(() => setTriggered(true), delay); }, [inView, delay]);
  const { displayed, done } = useTypewriter(text, 55, triggered);
  return (
    <div ref={ref}>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
        lineHeight: 0.95, color: "#C8FF2B",
        minHeight: "1.1em", display: "flex", alignItems: "center",
      }}>
        {displayed}
        {!done && (
          <span style={{
            display: "inline-block", width: 3, height: "0.85em",
            background: "#C8FF2B", marginLeft: 4, verticalAlign: "middle",
            animation: "pulseGlow 0.7s ease-in-out infinite",
          }} />
        )}
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.35em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 8 }}>Community</div>
    </div>
  );
};

/* ─── DASHED DIVIDER ─────────────────────────────────────────────────────────── */
const Divider = () => (
  <div style={{ width: "100%", borderTop: "1px dashed rgba(200,255,43,0.15)" }} />
);

/* ─── SECTION LABEL ─────────────────────────────────────────────────────────── */
const Label = ({ text }) => (
  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.4em", color: "#C8FF2B", textTransform: "uppercase", marginBottom: 16 }}>
    // {text} //
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────────── */
export default function VolunteerDetails() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.4]);

  const scrollToApply = () => {
    document.getElementById("apply-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const manifestoLines = [
    "You don't need experience.",
    "You don't need credentials.",
    "You don't need a title.",
    "",
    "You only need curiosity.",
    "You only need intention.",
    "You only need the willingness to create something meaningful.",
  ];

  return (
    <div className="vol-page">
      <GlobalStyles />

      {/* ─── NAVBAR ─── */}
      <nav className="vol-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 5vw", height: 64,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(8,8,8,0.97)", borderBottom: "1px solid rgba(200,255,43,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            onClick={() => navigate("/")} style={{ cursor: "pointer" }}
          >
            <img src="/logo.svg" alt="Tangy" style={{ height: 34, display: "block" }} />
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.15em", display: "flex", alignItems: "center", gap: 8 }}>
            <span
              onClick={() => navigate("/")} style={{ cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#C8FF2B"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.25)"}
            >HOME</span>
            <span style={{ opacity: 0.3 }}>›</span>
            <span style={{ color: "#C8FF2B" }}>COMMUNITY</span>
          </div>
        </div>
        <button
          onClick={scrollToApply}
          style={{
            padding: "9px 22px", background: "#C8FF2B", color: "#080808", border: "none",
            cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "1rem", letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 0,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#fff"}
          onMouseLeave={e => e.currentTarget.style.background = "#C8FF2B"}
        >
          Apply Now →
        </button>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {/* Parallax background */}
        <motion.div style={{ position: "absolute", inset: 0, y: heroY, scale: 1.12 }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/gallery/tngy7.jpg')",
            backgroundSize: "cover", backgroundPosition: "center 30%",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(8,8,8,0.65)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #080808 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(8,8,8,0.7) 0%, transparent 60%)" }} />
        </motion.div>

        <Particles count={14} />

        {/* Marquee strip */}
        <div style={{ position: "absolute", top: 64, left: 0, right: 0, overflow: "hidden", height: 28, borderBottom: "1px solid rgba(200,255,43,0.12)", background: "rgba(200,255,43,0.04)", display: "flex", alignItems: "center", zIndex: 5 }}>
          <div style={{ display: "flex", animation: "marqueeScroll 22s linear infinite", whiteSpace: "nowrap" }}>
            {Array(8).fill("UNDERGROUND MUSIC · ANCIENT SPACES · TANGY SESSIONS · JOIN THE COLLECTIVE · ").map((t, i) => (
              <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(200,255,43,0.55)", letterSpacing: "0.25em", paddingRight: "2rem", textTransform: "uppercase" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Vertical rotated label */}
        <div style={{
          position: "absolute", left: 24, top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          fontFamily: "'Space Mono', monospace", fontSize: "0.52rem",
          color: "rgba(200,255,43,0.35)", letterSpacing: "0.4em", textTransform: "uppercase",
          whiteSpace: "nowrap", zIndex: 2,
        }}>
          COMMUNITY · TANGY SESSIONS · HYD
        </div>

        {/* Hero content — left aligned */}
        <motion.div
          style={{ position: "relative", zIndex: 2, padding: "0 5vw 72px", maxWidth: 1100, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.4em", color: "#C8FF2B", textTransform: "uppercase", marginBottom: 24 }}
          >
            // COMMUNITY · TANGY SESSIONS //
          </motion.div>

          {/* Headline */}
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3rem, 8vw, 7rem)",
                lineHeight: 0.9, letterSpacing: "0.03em",
                margin: "0 0 4px", color: "#fff",
              }}
            >
              NOT EVERYONE
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.div
              initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3rem, 8vw, 7rem)",
                lineHeight: 0.9, letterSpacing: "0.03em",
                margin: "0 0 28px",
                WebkitTextStroke: "2px #C8FF2B", WebkitTextFillColor: "transparent",
              }}
            >
              JUST ARRIVES.
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.1rem, 2.5vw, 2rem)",
              letterSpacing: "0.06em", color: "rgba(255,255,255,0.45)",
              margin: "0 0 20px",
            }}
          >
            Some people HELP CREATE THE MAGIC.
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", fontSize: "clamp(1rem, 2vw, 1.3rem)",
              color: "rgba(255,255,255,0.5)", lineHeight: 1.7,
              maxWidth: 580, marginBottom: 40,
              borderLeft: "2px solid #C8FF2B", paddingLeft: 20,
            }}
          >
            Behind every Tangy Session is a collective of artists, dreamers, builders, volunteers and creators shaping moments that stay with people long after the music ends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <button
              onClick={scrollToApply}
              style={{
                padding: "16px 44px", background: "#C8FF2B", color: "#080808", border: "none",
                cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem",
                letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 0,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#fff"}
              onMouseLeave={e => e.currentTarget.style.background = "#C8FF2B"}
            >
              Join The Collective →
            </button>
            <button
              style={{
                padding: "16px 44px", background: "transparent", color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer",
                fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem",
                letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 0,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#C8FF2B"; e.currentTarget.style.color = "#C8FF2B"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
            >
              Watch The Journey
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            position: "absolute", bottom: 32, right: "5vw",
            display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, zIndex: 2,
          }}
        >
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>SCROLL</div>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(200,255,43,0.6), transparent)" }}
          />
        </motion.div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — EDITORIAL QUOTE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "120px 5vw", position: "relative", overflow: "hidden" }}>
        {/* Giant bg text */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(8rem, 25vw, 35rem)",
          color: "#fff", opacity: 0.02, pointerEvents: "none",
          whiteSpace: "nowrap", userSelect: "none", lineHeight: 1,
        }}>
          MOMENT
        </div>

        <div style={{
          maxWidth: 1300, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "6vw", alignItems: "center", position: "relative", zIndex: 1,
        }} className="vol-editorial-grid">
          {/* Left – Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative" }}
          >
            <div style={{
              position: "relative", overflow: "hidden",
              height: "clamp(360px, 50vw, 660px)",
              border: "1px solid rgba(200,255,43,0.15)",
            }}>
              <motion.div
                whileHover={{ scale: 1.04 }} transition={{ duration: 0.8 }}
                style={{
                  width: "100%", height: "100%",
                  backgroundImage: "url('/gallery/tangy8.jpg')",
                  backgroundSize: "cover", backgroundPosition: "center",
                  filter: "grayscale(20%)", transition: "filter 0.6s",
                }}
                onMouseEnter={e => e.currentTarget.style.filter = "grayscale(0%)"}
                onMouseLeave={e => e.currentTarget.style.filter = "grayscale(20%)"}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(200,255,43,0.08), transparent 60%)" }} />
              {/* Corner deco */}
              <div style={{ position: "absolute", top: 0, left: 0, width: 24, height: 24, borderTop: "2px solid #C8FF2B", borderLeft: "2px solid #C8FF2B" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderBottom: "2px solid #C8FF2B", borderRight: "2px solid #C8FF2B" }} />
            </div>
            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.7 }}
              style={{
                position: "absolute", bottom: -20, right: -20,
                background: "#111", border: "1px dashed rgba(200,255,43,0.4)",
                padding: "18px 24px", boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              }}
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", color: "#C8FF2B", lineHeight: 1 }}>3+</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginTop: 4 }}>Sessions</div>
            </motion.div>
          </motion.div>

          {/* Right – Quote */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Label text="The Manifesto" />
            <blockquote style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              fontStyle: "italic", fontWeight: 300, lineHeight: 1.35,
              color: "#fff", margin: "0 0 32px",
              borderLeft: "3px solid #C8FF2B", paddingLeft: 28,
            }}>
              "We don't build events.<br />We build moments people remember."
            </blockquote>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.1rem", color: "rgba(255,255,255,0.45)",
              lineHeight: 1.85, fontStyle: "italic",
            }}>
              Tangy Sessions is a living, breathing collective — each session shaped by the hands, hearts, and presence of the people who show up to create it together.
            </p>
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — INSIDE THE MOVEMENT
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "120px 0" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ marginBottom: 64, padding: "0 5vw" }}
        >
          <Label text="Exclusive Access" />
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            letterSpacing: "0.04em", color: "#fff",
            lineHeight: 0.9, margin: 0,
          }}>
            INSIDE THE MOVEMENT
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }} className="vol-panels-row">
          {[
            { id: "01", title: "BEHIND THE MUSIC", sub: "The moments before the music starts", img: "/gallery/tangy10.jpg" },
            { id: "02", title: "THE PEOPLE", sub: "A community built on shared presence", img: "/gallery/tangy3.jpg" },
            { id: "03", title: "THE PROCESS", sub: "Creation before the crowd arrives", img: "/gallery/tabgy2.jpg" },
          ].map((panel, i) => (
            <motion.div
              key={i}
              className="vol-panel"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              style={{
                position: "relative", height: "clamp(200px, 30vw, 420px)",
                overflow: "hidden", cursor: "pointer", background: "#0a0a0a",
              }}
            >
              <div
                className="vol-panel-img"
                style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url('${panel.img}')`,
                  backgroundSize: "cover", backgroundPosition: "center",
                  filter: "grayscale(30%) brightness(0.55)",
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: "rgba(8,8,8,0.4)" }} />

              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center",
                padding: "0 8vw", justifyContent: "space-between",
              }}>
                <div>
                  {/* oversized bg number */}
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(6rem, 12vw, 10rem)",
                    color: "rgba(200,255,43,0.06)", lineHeight: 1,
                    position: "absolute", left: "5vw", top: "50%",
                    transform: "translateY(-50%)", userSelect: "none",
                  }}>
                    {panel.id}
                  </div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h3 style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(2rem, 5vw, 4rem)",
                      letterSpacing: "0.08em", color: "#fff", margin: "0 0 8px",
                    }}>
                      {panel.title}
                    </h3>
                    <p style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.65rem", letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
                    }}>
                      {panel.sub}
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 8 }}
                  style={{
                    width: 48, height: 48, border: "1px solid rgba(200,255,43,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.5)", fontSize: "1.2rem", flexShrink: 0,
                  }}
                >
                  →
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 4 — STATISTICS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "140px 5vw", position: "relative", overflow: "hidden" }}>
        {/* bg word */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(8rem, 20vw, 28rem)",
          color: "#C8FF2B", opacity: 0.03,
          pointerEvents: "none", whiteSpace: "nowrap", userSelect: "none",
        }}>
          TANGY
        </div>

        <div style={{
          maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "flex-start",
        }} className="vol-stat-row">
          <StatNumber target={1200} suffix="+" label="Attendees" delay={0} />
          <StatNumber target={12} suffix="" label="Artists" delay={150} />
          <StatNumber target={3} suffix="" label="Sessions" delay={300} />
          <TypewriterStat text="GROWING" delay={500} />
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5 — THE PEOPLE WE LOOK FOR
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "120px 5vw", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} style={{ marginBottom: 64 }}
          >
            <Label text="No Prerequisites" />
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              letterSpacing: "0.04em", color: "#fff", lineHeight: 0.93, margin: 0,
            }}>
              THE PEOPLE<br />WE LOOK FOR
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {manifestoLines.map((line, i) => {
              if (!line) return <div key={i} style={{ height: 32 }} />;
              const isAccent = line.startsWith("You only");
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    padding: "18px 0",
                    borderBottom: `1px solid ${isAccent ? "rgba(200,255,43,0.12)" : "rgba(255,255,255,0.04)"}`,
                    position: "relative",
                  }}
                >
                  {isAccent && (
                    <span style={{
                      position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                      background: "#C8FF2B",
                    }} />
                  )}
                  <span style={{
                    fontFamily: isAccent ? "'Bebas Neue', sans-serif" : "'Cormorant Garamond', serif",
                    fontSize: isAccent ? "clamp(1.8rem, 4vw, 3rem)" : "clamp(1.4rem, 2.8vw, 2.2rem)",
                    fontStyle: isAccent ? "normal" : "italic",
                    letterSpacing: isAccent ? "0.06em" : "0",
                    color: isAccent ? "#fff" : "rgba(255,255,255,0.38)",
                    display: "block",
                    paddingLeft: isAccent ? 20 : 0,
                  }}>
                    {line}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 6 — APPLICATION FORM
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="apply-section" style={{ padding: "120px 5vw", position: "relative" }}>
        {/* Background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/gallery/tangy4.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(50px) brightness(0.2)", opacity: 0.5, zIndex: 0,
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #080808, rgba(8,8,8,0.6) 40%, rgba(8,8,8,0.6) 60%, #080808)", zIndex: 0 }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} style={{ marginBottom: 56 }}
          >
            <Label text="Join The Collective" />
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              letterSpacing: "0.04em", color: "#fff", lineHeight: 0.93, margin: "0 0 20px",
            }}>
              YOUR APPLICATION
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", fontSize: "1.15rem",
              color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
              borderLeft: "2px solid #C8FF2B", paddingLeft: 20, maxWidth: 540,
            }}>
              This is not a job application. It's an invitation to become part of something real.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(10,10,10,0.85)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <VolunteerForm />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 7 — FINAL CTA
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", height: "80vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/gallery/tangy1.jpg')",
            backgroundSize: "cover", backgroundPosition: "center 40%",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(8,8,8,0.72)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #080808 0%, transparent 25%, transparent 75%, #080808 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(8,8,8,0.85) 0%, transparent 60%)" }} />
        </div>

        <Particles count={10} />

        <div style={{ position: "relative", zIndex: 2, padding: "0 5vw" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(4rem, 15vw, 14rem)",
              lineHeight: 0.88, letterSpacing: "0.02em", color: "#fff",
              margin: "0 0 24px",
            }}>
              SEE YOU<br />
              <span style={{ WebkitTextStroke: "2px #C8FF2B", WebkitTextFillColor: "transparent" }}>
                INSIDE.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", fontSize: "clamp(1rem, 2.2vw, 1.4rem)",
              color: "rgba(255,255,255,0.45)", lineHeight: 1.7,
              marginBottom: 40, maxWidth: 500,
            }}
          >
            Some people attend Tangy.<br />Others become part of it.
          </motion.p>

          <motion.button
            onClick={scrollToApply}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              padding: "18px 52px",
              background: "#C8FF2B", color: "#080808", border: "none",
              cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.3rem", letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 0,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#fff"}
            onMouseLeave={e => e.currentTarget.style.background = "#C8FF2B"}
          >
            Begin Your Journey →
          </motion.button>
        </div>
      </section>
    </div>
  );
}
