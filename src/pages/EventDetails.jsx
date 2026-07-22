// ─── src/pages/EventDetails.jsx ──────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";
import { bookingService } from "../services/bookingService";

// ─── SHARED EVENT DATA (keep in sync with App.jsx EVENTS) ────────────────────
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

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <div style={{
      fontSize: "0.65rem", letterSpacing: "0.42em", color: "#F26D4F",
      textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12,
    }}>
      {text}
    </div>
  );
}

function GlassCard({ children, style = {}, ...props }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(8,8,12,0.82) 0%, rgba(8,8,12,0.62) 100%)",
      backdropFilter: "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      border: "1px solid rgba(242, 109, 79,0.22)",
      borderRadius: 24,
      boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(242, 109, 79,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
      ...style,
    }} {...props}>
      {children}
    </div>
  );
}

// ─── BREADCRUMB ───────────────────────────────────────────────────────────────
function Breadcrumb({ eventName }) {
  const navigate = useNavigate();
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      fontSize: "0.73rem", color: "rgba(255,255,255,0.4)",
      letterSpacing: "0.06em", flexWrap: "wrap",
    }}>
      <span
        onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
        style={{ cursor: "pointer", transition: "color 0.2s" }}
        onMouseEnter={e => e.target.style.color = "#F26D4F"}
        onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
      >
        Home
      </span>
      <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
      <span
        onClick={() => { navigate("/"); setTimeout(() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" }), 120); }}
        style={{ cursor: "pointer", transition: "color 0.2s" }}
        onMouseEnter={e => e.target.style.color = "#F26D4F"}
        onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
      >
        Events
      </span>
      <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
      <span style={{ color: "rgba(255,255,255,0.75)" }}>{eventName}</span>
    </div>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function EventHero({ ev }) {
  const pct = Math.round(((ev.capacity - ev.available) / ev.capacity) * 100);
  const isLow = ev.available < 60;

  return (
    <section style={{ position: "relative", minHeight: "72vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
      {/* Banner image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${ev.heroImage})`,
        backgroundSize: "cover", backgroundPosition: "center 30%",
        zIndex: 0,
      }} />
      {/* Overlays */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #080808 0%, transparent 65%)", zIndex: 2 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(242, 109, 79,0.08), transparent 60%)", zIndex: 2 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 3, width: "100%", padding: "0 5vw 60px" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Genre tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            {ev.tags.map(tag => (
              <span key={tag} style={{
                padding: "4px 12px",
                background: "rgba(242, 109, 79,0.18)",
                border: "1px solid rgba(242, 109, 79,0.4)",
                borderRadius: 20, fontSize: "0.68rem",
                color: "#2A593E", letterSpacing: "0.1em", textTransform: "uppercase",
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Instrument Serif', sans-serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            color: "#fff", margin: "0 0 24px",
            lineHeight: 0.95, letterSpacing: "0.04em",
            textShadow: "0 0 80px rgba(242, 109, 79,0.3)",
          }}>
            {ev.name}
          </h1>

          {/* Meta row & Actions */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32, marginBottom: 32 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
              {[
                { icon: "📅", label: "Date & Time", value: `${ev.date} · ${ev.time}` },
                { icon: "📍", label: "Venue", value: `${ev.location}, ${ev.city}` },
                { icon: "🎟", label: "From", value: `₹${ev.price.toLocaleString()}` },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(242, 109, 79,0.18)",
                    border: "1px solid rgba(242, 109, 79,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.1rem", flexShrink: 0,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontFamily: "monospace" }}>{label}</div>
                    <div style={{ fontSize: "0.88rem", color: "#fff", fontWeight: 500, marginTop: 2 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div style={{ width: 280, minWidth: 240 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <span>Availability</span>
                <span style={{ color: isLow ? "#f59e0b" : "#10b981" }}>
                  {isLow ? `⚠ Only ${ev.available} left` : `${ev.available} remaining`}
                </span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  style={{
                    height: "100%", borderRadius: 4,
                    background: isLow
                      ? "linear-gradient(to right, #f59e0b, #ef4444)"
                      : "linear-gradient(to right, #F26D4F, #C9A24B)",
                  }}
                />
              </div>
            </div>

            {/* Book Now Button */}
            <motion.button
              onClick={() => {
                document.getElementById("book-tickets")?.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(242, 109, 79, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "14px 36px",
                background: "linear-gradient(135deg, #F26D4F 0%, #D4AF37 100%)",
                border: "none",
                borderRadius: 30,
                color: "#fff",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(242, 109, 79, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Book Tickets 🎟️
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
function AboutEvent({ ev }) {
  return (
    <section style={{ padding: "80px 5vw" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="ed-about-grid">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard style={{ padding: "36px 32px", height: "100%" }}>
            <SectionLabel text="About the Event" />
            <h2 style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", margin: "0 0 20px", letterSpacing: "0.04em" }}>
              The Experience
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, fontSize: "0.92rem", marginBottom: 20 }}>
              {ev.description}
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.75, fontSize: "0.87rem" }}>
              {ev.experienceOverview}
            </p>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* Genres */}
          <GlassCard style={{ padding: "28px 28px" }}>
            <SectionLabel text="Music Genres" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
              {ev.genres.map(g => (
                <span key={g} style={{
                  padding: "7px 16px",
                  background: "linear-gradient(135deg, rgba(242, 109, 79,0.15), rgba(201, 162, 75,0.08))",
                  border: "1px solid rgba(242, 109, 79,0.3)",
                  borderRadius: 30, fontSize: "0.78rem",
                  color: "#c4b5fd", letterSpacing: "0.06em",
                }}>
                  {g}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Quick facts */}
          <GlassCard style={{ padding: "28px 28px" }}>
            <SectionLabel text="Event Details" />
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
              {[
                ["🗓", "Date", ev.date],
                ["🕐", "Doors Open", ev.time],
                ["📍", "Venue", ev.location],
                ["🏙", "City", ev.city],
                ["👥", "Capacity", `${ev.capacity} attendees`],
                ["🎟", "Ticket Price", `₹${ev.price.toLocaleString()} per person`],
              ].map(([icon, key, val]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 10 }}>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {icon} {key}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.85)", textAlign: "right" }}>{val}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SCHEDULE SECTION ─────────────────────────────────────────────────────────
function ScheduleSection({ ev }) {
  return (
    <section style={{ padding: "80px 5vw", background: "rgba(242, 109, 79,0.02)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel text="Programme" />
          <h2 style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "#fff", margin: 0, letterSpacing: "0.04em" }}>
            Event Schedule
          </h2>
          <motion.div
            initial={{ width: 0 }} whileInView={{ width: 48 }}
            transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
            style={{ height: 2, background: "linear-gradient(to right, #F26D4F, #C9A24B)", margin: "16px auto 0", borderRadius: 2 }}
          />
        </div>

        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div style={{
            position: "absolute", left: 79, top: 0, bottom: 0, width: 1,
            background: "linear-gradient(to bottom, transparent, rgba(242, 109, 79,0.4) 10%, rgba(242, 109, 79,0.4) 90%, transparent)",
          }} />

          {ev.schedule.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              style={{ display: "flex", gap: 24, marginBottom: 28, position: "relative" }}
            >
              {/* Time column */}
              <div style={{
                minWidth: 68, textAlign: "right",
                fontFamily: "monospace", fontSize: "0.72rem",
                color: "#F26D4F", letterSpacing: "0.08em", paddingTop: 14,
              }}>
                {item.time}
              </div>

              {/* Dot */}
              <div style={{
                position: "relative", display: "flex", alignItems: "flex-start", paddingTop: 14,
              }}>
                <motion.div
                  whileInView={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
                  transition={{ duration: 0.5, delay: i * 0.08 + 0.2 }}
                  viewport={{ once: true }}
                  style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: i === 0 ? "#10b981" : "#F26D4F",
                    border: `2px solid ${i === 0 ? "#10b981" : "#F26D4F"}`,
                    boxShadow: `0 0 12px ${i === 0 ? "#10b981" : "#F26D4F"}66`,
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* Content card */}
              <GlassCard style={{ flex: 1, padding: "16px 22px" }}>
                <div style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "1.3rem", color: "#fff", letterSpacing: "0.06em", marginBottom: 4 }}>
                  {item.act}
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                  {item.detail}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── GALLERY SECTION ──────────────────────────────────────────────────────────
function GallerySection({ ev }) {
  const [lightbox, setLightbox] = useState(null);
  const handleKeyDown = useCallback(e => { if (e.key === "Escape") setLightbox(null); }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section style={{ padding: "80px 5vw" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel text="Photos" />
          <h2 style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "#fff", margin: 0, letterSpacing: "0.04em" }}>
            Gallery
          </h2>
          <motion.div
            initial={{ width: 0 }} whileInView={{ width: 48 }}
            transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
            style={{ height: 2, background: "linear-gradient(to right, #F26D4F, #C9A24B)", margin: "16px auto 0", borderRadius: 2 }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {ev.gallery.map((item, i) => (
            <motion.div
              key={i}
              onClick={() => setLightbox(item)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ scale: 1.03 }}
              style={{
                aspectRatio: "4/3", borderRadius: 24, cursor: "pointer",
                overflow: "hidden", background: "#080808",
                border: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
              }}
            >
              <img
                src={item.img} alt={item.label} loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease, filter 0.5s ease", filter: "brightness(0.8)" }}
                onMouseEnter={e => { e.target.style.transform = "scale(1.08)"; e.target.style.filter = "brightness(1)"; }}
                onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.filter = "brightness(0.8)"; }}
              />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "20px 14px 12px",
                background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                fontSize: "0.7rem", color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.15em", textTransform: "uppercase",
              }}>
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            onClick={() => setLightbox(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(10px)" }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", damping: 22 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#111111", border: "1px solid rgba(242, 109, 79,0.3)", borderRadius: 24, overflow: "hidden", boxShadow: "0 0 120px rgba(242, 109, 79,0.18)", maxWidth: "90vw", maxHeight: "85vh" }}
            >
              <img src={lightbox.img} alt={lightbox.label} style={{ display: "block", maxWidth: "90vw", maxHeight: "75vh", objectFit: "contain", borderRadius: "24px 24px 0 0" }} />
              <div style={{ padding: "18px 28px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "1.4rem", color: "#fff", letterSpacing: "0.1em" }}>{lightbox.label}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", marginTop: 4, fontFamily: "monospace" }}>ESC or click to close</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── FAQ SECTION ──────────────────────────────────────────────────────────────
function FAQSection({ ev }) {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: "80px 5vw", background: "rgba(242, 109, 79,0.02)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel text="FAQ" />
          <h2 style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "#fff", margin: 0, letterSpacing: "0.04em" }}>
            Common Questions
          </h2>
          <motion.div
            initial={{ width: 0 }} whileInView={{ width: 48 }}
            transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
            style={{ height: 2, background: "linear-gradient(to right, #F26D4F, #C9A24B)", margin: "16px auto 0", borderRadius: 2 }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ev.faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <GlassCard style={{
                border: open === i ? "1px solid rgba(242, 109, 79,0.45)" : "1px solid rgba(242, 109, 79,0.18)",
                transition: "border-color 0.25s, box-shadow 0.25s",
                boxShadow: open === i ? "0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(242, 109, 79,0.12)" : undefined,
              }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: "100%", padding: "20px 24px",
                    background: "transparent", border: "none", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    gap: 16, textAlign: "left",
                  }}
                >
                  <span style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.5, fontFamily: "inherit" }}>
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ color: "#F26D4F", fontSize: "1.3rem", flexShrink: 0, lineHeight: 1 }}
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
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 24px 22px", color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", lineHeight: 1.75 }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── BOOKING FORM SECTION ─────────────────────────────────────────────────────
function BookingSection({ ev }) {
    const [form, setForm] = useState({
    name: "", email: "", phone: "", qty: 1, notes: "",
    dob: "", gender: "Woman", paymentTo: "7671836748 - Arjuna/ Tangy",
    upiName: "", upiId: "", paymentMethod: "Google Pay",
    attendedBefore: "Not yet, but can't wait.", cityPart: "",
    artistCollab: "", seatingPreference: "", instagram: ""
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
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
    if (Object.keys(errs).length === 0) {
      // Instead of showing payment modal, since they already paid via UPI manually:
      handlePaymentSuccess();
    }
  };

  const handlePaymentSuccess = async () => {
    setShowModal(false);
    setIsSubmitting(true);
    
    // Pass the event name automatically
        const result = await bookingService.submitBooking({
      ...form,
      eventName: ev.name,
      amountPaid: ev.price * form.qty
    });
    
    setIsSubmitting(false);
    if (result.success) {
      setSubmitSuccess(true);
            setForm({
        name: "", email: "", phone: "", qty: 1, notes: "",
        dob: "", gender: "Woman", paymentTo: "7671836748 - Arjuna/ Tangy",
        upiName: "", upiId: "", paymentMethod: "Google Pay",
        attendedBefore: "Not yet, but can't wait.", cityPart: "",
        artistCollab: "", seatingPreference: "", instagram: ""
      });
    } else {
      alert("Failed to submit booking. Please try again.");
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "13px 16px",
    background: "rgba(0,0,0,0.45)",
    border: `1px solid ${errors[field] ? "#ef4444" : "rgba(242, 109, 79,0.25)"}`,
    borderRadius: 8, color: "#fff", fontSize: "0.88rem",
    fontFamily: "inherit", outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s",
  });

  return (
    <section id="book-tickets" style={{ padding: "80px 5vw" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <SectionLabel text="Reserve Your Spot" />
          <h2 style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "#fff", margin: 0, letterSpacing: "0.04em" }}>
            Book Tickets
          </h2>
          <motion.div
            initial={{ width: 0 }} whileInView={{ width: 48 }}
            transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
            style={{ height: 2, background: "linear-gradient(to right, #F26D4F, #C9A24B)", margin: "16px auto 0", borderRadius: 2 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.3 }}
        >
          {submitSuccess ? (
            <GlassCard style={{ padding: "40px 32px", textAlign: "center", border: "1px solid rgba(16, 185, 129, 0.4)", boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 50px rgba(16, 185, 129, 0.15)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 14 }}>🎉</div>
              <h3 style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "2.2rem", color: "#10b981", margin: "0 0 8px", letterSpacing: "0.06em" }}>Booking Confirmed</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 28 }}>
                Your tickets for <strong>{ev.name}</strong> have been secured! A confirmation email containing your entry pass has been sent to your inbox.
              </p>

              {/* Redesigned Premium Ticket Mockup with QR Code */}
              <div style={{
                background: "linear-gradient(135deg, #111 0%, #080808 100%)",
                border: "1px dashed rgba(255, 255, 255, 0.15)",
                borderRadius: 16,
                padding: "24px",
                margin: "0 auto 28px",
                maxWidth: 420,
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 15px 30px rgba(0,0,0,0.4)"
              }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: "radial-gradient(circle, rgba(229, 192, 123, 0.1) 0%, transparent 75%)", pointerEvents: "none" }} />
                
                {/* Ticket Header */}
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: 14, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: "0.62rem", letterSpacing: "0.2em", color: "#C8FF2B", textTransform: "uppercase", fontWeight: 700 }}>Tangy Sessions Entry Pass</div>
                    <div style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "1.3rem", color: "#fff", marginTop: 4 }}>{ev.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.3)" }}>QTY</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>{form.qty}x</div>
                  </div>
                </div>

                {/* Ticket Details & QR Code */}
                <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ display: "block", fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Attendee</span>
                      <span style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 500 }}>{form.name || "Guest"}</span>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ display: "block", fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date & Time</span>
                      <span style={{ fontSize: "0.82rem", color: "#fff" }}>{ev.date} · {ev.time}</span>
                    </div>
                    <div>
                      <span style={{ display: "block", fontSize: "0.55rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Venue</span>
                      <span style={{ fontSize: "0.82rem", color: "#06b6d4" }}>📍 {ev.location}</span>
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div style={{
                    width: 90,
                    height: 90,
                    background: "#fff",
                    borderRadius: 8,
                    padding: 6,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
                  }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`TANGY_TICKET_${ev.id}_${form.email}_${form.qty}`)}`}
                      alt="Ticket Entry QR Code" 
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSubmitSuccess(false)}
                style={{
                  padding: "12px 24px", background: "transparent", border: "1px solid rgba(16, 185, 129, 0.5)",
                  color: "#10b981", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                  textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.8rem",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                Book Another Ticket
              </button>
            </GlassCard>
          ) : (
          <GlassCard style={{ padding: "40px 36px", border: "1px solid rgba(242, 109, 79,0.35)", boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 50px rgba(242, 109, 79,0.12)" }}>
            {/* Event info banner */}
            <div style={{
              background: "rgba(242, 109, 79,0.1)", border: "1px solid rgba(242, 109, 79,0.25)",
              borderRadius: 10, padding: "14px 18px", marginBottom: 28,
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10,
            }}>
              <div>
                <div style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "1.15rem", color: "#fff", letterSpacing: "0.06em" }}>{ev.name}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{ev.date} · {ev.location}</div>
              </div>
              <div style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "1.5rem", color: "#F26D4F" }}>₹{ev.price.toLocaleString()}</div>
            </div>

                        {/* Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Full Name *</label>
              <input
                type="text" placeholder="Your full name"
                value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: null })); }}
                style={fieldStyle("name")} onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = errors.name ? "#ef4444" : "rgba(242, 109, 79,0.25)"; }}
              />
              {errors.name && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.name}</div>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Email Address *</label>
              <input
                type="email" placeholder="your@email.com"
                value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: null })); }}
                style={fieldStyle("email")} onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = errors.email ? "#ef4444" : "rgba(242, 109, 79,0.25)"; }}
              />
              {errors.email && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.email}</div>}
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Phone Number (WhatsApp) *</label>
              <input
                type="tel" placeholder="+91 98765 43210"
                value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: null })); }}
                style={fieldStyle("phone")} onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = errors.phone ? "#ef4444" : "rgba(242, 109, 79,0.25)"; }}
              />
              {errors.phone && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.phone}</div>}
            </div>

            {/* DOB & Gender */}
            <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Date of Birth *</label>
                <input
                  type="text" placeholder="DD/MM/YYYY"
                  value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                  style={fieldStyle("dob")} onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = "rgba(242, 109, 79,0.25)"; }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Gender *</label>
                <select
                  value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
                  style={{...fieldStyle("gender"), appearance: "none", cursor: "pointer"}}
                >
                  <option value="Woman">Woman</option>
                  <option value="Man">Man</option>
                  <option value="Non-binary / Genderqueer">Non-binary / Genderqueer</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* City & Instagram */}
            <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Part of City?</label>
                <input
                  type="text" placeholder="e.g. Jubilee Hills"
                  value={form.cityPart} onChange={e => setForm(f => ({ ...f, cityPart: e.target.value }))}
                  style={fieldStyle("cityPart")} onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = "rgba(242, 109, 79,0.25)"; }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Instagram ID</label>
                <input
                  type="text" placeholder="@username"
                  value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                  style={fieldStyle("instagram")} onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = "rgba(242, 109, 79,0.25)"; }}
                />
              </div>
            </div>

            {/* Attended Before */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Attended Before? *</label>
              <select
                value={form.attendedBefore} onChange={e => setForm(f => ({ ...f, attendedBefore: e.target.value }))}
                style={{...fieldStyle("attendedBefore"), appearance: "none", cursor: "pointer"}}
              >
                <option value="Not yet, but can't wait.">Not yet, but can't wait.</option>
                <option value="Once or twice — loved it.">Once or twice — loved it.</option>
                <option value="Yes, I’m a Tangy regular!">Yes, I’m a Tangy regular!</option>
              </select>
            </div>

            {/* Quantity & Seating */}
            <div style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 180px" }}>
                <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Tickets (max 10) *</label>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <button
                    onClick={() => setForm(f => ({ ...f, qty: Math.max(1, f.qty - 1) }))}
                    style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(242, 109, 79,0.12)", border: "1px solid rgba(242, 109, 79,0.3)", color: "#fff", cursor: "pointer", fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >−</button>
                  <div style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "2.2rem", color: "#fff", minWidth: 36, textAlign: "center", lineHeight: 1 }}>{form.qty}</div>
                  <button
                    onClick={() => setForm(f => ({ ...f, qty: Math.min(10, f.qty + 1) }))}
                    style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(242, 109, 79,0.12)", border: "1px solid rgba(242, 109, 79,0.3)", color: "#fff", cursor: "pointer", fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >+</button>
                </div>
              </div>
              <div style={{ flex: "1 1 140px" }}>
                <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Seating Preference</label>
                <input
                  type="text" placeholder="Chairs/Mattress?"
                  value={form.seatingPreference} onChange={e => setForm(f => ({ ...f, seatingPreference: e.target.value }))}
                  style={fieldStyle("seatingPreference")} onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = "rgba(242, 109, 79,0.25)"; }}
                />
              </div>
            </div>

            {/* Artist Collab */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Are you an Artist? / Collab Ideas</label>
              <textarea
                placeholder="We love hearing your story!"
                value={form.artistCollab} onChange={e => setForm(f => ({ ...f, artistCollab: e.target.value }))}
                style={{ ...fieldStyle("artistCollab"), minHeight: "50px", resize: "vertical" }}
                onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = "rgba(242, 109, 79,0.25)"; }}
              />
            </div>

            {/* Additional Notes */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Anything else to share?</label>
              <textarea
                placeholder="Feedback, stories, etc..."
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                style={{ ...fieldStyle("notes"), minHeight: "50px", resize: "vertical" }}
                onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = "rgba(242, 109, 79,0.25)"; }}
              />
            </div>

            {/* Total price display */}            <div style={{
              background: "rgba(242, 109, 79,0.08)",
              border: "1px solid rgba(242, 109, 79,0.25)",
              borderRadius: 12, padding: "20px 22px", marginBottom: 26,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginBottom: 10 }}>
                <span>{form.qty} × ₹{ev.price.toLocaleString()} per ticket</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "1.2rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}>TOTAL</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.2, color: "#2A593E" }}
                  animate={{ scale: 1, color: "#F26D4F" }}
                  transition={{ duration: 0.3 }}
                  style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "2.4rem", letterSpacing: "0.04em" }}
                >
                  ₹{total.toLocaleString()}
                </motion.span>
              </div>
            </div>

                        {/* Payment Details Section */}
            <div style={{ background: "rgba(242, 109, 79,0.05)", border: "1px solid rgba(242, 109, 79,0.2)", borderRadius: 12, padding: "24px 20px", marginBottom: 26 }}>
              <h4 style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "1.4rem", color: "#2A593E", margin: "0 0 16px", letterSpacing: "0.05em" }}>Payment Details</h4>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginBottom: 16, lineHeight: 1.5 }}>
                Please make the payment of <strong>₹{total.toLocaleString()}</strong> to one of the following numbers and fill in the transaction details below.
              </p>
              
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Payment Made To *</label>
                <select
                  value={form.paymentTo} onChange={e => setForm(f => ({ ...f, paymentTo: e.target.value }))}
                  style={{...fieldStyle("paymentTo"), appearance: "none", cursor: "pointer"}}
                >
                  <option value="7671836748 - Arjuna/ Tangy">7671836748 - Arjuna/ Tangy</option>
                  <option value="8686299924 - Deepa">8686299924 - Deepa</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 120px" }}>
                  <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Your UPI Name *</label>
                  <input
                    type="text" placeholder="Name on your UPI App"
                    value={form.upiName} onChange={e => { setForm(f => ({ ...f, upiName: e.target.value })); setErrors(er => ({ ...er, upiName: null })); }}
                    style={fieldStyle("upiName")} onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = errors.upiName ? "#ef4444" : "rgba(242, 109, 79,0.25)"; }}
                  />
                  {errors.upiName && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.upiName}</div>}
                </div>
                <div style={{ flex: "1 1 120px" }}>
                  <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Payment Method *</label>
                  <select
                    value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                    style={{...fieldStyle("paymentMethod"), appearance: "none", cursor: "pointer"}}
                  >
                    <option value="Google Pay">Google Pay</option>
                    <option value="PhonePe">PhonePe</option>
                    <option value="UPI ID">UPI ID</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 4 }}>
                <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>UPI Transaction ID *</label>
                <input
                  type="text" placeholder="12-35 digit reference number"
                  value={form.upiId} onChange={e => { setForm(f => ({ ...f, upiId: e.target.value })); setErrors(er => ({ ...er, upiId: null })); }}
                  style={fieldStyle("upiId")} onFocus={e => { e.target.style.borderColor = "#F26D4F"; }} onBlur={e => { e.target.style.borderColor = errors.upiId ? "#ef4444" : "rgba(242, 109, 79,0.25)"; }}
                />
                {errors.upiId && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.upiId}</div>}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              id="proceed-to-payment"
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02, backgroundColor: "#D4AF37" } : {}}
              whileTap={!isSubmitting ? { scale: 0.97 } : {}}
              style={{
                width: "100%", padding: "17px 0",
                background: isSubmitting ? "rgba(242, 109, 79,0.5)" : "#F26D4F", 
                color: "#fff", border: "none",
                borderRadius: 8, cursor: isSubmitting ? "not-allowed" : "pointer", 
                fontFamily: "inherit",
                letterSpacing: "0.14em", textTransform: "uppercase",
                fontSize: "0.9rem", fontWeight: 700,
                boxShadow: "0 0 40px rgba(242, 109, 79,0.4)",
                transition: "background 0.2s",
                display: "flex", justifyContent: "center", alignItems: "center", gap: 10
              }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                  />
                  <span>Confirming Booking...</span>
                </>
              ) : (
                "Proceed to Payment →"
              )}
            </motion.button>

            <div style={{ marginTop: 16, textAlign: "center", fontSize: "0.7rem", color: "rgba(255,255,255,0.2)" }}>
              🔒 Secure checkout · Instant confirmation · Free cancellation within 48h
            </div>
          </GlassCard>
          )}
        </motion.div>
      </div>

      </section>
  );
}

// ─── CONTACT STRIP ────────────────────────────────────────────────────────────
function ContactStrip() {
  return (
    <section style={{ padding: "60px 5vw", background: "rgba(242, 109, 79,0.04)", borderTop: "1px solid rgba(242, 109, 79,0.12)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 28 }}>
        <div>
          <SectionLabel text="Contact" />
          <h3 style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "1.8rem", color: "#fff", margin: 0, letterSpacing: "0.06em" }}>
            Questions? We've Got You.
          </h3>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {[
            { label: "Email Us", value: "hello@tangysessions.in", href: "mailto:hello@tangysessions.in" },
            { label: "Instagram", value: "@tangysessions", href: "#" },
          ].map(({ label, value, href }) => (
            <a
              key={label}
              href={href}
              style={{
                padding: "12px 22px",
                background: "rgba(242, 109, 79,0.1)",
                border: "1px solid rgba(242, 109, 79,0.3)",
                borderRadius: 8, color: "#c4b5fd",
                textDecoration: "none", fontSize: "0.83rem",
                transition: "all 0.2s", display: "block",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(242, 109, 79,0.25)"; e.currentTarget.style.borderColor = "rgba(242, 109, 79,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(242, 109, 79,0.1)"; e.currentTarget.style.borderColor = "rgba(242, 109, 79,0.3)"; }}
            >
              <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
              {value}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

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
        <div style={{ fontSize: "4rem", marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontFamily: "'Instrument Serif', sans-serif", fontSize: "2.5rem", letterSpacing: "0.06em", margin: "0 0 12px" }}>Event Not Found</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: 32 }}>We couldn't find an event at this URL.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 28px", background: "#F26D4F", color: "#fff",
            border: "none", borderRadius: 6, cursor: "pointer",
            fontFamily: "inherit", fontSize: "0.9rem", letterSpacing: "0.1em",
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: "#080808", minHeight: "100vh",
      fontFamily: "'DM Sans', system-ui, sans-serif", color: "#fff",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { overflow-x: hidden; }
        input, button, select, textarea { font-family: inherit; }
        ::selection { background: rgba(242, 109, 79,0.35); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #F26D4F; border-radius: 2px; }

        .ed-about-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 768px) {
          .ed-about-grid {
            grid-template-columns: 1fr !important;
          }
          .ed-breadcrumbs {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .ed-nav-bar { padding: 0 16px !important; }
          .ed-meta-row { gap: 14px !important; }
        }
      `}</style>

      {/* ── Top navigation bar ───────────────────────────────────────────────── */}
      <nav className="ed-nav-bar" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(9,9,9,0.95)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(242, 109, 79,0.15)",
        padding: "0 5vw", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        {/* Logo */}
        <img
          src="/logo.svg" alt="Tangy Sessions"
          style={{ height: 38, width: "auto", minWidth: 80, cursor: "pointer" }}
          onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
        />

        {/* Breadcrumb - Hidden on Mobile */}
        <div className="ed-breadcrumbs" style={{ display: "flex", justifyContent: "center" }}>
          <Breadcrumb eventName={ev.name} />
        </div>

        {/* Back button */}
        <motion.button
          onClick={() => {
            navigate("/");
            setTimeout(() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" }), 120);
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            padding: "8px 18px",
            background: "transparent",
            border: "1px solid rgba(242, 109, 79,0.4)",
            borderRadius: 6, color: "#2A593E",
            cursor: "pointer", fontSize: "0.78rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            whiteSpace: "nowrap", transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(242, 109, 79,0.15)"; e.currentTarget.style.borderColor = "#F26D4F"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(242, 109, 79,0.4)"; }}
        >
          ← Back
        </motion.button>
      </nav>

      {/* Spacer for fixed nav */}
      <div style={{ height: 64 }} />

      {/* ── Page sections ────────────────────────────────────────────────────── */}
      <EventHero ev={ev} />
      <AboutEvent ev={ev} />
      <ScheduleSection ev={ev} />
      <GallerySection ev={ev} />
      <FAQSection ev={ev} />
      <BookingSection ev={ev} />
      <ContactStrip />

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer style={{
        background: "linear-gradient(135deg, rgba(6,6,10,0.9) 0%, rgba(8,8,16,0.8) 100%)",
        borderTop: "1px solid rgba(242, 109, 79,0.12)",
        padding: "32px 5vw",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.73rem" }}>© 2025 Tangy Sessions. All rights reserved.</div>
        <div style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.73rem" }}>Bansilal Stepwell, Hyderabad</div>
      </footer>
    </div>
  );
}
