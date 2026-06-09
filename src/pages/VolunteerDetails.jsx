import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { volunteerService } from "../services/volunteerService";
import VolunteerForm from "../components/VolunteerForm";

const GlassCard = ({ children, style, className }) => (
  <div className={className} style={{
    background: "linear-gradient(135deg, rgba(8,8,12,0.85) 0%, rgba(8,8,12,0.65) 100%)",
    backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(124,58,237,0.2)", borderRadius: 16,
    boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
    ...style
  }}>
    {children}
  </div>
);

const SectionLabel = ({ text }) => (
  <div style={{
    display: "inline-block", padding: "6px 12px", background: "rgba(124,58,237,0.15)",
    border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20, color: "#a78bfa",
    fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16
  }}>
    {text}
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

  // Form State
  const [form, setForm] = useState({ name: "", email: "", phone: "", dob: "", why: "", team: ROLES[0].title, experience: "", social: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Interaction States
  const [openFaq, setOpenFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const scrollToApply = () => {
    document.getElementById("apply-section").scrollIntoView({ behavior: "smooth" });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required";
    if (!form.phone.match(/^[+\d\s\-()]{7,15}$/)) errs.phone = "Valid phone required";
    if (!form.dob.trim()) errs.dob = "Required";
    if (!form.why.trim() || form.why.trim().length < 20) errs.why = "Please provide more detail (min 20 chars)";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    const result = await volunteerService.submitApplication(form);
    setIsSubmitting(false);

    if (result.success) {
      setSubmitSuccess(true);
    } else {
      alert("Submission failed. Please try again later.");
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "13px 16px",
    background: "rgba(0,0,0,0.45)",
    border: `1px solid ${errors[field] ? "#ef4444" : "rgba(124,58,237,0.25)"}`,
    borderRadius: 8, color: "#fff", fontSize: "0.85rem",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    transition: "all 0.2s"
  });

  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>
      
      {/* Navigation Bar overlay (simplified for this page) */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "20px 5vw", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/logo.svg" alt="Tangy" style={{ height: 38, cursor: "pointer" }} onClick={() => navigate("/")} />
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</span> <span style={{ margin: "0 8px" }}>›</span> Volunteer
          </div>
        </div>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 5vw 60px", position: "relative", textAlign: "center" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0, pointerEvents: "none" }} />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <SectionLabel text="Join The Tangy Crew" />
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem, 8vw, 6rem)", lineHeight: 1, margin: "0 0 24px", letterSpacing: "0.04em", textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            BECOME PART OF THE <span style={{ color: "#7c3aed" }}>MAGIC</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px" }}>
            Become part of the team that creates unforgettable experiences and helps shape the Tangy Sessions community.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button onClick={scrollToApply} whileHover={{ scale: 1.05, backgroundColor: "#6d28d9" }} whileTap={{ scale: 0.95 }}
              style={{ padding: "16px 32px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 30, cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", boxShadow: "0 10px 30px rgba(124,58,237,0.4)" }}>
              Apply Now
            </motion.button>
            <motion.button onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })} whileHover={{ scale: 1.05, borderColor: "rgba(124,58,237,0.8)" }} whileTap={{ scale: 0.95 }}
              style={{ padding: "16px 32px", background: "transparent", color: "#fff", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 30, cursor: "pointer", fontFamily: "inherit", fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ─── ABOUT VOLUNTEERING ─── */}
      <section id="about" style={{ padding: "100px 5vw", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel text="Why Volunteer?" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", marginBottom: 40 }}>MORE THAN JUST HELPING OUT</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            {[
              { t: "Meet Creatives", d: "Connect with artists, organizers, and music lovers." },
              { t: "Learn Production", d: "Get hands-on experience running live events." },
              { t: "Build Community", d: "Become part of a growing family of passionate individuals." },
              { t: "Gain Experience", d: "Build your resume with real-world operations." }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard style={{ padding: 30, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#a78bfa", margin: "0 0 10px" }}>{item.t}</h3>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>{item.d}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT MAKES TANGY DIFFERENT? ─── */}
      <section style={{ padding: "100px 5vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <SectionLabel text="The Tangy Difference" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", marginBottom: 50, textAlign: "center" }}>NOT YOUR AVERAGE EVENT</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
            <GlassCard style={{ padding: 40, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
              <h3 style={{ color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.9rem", marginBottom: 24 }}>Traditional Events</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 2.5 }}>
                <li>❌ Just attend</li>
                <li>❌ Leave immediately after</li>
                <li>❌ Disconnected from organizers</li>
              </ul>
            </GlassCard>
            
            <GlassCard style={{ padding: 40, border: "1px solid rgba(124,58,237,0.4)", boxShadow: "0 0 40px rgba(124,58,237,0.15)" }}>
              <h3 style={{ color: "#a78bfa", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.9rem", marginBottom: 24 }}>Tangy Sessions</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#fff", fontSize: "1rem", lineHeight: 2.5 }}>
                <li>✨ Create magical experiences</li>
                <li>✨ Meet and interact with artists</li>
                <li>✨ Build lifelong friendships</li>
                <li>✨ Learn end-to-end event ops</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ─── VOLUNTEER BENEFITS ─── */}
      <section style={{ padding: "100px 5vw", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel text="The Perks" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", marginBottom: 50 }}>WHAT YOU GET</h2>
          
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            {["Free Event Entry", "Exclusive Merch Kit", "Backstage Access", "Networking", "Behind The Scenes", "Community Recogition"].map((perk, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05, y: -5 }} style={{
                padding: "20px 30px", background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: 40, color: "#e9d5ff", fontSize: "0.95rem", fontWeight: 600, letterSpacing: "0.05em"
              }}>
                {perk}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VOLUNTEER ROLES ─── */}
      <section style={{ padding: "100px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel text="Find Your Fit" />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem" }}>VOLUNTEER ROLES</h2>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {ROLES.map((role, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <GlassCard style={{ padding: 30, height: "100%" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{role.icon}</div>
                  <h3 style={{ margin: "0 0 10px", fontSize: "1.2rem", color: "#fff" }}>{role.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>{role.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DAY IN THE LIFE TIMELINE ─── */}
      <section style={{ padding: "100px 5vw", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel text="What to Expect" />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem" }}>A DAY IN THE LIFE</h2>
          </div>
          
          <div style={{ position: "relative", paddingLeft: 40 }}>
            <div style={{ position: "absolute", left: 15, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom, #7c3aed, #06b6d4)" }} />
            {TIMELINE.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                style={{ position: "relative", marginBottom: i === TIMELINE.length - 1 ? 0 : 40 }}>
                <div style={{ position: "absolute", left: -32, top: 2, width: 14, height: 14, borderRadius: "50%", background: "#050505", border: "3px solid #06b6d4", zIndex: 2 }} />
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "#a78bfa", marginBottom: 4 }}>{item.time}</div>
                <div style={{ fontSize: "1.1rem", color: "#fff" }}>{item.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMUNITY IMPACT & STATS ─── */}
      <section style={{ padding: "100px 5vw" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel text="Our Impact" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", marginBottom: 60 }}>GROWING TOGETHER</h2>
          
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 40 }}>
            {[
              { num: "50+", label: "Volunteers" },
              { num: "10+", label: "Events Hosted" },
              { num: "500+", label: "Attendees" },
              { num: "100+", label: "Community Members" }
            ].map((stat, i) => (
              <div key={i}>
                <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5, delay: i * 0.1 }}
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4.5rem", color: "#7c3aed", lineHeight: 1 }}>
                  {stat.num}
                </motion.div>
                <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginTop: 10 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: "100px 5vw", background: "#0a0a0a", overflow: "hidden" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel text="Word on the Street" />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", marginBottom: 40 }}>VOLUNTEER STORIES</h2>
          
          <GlassCard style={{ padding: "60px 40px", position: "relative" }}>
            <div style={{ color: "#f59e0b", fontSize: "1.5rem", marginBottom: 20 }}>★★★★★</div>
            <AnimatePresence mode="wait">
              <motion.div key={activeTestimonial} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p style={{ fontSize: "1.4rem", fontStyle: "italic", color: "#fff", lineHeight: 1.6, margin: "0 0 20px" }}>
                  {["I came for one event and stayed for the community.", "The best networking opportunity I've experienced.", "I learned more in one event than months of theory."][activeTestimonial]}
                </p>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 30 }}>
              {[0, 1, 2].map(i => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  style={{ width: 10, height: 10, borderRadius: "50%", border: "none", cursor: "pointer", background: activeTestimonial === i ? "#7c3aed" : "rgba(255,255,255,0.2)", transition: "background 0.3s" }}
                />
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding: "100px 5vw" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel text="Got Questions?" />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem" }}>FAQ</h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FAQS.map((faq, i) => (
              <GlassCard key={i} style={{ padding: 0, overflow: "hidden" }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "20px 24px", background: "transparent", border: "none", color: "#fff", textAlign: "left", fontSize: "1rem", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {faq.q}
                  <span style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.3s", color: "#7c3aed" }}>▼</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 24px 24px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontSize: "0.9rem" }}>
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

      {/* ─── APPLICATION FORM SECTION ─── */}
      <section id="apply-section" style={{ padding: "100px 5vw", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <SectionLabel text="Step Into The Magic" />
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem" }}>APPLY TO JOIN THE CREW</h2>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <VolunteerForm />
          </motion.div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ padding: "120px 5vw", textAlign: "center", borderTop: "1px solid rgba(124,58,237,0.2)" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 6vw, 5rem)", margin: "0 0 20px" }}>READY TO CREATE MAGIC WITH US?</h2>
        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Join a community of creators, music lovers, organizers, and dreamers building unforgettable experiences together.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <motion.button onClick={scrollToApply} whileHover={{ scale: 1.05 }} style={{ padding: "16px 36px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 30, cursor: "pointer", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Apply Now
          </motion.button>
          <motion.button onClick={() => { navigate("/"); setTimeout(() => document.getElementById("events")?.scrollIntoView(), 100); }} whileHover={{ scale: 1.05 }} style={{ padding: "16px 36px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 30, cursor: "pointer", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Explore Events
          </motion.button>
        </div>
      </section>

    </div>
  );
}
