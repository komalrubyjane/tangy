import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { volunteerService } from "../services/volunteerService";

const GlassCard = ({ children, style, className }) => (
  <div className={className} style={{
    background: "rgba(5, 5, 5, 0.4)",
    backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
    border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    ...style
  }}>
    {children}
  </div>
);

const INPUT_STYLE = {
  width: "100%", padding: "13px 16px",
  background: "rgba(0, 0, 0, 0.6)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  borderRadius: 8, color: "#fff", fontSize: "0.85rem",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  transition: "all 0.2s"
};

const LABEL_STYLE = {
  display: "block", fontSize: "0.65rem", letterSpacing: "0.2em",
  color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8
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

  useEffect(() => {
    localStorage.setItem("tangy_volunteer_draft", JSON.stringify(form));
  }, [form]);

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
      <GlassCard style={{ padding: "60px 40px", textAlign: "center", border: "1px solid rgba(16, 185, 129, 0.4)" }}>
        <div style={{ fontSize: "4rem", marginBottom: 20 }}>🎉</div>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", color: "#10b981", margin: "0 0 16px" }}>Application Received!</h3>
        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 30 }}>
          Welcome to the Tangy Sessions community. Our team will review your application and get in touch with you at <strong>{form.email}</strong> soon.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={{ padding: "40px" }}>
      {/* Progress Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{ height: 4, flex: 1, borderRadius: 2, background: s <= step ? "#7c3aed" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
        ))}
      </div>
      
      <div style={{ fontSize: "0.8rem", color: "#a78bfa", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Step {step} of 5</div>

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
                <div style={{ background: "rgba(124,58,237,0.05)", padding: 20, borderRadius: 12, marginTop: 10, display: "flex", flexDirection: "column", gap: 16 }}>
                  <h4 style={{ margin: 0, color: "#a78bfa" }}>Creative Direction Section</h4>
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
                <div style={{ background: "rgba(124,58,237,0.05)", padding: 20, borderRadius: 12, marginTop: 10, display: "flex", flexDirection: "column", gap: 16 }}>
                  <h4 style={{ margin: 0, color: "#a78bfa" }}>Stage Design Section</h4>
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
                <div style={{ background: "rgba(124,58,237,0.05)", padding: 20, borderRadius: 12, marginTop: 10, display: "flex", flexDirection: "column", gap: 16 }}>
                  <h4 style={{ margin: 0, color: "#a78bfa" }}>Costume Design Section</h4>
                  <div><label style={LABEL_STYLE}>Role *</label><select value={form.csRole} onChange={e => handleChange("csRole", e.target.value)} style={INPUT_STYLE}><option value="">Select</option><option value="Costume Head">Costume Head</option><option value="Costume Crew">Costume Crew</option></select></div>
                  <div><label style={LABEL_STYLE}>Background *</label><input type="text" value={form.csBg} onChange={e => handleChange("csBg", e.target.value)} style={INPUT_STYLE} /></div>
                  <div><label style={LABEL_STYLE}>Experience *</label><input type="text" value={form.csExp} onChange={e => handleChange("csExp", e.target.value)} style={INPUT_STYLE} /></div>
                  <div><label style={LABEL_STYLE}>Portfolio Link</label><input type="text" value={form.csPort} onChange={e => handleChange("csPort", e.target.value)} style={INPUT_STYLE} /></div>
                </div>
              )}

              {form.primaryDept === "Visual & Content" && (
                <div style={{ background: "rgba(124,58,237,0.05)", padding: 20, borderRadius: 12, marginTop: 10, display: "flex", flexDirection: "column", gap: 16 }}>
                  <h4 style={{ margin: 0, color: "#a78bfa" }}>Visual & Content Section</h4>
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
                <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16, background: "rgba(0,0,0,0.3)", borderRadius: 8, border: `1px solid ${errors.dates ? "#ef4444" : "rgba(255,255,255,0.1)"}` }}>
                  {DATES.map(date => (
                    <label key={date} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
                      <input type="checkbox" checked={form.dates.includes(date)} onChange={() => handleMultiSelect("dates", date)} style={{ width: 16, height: 16, accentColor: "#7c3aed" }} />
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
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 16, background: "rgba(0,0,0,0.3)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)" }}>
                  {["Event Experience", "Portfolio Building", "Community", "Learning", "Career Growth", "Contribution", "Networking", "All Of The Above", "Other"].map(opt => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
                      <input type="checkbox" checked={form.hopeGain.includes(opt)} onChange={() => handleMultiSelect("hopeGain", opt)} style={{ width: 16, height: 16, accentColor: "#7c3aed" }} />
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
              
              <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24, background: "rgba(124,58,237,0.05)", borderRadius: 12, border: "1px solid rgba(124,58,237,0.2)" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 16, cursor: "pointer", fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
                  <input type="checkbox" checked={form.dec1} onChange={e => handleChange("dec1", e.target.checked)} style={{ width: 20, height: 20, accentColor: "#7c3aed", marginTop: 2 }} />
                  <div>
                    I understand that I'm joining the Tangy Sessions community and contributing my skills and energy to build something meaningful. *
                    {errors.dec1 && <div style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 6 }}>⚠ {errors.dec1}</div>}
                  </div>
                </label>

                <label style={{ display: "flex", alignItems: "flex-start", gap: 16, cursor: "pointer", fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
                  <input type="checkbox" checked={form.dec2} onChange={e => handleChange("dec2", e.target.checked)} style={{ width: 20, height: 20, accentColor: "#7c3aed", marginTop: 2 }} />
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

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, paddingTop: 30, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        {step > 1 ? (
          <motion.button onClick={prevStep} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{ padding: "14px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 8, cursor: "pointer", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            Back
          </motion.button>
        ) : <div />}
        
        <motion.button
          onClick={step === 5 ? handleSubmit : nextStep} disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.05, backgroundColor: "#6d28d9" } : {}}
          whileTap={!isSubmitting ? { scale: 0.95 } : {}}
          style={{ padding: "14px 36px", background: isSubmitting ? "rgba(124,58,237,0.5)" : "#7c3aed", color: "#fff", border: "none", borderRadius: 8, cursor: isSubmitting ? "not-allowed" : "pointer", textTransform: "uppercase", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.1em", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}>
          {isSubmitting ? "Submitting..." : step === 5 ? "Submit Application" : "Continue"}
        </motion.button>
      </div>

    </GlassCard>
  );
}
