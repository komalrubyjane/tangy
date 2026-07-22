// ─── src/pages/EventDetails.jsx ──────────────────────────────────────────────
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";
import { bookingService } from "../services/bookingService";

// ─── SHARED EVENT DATA ────────────────────────────────────────────────────────
export const EVENTS_DATA = [
  {
    id: 1,
    slug: "vol-1",
    name: "Tangy Sessions Vol. 1",
    date: "Aug 15, 2025",
    time: "7:00 PM",
    location: "Bansilal Stepwell",
    city: "Hyderabad, Telangana",
    price: 799,
    capacity: 200,
    available: 120,
    tags: ["Deep House", "Ambient"],
    heroImage: "/gallery/tangy1.jpg",
    description:
      "An immersive night of underground electronic music echoing through ancient stone corridors. Vol. 1 was the genesis — the first time we dared to bring 140 BPM into a 16th-century stepwell. The Bansilal Baoli's geometric chambers became a living speaker cabinet, with bass frequencies bouncing off carved stone and dissolving into the still water below.",
    experienceOverview:
      "Expect a sensory journey: candlelit descents, spatial audio designed for the stepwell's natural reverb, rooftop chill zones, and an intimate crowd of 200 who truly listen. No VIP sections — only good sound and good people.",
    genres: ["Deep House", "Ambient", "Organic Electronic"],
    schedule: [
      { time: "7:00 PM", act: "Doors Open", detail: "Complimentary welcome drink, ambient soundscape playing" },
      { time: "7:45 PM", act: "Aura.wav", detail: "Opening ambient set — let the space breathe" },
      { time: "9:00 PM", act: "Ritvik", detail: "Classical fusion — Carnatic ragas meet modular synths" },
      { time: "10:30 PM", act: "KRYZEN", detail: "Headline deep house set in the lower chamber" },
      { time: "12:30 AM", act: "Closing", detail: "Guided exit, after-party details announced" },
    ],
    gallery: [
      { img: "/gallery/tangy1.jpg", label: "Stepwell Entrance" },
      { img: "/gallery/tangy2.jpg", label: "Stage Setup" },
      { img: "/gallery/tangy3.jpg", label: "Crowd Vibes" },
      { img: "/gallery/tangy4.jpg", label: "Night Ambience" },
      { img: "/gallery/tangy5.jpg", label: "DJ Booth" },
      { img: "/gallery/tangy6.jpg", label: "Light Show" },
    ],
    faqs: [
      { q: "Is there an age restriction?", a: "Yes, this is an 18+ event. Please bring valid government-issued photo ID." },
      { q: "What's the cancellation policy?", a: "Full refund within 48 hours of purchase. 50% refund up to 7 days before the event. No refunds after that." },
      { q: "Can I bring my camera?", a: "Compact cameras and mobile phones are welcome. Professional DSLRs and video equipment require prior approval." },
      { q: "Is food & beverage available?", a: "Yes — curated bar with craft cocktails, mocktails, and light bites available throughout the night." },
      { q: "How do I reach the venue?", a: "Bansilal Stepwell is near Golconda Fort. We recommend Uber/Ola or our shuttle service from Mehdipatnam (details in your confirmation email)." },
    ],
  },
  {
    id: 2,
    slug: "vol-2",
    name: "Tangy Sessions Vol. 2",
    date: "Sep 20, 2025",
    time: "8:00 PM",
    location: "Bansilal Stepwell",
    city: "Hyderabad, Telangana",
    price: 999,
    capacity: 250,
    available: 85,
    tags: ["House", "Experimental"],
    heroImage: "/gallery/tangy3.jpg",
    description:
      "Deep house and ambient textures meet centuries-old architecture for a transcendent experience. Vol. 2 pushed further — we brought in a live modular synthesizer rig that responded to the crowd's energy in real time. The stepwell's multiple levels were activated simultaneously, creating a 3D sound map you could walk through.",
    experienceOverview:
      "Three performance zones across different levels of the stepwell. A dedicated ambient lounge carved into the northern alcove. Handcrafted spatial audio installation by Aura.wav running throughout the evening. Limited to 250 attendees for an exclusive feel.",
    genres: ["House", "Experimental", "Modular Synthesis", "Techno"],
    schedule: [
      { time: "8:00 PM", act: "Doors Open", detail: "Interactive sound installation active in upper courtyard" },
      { time: "8:30 PM", act: "SONDER", detail: "Live modular synthesis — the stepwell responds" },
      { time: "10:00 PM", act: "Priya K", detail: "Haunting vocal improvisations over electronic beats" },
      { time: "11:15 PM", act: "AXIOM", detail: "Bass music headline set — sub-frequencies you feel in your chest" },
      { time: "1:00 AM", act: "Closing Ritual", detail: "Guided meditation with Aura.wav ambient soundscape" },
    ],
    gallery: [
      { img: "/gallery/tangy3.jpg", label: "Crowd Vibes" },
      { img: "/gallery/tangy4.jpg", label: "Night Ambience" },
      { img: "/gallery/tangy5.jpg", label: "DJ Booth" },
      { img: "/gallery/tangy6.jpg", label: "Light Show" },
      { img: "/gallery/tangy1.jpg", label: "Stepwell Lit" },
      { img: "/gallery/tangy2.jpg", label: "Stage View" },
    ],
    faqs: [
      { q: "Is there an age restriction?", a: "Yes, 18+ only. Please bring valid government-issued photo ID." },
      { q: "What's the cancellation policy?", a: "Full refund within 48 hours of purchase. 50% refund up to 7 days before the event. No refunds after that." },
      { q: "Are there multiple stages?", a: "Yes — Vol. 2 features three simultaneous performance zones across different levels of the stepwell." },
      { q: "Is this accessible for people with mobility needs?", a: "The stepwell has historic stone steps. Please contact us at hello@tangysessions.in so we can best accommodate you." },
      { q: "Will there be merchandise?", a: "Yes — limited edition Vol. 2 tees and prints available at the venue. First-come, first-served." },
    ],
  },
  {
    id: 3,
    slug: "solstice",
    name: "Tangy Sessions: Solstice",
    date: "Dec 21, 2025",
    time: "6:30 PM",
    location: "Bansilal Stepwell",
    city: "Hyderabad, Telangana",
    price: 1299,
    capacity: 180,
    available: 42,
    tags: ["Techno", "Dark Ambient"],
    heroImage: "/gallery/tangy4.jpg",
    description:
      "A winter solstice special — the longest night, the deepest sounds. Solstice is our most ambitious event yet: a 6-hour ceremony of techno and dark ambient that begins at dusk and ends as the first light of the next day approaches. We've partnered with a heritage lighting designer to transform the stepwell into a cathedral of shadow and neon.",
    experienceOverview:
      "Strictly limited to 180 attendees. Full stepwell takeover — all levels, all chambers. Custom stage built at the base of the main baoli pool. Fire installation by local artists. This is not just a party — it is a ritual.",
    genres: ["Techno", "Dark Ambient", "Industrial", "Drone"],
    schedule: [
      { time: "6:30 PM", act: "Doors Open", detail: "Sunset arrival, welcome ceremony with fire installation" },
      { time: "7:00 PM", act: "Noctis", detail: "Dark ambient drone set as darkness falls over the stepwell" },
      { time: "8:30 PM", act: "ZEPH", detail: "Industrial techno — Berlin-meets-Hyderabad" },
      { time: "10:30 PM", act: "KRYZEN B2B AXIOM", detail: "Back-to-back headline set — peak hours" },
      { time: "1:00 AM", act: "SONDER", detail: "Closing live modular set into the early hours" },
      { time: "3:00 AM", act: "Solstice Close", detail: "Candlelit ceremony as the longest night ends" },
    ],
    gallery: [
      { img: "/gallery/tangy4.jpg", label: "Night Ambience" },
      { img: "/gallery/tangy6.jpg", label: "Light Show" },
      { img: "/gallery/tangy5.jpg", label: "DJ Booth" },
      { img: "/gallery/tangy1.jpg", label: "The Descent" },
      { img: "/gallery/tangy2.jpg", label: "Sound Check" },
      { img: "/gallery/tangy3.jpg", label: "After Hours" },
    ],
    faqs: [
      { q: "Is there an age restriction?", a: "Yes, 18+ only. Valid government-issued ID required." },
      { q: "How long does the event run?", a: "Doors at 6:30 PM through approximately 3:00 AM — nearly 9 hours of programming." },
      { q: "Is camping available?", a: "No overnight camping, but we have curated transport arrangements back to the city. Details in your confirmation." },
      { q: "Why is Solstice more expensive?", a: "This is our most produced event: custom stage, heritage lighting design, fire installation, and a 9-hour programme. The price reflects the experience." },
      { q: "Are tickets transferable?", a: "Yes — tickets are name-transferable up to 48 hours before the event. Contact us at hello@tangysessions.in." },
    ],
  },
];

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@1,300;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
    body { overflow-x: hidden; background: #080808; }
    input, button, select, textarea { font-family: inherit; }
    ::selection { background: rgba(200,255,43,0.3); }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #080808; }
    ::-webkit-scrollbar-thumb { background: #C8FF2B; }

    .ed-input {
      width: 100%; padding: 14px 0;
      background: transparent;
      border: none; border-bottom: 1px solid rgba(255,255,255,0.15);
      color: #fff; font-size: 0.9rem; font-family: inherit; outline: none;
      transition: border-color 0.2s;
    }
    .ed-input:focus { border-bottom-color: #C8FF2B; }
    .ed-input::placeholder { color: rgba(255,255,255,0.2); }
    select.ed-input { cursor: pointer; appearance: none; }
    textarea.ed-input { resize: vertical; min-height: 60px; border: 1px solid rgba(255,255,255,0.12); padding: 12px; }
    textarea.ed-input:focus { border-color: #C8FF2B; }

    .ed-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
    @media (max-width: 768px) {
      .ed-about-grid { grid-template-columns: 1fr !important; }
      .ed-breadcrumb { display: none !important; }
    }
    @media (max-width: 600px) {
      .ed-nav { padding: 0 16px !important; }
      .ed-meta-row { flex-direction: column !important; gap: 16px !important; }
    }
  `}</style>
);

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function Label({ text }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace", fontSize: "0.62rem",
      letterSpacing: "0.4em", color: "#C8FF2B", textTransform: "uppercase", marginBottom: 12,
    }}>
      // {text} //
    </div>
  );
}

// ─── DASHED DIVIDER ───────────────────────────────────────────────────────────
const Dash = () => (
  <div style={{ width: "100%", borderTop: "1px dashed rgba(200,255,43,0.18)", margin: "0" }} />
);

// ─── MAIN EVENT DETAILS PAGE ──────────────────────────────────────────────────
export default function EventDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const ev = EVENTS_DATA.find(e => e.slug === slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!ev) {
    return (
      <div style={{
        minHeight: "100vh", background: "#080808",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", color: "#fff", textAlign: "center", padding: 40,
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4rem,15vw,10rem)", color: "rgba(255,255,255,0.05)", lineHeight: 1 }}>404</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "0.06em", margin: "0 0 12px", color: "#fff" }}>Event Not Found</h2>
        <p style={{ color: "rgba(255,255,255,0.35)", marginBottom: 32, fontFamily: "'Space Mono', monospace", fontSize: "0.75rem" }}>Nothing at this URL.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "14px 36px", background: "#C8FF2B", color: "#080808",
            border: "none", borderRadius: 0, cursor: "pointer",
            fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.15em",
          }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const pct = Math.round(((ev.capacity - ev.available) / ev.capacity) * 100);
  const isLow = ev.available < 60;

  return (
    <div style={{ background: "#080808", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#fff" }}>
      <GlobalStyles />

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <nav className="ed-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(8,8,8,0.97)", borderBottom: "1px solid rgba(200,255,43,0.1)",
        padding: "0 5vw", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        {/* Logo text */}
        <div
          onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#fff", cursor: "pointer", letterSpacing: "0.05em" }}
        >
          TANGY<span style={{ color: "#C8FF2B" }}>.</span>
        </div>

        {/* Breadcrumb */}
        <div className="ed-breadcrumb" style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
          <span onClick={() => { navigate("/"); window.scrollTo(0, 0); }} style={{ cursor: "pointer" }} onMouseEnter={e => e.target.style.color = "#C8FF2B"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}>HOME</span>
          <span style={{ opacity: 0.3 }}>›</span>
          <span onClick={() => { navigate("/"); setTimeout(() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" }), 120); }} style={{ cursor: "pointer" }} onMouseEnter={e => e.target.style.color = "#C8FF2B"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}>EVENTS</span>
          <span style={{ opacity: 0.3 }}>›</span>
          <span style={{ color: "#C8FF2B" }}>{ev.name.toUpperCase()}</span>
        </div>

        {/* Back */}
        <button
          onClick={() => { navigate("/"); setTimeout(() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" }), 120); }}
          style={{
            padding: "8px 20px", background: "transparent",
            border: "1px solid rgba(200,255,43,0.4)", color: "#C8FF2B",
            cursor: "pointer", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
            letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: 0,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#C8FF2B"; e.currentTarget.style.color = "#080808"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C8FF2B"; }}
        >
          ← BACK
        </button>
      </nav>
      <div style={{ height: 64 }} />

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "82vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {/* Background image */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${ev.heroImage})`,
          backgroundSize: "cover", backgroundPosition: "center 30%",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #080808 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(8,8,8,0.7) 0%, transparent 60%)" }} />

        {/* Serial tag — top right */}
        <div style={{
          position: "absolute", top: 24, right: "5vw",
          fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
          color: "rgba(200,255,43,0.5)", letterSpacing: "0.3em", textTransform: "uppercase",
        }}>
          SRL-{String(ev.id).padStart(3,"0")} // TS-HYD-2025
        </div>

        {/* Vertical rotated label */}
        <div style={{
          position: "absolute", left: 28, top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          fontFamily: "'Space Mono', monospace", fontSize: "0.55rem",
          color: "rgba(200,255,43,0.4)", letterSpacing: "0.4em", textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          BANSILAL STEPWELL · HYDERABAD
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 3, width: "100%", padding: "0 5vw 70px" }}>
          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}
          >
            {ev.tags.map(tag => (
              <span key={tag} style={{
                padding: "4px 14px",
                border: "1px dashed rgba(200,255,43,0.5)",
                fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
                color: "#C8FF2B", letterSpacing: "0.2em", textTransform: "uppercase",
              }}>
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Title */}
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.5rem, 9vw, 8rem)",
                color: "#fff", margin: "0 0 28px",
                lineHeight: 0.93, letterSpacing: "0.03em",
              }}
            >
              {ev.name}
            </motion.h1>
          </div>

          {/* Meta row */}
          <motion.div
            className="ed-meta-row"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "flex", alignItems: "flex-start", flexWrap: "wrap", gap: 40, marginBottom: 36 }}
          >
            {[
              { label: "DATE & TIME", value: `${ev.date} · ${ev.time}` },
              { label: "VENUE", value: `${ev.location}, ${ev.city}` },
              { label: "PRICE", value: `₹${ev.price.toLocaleString()}` },
              { label: "CAPACITY", value: `${ev.capacity} attendees` },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: "0.9rem", color: "#fff", fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </motion.div>

          {/* Availability bar */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ width: "min(380px, 90vw)", marginBottom: 32 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.35)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <span>Availability</span>
              <span style={{ color: isLow ? "#FF2E52" : "#C8FF2B" }}>
                {isLow ? `⚠ Only ${ev.available} left` : `${ev.available} remaining`}
              </span>
            </div>
            <div style={{ height: 2, background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                style={{ height: "100%", background: isLow ? "#FF2E52" : "#C8FF2B" }}
              />
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <button
              onClick={() => document.getElementById("book-tickets")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                padding: "16px 44px", background: "#C8FF2B", color: "#080808",
                border: "none", borderRadius: 0, cursor: "pointer",
                fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem",
                letterSpacing: "0.15em", display: "inline-flex", alignItems: "center", gap: 10,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#C8FF2B"; }}
            >
              BOOK TICKETS →
            </button>
          </motion.div>
        </div>
      </section>

      <Dash />

      {/* ═══════════════════════════════════════════════════════════════════════
          ABOUT
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="ed-about-grid">
            {/* Left: description */}
            <motion.div
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{ borderRight: "1px dashed rgba(200,255,43,0.12)", padding: "0 5vw 0 0" }}
            >
              <Label text="About the Event" />
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff", margin: "0 0 24px", letterSpacing: "0.04em" }}>
                The Experience
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.85, fontSize: "0.92rem", marginBottom: 20 }}>{ev.description}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.75, fontSize: "0.87rem" }}>{ev.experienceOverview}</p>
            </motion.div>

            {/* Right: details + genres */}
            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ padding: "0 0 0 5vw", display: "flex", flexDirection: "column", gap: 36 }}
            >
              {/* Genres */}
              <div>
                <Label text="Music Genres" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {ev.genres.map(g => (
                    <span key={g} style={{
                      padding: "6px 16px",
                      border: "1px dashed rgba(200,255,43,0.35)",
                      fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
                      color: "#C8FF2B", letterSpacing: "0.1em",
                    }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick facts */}
              <div>
                <Label text="Event Details" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    ["DATE", ev.date],
                    ["DOORS OPEN", ev.time],
                    ["VENUE", ev.location],
                    ["CITY", ev.city],
                    ["CAPACITY", `${ev.capacity} attendees`],
                    ["TICKET PRICE", `₹${ev.price.toLocaleString()} / person`],
                  ].map(([key, val]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }}>{key}</span>
                      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Dash />

      {/* ═══════════════════════════════════════════════════════════════════════
          SCHEDULE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 5vw" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Label text="Programme" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", margin: "0 0 48px", letterSpacing: "0.04em" }}>
            Event Schedule
          </h2>

          <div style={{ position: "relative" }}>
            {/* Timeline line */}
            <div style={{
              position: "absolute", left: 84, top: 0, bottom: 0, width: 1,
              background: "linear-gradient(to bottom, transparent, rgba(200,255,43,0.3) 10%, rgba(200,255,43,0.3) 90%, transparent)",
            }} />

            {ev.schedule.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ display: "flex", gap: 20, marginBottom: 20, position: "relative" }}
              >
                {/* Time */}
                <div style={{
                  minWidth: 72, textAlign: "right",
                  fontFamily: "'Space Mono', monospace", fontSize: "0.65rem",
                  color: "#C8FF2B", letterSpacing: "0.05em", paddingTop: 18,
                }}>
                  {item.time}
                </div>

                {/* Dot */}
                <div style={{ display: "flex", alignItems: "flex-start", paddingTop: 18 }}>
                  <div style={{
                    width: 10, height: 10,
                    background: i === 0 ? "#C8FF2B" : "transparent",
                    border: `2px solid #C8FF2B`,
                    flexShrink: 0,
                  }} />
                </div>

                {/* Card */}
                <div style={{
                  flex: 1, background: "#111", border: "1px solid rgba(255,255,255,0.06)",
                  padding: "16px 22px",
                  transition: "border-color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(200,255,43,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
                >
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "#fff", letterSpacing: "0.06em", marginBottom: 4 }}>
                    {item.act}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                    {item.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dash />

      {/* ═══════════════════════════════════════════════════════════════════════
          GALLERY
      ═══════════════════════════════════════════════════════════════════════ */}
      <GallerySection ev={ev} />

      <Dash />

      {/* ═══════════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════════ */}
      <FAQSection ev={ev} />

      <Dash />

      {/* ═══════════════════════════════════════════════════════════════════════
          BOOKING FORM
      ═══════════════════════════════════════════════════════════════════════ */}
      <BookingSection ev={ev} />

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        borderTop: "1px dashed rgba(200,255,43,0.18)",
        padding: "32px 5vw",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.15em" }}>© 2025 TANGY SESSIONS</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.15em" }}>BANSILAL STEPWELL · HYDERABAD</div>
      </footer>
    </div>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────
