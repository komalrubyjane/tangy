import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSharedStore, MOCK_INITIAL_ARTISTS } from "../store";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
  { id: "TS-A1B2C3D4", name: "Arjun Mehta", email: "arjun@email.com", event: "Vol. 1", tickets: 2, amount: 1598, status: "confirmed", date: "2025-07-12", method: "UPI" },
  { id: "TS-E5F6G7H8", name: "Priya Sharma", email: "priya@email.com", event: "Vol. 2", tickets: 4, amount: 3996, status: "confirmed", date: "2025-07-14", method: "Card" },
  { id: "TS-I9J0K1L2", name: "Rahul Nair", email: "rahul@email.com", event: "Solstice", tickets: 1, amount: 1299, status: "pending", date: "2025-07-15", method: "UPI" },
  { id: "TS-M3N4O5P6", name: "Sneha Reddy", email: "sneha@email.com", event: "Vol. 1", tickets: 3, amount: 2397, status: "confirmed", date: "2025-07-16", method: "NetBanking" },
  { id: "TS-Q7R8S9T0", name: "Karan Patel", email: "karan@email.com", event: "Vol. 2", tickets: 2, amount: 1998, status: "refunded", date: "2025-07-16", method: "Card" },
  { id: "TS-U1V2W3X4", name: "Anjali Iyer", email: "anjali@email.com", event: "Solstice", tickets: 5, amount: 6495, status: "confirmed", date: "2025-07-17", method: "UPI" },
  { id: "TS-Y5Z6A7B8", name: "Dev Krishnan", email: "dev@email.com", event: "Vol. 1", tickets: 1, amount: 799, status: "confirmed", date: "2025-07-18", method: "Wallet" },
];

const MOCK_VOLUNTEERS = [
  { id: "VOL-A1B2C3D4", name: "Meera Pillai", email: "meera@email.com", role: "Social Media", event: "Vol. 1", status: "approved", applied: "2025-07-10" },
  { id: "VOL-E5F6G7H8", name: "Rohan Sinha", email: "rohan@email.com", role: "Crew", event: "Vol. 2", status: "pending", applied: "2025-07-12" },
  { id: "VOL-I9J0K1L2", name: "Lakshmi Rao", email: "lakshmi@email.com", role: "Hospitality", event: "Solstice", status: "approved", applied: "2025-07-13" },
  { id: "VOL-M3N4O5P6", name: "Aditya Gupta", email: "aditya@email.com", role: "Security", event: "Vol. 1", status: "pending", applied: "2025-07-14" },
  { id: "VOL-Q7R8S9T0", name: "Nandini Joshi", email: "nandini@email.com", role: "Artist Liaison", event: "Vol. 2", status: "rejected", applied: "2025-07-15" },
  { id: "VOL-U1V2W3X4", name: "Vivek Menon", email: "vivek@email.com", role: "Food & Beverage", event: "Solstice", status: "approved", applied: "2025-07-16" },
];

const EVENTS_DATA = [
  { name: "Tangy Sessions Vol. 1", date: "Aug 15, 2025", capacity: 200, sold: 148, revenue: 118152, status: "on-sale" },
  { name: "Tangy Sessions Vol. 2", date: "Sep 20, 2025", capacity: 250, sold: 67, revenue: 66933, status: "on-sale" },
  { name: "Tangy Sessions: Solstice", date: "Dec 21, 2025", capacity: 180, sold: 23, revenue: 29877, status: "on-sale" },
];

