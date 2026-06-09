import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VolunteerForm from "../components/VolunteerForm";

const GlassCard = ({ children, style, className, whileHover, transition }) => (
  <motion.div className={className} whileHover={whileHover} transition={transition} style={{
    background: "linear-gradient(135deg, rgba(16,16,24,0.7) 0%, rgba(16,16,24,0.4) 100%)",
    backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(124,58,237,0.2)", borderRadius: 16,
    boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
    ...style
  }}>
    {children}
  </motion.div>
);

const SectionLabel = ({ text }) => (
  <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{
    display: "inline-block", padding: "6px 12px", background: "rgba(124,58,237,0.15)",
    border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20, color: "#e9d5ff",
    fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16,
    boxShadow: "0 0 15px rgba(124,58,237,0.4)"
  }}>
    {text}
  </motion.div>
);

// ─── EFFECTS COMPONENTS ───────────────────────────────────────────────────

const MouseGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 9999,
      background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(124,58,237,0.08), transparent 40%)`
    }} />
  );
};

const FloatingParticles = () => (
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", pointerEvents: "none" }}>
    {[...Array(20)].map((_, i) => (
      <motion.div key={i}
        animate={{ y: ["0vh", "-100vh"], x: [0, Math.random() * 100 - 50], opacity: [0, 0.5, 0] }}
        transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
        style={{
          position: "absolute", bottom: "-10%", left: `${Math.random() * 100}%`,
          width: Math.random() * 4 + 2, height: Math.random() * 4 + 2,
          background: "#a78bfa", borderRadius: "50%", filter: "blur(2px)",
          boxShadow: "0 0 10px #7c3aed"
        }}
      />
    ))}
  </div>
);

// ─── DATA OBJECTS ─────────────────────────────────────────────────────────────
const ROLES = [
  { title: "Registration Team", desc: "Check-ins, ticket verification, and guest assistance.", icon: "🎫" },
  { title: "Guest Experience", desc: "Help attendees, venue support, and information desk.", icon: "🤝" },
  { title: "Content Team", desc: "Social media content, reels, and stories.", icon: "📱" },
  { title: "Photo & Video", desc: "Capture moments and provide full event coverage.", icon: "📸" },
  { title: "Logistics Team", desc: "Venue setup, coordination, and operations.", icon: "🏗️" },
  { title: "Stage Assistance", desc: "Artist support and technical coordination.", icon: "🎸" },
  { title: "Community Team", desc: "Community engagement and volunteer coordination.", icon: "🌍" },
];

const TIMELINE = [
  { time: "3:00 PM", text: "Team Check-In" },
  { time: "4:00 PM", text: "Venue Setup" },
  { time: "5:00 PM", text: "Volunteer Briefing" },
  { time: "6:00 PM", text: "Guest Arrival" },
  { time: "7:00 PM", text: "Event Begins" },
  { time: "10:00 PM", text: "Networking" },
  { time: "11:00 PM", text: "Wrap Up" },
];

const FAQS = [
  { q: "Is volunteering paid?", a: "No, volunteering is unpaid, but you receive free entry, backstage access, a merch kit, and priceless networking opportunities." },
  { q: "Do volunteers get free entry?", a: "Absolutely! When you volunteer, your entry to the Tangy Sessions event is completely free." },
  { q: "Can students apply?", a: "Yes! Students are highly encouraged to apply. It's a great way to gain real-world event production experience." },
  { q: "Do I need prior experience?", a: "Not at all. We value enthusiasm, reliability, and a positive attitude over prior experience. We'll train you on the day!" },
  { q: "How much time is required?", a: "Typically, volunteers are needed from 3:00 PM to 11:00 PM on the day of the event." },
  { q: "Can I volunteer for multiple events?", a: "Yes! Many of our volunteers join our core community and help out at multiple events." },
  { q: "Will I receive a certificate?", a: "Yes, upon request we provide a certificate of appreciation detailing your role and contribution." }
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function VolunteerDetails() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const [openFaq, setOpenFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const scrollToApply = () => {
    document.getElementById("apply-section").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "#fff", overflowX: "hidden", position: "relative" }}>
      <MouseGlow />
      
      {/* Navigation Bar overlay */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "20px 5vw", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/logo.svg" alt="Tangy" style={{ height: 38, cursor: "pointer" }} onClick={() => navigate("/")} />
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</span> <span style={{ margin: "0 8px" }}>›</span> Volunteer
          </div>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 5vw 60px", textAlign: "center" }}>
        <motion.div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, y: heroY, scale: heroScale, zIndex: 0 }}>
          {/* Heritage Stepwell / Golden Hour Imagery */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
          {/* Vignette Overlay */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(5,5,5,0.4), rgba(5,5,5,0.9)), radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(5,5,5,0.8) 100%)" }} />
        </motion.div>
        
        <FloatingParticles />

        <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }} style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <SectionLabel text="Join The Tangy Crew" />
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem, 8vw, 6.5rem)", lineHeight: 1, margin: "0 0 24px", letterSpacing: "0.04em", textShadow: "0 20px 40px rgba(0,0,0,0.8)" }}>
            BECOME PART OF THE <span style={{ background: "-webkit-linear-gradient(45deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 20px rgba(168,85,247,0.6))" }}>MAGIC</span>
          </h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            Become part of the team that creates unforgettable experiences and helps shape the Tangy Sessions community.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button onClick={scrollToApply} whileHover={{ scale: 1.05, backgroundColor: "#6d28d9", boxShadow: "0 0 40px rgba(124,58,237,0.6)" }} whileTap={{ scale: 0.95 }}
              style={{ padding: "16px 36px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 30, cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", boxShadow: "0 10px 30px rgba(124,58,237,0.4)", transition: "box-shadow 0.3s" }}>
              Apply Now
            </motion.button>
            <motion.button onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })} whileHover={{ scale: 1.05, borderColor: "rgba(124,58,237,0.8)", background: "rgba(124,58,237,0.1)" }} whileTap={{ scale: 0.95 }}
              style={{ padding: "16px 36px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", color: "#fff", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 30, cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ─── ABOUT VOLUNTEERING (Fixed Background) ─── */}
      <section id="about" style={{ padding: "120px 5vw", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('https://images.unsplash.com/photo-1623062369408-545bd4a22b07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", opacity: 0.15, zIndex: 0 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, #050505, transparent, #050505)", zIndex: 0 }} />
        
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <SectionLabel text="Why Volunteer?" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 4rem)", marginBottom: 60, textShadow: "0 10px 20px rgba(0,0,0,0.5)" }}>MORE THAN JUST HELPING OUT</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { t: "Meet Creatives", d: "Connect with artists, organizers, and music lovers." },
              { t: "Learn Production", d: "Get hands-on experience running live events." },
              { t: "Build Community", d: "Become part of a growing family of passionate individuals." },
              { t: "Gain Experience", d: "Build your resume with real-world operations." }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                <GlassCard whileHover={{ y: -10, boxShadow: "0 30px 60px rgba(124,58,237,0.2)" }} style={{ padding: "40px 30px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#a78bfa", margin: "0 0 16px", textShadow: "0 0 10px rgba(167,139,250,0.3)" }}>{item.t}</h3>
                  <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>{item.d}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW: VENUES SECTION ─── */}
      <section style={{ padding: "120px 5vw", background: "linear-gradient(to bottom, #050505, #0a0a0a)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel text="Our Spaces" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 4rem)", marginBottom: 60 }}>MAGICAL VENUES</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 30 }}>
            {[
              { name: "Bansilalpet Stepwell", img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { name: "Bapu Ghat Stepwell", img: "https://images.unsplash.com/photo-1598094628860-2e06180630b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
              { name: "Maha Laqa Stepwell", img: "https://images.unsplash.com/photo-1588691512401-49b497047f3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
            ].map((venue, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ position: "relative", height: 400, borderRadius: 20, overflow: "hidden", cursor: "pointer" }}>
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }} style={{ width: "100%", height: "100%", backgroundImage: `url(${venue.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: 30, left: 30, right: 30, pointerEvents: "none" }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", margin: 0, textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>{venue.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VOLUNTEER BENEFITS (Abstract Gradients) ─── */}
      <section style={{ padding: "120px 5vw", position: "relative", overflow: "hidden" }}>
        <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", top: "-20%", left: "-10%", width: "70vw", height: "70vw", background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0 }} />
        <motion.div animate={{ rotate: -360, scale: [1, 1.3, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", bottom: "-30%", right: "-10%", width: "80vw", height: "80vw", background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", filter: "blur(100px)", zIndex: 0 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <SectionLabel text="The Perks" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 4rem)", marginBottom: 60 }}>WHAT YOU GET</h2>
          
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
            {["Free Event Entry", "Exclusive Merch Kit", "Backstage Access", "Networking", "Behind The Scenes", "Community Recognition"].map((perk, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05, y: -10, boxShadow: "0 20px 40px rgba(168,85,247,0.3)" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                style={{
                  padding: "24px 36px", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)",
                  border: "1px solid rgba(168,85,247,0.3)", borderRadius: 40, color: "#e9d5ff",
                  fontSize: "1rem", fontWeight: 600, letterSpacing: "0.05em", boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}>
                {perk}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VOLUNTEER ROLES (Behind the scenes) ─── */}
      <section style={{ padding: "120px 5vw", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08, zIndex: 0 }} />
        
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <SectionLabel text="Find Your Fit" />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 4rem)" }}>VOLUNTEER ROLES</h2>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 30 }}>
            {ROLES.map((role, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1 }}>
                <GlassCard whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(124,58,237,0.2)" }} style={{ padding: 40, height: "100%" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 20, filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))" }}>{role.icon}</div>
                  <h3 style={{ margin: "0 0 12px", fontSize: "1.4rem", color: "#fff", letterSpacing: "0.05em" }}>{role.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>{role.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DAY IN THE LIFE TIMELINE (Blurred Crowd) ─── */}
      <section style={{ padding: "120px 5vw", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')", backgroundSize: "cover", backgroundPosition: "center", filter: "blur(20px)", transform: "scale(1.1)", opacity: 0.3, zIndex: 0 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(5,5,5,0.8)", zIndex: 0 }} />
        
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <SectionLabel text="What to Expect" />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 4rem)" }}>A DAY IN THE LIFE</h2>
          </div>
          
          <div style={{ position: "relative", paddingLeft: 50 }}>
            <div style={{ position: "absolute", left: 20, top: 10, bottom: 10, width: 2, background: "linear-gradient(to bottom, #7c3aed, #ec4899)" }} />
            {TIMELINE.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: i * 0.1 }}
                style={{ position: "relative", marginBottom: i === TIMELINE.length - 1 ? 0 : 60 }}>
                <motion.div whileHover={{ scale: 1.5 }} style={{ position: "absolute", left: -39, top: 2, width: 18, height: 18, borderRadius: "50%", background: "#050505", border: "4px solid #ec4899", zIndex: 2, boxShadow: "0 0 20px #ec4899" }} />
                <GlassCard style={{ padding: "24px 32px", display: "inline-block", minWidth: 300 }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fbcfe8", marginBottom: 4, letterSpacing: "0.05em" }}>{item.time}</div>
                  <div style={{ fontSize: "1.15rem", color: "#fff", fontWeight: 600 }}>{item.text}</div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY IMPACT (Collage Background) ─── */}
      <section style={{ padding: "120px 5vw", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(2, 1fr)", opacity: 0.15, filter: "blur(3px)", zIndex: 0 }}>
          {[
            "https://images.unsplash.com/photo-1470229722913-7c090b332da8?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1540039155733-d7696d4eb98e?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=400&q=80"
          ].map((img, i) => <div key={i} style={{ backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }} />)}
        </div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, #050505, rgba(5,5,5,0.7), #050505)", zIndex: 0 }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <SectionLabel text="Our Impact" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 4rem)", marginBottom: 80 }}>GROWING TOGETHER</h2>
          
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 40 }}>
            {[
              { num: "50+", label: "Volunteers" },
              { num: "10+", label: "Events Hosted" },
              { num: "500+", label: "Attendees" },
              { num: "100+", label: "Community Members" }
            ].map((stat, i) => (
              <div key={i} style={{ padding: 20 }}>
                <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: "spring", bounce: 0.6, delay: i * 0.15 }}
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5.5rem", background: "-webkit-linear-gradient(45deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, filter: "drop-shadow(0 0 20px rgba(168,85,247,0.4))" }}>
                  {stat.num}
                </motion.div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", marginTop: 16 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS (Gradient Mesh Background) ─── */}
      <section style={{ padding: "120px 5vw", position: "relative", overflow: "hidden" }}>
        {/* Animated 4-color gradient mesh */}
        <motion.div animate={{ rotate: [0, 90, 180, 270, 360] }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", background: "conic-gradient(from 0deg, rgba(124,58,237,0.1), rgba(236,72,153,0.1), rgba(245,158,11,0.1), rgba(79,70,229,0.1), rgba(124,58,237,0.1))", filter: "blur(100px)", zIndex: 0 }} />
        
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <SectionLabel text="Word on the Street" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 4rem)", marginBottom: 60 }}>VOLUNTEER STORIES</h2>
          
          <GlassCard style={{ padding: "80px 60px", position: "relative" }}>
            <div style={{ color: "#f59e0b", fontSize: "2rem", marginBottom: 30, letterSpacing: "0.2em" }}>★★★★★</div>
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                <p style={{ fontSize: "1.6rem", fontStyle: "italic", color: "#fff", lineHeight: 1.6, margin: "0 0 30px", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                  "{["I came for one event and stayed for the community.", "The best networking opportunity I've experienced.", "I learned more in one event than months of theory."][activeTestimonial]}"
                </p>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 40 }}>
              {[0, 1, 2].map(i => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  style={{ width: 12, height: 12, borderRadius: "50%", border: "none", cursor: "pointer", background: activeTestimonial === i ? "#a855f7" : "rgba(255,255,255,0.2)", transition: "all 0.3s", transform: activeTestimonial === i ? "scale(1.3)" : "scale(1)" }}
                />
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding: "120px 5vw", position: "relative" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <SectionLabel text="Got Questions?" />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 4rem)" }}>FAQ</h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {FAQS.map((faq, i) => (
              <GlassCard key={i} whileHover={{ borderColor: "rgba(168,85,247,0.5)" }} style={{ padding: 0, overflow: "hidden", transition: "border-color 0.3s" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "24px 30px", background: "transparent", border: "none", color: "#fff", textAlign: "left", fontSize: "1.1rem", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {faq.q}
                  <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} style={{ color: "#a855f7", fontSize: "1.2rem" }}>▼</motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 30px 30px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: "1rem" }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APPLICATION FORM SECTION (Premium Glass) ─── */}
      <section id="apply-section" style={{ padding: "120px 5vw", position: "relative", overflow: "hidden" }}>
        {/* Subtle noise texture over gradient background */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(180deg, #050505 0%, #1a0b2e 50%, #050505 100%)", zIndex: 0 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.03%22/%3E%3C/svg%3E')", zIndex: 0, pointerEvents: "none" }} />
        
        <div style={{ maxWidth: 850, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel text="Step Into The Magic" />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 4rem)", textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>APPLY TO JOIN THE CREW</h2>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div style={{ position: "relative" }}>
              {/* Glowing animated border effect around the form */}
              <motion.div animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", top: -2, left: -2, right: -2, bottom: -2, background: "linear-gradient(90deg, #7c3aed, #ec4899, #7c3aed, #06b6d4, #7c3aed)", backgroundSize: "400% 400%", borderRadius: 20, zIndex: -1, filter: "blur(10px)", opacity: 0.5 }} />
              
              <VolunteerForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ padding: "150px 5vw", textAlign: "center", position: "relative", borderTop: "1px solid rgba(124,58,237,0.15)", background: "#050505" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem, 6vw, 5.5rem)", margin: "0 0 24px", letterSpacing: "0.02em" }}>READY TO CREATE <span style={{ color: "#ec4899" }}>MAGIC</span> WITH US?</h2>
        <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.7)", maxWidth: 700, margin: "0 auto 50px", lineHeight: 1.6 }}>
          Join a community of creators, music lovers, organizers, and dreamers building unforgettable experiences together.
        </p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <motion.button onClick={scrollToApply} whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(236,72,153,0.5)" }} style={{ padding: "18px 40px", background: "linear-gradient(45deg, #a855f7, #ec4899)", color: "#fff", border: "none", borderRadius: 40, cursor: "pointer", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.95rem" }}>
            Apply Now
          </motion.button>
          <motion.button onClick={() => { navigate("/"); setTimeout(() => document.getElementById("events")?.scrollIntoView(), 100); }} whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.1)" }} style={{ padding: "18px 40px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 40, cursor: "pointer", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", fontSize: "0.95rem" }}>
            Explore Events
          </motion.button>
        </div>
      </section>

    </div>
  );
}
