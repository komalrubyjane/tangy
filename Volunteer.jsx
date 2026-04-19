import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = [
  { id: "crew", label: "Crew", icon: "🎛️", desc: "Stage setup, logistics & tech operations" },
  { id: "hospitality", label: "Hospitality", icon: "🤝", desc: "Guest relations & onboarding experience" },
  { id: "security", label: "Security", icon: "🛡️", desc: "Crowd safety & perimeter management" },
  { id: "social", label: "Social Media", icon: "📸", desc: "Live coverage, stories & event photography" },
  { id: "food", label: "Food & Beverage", icon: "🥂", desc: "Bar, snacks & guest refreshments" },
  { id: "artist", label: "Artist Liaison", icon: "🎧", desc: "Backstage artist support & coordination" },
];

const EVENTS_LIST = [
  "Tangy Sessions Vol. 1 — Aug 15",
  "Tangy Sessions Vol. 2 — Sep 20",
  "Tangy Sessions: Solstice — Dec 21",
];

const STEPS = ["Your Info", "Role & Event", "Review"];

export default function Volunteer({ toast }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", age: "",
    role: "", event: "",
    why: "", experience: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (s) => {
    const errs = {};
    if (s === 0) {
      if (!form.name.trim()) errs.name = "Name is required";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required";
      if (!form.phone.match(/^\d{10}$/)) errs.phone = "Enter a 10-digit phone number";
      if (!form.age || parseInt(form.age) < 18) errs.age = "Must be 18 or older to volunteer";
    }
    if (s === 1) {
      if (!form.role) errs.role = "Select a role";
      if (!form.event) errs.event = "Select an event";
      if (!form.why.trim() || form.why.trim().length < 20) errs.why = "Tell us a bit more (min 20 chars)";
    }
    if (s === 2) {
      if (!form.terms) errs.terms = "You must agree to the terms";
    }
    return errs;
  };

  const next = () => {
    const errs = validate(step);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStep(s => s + 1);
    setErrors({});
  };

  const back = () => { setStep(s => s - 1); setErrors({}); };

  const submit = () => {
    const errs = validate(2);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitted(true);
    toast && toast("Volunteer application submitted! We'll reach out shortly. 🎉", "success");
  };

  const inp = (field) => ({
    width: "100%", padding: "12px 14px",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${errors[field] ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 8, color: "#fff", fontSize: "0.88rem",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    transition: "all 0.2s",
  });

  const selectedRole = ROLES.find(r => r.id === form.role);

  if (submitted) {
    return (
      <section id="volunteer" style={{ background: "transparent", padding: "100px 5vw" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          style={{
            maxWidth: 560, margin: "0 auto", textAlign: "center",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 20, padding: "60px 40px",
            boxShadow: "0 0 60px rgba(16,185,129,0.08)",
          }}>
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
            style={{ fontSize: "4rem", marginBottom: 20 }}>
            🎉
          </motion.div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", color: "#fff", letterSpacing: "0.05em" }}>You're In!</div>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 12, lineHeight: 1.7, fontSize: "0.9rem" }}>
            Thanks, <strong style={{ color: "#7c3aed" }}>{form.name}</strong>! Your application for the{" "}
            <strong style={{ color: "#06b6d4" }}>{selectedRole?.label}</strong> role has been received.
            We'll send a confirmation to <strong style={{ color: "#fff" }}>{form.email}</strong>.
          </p>
          <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 10 }}>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 4 }}>Application ID</div>
            <div style={{ fontFamily: "monospace", color: "#7c3aed", letterSpacing: "0.15em" }}>VOL-{Math.random().toString(36).toUpperCase().slice(2, 10)}</div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="volunteer" style={{ background: "transparent", padding: "100px 5vw", perspective: "1000px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ fontSize: "0.7rem", letterSpacing: "0.35em", color: "#7c3aed", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 14 }}>Join Us</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#fff", margin: 0, letterSpacing: "0.05em" }}>Volunteer</h2>
        <motion.div initial={{ width: 0 }} whileInView={{ width: 48 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}
          style={{ height: 2, background: "linear-gradient(to right, #7c3aed, #06b6d4)", margin: "18px auto 0", borderRadius: 2 }} />
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem", marginTop: 20, maxWidth: 500, margin: "20px auto 0", lineHeight: 1.7 }}>
          Be part of the magic behind Tangy Sessions. Volunteers get free entry, backstage access, and merch.
        </p>
      </motion.div>

      {/* Perks row */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 60 }}>
        {[["🎟️", "Free Entry"], ["🎒", "Merch Kit"], ["🎭", "Backstage"], ["🤝", "Network"]].map(([icon, label]) => (
          <motion.div key={label}
            whileHover={{ scale: 1.05, borderColor: "rgba(124,58,237,0.4)" }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 40, fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>
            <span>{icon}</span><span>{label}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ maxWidth: 580, margin: "0 auto", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 20, overflow: "hidden" }}>

        {/* Step progress bar */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{
              flex: 1, padding: "16px 10px", textAlign: "center", fontSize: "0.72rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: i === step ? "#fff" : i < step ? "#7c3aed" : "rgba(255,255,255,0.25)",
              borderBottom: `2px solid ${i === step ? "#7c3aed" : i < step ? "rgba(124,58,237,0.3)" : "transparent"}`,
              transition: "all 0.3s",
              cursor: i < step ? "pointer" : "default",
            }} onClick={() => i < step && setStep(i)}>
              {i < step ? "✓ " : `${i + 1}. `}{s}
            </div>
          ))}
        </div>

        <div style={{ padding: 36 }}>
          <AnimatePresence mode="wait">

            {/* ── Step 0: Personal Info ── */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Full Name</label>
                  <input placeholder="Your name" value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: null })); }}
                    style={inp("name")}
                    onFocus={e => e.target.style.borderColor = "#7c3aed"}
                    onBlur={e => e.target.style.borderColor = errors.name ? "#ef4444" : "rgba(255,255,255,0.1)"}
                  />
                  {errors.name && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors.name}</div>}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Email</label>
                  <input placeholder="you@email.com" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: null })); }}
                    style={inp("email")}
                    onFocus={e => e.target.style.borderColor = "#7c3aed"}
                    onBlur={e => e.target.style.borderColor = errors.email ? "#ef4444" : "rgba(255,255,255,0.1)"}
                  />
                  {errors.email && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors.email}</div>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Phone</label>
                    <input placeholder="10-digit number" value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })); setErrors(er => ({ ...er, phone: null })); }}
                      style={inp("phone")}
                      onFocus={e => e.target.style.borderColor = "#7c3aed"}
                      onBlur={e => e.target.style.borderColor = errors.phone ? "#ef4444" : "rgba(255,255,255,0.1)"}
                    />
                    {errors.phone && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors.phone}</div>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Age</label>
                    <input placeholder="Age (18+)" type="number" min="18" max="60" value={form.age} onChange={e => { setForm(f => ({ ...f, age: e.target.value })); setErrors(er => ({ ...er, age: null })); }}
                      style={inp("age")}
                      onFocus={e => e.target.style.borderColor = "#7c3aed"}
                      onBlur={e => e.target.style.borderColor = errors.age ? "#ef4444" : "rgba(255,255,255,0.1)"}
                    />
                    {errors.age && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors.age}</div>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 1: Role & Event ── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 12 }}>Choose Your Role</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {ROLES.map(r => (
                      <motion.button key={r.id}
                        onClick={() => { setForm(f => ({ ...f, role: r.id })); setErrors(er => ({ ...er, role: null })); }}
                        whileHover={{ scale: 1.02, borderColor: "rgba(124,58,237,0.5)" }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          padding: "14px 12px", textAlign: "left",
                          background: form.role === r.id ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${form.role === r.id ? "#7c3aed" : "rgba(255,255,255,0.08)"}`,
                          borderRadius: 10, cursor: "pointer", color: "#fff", transition: "all 0.2s",
                        }}>
                        <div style={{ fontSize: "1.3rem", marginBottom: 4 }}>{r.icon}</div>
                        <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{r.label}</div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: 2, lineHeight: 1.4 }}>{r.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                  {errors.role && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 8 }}>⚠ {errors.role}</div>}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>Which Event?</label>
                  {EVENTS_LIST.map(ev => (
                    <button key={ev} onClick={() => { setForm(f => ({ ...f, event: ev })); setErrors(er => ({ ...er, event: null })); }}
                      style={{
                        display: "block", width: "100%", marginBottom: 8, padding: "12px 14px", textAlign: "left",
                        background: form.event === ev ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${form.event === ev ? "#7c3aed" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 8, color: form.event === ev ? "#fff" : "rgba(255,255,255,0.6)",
                        cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s",
                      }}>
                      📅 {ev}
                    </button>
                  ))}
                  {errors.event && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors.event}</div>}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>Why do you want to volunteer?</label>
                  <textarea placeholder="Tell us what drives you to be part of Tangy Sessions..." value={form.why} rows={3}
                    onChange={e => { setForm(f => ({ ...f, why: e.target.value })); setErrors(er => ({ ...er, why: null })); }}
                    style={{ ...inp("why"), resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = "#7c3aed"}
                    onBlur={e => e.target.style.borderColor = errors.why ? "#ef4444" : "rgba(255,255,255,0.1)"}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    {errors.why && <div style={{ color: "#ef4444", fontSize: "0.73rem" }}>⚠ {errors.why}</div>}
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>{form.why.length} chars</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Review & Submit ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "#7c3aed", textTransform: "uppercase", marginBottom: 16 }}>Application Summary</div>
                  {[
                    ["Name", form.name],
                    ["Email", form.email],
                    ["Phone", form.phone],
                    ["Age", form.age],
                    ["Role", selectedRole ? `${selectedRole.icon} ${selectedRole.label}` : "—"],
                    ["Event", form.event || "—"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.85rem" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>{k}</span>
                      <span style={{ color: "#fff", maxWidth: "60%", textAlign: "right" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>MOTIVATION</div>
                    <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{form.why || "—"}</div>
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginBottom: 4 }}>
                  <input type="checkbox" checked={form.terms} onChange={e => { setForm(f => ({ ...f, terms: e.target.checked })); setErrors(er => ({ ...er, terms: null })); }}
                    style={{ marginTop: 2, accentColor: "#7c3aed", width: 16, height: 16 }} />
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                    I agree to the volunteer guidelines and understand that this is a commitment. I confirm I am 18+ and will attend the selected event.
                  </span>
                </label>
                {errors.terms && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors.terms}</div>}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            {step > 0 && (
              <motion.button onClick={back} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{ flex: 1, padding: "13px", background: "transparent", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem" }}>
                ← Back
              </motion.button>
            )}
            <motion.button
              onClick={step < 2 ? next : submit}
              whileHover={{ scale: 1.02, backgroundColor: step < 2 ? "#6d28d9" : "#059669" }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 2, padding: "13px",
                background: step === 2 ? "#10b981" : "#7c3aed",
                color: "#fff", border: "none", borderRadius: 8,
                cursor: "pointer", fontFamily: "inherit", fontSize: "0.88rem",
                fontWeight: 600, letterSpacing: "0.08em",
                boxShadow: `0 0 20px ${step === 2 ? "rgba(16,185,129,0.3)" : "rgba(124,58,237,0.3)"}`,
              }}>
              {step < 2 ? "Continue →" : "Submit Application ✓"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
