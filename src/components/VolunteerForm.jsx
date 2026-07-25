import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { volunteerService } from "../services/volunteerService";
import { useAuth } from "../contexts/AuthContext";
import { profileService } from "../services/profileService";

const GlassCard = ({ children, style, className }) => (
  <div className={className} style={{ background: "transparent", ...style }}>
    {children}
  </div>
);

const INPUT_STYLE = {
  width: "100%", padding: "12px 0",
  background: "transparent",
  border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 0, color: "#fff", fontSize: "16px",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  transition: "border-color 0.2s", minHeight: "44px",
};

const LABEL_STYLE = {
  display: "block",
  fontFamily: "'Bebas Neue', sans-serif",
  fontSize: "0.95rem", letterSpacing: "0.12em",
  color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 6,
};

const DEPTS = [
  "Creative Direction & Show Design",
  "Stage Designer & Decor Lead",
  "Costume Design",
  "Visual & Content",
  "Audio Engineering & Sound",
  "Production, Coordination, Ticketing & Artist Management",
  "Artist Liaison & Management",
  "MC / Hosting",
  "Setup, Breakdown, Security & General Crew",
  "Flexible Volunteer"
];

const DATES = [
  "Event 1 - Aug 15 - Main Venue",
  "Event 2 - Sep 20 - Main Venue",
  "Event 3 - Oct 15 - Outdoor Venue"
];