function GallerySection({ ev }) {
  const [lightbox, setLightbox] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);

  const handleKeyDown = useCallback(e => { if (e.key === "Escape") setLightbox(null); }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Group photos into pages of 3
  const PER_SLIDE = 3;
  const slides = [];
  for (let i = 0; i < ev.gallery.length; i += PER_SLIDE) {
    slides.push(ev.gallery.slice(i, i + PER_SLIDE));
  }
  const total = slides.length;

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

  return (
    <section style={{ padding: "80px 0" }}>
      {/* Header */}
      <div style={{ padding: "0 5vw", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
          <div>
            <Label text="Photos" />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", margin: 0, letterSpacing: "0.04em" }}>Gallery</h2>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em" }}>
            {String(currentSlide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Carousel wrapper */}
      <div style={{ position: "relative" }}>
        <style>{`
          .gal-track::-webkit-scrollbar { display: none; }
          .gal-track { scrollbar-width: none; -ms-overflow-style: none; }
        `}</style>

        {/* Track */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="gal-track"
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {slides.map((slide, si) => (
            <div
              key={si}
              style={{
                minWidth: "100%",
                flexShrink: 0,
                scrollSnapAlign: "start",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
                padding: "0 5vw",
                boxSizing: "border-box",
              }}
            >
              {/* Fill to always show 3 columns */}
              {[...slide, ...Array(PER_SLIDE - slide.length).fill(null)].map((item, ii) =>
                item ? (
                  <div
                    key={ii}
                    onClick={() => setLightbox(item)}
                    style={{ aspectRatio: "4/3", cursor: "pointer", overflow: "hidden", background: "#080808", position: "relative" }}
                  >
                    <img
                      src={item.img} alt={item.label} loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease, filter 0.4s ease", filter: "grayscale(30%) brightness(0.75)", display: "block" }}
                      onMouseEnter={e => { e.target.style.transform = "scale(1.06)"; e.target.style.filter = "grayscale(0%) brightness(1)"; }}
                      onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.filter = "grayscale(30%) brightness(0.75)"; }}
                    />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 10px 8px", background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)", fontFamily: "'Space Mono', monospace", fontSize: "0.52rem", color: "#C8FF2B", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                      {item.label}
                    </div>
                    <div style={{ position: "absolute", top: 0, left: 0, width: 12, height: 12, borderTop: "2px solid #C8FF2B", borderLeft: "2px solid #C8FF2B" }} />
                  </div>
                ) : (
                  <div key={`empty-${ii}`} style={{ background: "#0a0a0a", aspectRatio: "4/3" }} />
                )
              )}
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        {total > 1 && (
          <>
            <button
              onClick={() => goTo(currentSlide - 1)}
              disabled={currentSlide === 0}
              style={{
                position: "absolute", left: "calc(5vw + 6px)", top: "50%", transform: "translateY(-50%)",
                width: 38, height: 38, background: "rgba(8,8,8,0.9)",
                border: `1px solid ${currentSlide === 0 ? "rgba(255,255,255,0.06)" : "rgba(200,255,43,0.4)"}`,
                color: currentSlide === 0 ? "rgba(255,255,255,0.12)" : "#C8FF2B",
                cursor: currentSlide === 0 ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", zIndex: 10, transition: "all 0.2s", borderRadius: 0,
              }}
            >&#8592;</button>
            <button
              onClick={() => goTo(currentSlide + 1)}
              disabled={currentSlide === total - 1}
              style={{
                position: "absolute", right: "calc(5vw + 6px)", top: "50%", transform: "translateY(-50%)",
                width: 38, height: 38, background: "rgba(8,8,8,0.9)",
                border: `1px solid ${currentSlide === total - 1 ? "rgba(255,255,255,0.06)" : "rgba(200,255,43,0.4)"}`,
                color: currentSlide === total - 1 ? "rgba(255,255,255,0.12)" : "#C8FF2B",
                cursor: currentSlide === total - 1 ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", zIndex: 10, transition: "all 0.2s", borderRadius: 0,
              }}
            >&#8594;</button>
          </>
        )}
      </div>

      {/* Dot navigation */}
      {total > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 18 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === currentSlide ? 22 : 7,
                height: 3, padding: 0, border: "none",
                background: i === currentSlide ? "#C8FF2B" : "rgba(255,255,255,0.15)",
                cursor: "pointer", transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            onClick={() => setLightbox(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#0e0e0e", border: "1px dashed rgba(200,255,43,0.4)", overflow: "hidden", maxWidth: "90vw", maxHeight: "85vh" }}
            >
              <img src={lightbox.img} alt={lightbox.label} style={{ display: "block", maxWidth: "90vw", maxHeight: "75vh", objectFit: "contain" }} />
              <div style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "#fff", letterSpacing: "0.1em" }}>{lightbox.label}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>ESC TO CLOSE</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQSection({ ev }) {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "80px 5vw" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <Label text="FAQ" />
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", margin: "0 0 40px", letterSpacing: "0.04em" }}>
          Common Questions
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {ev.faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", padding: "20px 0",
                  background: "transparent", border: "none", borderBottom: `1px solid ${open === i ? "rgba(200,255,43,0.4)" : "rgba(255,255,255,0.06)"}`,
                  cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                  transition: "border-color 0.25s",
                }}
              >
                <span style={{ color: "#fff", fontSize: "0.92rem", fontWeight: 500, lineHeight: 1.5, textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: "#C8FF2B", fontSize: "1.4rem", flexShrink: 0, lineHeight: 1, fontFamily: "monospace" }}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ padding: "16px 0 24px", color: "rgba(255,255,255,0.5)", fontSize: "0.87rem", lineHeight: 1.8, borderLeft: "2px solid #C8FF2B", paddingLeft: 20 }}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BOOKING FORM ─────────────────────────────────────────────────────────────
function BookingSection({ ev }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", qty: 1, notes: "",
    dob: "", gender: "Woman", paymentTo: "7671836748 - Arjuna/ Tangy",
    upiName: "", upiId: "", paymentMethod: "Google Pay",
    attendedBefore: "Not yet, but can't wait.", cityPart: "",
    artistCollab: "", seatingPreference: "", instagram: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const total = ev.price * form.qty;

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required";
    if (!form.phone.match(/^[+\d\s\-()]{7,15}$/)) errs.phone = "Valid phone number required";
    if (!form.qty || form.qty < 1) errs.qty = "Minimum 1 ticket";
    if (form.qty > 10) errs.qty = "Maximum 10 tickets per booking";
    if (!form.upiName.trim()) errs.upiName = "UPI Name required";
    if (!form.upiId.trim()) errs.upiId = "Transaction ID required";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) handlePaymentSuccess();
  };

  const handlePaymentSuccess = async () => {
    setIsSubmitting(true);
    const result = await bookingService.submitBooking({
      ...form, eventName: ev.name, amountPaid: ev.price * form.qty,
    });
    setIsSubmitting(false);
    if (result.success) {
      setSubmitSuccess(true);
      setForm({
        name: "", email: "", phone: "", qty: 1, notes: "",
        dob: "", gender: "Woman", paymentTo: "7671836748 - Arjuna/ Tangy",
        upiName: "", upiId: "", paymentMethod: "Google Pay",
        attendedBefore: "Not yet, but can't wait.", cityPart: "",
        artistCollab: "", seatingPreference: "", instagram: "",
      });
    } else {
      alert("Failed to submit booking. Please try again.");
    }
  };

  const errStyle = { color: "#FF2E52", fontSize: "0.68rem", marginTop: 4, fontFamily: "'Space Mono', monospace" };
  const labelStyle = { display: "block", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 };

  return (
    <section id="book-tickets" style={{ padding: "80px 5vw" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Label text="Reserve Your Spot" />
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", margin: "0 0 48px", letterSpacing: "0.04em" }}>
          Book Tickets
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ type: "spring", bounce: 0.2 }}
        >
          {submitSuccess ? (
            /* ── SUCCESS STATE ── */
            <div style={{ border: "1px dashed rgba(200,255,43,0.5)", padding: "48px 36px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,6vw,3.5rem)", color: "#C8FF2B", letterSpacing: "0.1em", marginBottom: 12 }}>
                BOOKING CONFIRMED ✓
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 32 }}>
                Your tickets for <strong style={{ color: "#fff" }}>{ev.name}</strong> are secured. Confirmation sent to your inbox.
              </p>

              {/* Ticket mockup */}
              <div style={{ border: "1px dashed rgba(200,255,43,0.3)", padding: "24px", maxWidth: 400, margin: "0 auto 32px", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: 14, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "#C8FF2B", letterSpacing: "0.2em", textTransform: "uppercase" }}>TANGY SESSIONS ENTRY PASS</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: "#fff", marginTop: 4, letterSpacing: "0.06em" }}>{ev.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>QTY</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "#fff" }}>{form.qty}x</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    {[["DATE", `${ev.date} · ${ev.time}`], ["VENUE", ev.location]].map(([k, v]) => (
                      <div key={k} style={{ marginBottom: 10 }}>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{k}</div>
                        <div style={{ fontSize: "0.82rem", color: "#fff" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ width: 80, height: 80, background: "#fff", padding: 4, flexShrink: 0 }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`TANGY_${ev.id}_${form.email}_${form.qty}`)}`}
                      alt="QR" style={{ width: "100%", height: "100%", display: "block" }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSubmitSuccess(false)}
                style={{
                  padding: "12px 32px", background: "transparent",
                  border: "1px solid rgba(200,255,43,0.4)", color: "#C8FF2B",
                  cursor: "pointer", fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: 0,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#C8FF2B"; e.currentTarget.style.color = "#080808"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C8FF2B"; }}
              >
                Book Another Ticket
              </button>
            </div>
          ) : (
            /* ── BOOKING FORM ── */
            <div style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Event info banner */}
              <div style={{ background: "#111", borderBottom: "1px dashed rgba(200,255,43,0.2)", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.15rem", color: "#fff", letterSpacing: "0.06em" }}>{ev.name}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{ev.date} · {ev.location}</div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#C8FF2B", letterSpacing: "0.04em" }}>₹{ev.price.toLocaleString()}</div>
              </div>

              <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 22 }}>

                {/* Name */}
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input className="ed-input" type="text" placeholder="Your full name"
                    value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: null })); }}
                    style={{ borderBottomColor: errors.name ? "#FF2E52" : undefined }}
                  />
                  {errors.name && <div style={errStyle}>⚠ {errors.name}</div>}
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input className="ed-input" type="email" placeholder="your@email.com"
                    value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: null })); }}
                    style={{ borderBottomColor: errors.email ? "#FF2E52" : undefined }}
                  />
                  {errors.email && <div style={errStyle}>⚠ {errors.email}</div>}
                </div>

                {/* Phone */}
                <div>
                  <label style={labelStyle}>Phone Number (WhatsApp) *</label>
                  <input className="ed-input" type="tel" placeholder="+91 98765 43210"
                    value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: null })); }}
                    style={{ borderBottomColor: errors.phone ? "#FF2E52" : undefined }}
                  />
                  {errors.phone && <div style={errStyle}>⚠ {errors.phone}</div>}
                </div>

                {/* DOB + Gender */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <label style={labelStyle}>Date of Birth</label>
                    <input className="ed-input" type="text" placeholder="DD/MM/YYYY"
                      value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Gender</label>
                    <select className="ed-input" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                      <option>Woman</option><option>Man</option>
                      <option>Non-binary / Genderqueer</option><option>Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* City + Instagram */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <label style={labelStyle}>Part of City?</label>
                    <input className="ed-input" type="text" placeholder="e.g. Jubilee Hills"
                      value={form.cityPart} onChange={e => setForm(f => ({ ...f, cityPart: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Instagram ID</label>
                    <input className="ed-input" type="text" placeholder="@username"
                      value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} />
                  </div>
                </div>

                {/* Attended Before */}
                <div>
                  <label style={labelStyle}>Attended Before?</label>
                  <select className="ed-input" value={form.attendedBefore} onChange={e => setForm(f => ({ ...f, attendedBefore: e.target.value }))}>
                    <option>Not yet, but can't wait.</option>
                    <option>Once or twice — loved it.</option>
                    <option>Yes, I'm a Tangy regular!</option>
                  </select>
                </div>

                {/* Tickets quantity */}
                <div>
                  <label style={labelStyle}>Number of Tickets * (max 10)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 4 }}>
                    <button
                      onClick={() => setForm(f => ({ ...f, qty: Math.max(1, f.qty - 1) }))}
                      style={{ width: 40, height: 40, background: "transparent", border: "1px solid rgba(200,255,43,0.3)", color: "#C8FF2B", cursor: "pointer", fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(200,255,43,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >−</button>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "#fff", minWidth: 36, textAlign: "center", lineHeight: 1 }}>{form.qty}</div>
                    <button
                      onClick={() => setForm(f => ({ ...f, qty: Math.min(10, f.qty + 1) }))}
                      style={{ width: 40, height: 40, background: "transparent", border: "1px solid rgba(200,255,43,0.3)", color: "#C8FF2B", cursor: "pointer", fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(200,255,43,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >+</button>
                  </div>
                  {errors.qty && <div style={errStyle}>⚠ {errors.qty}</div>}
                </div>

                {/* Seating Preference */}
                <div>
                  <label style={labelStyle}>Seating Preference</label>
                  <input className="ed-input" type="text" placeholder="Chairs / Mattress?"
                    value={form.seatingPreference} onChange={e => setForm(f => ({ ...f, seatingPreference: e.target.value }))} />
                </div>

                {/* Artist Collab */}
                <div>
                  <label style={labelStyle}>Are you an Artist? / Collab Ideas</label>
                  <textarea className="ed-input" placeholder="We love hearing your story!"
                    value={form.artistCollab} onChange={e => setForm(f => ({ ...f, artistCollab: e.target.value }))} />
                </div>

                {/* Notes */}
                <div>
                  <label style={labelStyle}>Anything else to share?</label>
                  <textarea className="ed-input" placeholder="Feedback, stories, etc..."
                    value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>

                {/* Total */}
                <div style={{ border: "1px dashed rgba(200,255,43,0.25)", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.35)", fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", marginBottom: 8 }}>
                    <span>{form.qty} × ₹{ev.price.toLocaleString()} per ticket</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>TOTAL</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.15, color: "#fff" }} animate={{ scale: 1, color: "#C8FF2B" }}
                      transition={{ duration: 0.3 }}
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", letterSpacing: "0.04em" }}
                    >
                      ₹{total.toLocaleString()}
                    </motion.span>
                  </div>
                </div>

                {/* Payment section */}
                <div style={{ border: "1px solid rgba(255,255,255,0.07)", padding: "24px 20px" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "#C8FF2B", marginBottom: 14, letterSpacing: "0.08em" }}>PAYMENT DETAILS</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", marginBottom: 20, lineHeight: 1.6 }}>
                    Make the payment of <strong style={{ color: "#fff" }}>₹{total.toLocaleString()}</strong> to one of the numbers below, then fill in the transaction details.
                  </p>

                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle}>Payment Made To *</label>
                    <select className="ed-input" value={form.paymentTo} onChange={e => setForm(f => ({ ...f, paymentTo: e.target.value }))}>
                      <option>7671836748 - Arjuna/ Tangy</option>
                      <option>8686299924 - Deepa</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 }}>
                    <div>
                      <label style={labelStyle}>Your UPI Name *</label>
                      <input className="ed-input" type="text" placeholder="Name on your UPI App"
                        value={form.upiName} onChange={e => { setForm(f => ({ ...f, upiName: e.target.value })); setErrors(er => ({ ...er, upiName: null })); }}
                        style={{ borderBottomColor: errors.upiName ? "#FF2E52" : undefined }}
                      />
                      {errors.upiName && <div style={errStyle}>⚠ {errors.upiName}</div>}
                    </div>
                    <div>
                      <label style={labelStyle}>Payment Method *</label>
                      <select className="ed-input" value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                        <option>Google Pay</option><option>PhonePe</option><option>UPI ID</option><option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>UPI Transaction ID *</label>
                    <input className="ed-input" type="text" placeholder="12–35 digit reference number"
                      value={form.upiId} onChange={e => { setForm(f => ({ ...f, upiId: e.target.value })); setErrors(er => ({ ...er, upiId: null })); }}
                      style={{ borderBottomColor: errors.upiId ? "#FF2E52" : undefined }}
                    />
                    {errors.upiId && <div style={errStyle}>⚠ {errors.upiId}</div>}
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  id="proceed-to-payment"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  style={{
                    width: "100%", padding: "18px 0",
                    background: isSubmitting ? "rgba(200,255,43,0.4)" : "#C8FF2B",
                    color: "#080808", border: "none", borderRadius: 0,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    fontSize: "1.3rem",
                    display: "flex", justifyContent: "center", alignItems: "center", gap: 12,
                    transition: "background 0.2s",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        style={{ width: 18, height: 18, border: "2px solid rgba(8,8,8,0.3)", borderTopColor: "#080808", borderRadius: "50%" }}
                      />
                      <span>Confirming Booking...</span>
                    </>
                  ) : "Proceed to Payment →"}
                </motion.button>

                <div style={{ textAlign: "center", fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.15em" }}>
                  🔒 SECURE CHECKOUT · INSTANT CONFIRMATION · FREE CANCELLATION WITHIN 48H
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