// ─── MINI CHART (sparkline) ───────────────────────────────────────────────────
function Sparkline({ data, color = "#E5C07B", width = 120, height = 40 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <polygon
        fill={`url(#sg-${color.replace("#","")})`}
        points={`0,${height} ${pts} ${width},${height}`}
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 6) - 3;
        return i === data.length - 1 ? (
          <circle key={i} cx={x} cy={y} r={4} fill={color} stroke="#0d0d0d" strokeWidth={2} />
        ) : null;
      })}
    </svg>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function Badge({ status }) {
  const colors = {
    confirmed: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", text: "#10b981" },
    pending: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", text: "#f59e0b" },
    refunded: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", text: "#ef4444" },
    approved: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", text: "#10b981" },
    rejected: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", text: "#ef4444" },
    "on-sale": { bg: "rgba(6,182,212,0.1)", border: "rgba(6,182,212,0.25)", text: "#06b6d4" },
    "sold-out": { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)", text: "#ef4444" },
    cancelled: { bg: "rgba(120,113,108,0.1)", border: "rgba(120,113,108,0.25)", text: "#78716c" },
  };
  const c = colors[status] || { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", text: "#f59e0b" };
  return (
    <span style={{
      padding: "7px 16px", borderRadius: 6, fontSize: "0.78rem",
      background: c.bg, border: `1px solid ${c.border}`,
      color: c.text, textTransform: "capitalize", letterSpacing: "0.05em", whiteSpace: "nowrap",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontWeight: 500, fontFamily: "inherit",
    }}>
      {status === "on-sale" ? "On-Sale" : status}
    </span>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, trend, sparkData, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: color + "44" }}
      style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, padding: "22px 24px",
        display: "flex", flexDirection: "column", gap: 8,
        transition: "border-color 0.2s",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "0.68rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: "0.75rem", color: color, marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <span style={{ fontSize: "1.5rem" }}>{icon}</span>
          {sparkData && <Sparkline data={sparkData} color={color} />}
        </div>
      </div>
      {trend && (
        <div style={{ fontSize: "0.75rem", color: trend.startsWith("+") ? "#10b981" : "#ef4444", marginTop: 4 }}>
          {trend.startsWith("+") ? "▲" : "▼"} {trend} vs last month
        </div>
      )}
    </motion.div>
  );
}

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!creds.user || !creds.pass) { setError("Enter credentials"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (creds.user === "admin" && creds.pass === "tangy2025") {
      onLogin();
    } else {
      setError("Invalid credentials. Hint: admin / tangy2025");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap'); @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: "#0d0d0d", border: "1px solid rgba(229, 192, 123,0.2)",
          borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 380,
          boxShadow: "0 0 80px rgba(229, 192, 123,0.12)",
        }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "#E5C07B", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>Tangy Sessions</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", color: "#fff", letterSpacing: "0.05em", margin: 0 }}>Admin Portal</h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {["user", "pass"].map(f => (
            <input key={f}
              placeholder={f === "user" ? "Username" : "Password"}
              type={f === "pass" ? "password" : "text"}
              value={creds[f]}
              onChange={e => { setCreds(c => ({ ...c, [f]: e.target.value })); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{
                padding: "13px 16px", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
                color: "#fff", fontSize: "0.9rem", outline: "none", fontFamily: "inherit",
              }}
            />
          ))}
          {error && <div style={{ color: "#ef4444", fontSize: "0.78rem", textAlign: "center" }}>⚠ {error}</div>}
          <motion.button onClick={handleLogin} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{
              padding: "14px", background: "#E5C07B", color: "#fff", border: "none", borderRadius: 8,
              cursor: "pointer", fontFamily: "inherit", fontSize: "0.9rem", fontWeight: 600,
              letterSpacing: "0.08em", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            {loading ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Signing in...</> : "Sign In →"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("overview");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [volunteerFilter, setVolunteerFilter] = useState("all");
  const [artistFilter, setArtistFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [volunteers, setVolunteers] = useState(MOCK_VOLUNTEERS);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [events, setEvents] = useState(EVENTS_DATA);
  const [artists, setArtists] = useSharedStore("artists", MOCK_INITIAL_ARTISTS);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", date: "", capacity: 0, sold: 0, revenue: 0, status: "" });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setSearch("");
  }, [tab]);

  const showNote = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  // ── Derived stats
  const totalRevenue = bookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.amount, 0);
  const totalTickets = bookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.tickets, 0);
  const pendingVols = volunteers.filter(v => v.status === "pending").length;
  const pendingArtists = artists.filter(a => a.appStatus === "pending").length;

  const filteredBookings = bookings.filter(b => {
    const matchFilter = bookingFilter === "all" || b.status === bookingFilter;
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()) || b.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filteredVolunteers = volunteers.filter(v => {
    const matchFilter = volunteerFilter === "all" || v.status === volunteerFilter;
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filteredArtists = artists.filter(a => {
    const matchFilter = artistFilter === "all" || a.appStatus === artistFilter || a.status === artistFilter;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.genre.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const updateVolunteer = (id, status) => {
    setVolunteers(vs => vs.map(v => v.id === id ? { ...v, status } : v));
    showNote(`Volunteer ${status === "approved" ? "approved ✓" : "rejected"}`);
  };

  const updateArtistAppStatus = (id, appStatus) => {
    setArtists(prev => prev.map(a => a.id === id ? { ...a, appStatus } : a));
    showNote(`Artist ${appStatus === "approved" ? "approved ✓" : "rejected"}`);
  };

  const TABS = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "bookings", label: "Bookings", icon: "🎟️" },
    { id: "volunteers", label: "Volunteers", icon: "🤝" },
    { id: "events", label: "Events", icon: "📅" },
    { id: "artists", label: "Artists", icon: "🎵" },
  ];

  const FILTER_BTN = (active, label, val, setter) => (
    <button onClick={() => setter(val)}
      style={{
        padding: "6px 14px", fontSize: "0.75rem", letterSpacing: "0.08em",
        background: active === val ? "#E5C07B" : "rgba(255,255,255,0.04)",
        color: active === val ? "#fff" : "rgba(255,255,255,0.5)",
        border: `1px solid ${active === val ? "#E5C07B" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20, cursor: "pointer", transition: "all 0.2s",
      }}>
      {label}
    </button>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#070707", color: "#fff",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #E5C07B; border-radius: 2px; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{
              position: "fixed", bottom: 24, right: 24, zIndex: 9999,
              background: "#111", border: `1px solid ${notification.type === "success" ? "#10b981" : "#ef4444"}`,
              color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: "0.85rem",
              boxShadow: `0 0 20px ${notification.type === "success" ? "#10b98144" : "#ef444444"}`,
            }}>
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside style={{
          width: 220, background: "#0d0d0d", borderRight: "1px solid rgba(255,255,255,0.06)",
          padding: "28px 0", display: "flex", flexDirection: "column", flexShrink: 0,
          position: "sticky", top: 0, height: "100vh",
        }}>
          <div style={{ padding: "0 24px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#E5C07B", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 4 }}>Dashboard</div>
            <img
              src="/logo.svg"
              alt="Tangy Sessions Logo"
              style={{ height: 36, marginTop: 4 }}
            />
          </div>
          <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSearch(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
                  background: tab === t.id ? "rgba(229, 192, 123,0.15)" : "transparent",
                  border: `1px solid ${tab === t.id ? "rgba(229, 192, 123,0.3)" : "transparent"}`,
                  borderRadius: 8, color: tab === t.id ? "#fff" : "rgba(255,255,255,0.45)",
                  cursor: "pointer", fontSize: "0.85rem", fontFamily: "inherit", textAlign: "left",
                  transition: "all 0.2s",
                }}>
                <span>{t.icon}</span> {t.label}
                {t.id === "volunteers" && pendingVols > 0 && (
                  <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#000", borderRadius: 10, padding: "1px 7px", fontSize: "0.65rem", fontWeight: 700 }}>{pendingVols}</span>
                )}
                {t.id === "artists" && pendingArtists > 0 && (
                  <span style={{ marginLeft: "auto", background: "#E5C07B", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: "0.65rem", fontWeight: 700 }}>{pendingArtists}</span>
                )}
              </button>
            ))}
          </nav>
          <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.8rem", borderRadius: 6 }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
              ← Back to Site
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto", maxWidth: "calc(100vw - 220px)" }}>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
            <div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em", marginBottom: 4 }}>
                {TABS.find(t => t.id === tab)?.label}
              </h1>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
            {(tab === "bookings" || tab === "volunteers" || tab === "artists") && (
              <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                style={{
                  padding: "10px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, color: "#fff", fontSize: "0.85rem", outline: "none", fontFamily: "inherit", width: 220,
                }} />
            )}
          </div>

          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
                  <StatCard label="Total Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}K`} sub={`From ${bookings.filter(b => b.status === "confirmed").length} bookings`} color="#E5C07B" icon="💰" sparkData={[42, 58, 71, 65, 83, 91, 105, 98, 120, 115, 132, 142]} trend="+24%" />
                  <StatCard label="Tickets Sold" value={totalTickets} sub="Across 3 events" color="#06b6d4" icon="🎟️" sparkData={[12, 18, 22, 19, 28, 34, 29, 38, 45, 41, 52, 58]} trend="+18%" />
                  <StatCard label="Volunteers" value={volunteers.length} sub={`${pendingVols} pending review`} color="#F9E0A2" icon="🤝" sparkData={[2, 3, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9]} trend="+3" />
                  <StatCard label="Upcoming Events" value="3" sub="Next: Aug 15, 2025" color="#f59e0b" icon="📅" sparkData={[1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3]} />
                </div>

                {/* Recent bookings table */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Recent Bookings</div>
                    <button onClick={() => setTab("bookings")} style={{ background: "none", border: "none", color: "#E5C07B", cursor: "pointer", fontSize: "0.78rem" }}>View all →</button>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {["ID", "Name", "Event", "Tickets", "Amount", "Status"].map(h => (
                            <th key={h} style={{ padding: "12px 20px", textAlign: "left", color: "rgba(255,255,255,0.35)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((b, i) => (
                          <motion.tr key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: "0.75rem", color: "#E5C07B" }}>{b.id}</td>
                            <td style={{ padding: "14px 20px" }}><div>{b.name}</div><div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{b.email}</div></td>
                            <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.6)" }}>{b.event}</td>
                            <td style={{ padding: "14px 20px", color: "rgba(255,255,255,0.6)" }}>{b.tickets}</td>
                            <td style={{ padding: "14px 20px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.05em" }}>₹{b.amount.toLocaleString("en-IN")}</td>
                            <td style={{ padding: "14px 20px" }}><Badge status={b.status} /></td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Event capacity bars */}
                <div style={{ marginTop: 24, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 24px" }}>
                  <div style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 20 }}>Event Capacity</div>
                  {events.map((ev, i) => (
                    <div key={ev.name} style={{ marginBottom: i < events.length - 1 ? 20 : 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: 8 }}>
                        <span style={{ color: "#fff" }}>{ev.name}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)" }}>{ev.sold}/{ev.capacity} sold</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${(ev.sold / ev.capacity) * 100}%` }}
                          transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                          style={{
                            height: "100%", borderRadius: 3,
                            background: ev.sold / ev.capacity > 0.8 ? "#ef4444" : ev.sold / ev.capacity > 0.5 ? "#f59e0b" : "#E5C07B"
                          }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── BOOKINGS ── */}
            {tab === "bookings" && (
              <motion.div key="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  {["all", "confirmed", "pending", "refunded"].map(f => FILTER_BTN(bookingFilter, f.charAt(0).toUpperCase() + f.slice(1), f, setBookingFilter))}
                  <div style={{ marginLeft: "auto", fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center" }}>
                    {filteredBookings.length} result{filteredBookings.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          {["Booking ID", "Customer", "Event", "Qty", "Amount", "Method", "Date", "Status"].map(h => (
                            <th key={h} style={{ padding: "12px 18px", textAlign: "left", color: "rgba(255,255,255,0.35)", fontSize: "0.67rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {filteredBookings.map((b, i) => (
                            <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                              <td style={{ padding: "14px 18px", fontFamily: "monospace", fontSize: "0.73rem", color: "#E5C07B", whiteSpace: "nowrap" }}>{b.id}</td>
                              <td style={{ padding: "14px 18px", whiteSpace: "nowrap" }}>
                                <div style={{ fontWeight: 500 }}>{b.name}</div>
                                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{b.email}</div>
                              </td>
                              <td style={{ padding: "14px 18px", color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>{b.event}</td>
                              <td style={{ padding: "14px 18px", color: "rgba(255,255,255,0.6)", textAlign: "center" }}>{b.tickets}</td>
                              <td style={{ padding: "14px 18px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>₹{b.amount.toLocaleString("en-IN")}</td>
                              <td style={{ padding: "14px 18px", color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>{b.method}</td>
                              <td style={{ padding: "14px 18px", color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", whiteSpace: "nowrap" }}>{b.date}</td>
                              <td style={{ padding: "14px 18px" }}><Badge status={b.status} /></td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                        {filteredBookings.length === 0 && (
                          <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.85rem" }}>No bookings found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
                    <span>Total: ₹{filteredBookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.amount, 0).toLocaleString("en-IN")} confirmed</span>
                    <span>{filteredBookings.length} entries</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── VOLUNTEERS ── */}
            {tab === "volunteers" && (
              <motion.div key="volunteers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                  {["all", "pending", "approved", "rejected"].map(f => FILTER_BTN(volunteerFilter, f.charAt(0).toUpperCase() + f.slice(1), f, setVolunteerFilter))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <AnimatePresence>
                    {filteredVolunteers.map((v, i) => (
                      <motion.div key={v.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}
                        style={{
                          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 12, padding: "18px 22px",
                          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                        }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(229, 192, 123,0.15)", border: "1px solid rgba(229, 192, 123,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", color: "#E5C07B", flexShrink: 0 }}>
                          {v.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{v.name}</div>
                          <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.4)" }}>{v.email}</div>
                        </div>
                        <div style={{ minWidth: 110 }}>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>ROLE</div>
                          <div style={{ fontSize: "0.82rem", color: "#06b6d4" }}>{v.role}</div>
                        </div>
                        <div style={{ minWidth: 100 }}>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>EVENT</div>
                          <div style={{ fontSize: "0.82rem" }}>{v.event}</div>
                        </div>
                        <div style={{ minWidth: 90 }}>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>APPLIED</div>
                          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>{v.applied}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Badge status={v.status} />
                          {v.status === "pending" && (
                            <>
                              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => updateVolunteer(v.id, "approved")}
                                style={{ padding: "6px 14px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, color: "#10b981", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>
                                ✓ Approve
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => updateVolunteer(v.id, "rejected")}
                                style={{ padding: "6px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, color: "#ef4444", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>
                                ✕ Reject
                              </motion.button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredVolunteers.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.25)", fontSize: "0.9rem" }}>No volunteers found</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── EVENTS ── */}
            {tab === "events" && (
              <motion.div key="events" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {events.map((ev, i) => (
                    <motion.div key={ev.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "24px 28px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
                        <div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em", marginBottom: 4 }}>{ev.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>📅 {ev.date} · 📍 Bansilal Stepwell</div>
                        </div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <Badge status={ev.status} />
                          <button style={{ padding: "7px 16px", background: "rgba(229, 192, 123,0.1)", border: "1px solid rgba(229, 192, 123,0.25)", borderRadius: 6, color: "#E5C07B", cursor: "pointer", fontSize: "0.78rem", fontFamily: "inherit", transition: "all 0.2s" }}
                            onClick={() => { setEditingEvent(i); setEditForm({ ...ev }); }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(229, 192, 123,0.2)"; e.currentTarget.style.borderColor = "rgba(229, 192, 123,0.4)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(229, 192, 123,0.1)"; e.currentTarget.style.borderColor = "rgba(229, 192, 123,0.25)"; }}>
                            Edit Event
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 20 }}>
                        {[
                          ["Revenue", `₹${ev.revenue.toLocaleString("en-IN")}`, "#E5C07B"],
                          ["Tickets Sold", ev.sold, "#06b6d4"],
                          ["Capacity", ev.capacity, "#F9E0A2"],
                          ["Available", ev.capacity - ev.sold, ev.capacity - ev.sold < 30 ? "#ef4444" : "#10b981"],
                        ].map(([label, val, color]) => (
                          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 16px" }}>
                            <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color, letterSpacing: "0.04em" }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                          <span>Capacity utilization</span>
                          <span>{Math.round((ev.sold / ev.capacity) * 100)}%</span>
                        </div>
                        <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${(ev.sold / ev.capacity) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.15 }}
                            style={{
                              height: "100%", borderRadius: 4,
                              background: `linear-gradient(to right, #E5C07B, ${ev.sold / ev.capacity > 0.8 ? "#ef4444" : "#06b6d4"})`,
                            }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── ARTISTS ── */}
            {tab === "artists" && (
              <motion.div key="artists" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {FILTER_BTN(artistFilter, "All Artists", "all", setArtistFilter)}
                    {FILTER_BTN(artistFilter, "Approved", "approved", setArtistFilter)}
                    {FILTER_BTN(artistFilter, "Pending Approval", "pending", setArtistFilter)}
                    {FILTER_BTN(artistFilter, "Booked", "booked", setArtistFilter)}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <AnimatePresence mode="popLayout">
                    {filteredArtists.map((a, i) => (
                      <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}
                        style={{
                          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: 12, padding: "18px 22px",
                          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                        }}>
                        
                        {/* Avatar */}
                        <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", border: `2px solid ${a.color || "#E5C07B"}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)" }}>
                          {a.avatar ? (
                            <img src={a.avatar} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
                          ) : null}
                          <span style={{ display: a.avatar ? "none" : "flex", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: a.color || "#E5C07B" }}>
                            {a.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>

                        {/* Name & Genre */}
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                            {a.name}
                            <span style={{ fontSize: "0.7rem", padding: "2px 6px", background: `${a.color}15`, border: `1px solid ${a.color}35`, color: a.color, borderRadius: 4, textTransform: "uppercase" }}>{a.tags?.[0] || 'DJ'}</span>
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{a.genre}</div>
                        </div>

                        {/* Booking Status */}
                        <div style={{ minWidth: 110 }}>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>BOOKING STATUS</div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <select
                              value={a.status}
                              onChange={(e) => {
                                setArtists(prev => prev.map(art => art.id === a.id ? { ...art, status: e.target.value } : art));
                                showNote(`${a.name}'s booking status updated to ${e.target.value}`);
                              }}
                              style={{
                                background: "rgba(20,20,28,1)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 6,
                                color: a.status === "booked" ? "#06b6d4" : a.status === "available" ? "#10b981" : "#f59e0b",
                                fontSize: "0.76rem",
                                padding: "4px 8px",
                                outline: "none",
                                cursor: "pointer",
                              }}
                            >
                              <option value="available" style={{ color: "#10b981" }}>Available</option>
                              <option value="booked" style={{ color: "#06b6d4" }}>Booked</option>
                              <option value="tentative" style={{ color: "#f59e0b" }}>Tentative</option>
                              <option value="unavailable" style={{ color: "#ef4444" }}>Unavailable</option>
                            </select>
                          </div>
                        </div>

                        {/* Bio teaser */}
                        <div style={{ flex: "1 1 200px", minWidth: 200 }}>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>BIO</div>
                          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260 }}>
                            "{a.bio}"
                          </div>
                        </div>

                        {/* Approval Status & Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Badge status={a.appStatus || "pending"} />
                          {a.appStatus === "pending" && (
                            <>
                              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => updateArtistAppStatus(a.id, "approved")}
                                style={{ padding: "6px 14px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, color: "#10b981", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>
                                ✓ Approve
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => updateArtistAppStatus(a.id, "rejected")}
                                style={{ padding: "6px 14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, color: "#ef4444", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>
                                ✕ Reject
                              </motion.button>
                            </>
                          )}
                          {a.appStatus === "approved" && (
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => updateArtistAppStatus(a.id, "pending")}
                              style={{ padding: "6px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.75rem", fontFamily: "inherit" }}>
                              Revoke
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredArtists.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.25)", fontSize: "0.9rem" }}>No artists found</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ── EDIT EVENT LIQUID GLASS MODAL ── */}
      <AnimatePresence>
        {editingEvent !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              style={{
                background: "linear-gradient(135deg, rgba(16,16,24,0.9) 0%, rgba(10,10,14,0.95) 100%)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(229, 192, 123, 0.25)",
                boxShadow: "0 30px 70px rgba(0,0,0,0.8), 0 0 50px rgba(229, 192, 123, 0.15), inset 0 1px 1px rgba(255,255,255,0.05)",
                borderRadius: 24,
                width: "100%",
                maxWidth: 480,
                padding: "36px 40px",
                position: "relative",
                color: "#fff",
              }}
            >
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em", marginBottom: 24, color: "#fff" }}>
                Edit Event
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Event Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      color: "#fff",
                      fontSize: "0.88rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Date</label>
                  <input
                    type="text"
                    value={editForm.date}
                    onChange={e => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      color: "#fff",
                      fontSize: "0.88rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Capacity</label>
                    <input
                      type="number"
                      value={editForm.capacity}
                      onChange={e => setEditForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Sold</label>
                    <input
                      type="number"
                      value={editForm.sold}
                      onChange={e => setEditForm(prev => ({ ...prev, sold: parseInt(e.target.value) || 0 }))}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Revenue (₹)</label>
                    <input
                      type="number"
                      value={editForm.revenue}
                      onChange={e => setEditForm(prev => ({ ...prev, revenue: parseInt(e.target.value) || 0 }))}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Status</label>
                    <select
                      value={editForm.status}
                      onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "11px 14px",
                        background: "rgba(20,20,28,1)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none",
                        height: "43px",
                      }}
                    >
                      <option value="on-sale">On Sale</option>
                      <option value="sold-out">Sold Out</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditingEvent(null)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 8,
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontFamily: "inherit",
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(229, 192, 123, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setEvents(prev => prev.map((ev, i) => i === editingEvent ? editForm : ev));
                      setEditingEvent(null);
                      showNote("Event updated successfully!");
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#E5C07B",
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontFamily: "inherit",
                      fontWeight: 600,
                    }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
