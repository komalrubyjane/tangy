import re

with open("src/pages/EventDetails.jsx", "r") as f:
    content = f.read()

new_state = """  const [form, setForm] = useState({
    name: "", email: "", phone: "", qty: 1, notes: "",
    dob: "", gender: "Woman", paymentTo: "7671836748 - Arjuna/ Tangy",
    upiName: "", upiId: "", paymentMethod: "Google Pay",
    attendedBefore: "Not yet, but can't wait.", cityPart: "",
    artistCollab: "", seatingPreference: "", instagram: ""
  });"""

content = re.sub(r'const \[form, setForm\] = useState\(\{.*?\}\);', lambda m: new_state, content, flags=re.DOTALL)

new_success = """      setForm({
        name: "", email: "", phone: "", qty: 1, notes: "",
        dob: "", gender: "Woman", paymentTo: "7671836748 - Arjuna/ Tangy",
        upiName: "", upiId: "", paymentMethod: "Google Pay",
        attendedBefore: "Not yet, but can't wait.", cityPart: "",
        artistCollab: "", seatingPreference: "", instagram: ""
      });"""

content = re.sub(r'setForm\(\{ name: "", email: "", phone: "", qty: 1, notes: "" \}\);', lambda m: new_success, content)

new_submit = """    const result = await bookingService.submitBooking({
      ...form,
      eventName: ev.name,
      amountPaid: ev.price * form.qty
    });"""

content = re.sub(r'const result = await bookingService\.submitBooking\(\{\s*\.\.\.form,\s*eventName: ev\.name\s*\}\);', lambda m: new_submit, content)

new_fields = """            {/* Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Full Name *</label>
              <input
                type="text" placeholder="Your full name"
                value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: null })); }}
                style={fieldStyle("name")} onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = errors.name ? "#ef4444" : "rgba(124,58,237,0.25)"; }}
              />
              {errors.name && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.name}</div>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Email Address *</label>
              <input
                type="email" placeholder="your@email.com"
                value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: null })); }}
                style={fieldStyle("email")} onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = errors.email ? "#ef4444" : "rgba(124,58,237,0.25)"; }}
              />
              {errors.email && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.email}</div>}
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Phone Number (WhatsApp) *</label>
              <input
                type="tel" placeholder="+91 98765 43210"
                value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: null })); }}
                style={fieldStyle("phone")} onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = errors.phone ? "#ef4444" : "rgba(124,58,237,0.25)"; }}
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
                  style={fieldStyle("dob")} onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.25)"; }}
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
                  style={fieldStyle("cityPart")} onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.25)"; }}
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Instagram ID</label>
                <input
                  type="text" placeholder="@username"
                  value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))}
                  style={fieldStyle("instagram")} onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.25)"; }}
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
                    style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", cursor: "pointer", fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >−</button>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "#fff", minWidth: 36, textAlign: "center", lineHeight: 1 }}>{form.qty}</div>
                  <button
                    onClick={() => setForm(f => ({ ...f, qty: Math.min(10, f.qty + 1) }))}
                    style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "#fff", cursor: "pointer", fontSize: "1.3rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >+</button>
                </div>
              </div>
              <div style={{ flex: "1 1 140px" }}>
                <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Seating Preference</label>
                <input
                  type="text" placeholder="Chairs/Mattress?"
                  value={form.seatingPreference} onChange={e => setForm(f => ({ ...f, seatingPreference: e.target.value }))}
                  style={fieldStyle("seatingPreference")} onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.25)"; }}
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
                onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.25)"; }}
              />
            </div>

            {/* Additional Notes */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 8 }}>Anything else to share?</label>
              <textarea
                placeholder="Feedback, stories, etc..."
                value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                style={{ ...fieldStyle("notes"), minHeight: "50px", resize: "vertical" }}
                onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = "rgba(124,58,237,0.25)"; }}
              />
            </div>

            {/* Total price display */}"""

content = re.sub(r'\{\/\* Name \*\/\}.*?\{\/\* Total price display \*\/\}\n', lambda m: new_fields, content, flags=re.DOTALL)

new_payment = """            {/* Payment Details Section */}
            <div style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: "24px 20px", marginBottom: 26 }}>
              <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#a78bfa", margin: "0 0 16px", letterSpacing: "0.05em" }}>Payment Details</h4>
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
                    style={fieldStyle("upiName")} onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = errors.upiName ? "#ef4444" : "rgba(124,58,237,0.25)"; }}
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
                  style={fieldStyle("upiId")} onFocus={e => { e.target.style.borderColor = "#7c3aed"; }} onBlur={e => { e.target.style.borderColor = errors.upiId ? "#ef4444" : "rgba(124,58,237,0.25)"; }}
                />
                {errors.upiId && <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: 5 }}>⚠ {errors.upiId}</div>}
              </div>
            </div>

            {/* Submit */}"""

content = re.sub(r'\{\/\* Submit \*\/\}\n', lambda m: new_payment + "\n", content, flags=re.DOTALL)

new_validate = """  const validate = () => {
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
  };"""

content = re.sub(r'const validate = \(\) => \{.*?if \(Object\.keys\(errs\)\.length === 0\) setShowModal\(true\);\n  \};\n', lambda m: new_validate + "\n", content, flags=re.DOTALL)

content = re.sub(r'<AnimatePresence>\s*\{showModal && \(\s*<PaymentModal.*?</AnimatePresence>\s*', '', content, flags=re.DOTALL)

with open("src/pages/EventDetails.jsx", "w") as f:
    f.write(content)