export default function VolunteerForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("tangy_volunteer_draft");
    return saved ? JSON.parse(saved) : {
      name: "", phone: "", email: "", instagram: "", city: "", foundOut: "",
      primaryDept: "", secondDept: "",
      cdRole: "", cdExp: "", cdVision: "", cdPort: "",
      sdBg: "", sdRole: "", sdExp: "", sdAccess: "", sdVision: "", sdPort: "",
      csBg: "", csRole: "", csExp: "", csPort: "", csInsta: "",
      vcSkills: "", vcExp: "", vcEquip: "", vcPort: "", vcInsta: "",
      aeRole: "", aeExp: "", aeOutdoor: "", aeEquip: "",
      prRole: "", prPeople: "", prComfort: "",
      mcHosted: "", mcLang: [], mcComfort: "", mcVideo: "",
      involvement: "", dates: [],
      emergName: "", emergNum: "", attendedBefore: "", whyJoin: "", hopeGain: [],
      dec1: false, dec2: false
    };
  });

  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem("tangy_volunteer_draft", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (user) {
      profileService.getProfile(user.id).then(prof => {
        setForm(prev => ({
          ...prev,
          name: prev.name || prof?.fullName || user.name || "",
          email: prev.email || prof?.email || user.email || "",
          phone: prev.phone || prof?.phone || user.phone || "",
          city: prev.city || prof?.city || ""
        }));
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleMultiSelect = (field, value) => {
    setForm(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      if (!form.name.trim()) errs.name = "Required";
      if (!form.phone.trim()) errs.phone = "Required";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email required";
      if (!form.city.trim()) errs.city = "Required";
      if (!form.foundOut) errs.foundOut = "Required";
    } else if (currentStep === 2) {
      if (!form.primaryDept) errs.primaryDept = "Required";
      // Additional conditional validations could go here
    } else if (currentStep === 3) {
      if (!form.involvement) errs.involvement = "Required";
      if (!form.dates || form.dates.length === 0) errs.dates = "Select at least one date";
    } else if (currentStep === 4) {
      if (!form.emergName.trim()) errs.emergName = "Required";
      if (!form.emergNum.trim()) errs.emergNum = "Required";
      if (!form.attendedBefore) errs.attendedBefore = "Required";
      if (!form.whyJoin.trim()) errs.whyJoin = "Required";
    } else if (currentStep === 5) {
      if (!form.dec1) errs.dec1 = "You must agree to join the community";
      if (!form.dec2) errs.dec2 = "You must agree to be contacted";
    }
    return errs;
  };

  const nextStep = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStep(s => Math.min(5, s + 1));
  };

  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleSubmit = async () => {
    const errs = validateStep(5);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    const res = await volunteerService.submitApplication(form);
    setIsSubmitting(false);
    if (res.success) {
      setSubmitSuccess(true);
      localStorage.removeItem("tangy_volunteer_draft");
    } else {
      alert("Submission failed. Please try again.");
    }
  };

  if (submitSuccess) {
    return (
      <div style={{ padding: "60px 40px", textAlign: "center", border: "1px dashed rgba(200,255,43,0.5)" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,6vw,3.5rem)", color: "#C8FF2B", letterSpacing: "0.1em", marginBottom: 12 }}>APPLICATION RECEIVED ✓</div>
        <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem" }}>
          Welcome to the Tangy Sessions community. Our team will review your application and get in touch with you at <strong style={{ color: "#fff" }}>{form.email}</strong> soon.
        </p>
      </div>
    );
  }

  return (
    <GlassCard className="volunteer-form-container" style={{ padding: "clamp(24px, 5vw, 36px) clamp(16px, 5vw, 40px)", width: "100%", boxSizing: "border-box" }}>
      <style>{`
        .volunteer-form-container input:focus,
        .volunteer-form-container select:focus,
        .volunteer-form-container textarea:focus {
          border-bottom-color: #C8FF2B !important;
        }
        .volunteer-form-container textarea {
          border: 1px solid rgba(255,255,255,0.12) !important;
          padding: 12px !important;
          resize: vertical;
          font-size: 16px !important;
        }
        .volunteer-form-container textarea:focus {
          border-color: #C8FF2B !important;
          outline: none !important;
        }
        .volunteer-form-container select { appearance: none; cursor: pointer; }
        .volunteer-form-container select option {
          background-color: #111111 !important;
          color: #ffffff !important;
        }
        .volunteer-form-container input::placeholder,
        .volunteer-form-container textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
      {/* Progress Bar */}
      <div style={{ display: "flex", gap: 2, marginBottom: 32 }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{ height: 3, flex: 1, background: s <= step ? "#C8FF2B" : "rgba(255,255,255,0.08)", transition: "background 0.3s" }} />
        ))}
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#C8FF2B", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 16 }}>// STEP {step} OF 5 //</div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", margin: "0 0 10px" }}>Basic Information</h3>
              <div>
                <label style={LABEL_STYLE}>Full Name *</label>
                <input type="text" value={form.name} onChange={e => handleChange("name", e.target.value)} style={{...INPUT_STYLE, borderColor: errors.name ? "#ef4444" : INPUT_STYLE.border}} />
                {errors.name && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.name}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>Phone Number (WhatsApp preferred) *</label>
                <input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} style={{...INPUT_STYLE, borderColor: errors.phone ? "#ef4444" : INPUT_STYLE.border}} />
                {errors.phone && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.phone}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>Email Address *</label>
                <input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} style={{...INPUT_STYLE, borderColor: errors.email ? "#ef4444" : INPUT_STYLE.border}} />
                {errors.email && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.email}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>Instagram Handle</label>
                <input type="text" value={form.instagram} onChange={e => handleChange("instagram", e.target.value)} style={INPUT_STYLE} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Which city are you based in? *</label>
                <input type="text" value={form.city} onChange={e => handleChange("city", e.target.value)} style={{...INPUT_STYLE, borderColor: errors.city ? "#ef4444" : INPUT_STYLE.border}} />
                {errors.city && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.city}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>How did you find out about this? *</label>
                <select value={form.foundOut} onChange={e => handleChange("foundOut", e.target.value)} style={{...INPUT_STYLE, appearance: "none", cursor: "pointer", borderColor: errors.foundOut ? "#ef4444" : INPUT_STYLE.border}}>
                  <option value="" disabled>Select an option</option>
                  <option value="Instagram post or story">Instagram post or story</option>
                  <option value="Friend or colleague">Friend or colleague</option>
                  <option value="Attended a show before">Attended a show before</option>
                  <option value="Already connected with team">Already connected with team</option>
                  <option value="Other">Other</option>
                </select>
                {errors.foundOut && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.foundOut}</div>}
              </div>
            </div>
          )}

          {/* STEP 2: DEPARTMENT */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", margin: "0 0 10px" }}>Choose Your Department</h3>
              <div>
                <label style={LABEL_STYLE}>Primary Department *</label>
                <select value={form.primaryDept} onChange={e => handleChange("primaryDept", e.target.value)} style={{...INPUT_STYLE, appearance: "none", cursor: "pointer", borderColor: errors.primaryDept ? "#ef4444" : INPUT_STYLE.border}}>
                  <option value="" disabled>Select primary department</option>
                  {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.primaryDept && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.primaryDept}</div>}
              </div>
              <div>
                <label style={LABEL_STYLE}>Second Skill / Department (Optional)</label>
                <input type="text" value={form.secondDept} onChange={e => handleChange("secondDept", e.target.value)} style={INPUT_STYLE} placeholder="e.g. Photography, Decor..." />
              </div>

              {/* CONDITIONALS */}
              {form.primaryDept === "Creative Direction & Show Design" && (
                <div style={{ background: "rgba(200,255,43,0.03)", padding: 20, borderLeft: "2px solid rgba(200,255,43,0.3)", marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#C8FF2B", letterSpacing: "0.3em", textTransform: "uppercase" }}>// Creative Direction Section //</div>
                  <div><label style={LABEL_STYLE}>Role *</label>
                    <select value={form.cdRole} onChange={e => handleChange("cdRole", e.target.value)} style={INPUT_STYLE}><option value="">Select</option><option value="Show Director">Show Director</option><option value="Show Crew">Show Crew</option></select>
                  </div>
                  <div><label style={LABEL_STYLE}>Experience *</label>
                    <select value={form.cdExp} onChange={e => handleChange("cdExp", e.target.value)} style={INPUT_STYLE}><option value="">Select</option><option value="Professional">Professional</option><option value="Independent">Independent</option><option value="Idea-based">Idea-based</option><option value="No experience">No experience</option></select>
                  </div>
                  <div><label style={LABEL_STYLE}>Creative Vision *</label><textarea value={form.cdVision} onChange={e => handleChange("cdVision", e.target.value)} style={{...INPUT_STYLE, minHeight:80}} /></div>
                  <div><label style={LABEL_STYLE}>Portfolio Link</label><input type="text" value={form.cdPort} onChange={e => handleChange("cdPort", e.target.value)} style={INPUT_STYLE} /></div>
                </div>
              )}

              {form.primaryDept === "Stage Designer & Decor Lead" && (
                <div style={{ background: "rgba(200,255,43,0.03)", padding: 20, borderLeft: "2px solid rgba(200,255,43,0.3)", marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#C8FF2B", letterSpacing: "0.3em", textTransform: "uppercase" }}>// Stage Design Section //</div>
                  <div><label style={LABEL_STYLE}>Background *</label><select value={form.sdBg} onChange={e => handleChange("sdBg", e.target.value)} style={INPUT_STYLE}><option value="">Select</option><option value="Interior Design">Interior Design</option><option value="Architecture">Architecture</option><option value="Event Decor">Event Decor</option><option value="Fashion / Set Design">Fashion / Set Design</option><option value="Self Taught">Self Taught</option><option value="Beginner">Beginner</option></select></div>
                  <div><label style={LABEL_STYLE}>Role *</label><select value={form.sdRole} onChange={e => handleChange("sdRole", e.target.value)} style={INPUT_STYLE}><option value="">Select</option><option value="Decor Lead">Decor Lead</option><option value="Decor Crew">Decor Crew</option><option value="Either">Either</option></select></div>
                  <div><label style={LABEL_STYLE}>Experience *</label><select value={form.sdExp} onChange={e => handleChange("sdExp", e.target.value)} style={INPUT_STYLE}><option value="">Select</option><option value="Professional">Professional</option><option value="Independent">Independent</option><option value="Idea-based">Idea-based</option><option value="No experience">No experience</option></select></div>
                  <div><label style={LABEL_STYLE}>Have Access To Decor Tools? *</label><input type="text" value={form.sdAccess} onChange={e => handleChange("sdAccess", e.target.value)} style={INPUT_STYLE} /></div>
                  <div><label style={LABEL_STYLE}>Creative Vision *</label><textarea value={form.sdVision} onChange={e => handleChange("sdVision", e.target.value)} style={{...INPUT_STYLE, minHeight:80}} /></div>
                  <div><label style={LABEL_STYLE}>Portfolio Link</label><input type="text" value={form.sdPort} onChange={e => handleChange("sdPort", e.target.value)} style={INPUT_STYLE} /></div>
                </div>
              )}

              {/* Add other conditionals similarly */}
              {form.primaryDept === "Costume Design" && (
                <div style={{ background: "rgba(200,255,43,0.03)", padding: 20, borderLeft: "2px solid rgba(200,255,43,0.3)", marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#C8FF2B", letterSpacing: "0.3em", textTransform: "uppercase" }}>// Costume Design Section //</div>
                  <div><label style={LABEL_STYLE}>Role *</label><select value={form.csRole} onChange={e => handleChange("csRole", e.target.value)} style={INPUT_STYLE}><option value="">Select</option><option value="Costume Head">Costume Head</option><option value="Costume Crew">Costume Crew</option></select></div>
                  <div><label style={LABEL_STYLE}>Background *</label><input type="text" value={form.csBg} onChange={e => handleChange("csBg", e.target.value)} style={INPUT_STYLE} /></div>
                  <div><label style={LABEL_STYLE}>Experience *</label><input type="text" value={form.csExp} onChange={e => handleChange("csExp", e.target.value)} style={INPUT_STYLE} /></div>
                  <div><label style={LABEL_STYLE}>Portfolio Link</label><input type="text" value={form.csPort} onChange={e => handleChange("csPort", e.target.value)} style={INPUT_STYLE} /></div>
                </div>
              )}

              {form.primaryDept === "Visual & Content" && (
                <div style={{ background: "rgba(200,255,43,0.03)", padding: 20, borderLeft: "2px solid rgba(200,255,43,0.3)", marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#C8FF2B", letterSpacing: "0.3em", textTransform: "uppercase" }}>// Visual & Content Section //</div>
                  <div><label style={LABEL_STYLE}>Skills *</label><select value={form.vcSkills} onChange={e => handleChange("vcSkills", e.target.value)} style={INPUT_STYLE}><option value="">Select</option><option value="Photographer">Photographer</option><option value="Videographer">Videographer</option><option value="Editor">Editor</option><option value="Reels Creator">Reels Creator</option><option value="Colourist">Colourist</option><option value="Graphic Designer">Graphic Designer</option><option value="Motion Designer">Motion Designer</option></select></div>
                  <div><label style={LABEL_STYLE}>Experience *</label><input type="text" value={form.vcExp} onChange={e => handleChange("vcExp", e.target.value)} style={INPUT_STYLE} /></div>
                  <div><label style={LABEL_STYLE}>Equipment & Software *</label><input type="text" value={form.vcEquip} onChange={e => handleChange("vcEquip", e.target.value)} style={INPUT_STYLE} /></div>
                  <div><label style={LABEL_STYLE}>Portfolio Link *</label><input type="text" value={form.vcPort} onChange={e => handleChange("vcPort", e.target.value)} style={INPUT_STYLE} /></div>
                </div>
              )}

            </div>
          )}

          {/* STEP 3: COMMITMENT */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", margin: "0 0 10px" }}>Commitment</h3>
              <div>
                <label style={LABEL_STYLE}>How Would You Like To Be Involved? *</label>
                <select value={form.involvement} onChange={e => handleChange("involvement", e.target.value)} style={{...INPUT_STYLE, appearance: "none", cursor: "pointer", borderColor: errors.involvement ? "#ef4444" : INPUT_STYLE.border}}>
                  <option value="" disabled>Select an option</option>
                  <option value="One Day Volunteer">One Day Volunteer</option>
                  <option value="One Weekend Volunteer">One Weekend Volunteer</option>
                  <option value="Full Month Volunteer">Full Month Volunteer</option>
                  <option value="Full Month Structured Role">Full Month Structured Role</option>
                  <option value="Flexible">Flexible</option>
                </select>
                {errors.involvement && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.involvement}</div>}
              </div>

              <div>
                <label style={LABEL_STYLE}>Available Dates *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16, background: "rgba(0,0,0,0.3)", border: `1px solid ${errors.dates ? "#FF2E52" : "rgba(255,255,255,0.08)"}` }}>
                  {DATES.map(date => (
                    <label key={date} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
                      <input type="checkbox" checked={form.dates.includes(date)} onChange={() => handleMultiSelect("dates", date)} style={{ width: 16, height: 16, accentColor: "#C8FF2B" }} />
                      {date}
                    </label>
                  ))}
                </div>
                {errors.dates && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.dates}</div>}
              </div>
            </div>
          )}

          {/* STEP 4: ABOUT YOU */}
          {step === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", margin: "0 0 10px" }}>About You</h3>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={LABEL_STYLE}>Emergency Contact Name *</label>
                  <input type="text" value={form.emergName} onChange={e => handleChange("emergName", e.target.value)} style={{...INPUT_STYLE, borderColor: errors.emergName ? "#ef4444" : INPUT_STYLE.border}} />
                  {errors.emergName && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.emergName}</div>}
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={LABEL_STYLE}>Emergency Contact Number *</label>
                  <input type="tel" value={form.emergNum} onChange={e => handleChange("emergNum", e.target.value)} style={{...INPUT_STYLE, borderColor: errors.emergNum ? "#ef4444" : INPUT_STYLE.border}} />
                  {errors.emergNum && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.emergNum}</div>}
                </div>
              </div>
              
              <div>
                <label style={LABEL_STYLE}>Attended Tangy Sessions Before? *</label>
                <select value={form.attendedBefore} onChange={e => handleChange("attendedBefore", e.target.value)} style={{...INPUT_STYLE, appearance: "none", cursor: "pointer", borderColor: errors.attendedBefore ? "#ef4444" : INPUT_STYLE.border}}>
                  <option value="" disabled>Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.attendedBefore && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.attendedBefore}</div>}
              </div>

              <div>
                <label style={LABEL_STYLE}>Why Do You Want To Join Tangy Sessions? *</label>
                <textarea value={form.whyJoin} onChange={e => handleChange("whyJoin", e.target.value)} style={{...INPUT_STYLE, minHeight: 100, resize: "vertical", borderColor: errors.whyJoin ? "#ef4444" : INPUT_STYLE.border}} />
                {errors.whyJoin && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.whyJoin}</div>}
              </div>

              <div>
                <label style={LABEL_STYLE}>What Do You Hope To Gain?</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, padding: 16, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Event Experience", "Portfolio Building", "Community", "Learning", "Career Growth", "Contribution", "Networking", "All Of The Above", "Other"].map(opt => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
                      <input type="checkbox" checked={form.hopeGain.includes(opt)} onChange={() => handleMultiSelect("hopeGain", opt)} style={{ width: 16, height: 16, accentColor: "#C8FF2B" }} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: DECLARATION */}
          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", margin: "0 0 10px" }}>Final Declaration</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24, background: "rgba(200,255,43,0.03)", border: "1px dashed rgba(200,255,43,0.25)" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 16, cursor: "pointer", fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
                  <input type="checkbox" checked={form.dec1} onChange={e => handleChange("dec1", e.target.checked)} style={{ width: 20, height: 20, accentColor: "#C8FF2B", marginTop: 2 }} />
                  <div>
                    I understand that I'm joining the Tangy Sessions community and contributing my skills and energy to build something meaningful. *
                    {errors.dec1 && <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 6 }}>⚠ {errors.dec1}</div>}
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: 16, cursor: "pointer", fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
                  <input type="checkbox" checked={form.dec2} onChange={e => handleChange("dec2", e.target.checked)} style={{ width: 20, height: 20, accentColor: "#C8FF2B", marginTop: 2 }} />
                  <div>
                    I agree to be contacted by Tangy Sessions via WhatsApp and email regarding this application and future show updates. *
                    {errors.dec2 && <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 6 }}>⚠ {errors.dec2}</div>}
                  </div>
                </label>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 28, borderTop: "1px dashed rgba(200,255,43,0.15)" }}>
        {step > 1 ? (
          <button onClick={prevStep}
            style={{ padding: "13px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", borderRadius: 0, cursor: "pointer", fontFamily: "'Space Mono', monospace", textTransform: "uppercase", fontSize: "0.65rem", letterSpacing: "0.12em", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C8FF2B"; e.currentTarget.style.color = "#C8FF2B"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >
            ← Back
          </button>
        ) : <div />}
        
        <motion.button
          onClick={step === 5 ? handleSubmit : nextStep} disabled={isSubmitting}
          whileTap={!isSubmitting ? { scale: 0.97 } : {}}
          style={{
            padding: "14px 40px",
            background: isSubmitting ? "rgba(200,255,43,0.4)" : "#C8FF2B",
            color: "#080808", border: "none", borderRadius: 0,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontFamily: "'Bebas Neue', sans-serif",
            textTransform: "uppercase", fontSize: "1.1rem", letterSpacing: "0.15em",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = "#fff"; }}
          onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.background = "#C8FF2B"; }}
        >
          {isSubmitting ? "Submitting..." : step === 5 ? "Submit Application →" : "Continue →"}
        </motion.button>
      </div>

    </GlassCard>
  );
}
