import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VolunteerForm from "../components/VolunteerForm";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { margin: 0; padding: 0; overflow-x: hidden; background: #080808; }
    body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    .vol-page { background: #080808; min-height: 100vh; color: #fff; overflow-x: hidden; font-family: 'DM Sans', system-ui, sans-serif; }
    ::selection { background: rgba(242, 109, 79,0.4); }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #080808; }
    ::-webkit-scrollbar-thumb { background: #F26D4F; border-radius: 2px; }
    
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
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    
    .vol-input:focus { border-color: #F9E0A2 !important; box-shadow: 0 0 0 1px rgba(168,85,247,0.5), 0 0 20px rgba(168,85,247,0.2) !important; outline: none !important; }
    .vol-input { transition: all 0.3s ease !important; }
    
    .panel-hover { transition: all 0.6s cubic-bezier(0.16,1,0.3,1); }
    .panel-hover:hover .panel-img { transform: scale(1.06) !important; }
    .panel-hover:hover .panel-overlay { background: rgba(5,5,5,0.4) !important; }
    .panel-hover:hover .panel-label { letter-spacing: 0.4em !important; }
    .panel-img { transition: transform 0.8s cubic-bezier(0.16,1,0.3,1); }
    .panel-overlay { transition: background 0.6s ease; }
    .panel-label { transition: letter-spacing 0.4s ease; }
  `}</style>
);

/* ─── FLOATING PARTICLES ─────────────────────────────────────────────────────── */
const Particles = ({ count = 18 }) => {
  const particles = useRef(
    [...Array(count)].map(() => ({
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 12,
      delay: Math.random() * 10,
    }))
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      {particles.current.map((p, i) => (
        <div key={i} style={{
          position: "absolute", bottom: "-5%", left: p.left,
          width: p.size, height: p.size, borderRadius: "50%",
          background: "#2A593E", filter: "blur(1px)",
          animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
          boxShadow: "0 0 6px #F26D4F",
        }} />
      ))}
    </div>
  );
};

/* ─── MOUSE GLOW ─────────────────────────────────────────────────────────────── */
const MouseGlow = () => {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2,
      background: `radial-gradient(700px circle at ${pos.x}px ${pos.y}px, rgba(242, 109, 79,0.06), transparent 40%)`,
    }} />
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
    setDisplayed("");
    setDone(false);
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
    <div ref={ref} style={{ textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={triggered ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontFamily: "'Instrument Serif', sans-serif",
          fontSize: "clamp(5rem, 10vw, 9rem)",
          lineHeight: 1,
          background: "linear-gradient(135deg, #fff 30%, #2A593E 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 30px rgba(242, 109, 79,0.3))",
        }}
      >
        {count}{suffix}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={triggered ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{ fontSize: "0.75rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginTop: 12 }}
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
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'Instrument Serif', sans-serif",
        fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
        lineHeight: 1,
        background: "linear-gradient(135deg, #fff 30%, #2A593E 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        minHeight: "1.2em", display: "flex", alignItems: "center", justifyContent: "center",
        filter: "drop-shadow(0 0 20px rgba(242, 109, 79,0.25))",
      }}>
        {displayed}
        {!done && (
          <span style={{
            display: "inline-block", width: 3, height: "0.85em",
            background: "#2A593E", marginLeft: 4, verticalAlign: "middle",
            animation: "pulseGlow 0.7s ease-in-out infinite",
          }} />
        )}
      </div>
      <div style={{ fontSize: "0.75rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginTop: 12 }}>
        Community
      </div>
    </div>
  );
};

/* ─── SECTION DIVIDER ────────────────────────────────────────────────────────── */
const Divider = () => (
  <div style={{ width: "100%", height: 1, background: "linear-gradient(to right, transparent, rgba(242, 109, 79,0.15) 50%, transparent)" }} />
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

  /* ─ Manifesto lines ─ */
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
      <MouseGlow />

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "20px 5vw", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "linear-gradient(to bottom, rgba(5,5,5,0.95), transparent)",
        backdropFilter: "blur(0px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/logo.svg" alt="Tangy" style={{ height: 36, cursor: "pointer" }} onClick={() => navigate("/")} />
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            <span
              style={{ cursor: "pointer", transition: "color 0.2s" }}
              onClick={() => navigate("/")}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.7)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
            >
              Home
            </span>
            <span style={{ margin: "0 10px", opacity: 0.3 }}>›</span>
            <span style={{ color: "#2A593E" }}>Community</span>
          </div>
        </div>
        <motion.button
          onClick={scrollToApply}
          whileHover={{ scale: 1.03, backgroundColor: "#D4AF37" }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "10px 24px", background: "#F26D4F", color: "#fff", border: "none",
            borderRadius: 30, cursor: "pointer", fontSize: "0.78rem", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}
        >
          Apply Now
        </motion.button>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {/* Parallax background */}
        <motion.div style={{ position: "absolute", inset: 0, y: heroY, scale: 1.15 }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/gallery/tngy7.jpg')",
            backgroundSize: "cover", backgroundPosition: "center 30%",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(5,5,5,0.72)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, transparent 40%, rgba(5,5,5,0.6) 80%, #080808 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 50%, rgba(242, 109, 79,0.12) 0%, transparent 65%)" }} />
        </motion.div>

        <Particles count={20} />

        {/* Hero content */}
        <motion.div
          style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "100px 5vw 0", maxWidth: 1000, opacity: heroOpacity }}
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: "0.72rem", letterSpacing: "0.45em", color: "#2A593E",
              textTransform: "uppercase", fontFamily: "monospace", marginBottom: 32,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
            }}
          >
            <span style={{ display: "inline-block", width: 40, height: 1, background: "rgba(243, 229, 171,0.5)" }} />
            COMMUNITY • TANGY SESSIONS
            <span style={{ display: "inline-block", width: 40, height: 1, background: "rgba(243, 229, 171,0.5)" }} />
          </motion.div>

          {/* Massive headline */}
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Instrument Serif', sans-serif",
                fontSize: "clamp(5rem, 14vw, 13rem)",
                lineHeight: 0.88, letterSpacing: "0.02em",
                margin: 0, color: "#fff",
                textShadow: "0 0 80px rgba(242, 109, 79,0.15)",
              }}
            >
              NOT EVERYONE<br />
              <span style={{ color: "#fff", WebkitTextStroke: "1px rgba(243, 229, 171,0.6)", WebkitTextFillColor: "transparent" }}>JUST ARRIVES.</span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8 }}
            style={{
              fontFamily: "'Instrument Serif', sans-serif",
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              letterSpacing: "0.06em", color: "#2A593E",
              margin: "8px 0 32px",
            }}
          >
            Some people HELP CREATE THE MAGIC.
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", fontSize: "clamp(1rem, 2.2vw, 1.4rem)",
              color: "rgba(255,255,255,0.65)", lineHeight: 1.7,
              maxWidth: 680, margin: "0 auto 48px",
            }}
          >
            Behind every Tangy Session is a collective of artists, dreamers, builders, volunteers and creators shaping moments that stay with people long after the music ends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}
          >
            <motion.button
              onClick={scrollToApply}
              whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(242, 109, 79,0.5)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "18px 48px", background: "#F26D4F", color: "#fff", border: "none",
                borderRadius: 40, cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem",
                fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                boxShadow: "0 8px 30px rgba(242, 109, 79,0.35)",
              }}
            >
              Join The Collective
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "18px 48px", background: "transparent", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 40, cursor: "pointer",
                fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
              }}
            >
              Watch The Journey
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2,
          }}
        >
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.35em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Scroll</div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(243, 229, 171,0.6), transparent)" }}
          />
        </motion.div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2 — EDITORIAL QUOTE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "160px 5vw", position: "relative", overflow: "hidden" }}>
        {/* Giant bg text */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Instrument Serif', sans-serif",
          fontSize: "clamp(10rem, 30vw, 40rem)",
          color: "#fff", opacity: 0.025, pointerEvents: "none",
          whiteSpace: "nowrap", userSelect: "none", lineHeight: 1,
          filter: "blur(3px)",
        }}>
          MOMENT
        </div>

        <div style={{
          maxWidth: 1400, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "6vw", alignItems: "center", position: "relative", zIndex: 1,
        }}
          className="editorial-grid"
        >
          {/* Left – Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative" }}
          >
            <div style={{
              position: "relative", borderRadius: 4, overflow: "hidden",
              height: "clamp(400px, 55vw, 700px)",
            }}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8 }}
                style={{
                  width: "100%", height: "100%",
                  backgroundImage: "url('/gallery/tangy8.jpg')",
                  backgroundSize: "cover", backgroundPosition: "center",
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(242, 109, 79,0.15), transparent 60%)" }} />
            </div>
            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              style={{
                position: "absolute", bottom: -28, right: -28,
                background: "rgba(11,11,15,0.9)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(242, 109, 79,0.2)",
                borderRadius: 16, padding: "24px 28px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
              }}
            >
              <div style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "2.4rem", color: "#2A593E", lineHeight: 1 }}>3+</div>
              <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: 4 }}>Sessions</div>
            </motion.div>
          </motion.div>

          {/* Right – Quote */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.35em", color: "#2A593E", textTransform: "uppercase", marginBottom: 24, fontFamily: "monospace" }}>
              The Manifesto
            </div>
            <blockquote style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontStyle: "italic", fontWeight: 300, lineHeight: 1.35,
              color: "#fff", margin: "0 0 36px",
              borderLeft: "2px solid rgba(242, 109, 79,0.4)", paddingLeft: 32,
            }}>
              "We don't build events.<br />We build moments people remember."
            </blockquote>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.15rem", color: "rgba(255,255,255,0.55)",
              lineHeight: 1.8, fontStyle: "italic",
            }}>
              Tangy Sessions is a living, breathing collective — each session shaped by the hands, hearts, and presence of the people who show up to create it together.
            </p>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .editorial-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3 — INSIDE THE MOVEMENT (Horizontal panels)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "160px 0", background: "#080808" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: 80, padding: "0 5vw" }}
        >
          <div style={{ fontSize: "0.72rem", letterSpacing: "0.4em", color: "#2A593E", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20 }}>
            Exclusive Access
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', sans-serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            letterSpacing: "0.04em", color: "#fff",
            lineHeight: 0.9, margin: 0,
          }}>
            INSIDE THE MOVEMENT
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            {
              id: "01", title: "BEHIND THE MUSIC", sub: "The moments before the music starts",
              img: "/gallery/tangy10.jpg",
              accent: "#F26D4F",
            },
            {
              id: "02", title: "THE PEOPLE", sub: "A community built on shared presence",
              img: "/gallery/tangy3.jpg",
              accent: "#EC4899",
            },
            {
              id: "03", title: "THE PROCESS", sub: "Creation before the crowd arrives",
              img: "/gallery/tabgy2.jpg",
              accent: "#D4AF37",
            },
          ].map((panel, i) => (
            <motion.div
              key={i}
              className="panel-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              style={{
                position: "relative", height: "clamp(220px, 32vw, 440px)",
                overflow: "hidden", cursor: "pointer",
              }}
            >
              <div
                className="panel-img"
                style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url('${panel.img}')`,
                  backgroundSize: "cover", backgroundPosition: "center",
                }}
              />
              <div
                className="panel-overlay"
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(5,5,5,0.62)",
                }}
              />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${panel.accent}22 0%, transparent 60%)` }} />

              {/* Content */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center",
                padding: "0 8vw",
                justifyContent: "space-between",
              }}>
                <div>
                  <div style={{
                    fontFamily: "'Instrument Serif', sans-serif", fontSize: "5rem",
                    color: panel.accent, opacity: 0.3, lineHeight: 1,
                    position: "absolute", left: "5vw", top: "50%",
                    transform: "translateY(-50%)", userSelect: "none",
                  }}>
                    {panel.id}
                  </div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h3 style={{
                      fontFamily: "'Instrument Serif', sans-serif",
                      fontSize: "clamp(2rem, 5vw, 4rem)",
                      letterSpacing: "0.08em", color: "#fff", margin: "0 0 8px",
                    }}>
                      {panel.title}
                    </h3>
                    <p className="panel-label" style={{
                      fontSize: "0.78rem", letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
                    }}>
                      {panel.sub}
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ x: 8 }}
                  style={{
                    width: 48, height: 48, border: `1px solid ${panel.accent}55`,
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.5)", fontSize: "1.2rem",
                    flexShrink: 0,
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
          SECTION 4 — STATISTICS (Cinematic count-up)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "180px 5vw", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Instrument Serif', sans-serif",
          fontSize: "clamp(8rem, 20vw, 30rem)",
          color: "#F26D4F", opacity: 0.04,
          pointerEvents: "none", whiteSpace: "nowrap", userSelect: "none",
          filter: "blur(4px)",
        }}>
          TANGY
        </div>

        {/* Ambient orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "20%", left: "10%",
            width: "40vw", height: "40vw",
            background: "radial-gradient(circle, rgba(242, 109, 79,0.25) 0%, transparent 70%)",
            filter: "blur(60px)", pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            position: "absolute", bottom: "20%", right: "10%",
            width: "35vw", height: "35vw",
            background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)",
            filter: "blur(60px)", pointerEvents: "none",
          }}
        />

        <div style={{
          maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "center",
        }}>
          <StatNumber target={1200} suffix="+" label="Attendees" delay={0} />
          <StatNumber target={12} suffix="" label="Artists" delay={150} />
          <StatNumber target={3} suffix="" label="Sessions" delay={300} />
          <TypewriterStat text="GROWING" delay={500} />
        </div>
      </section>

      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 5 — THE PEOPLE WE LOOK FOR (Manifesto lines)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "180px 5vw", position: "relative" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 80 }}
          >
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.4em", color: "#2A593E", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20 }}>
              No Prerequisites
            </div>
            <h2 style={{
              fontFamily: "'Instrument Serif', sans-serif",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              letterSpacing: "0.04em", color: "#fff", lineHeight: 0.95, margin: 0,
            }}>
              THE PEOPLE<br />WE LOOK FOR
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {manifestoLines.map((line, i) => {
              if (!line) return <div key={i} style={{ height: 40 }} />;
              const isAccent = line.startsWith("You only");
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    padding: "20px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span style={{
                    fontFamily: isAccent ? "'Instrument Serif', sans-serif" : "'Cormorant Garamond', serif",
                    fontSize: isAccent ? "clamp(2rem, 4vw, 3rem)" : "clamp(1.5rem, 3vw, 2.2rem)",
                    fontStyle: isAccent ? "normal" : "italic",
                    letterSpacing: isAccent ? "0.06em" : "0",
                    color: isAccent ? "#fff" : "rgba(255,255,255,0.45)",
                    fontWeight: isAccent ? 400 : 300,
                    display: "block",
                  }}>
                    {isAccent && (
                      <span style={{ color: "#2A593E", marginRight: 16 }}>—</span>
                    )}
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
      <section id="apply-section" style={{ padding: "160px 5vw", position: "relative" }}>
        {/* Full-bleed bg image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/gallery/tangy4.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(50px) brightness(0.3)", opacity: 0.5, zIndex: 0,
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #080808, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0.5) 60%, #080808)", zIndex: 0 }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <div style={{ fontSize: "0.72rem", letterSpacing: "0.4em", color: "#2A593E", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 20 }}>
              Join The Collective
            </div>
            <h2 style={{
              fontFamily: "'Instrument Serif', sans-serif",
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              letterSpacing: "0.04em", color: "#fff", lineHeight: 0.95, margin: "0 0 24px",
            }}>
              YOUR APPLICATION
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", fontSize: "1.2rem",
              color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto",
            }}>
              This is not a job application. It's an invitation to become part of something real.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            style={{
              background: "rgba(24,24,24,0.7)",
              backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(242, 109, 79,0.2)",
              borderRadius: 24,
              boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
              overflow: "hidden",
            }}
          >
            <VolunteerForm />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 7 — FINAL CTA: SEE YOU INSIDE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", height: "80vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Video / image bg */}
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url('/gallery/tangy1.jpg')",
            backgroundSize: "cover", backgroundPosition: "center 40%",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(5,5,5,0.78)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #080808 0%, transparent 25%, transparent 75%, #080808 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, rgba(242, 109, 79,0.1) 0%, transparent 65%)" }} />
        </div>

        <Particles count={12} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 5vw" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 style={{
              fontFamily: "'Instrument Serif', sans-serif",
              fontSize: "clamp(5rem, 18vw, 16rem)",
              lineHeight: 0.88, letterSpacing: "0.02em", color: "#fff",
              margin: "0 0 32px",
              textShadow: "0 0 80px rgba(242, 109, 79,0.2)",
            }}>
              SEE YOU<br />
              <span style={{ WebkitTextStroke: "1px rgba(243, 229, 171,0.6)", WebkitTextFillColor: "transparent" }}>
                INSIDE.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic", fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              color: "rgba(255,255,255,0.55)", lineHeight: 1.7,
              marginBottom: 48, maxWidth: 600, margin: "0 auto 48px",
            }}
          >
            Some people attend Tangy.<br />Others become part of it.
          </motion.p>

          <motion.button
            onClick={scrollToApply}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(242, 109, 79,0.5)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "20px 56px",
              background: "linear-gradient(135deg, #F26D4F, #D4AF37)",
              color: "#fff", border: "none", borderRadius: 40,
              cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem",
              fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
              boxShadow: "0 12px 40px rgba(242, 109, 79,0.3)",
            }}
          >
            Begin Your Journey
          </motion.button>
        </div>
      </section>
    </div>
  );
}
