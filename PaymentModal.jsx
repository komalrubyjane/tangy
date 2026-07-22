import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: "⚡", desc: "Pay via any UPI app instantly" },
  { id: "card", label: "Card", icon: "💳", desc: "Credit / Debit card" },
  { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major banks supported" },
  { id: "wallet", label: "Wallet", icon: "👛", desc: "Paytm, PhonePe, Google Pay" },
];

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank"];
const WALLETS = ["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"];

function Stepper({ step }) {
  const steps = ["Select", "Pay", "Confirm"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <motion.div
              animate={{
                background: i < step ? "#C8FF2B" : i === step ? "rgba(229, 192, 123,0.2)" : "rgba(255,255,255,0.05)",
                borderColor: i <= step ? "#C8FF2B" : "rgba(255,255,255,0.1)",
                scale: i === step ? 1.1 : 1,
              }}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 700, color: i <= step ? "#fff" : "rgba(255,255,255,0.3)",
              }}
            >
              {i < step ? "✓" : i + 1}
            </motion.div>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.15em", color: i <= step ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <motion.div
              animate={{ background: i < step - 1 ? "#C8FF2B" : "rgba(255,255,255,0.08)" }}
              style={{ height: 1, width: 64, marginBottom: 22, transition: "background 0.4s" }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function PaymentModal({ amount, event, onClose, onSuccess }) {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(null);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // countdown on processing
  useEffect(() => {
    if (!processing) return;
    let c = 3;
    setCountdown(c);
    const iv = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) { clearInterval(iv); setStep(2); setProcessing(false); }
    }, 1000);
    return () => clearInterval(iv);
  }, [processing]);

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const validateAndPay = () => {
    const errs = {};
    if (method === "upi") {
      if (!upiId.match(/^[\w.\-_]+@[\w]+$/)) errs.upi = "Enter a valid UPI ID (e.g. name@upi)";
    } else if (method === "card") {
      if (card.number.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter a valid 16-digit card number";
      if (!card.expiry.match(/^\d{2}\/\d{2}$/)) errs.expiry = "Enter valid expiry (MM/YY)";
      if (card.cvv.length < 3) errs.cvv = "Enter valid CVV";
      if (!card.name.trim()) errs.name = "Cardholder name required";
    } else if (method === "netbanking") {
      if (!bank) errs.bank = "Select a bank";
    } else if (method === "wallet") {
      if (!wallet) errs.wallet = "Select a wallet";
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStep(1);
    setProcessing(true);
  };

  const inp = (field) => ({
    width: "100%", padding: "12px 14px",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${errors[field] ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 8, color: "#fff", fontSize: "0.88rem",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    transition: "all 0.2s",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)", zIndex: 3000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111111", border: "1px solid rgba(229, 192, 123,0.25)",
          borderRadius: 20, width: "100%", maxWidth: 520,
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 0 80px rgba(229, 192, 123,0.2), 0 40px 80px rgba(0,0,0,0.6)",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, background: "#111111", zIndex: 10, borderRadius: "20px 20px 0 0"
        }}>
          <div>
            <div style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "#C8FF2B", textTransform: "uppercase", fontFamily: "monospace" }}>Secure Checkout</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: "#fff", letterSpacing: "0.05em", marginTop: 2 }}>
              ₹{amount.toLocaleString("en-IN")}
            </div>
            {event && <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{event.name} · {event.date}</div>}
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)",
            width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: "1.1rem",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>×</button>
        </div>

        <div style={{ padding: "28px" }}>
          <Stepper step={step === 2 ? 3 : step === 1 ? 2 : 1} />

          <AnimatePresence mode="wait">

            {/* ── STEP 0: Method Selection ── */}
            {step === 0 && !processing && (
              <motion.div key="method" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                  {PAYMENT_METHODS.map((m) => (
                    <motion.button
                      key={m.id}
                      onClick={() => { setMethod(m.id); setErrors({}); }}
                      whileHover={{ scale: 1.02, borderColor: "rgba(229, 192, 123,0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: "16px 14px", textAlign: "left",
                        background: method === m.id ? "rgba(229, 192, 123,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${method === m.id ? "#C8FF2B" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 10, cursor: "pointer", color: "#fff",
                        boxShadow: method === m.id ? "0 0 20px rgba(229, 192, 123,0.15)" : "none",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{m.icon}</div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{m.label}</div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{m.desc}</div>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {method === "upi" && (
                    <motion.div key="upi" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>UPI ID</label>
                      <input placeholder="yourname@upi" value={upiId} onChange={e => { setUpiId(e.target.value); setErrors({}); }}
                        style={inp("upi")}
                        onFocus={e => e.target.style.borderColor = "#C8FF2B"}
                        onBlur={e => e.target.style.borderColor = errors.upi ? "#ef4444" : "rgba(255,255,255,0.1)"}
                      />
                      {errors.upi && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 6 }}>⚠ {errors.upi}</div>}
                      <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["@okaxis", "@ybl", "@paytm", "@oksbi"].map(s => (
                          <button key={s} onClick={() => setUpiId(prev => prev.split("@")[0] + s)}
                            style={{ padding: "6px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", cursor: "pointer" }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {method === "card" && (
                    <motion.div key="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Card Number</label>
                        <input placeholder="1234 5678 9012 3456" value={card.number}
                          onChange={e => { setCard(c => ({ ...c, number: formatCard(e.target.value) })); setErrors({}); }}
                          style={inp("cardNumber")} maxLength={19}
                          onFocus={e => e.target.style.borderColor = "#C8FF2B"}
                          onBlur={e => e.target.style.borderColor = errors.cardNumber ? "#ef4444" : "rgba(255,255,255,0.1)"}
                        />
                        {errors.cardNumber && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors.cardNumber}</div>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Expiry</label>
                          <input placeholder="MM/YY" value={card.expiry}
                            onChange={e => { setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) })); setErrors({}); }}
                            style={inp("expiry")} maxLength={5}
                            onFocus={e => e.target.style.borderColor = "#C8FF2B"}
                            onBlur={e => e.target.style.borderColor = errors.expiry ? "#ef4444" : "rgba(255,255,255,0.1)"}
                          />
                          {errors.expiry && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors.expiry}</div>}
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>CVV</label>
                          <input placeholder="•••" value={card.cvv} type="password"
                            onChange={e => { setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })); setErrors({}); }}
                            style={inp("cvv")} maxLength={4}
                            onFocus={e => e.target.style.borderColor = "#C8FF2B"}
                            onBlur={e => e.target.style.borderColor = errors.cvv ? "#ef4444" : "rgba(255,255,255,0.1)"}
                          />
                          {errors.cvv && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors.cvv}</div>}
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Name on Card</label>
                        <input placeholder="Full name" value={card.name}
                          onChange={e => { setCard(c => ({ ...c, name: e.target.value })); setErrors({}); }}
                          style={inp("name")}
                          onFocus={e => e.target.style.borderColor = "#C8FF2B"}
                          onBlur={e => e.target.style.borderColor = errors.name ? "#ef4444" : "rgba(255,255,255,0.1)"}
                        />
                        {errors.name && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 4 }}>⚠ {errors.name}</div>}
                      </div>
                      {/* Card type indicators */}
                      <div style={{ display: "flex", gap: 8 }}>
                        {["VISA", "MC", "AMEX", "RuPay"].map(t => (
                          <div key={t} style={{ padding: "4px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{t}</div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {method === "netbanking" && (
                    <motion.div key="nb" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <label style={{ display: "block", fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>Select Bank</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {BANKS.map(b => (
                          <button key={b} onClick={() => { setBank(b); setErrors({}); }}
                            style={{
                              padding: "12px 16px", textAlign: "left", background: bank === b ? "rgba(229, 192, 123,0.12)" : "rgba(255,255,255,0.03)",
                              border: `1px solid ${bank === b ? "#C8FF2B" : "rgba(255,255,255,0.08)"}`, borderRadius: 8,
                              color: bank === b ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s",
                            }}>
                            🏦 {b}
                          </button>
                        ))}
                      </div>
                      {errors.bank && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 6 }}>⚠ {errors.bank}</div>}
                    </motion.div>
                  )}

                  {method === "wallet" && (
                    <motion.div key="wallet" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {WALLETS.map(w => (
                          <button key={w} onClick={() => { setWallet(w); setErrors({}); }}
                            style={{
                              padding: "16px", background: wallet === w ? "rgba(229, 192, 123,0.12)" : "rgba(255,255,255,0.03)",
                              border: `1px solid ${wallet === w ? "#C8FF2B" : "rgba(255,255,255,0.08)"}`, borderRadius: 10,
                              color: wallet === w ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s",
                            }}>
                            👛 {w}
                          </button>
                        ))}
                      </div>
                      {errors.wallet && <div style={{ color: "#ef4444", fontSize: "0.73rem", marginTop: 6 }}>⚠ {errors.wallet}</div>}
                    </motion.div>
                  )}
                </AnimatePresence>

                {method && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, backgroundColor: "#D4AF37" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={validateAndPay}
                    style={{
                      width: "100%", marginTop: 24, padding: "15px",
                      background: "#C8FF2B", color: "#fff", border: "none", borderRadius: 10,
                      cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem",
                      fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                      boxShadow: "0 0 30px rgba(229, 192, 123,0.4)",
                    }}>
                    Pay ₹{amount.toLocaleString("en-IN")} →
                  </motion.button>
                )}

                <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "rgba(255,255,255,0.25)", fontSize: "0.72rem" }}>
                  <span>🔒</span> <span>256-bit SSL encrypted · PCI DSS compliant</span>
                </div>
              </motion.div>
            )}

            {/* ── STEP 1: Processing ── */}
            {(step === 1 || processing) && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 28px" }}>
                  <svg style={{ position: "absolute", inset: 0, animation: "spin 1.2s linear infinite" }} viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" stroke="rgba(229, 192, 123,0.15)" strokeWidth="4" />
                    <path d="M40 4 A36 36 0 0 1 76 40" stroke="#C8FF2B" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
                    {countdown}
                  </div>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: "#fff", letterSpacing: "0.1em" }}>Processing Payment</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", marginTop: 8 }}>
                  {method === "upi" ? `Waiting for UPI confirmation from ${upiId}` :
                   method === "card" ? "Verifying card details..." :
                   method === "netbanking" ? `Redirecting to ${bank}...` :
                   `Processing via ${wallet}...`}
                </div>
                <div style={{ marginTop: 24, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3, ease: "linear" }}
                    style={{ height: "100%", background: "linear-gradient(to right, #C8FF2B, #06b6d4)", borderRadius: 2 }}
                  />
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Success ── */}
            {step === 2 && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "32px 16px" }}>
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                  style={{
                    width: 80, height: 80, borderRadius: "50%", background: "rgba(16,185,129,0.12)",
                    border: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "2rem", margin: "0 auto 24px",
                  }}>
                  ✅
                </motion.div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#fff", letterSpacing: "0.08em" }}>Payment Successful!</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: 8, lineHeight: 1.6 }}>
                  Your tickets for <strong style={{ color: "#C8FF2B" }}>{event?.name}</strong> are confirmed.<br />
                  <span style={{ color: "#C8FF2B", fontWeight: "bold" }}>✔ Ticket email with QR code dispatched to your inbox.</span>
                </div>

                {/* Interactive Brutalist QR Code Ticket Card */}
                <div style={{
                  margin: "24px 0",
                  padding: "24px",
                  background: "#161616",
                  border: "1px solid rgba(255,255,255,0.08)",
                  position: "relative",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#C8FF2B", textTransform: "uppercase", marginBottom: 12, fontFamily: "monospace" }}>
                    ENTRY PASS // BOARDING PASS
                  </div>
                  
                  {/* Generated QR Code SVG */}
                  <div style={{
                    width: 140,
                    height: 140,
                    margin: "0 auto 16px",
                    background: "#fff",
                    padding: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                  }}>
                    <svg viewBox="0 0 29 29" style={{ width: "100%", height: "100%", shapeRendering: "crispEdges" }}>
                      <path fill="#000" d="M0 0h7v7H0zm22 0h7v7h-7zM0 22h7v7H0z" />
                      <path fill="#000" d="M2 2h3v3H2zm20 0h3v3h-3zM2 24h3v3H2z" />
                      <path fill="#000" d="M9 1h1v2H9zm3 0h1v1h-1zm2 0h4v1h-4zm5 0h1v3h-1zm-9 3h3v1h-3zm5 0h2v1h-2zm4 0h1v1h-1z" />
                      <path fill="#000" d="M8 8h1v2H8zm2 0h2v1h-2zm3 0h2v3h-2zm3 0h2v1h-2zm3 0h4v1h-4z" />
                      <path fill="#000" d="M1 9h2v1H1zm3 0h1v2H4zm3 0h1v1H7zm11 0h2v2h-2zm4 0h3v1h-3z" />
                      <path fill="#000" d="M9 13h4v1H9zm6 0h2v2h-2zm4 0h1v1h-1zm2 0h2v1h-2zm-12 2h1v2H9zm3 0h2v1h-2zm4 0h2v1h-2zm3 0h2v3h-2z" />
                      <path fill="#000" d="M1 18h1v1H1zm3 0h3v1H4zm5 0h1v2H9zm3 0h2v1h-2zm4 0h3v1h-3z" />
                      <path fill="#000" d="M9 22h2v1H9zm4 0h1v1h-1zm2 0h2v2h-2zm4 0h2v1h-2zm-11 3h1v3H9zm3 0h3v1h-3zm5 0h2v1h-2z" />
                      <path fill="#000" d="M22 22h1v1h-1zm2 0h3v2h-3zm-2 3h2v1h-2zm3 0h2v3h-2zm-3 3h4v1h-4z" />
                    </svg>
                  </div>

                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 4 }}>
                    PASSENGER REFERENCE
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "1rem", color: "#C8FF2B", letterSpacing: "0.15em", fontWeight: "bold" }}>
                    TS-{Math.random().toString(36).toUpperCase().slice(2, 10)}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { onSuccess(); onClose(); }}
                    style={{
                      flex: 1, padding: "14px", background: "#C8FF2B", color: "#080808", border: "none",
                      borderRadius: 0, cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem",
                      fontWeight: 600, letterSpacing: "0.08em",
                    }}>
                    DONE
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => alert("Dispatched: Ticket Pass PDF is downloading...")}
                    style={{
                      flex: 1, padding: "14px", background: "transparent", color: "#fff",
                      border: "1px solid rgba(255,255,255,0.15)", borderRadius: 0,
                      cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.08em",
                    }}>
                    DOWNLOAD PASS
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
