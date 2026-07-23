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
function Sparkline({ data, color = "#C8FF2B", width = 120, height = 40 }) {
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
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" points={pts} />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 6) - 3;
        return i === data.length - 1 ? (
          <rect key={i} x={x - 3} y={y - 3} width={6} height={6} fill={color} stroke="#111111" strokeWidth={1} />
        ) : null;
      })}
    </svg>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function Badge({ status }) {
  const colors = {
    confirmed: { border: "#10b981", text: "#10b981" },
    pending: { border: "#f59e0b", text: "#f59e0b" },
    refunded: { border: "#ef4444", text: "#ef4444" },
    approved: { border: "#10b981", text: "#10b981" },
    rejected: { border: "#ef4444", text: "#ef4444" },
    "on-sale": { border: "#06b6d4", text: "#06b6d4" },
    "sold-out": { border: "#ef4444", text: "#ef4444" },
    cancelled: { border: "#78716c", text: "#78716c" },
  };
  const c = colors[status] || { border: "#f59e0b", text: "#f59e0b" };
  return (
    <span style={{
      padding: "4px 12px", borderRadius: 0, fontSize: "0.75rem",
      background: "transparent", border: `1px solid ${c.border}`,
      color: c.text, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontFamily: "'Space Mono', monospace",
    }}>
      {status === "on-sale" ? "ON-SALE" : status}
    </span>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, trend, sparkData, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: color }}
      className="brut-card"
      style={{
        background: "#111111", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 0, padding: "22px 24px",
        display: "flex", flexDirection: "column", gap: 8,
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
          <div className="bebas" style={{ fontSize: "2.5rem", color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>{value}</div>
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
      minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center",
      justifyContent: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap'); 
        @keyframes spin { to { transform: rotate(360deg); } } 
        * { font-family: 'Space Mono', monospace; box-sizing: border-box; }
        .bebas { font-family: 'Bebas Neue', sans-serif !important; }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: "#111111", border: "1px solid #C8FF2B",
          borderRadius: 0, padding: "48px 40px", width: "100%", maxWidth: 380,
        }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "#C8FF2B", textTransform: "uppercase", marginBottom: 8 }}>Tangy Sessions</div>
          <h1 className="bebas" style={{ fontSize: "3rem", color: "#fff", letterSpacing: "0.05em", margin: 0 }}>Admin Portal</h1>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {["user", "pass"].map(f => (
            <input key={f}
              placeholder={f === "user" ? "USERNAME" : "PASSWORD"}
              type={f === "pass" ? "password" : "text"}
              value={creds[f]}
              onChange={e => { setCreds(c => ({ ...c, [f]: e.target.value })); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{
                padding: "14px 16px", background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)", borderRadius: 0,
                color: "#fff", fontSize: "0.9rem", outline: "none", textTransform: f === "user" ? "uppercase" : "none"
              }}
              onFocus={e => e.target.style.borderColor = "#C8FF2B"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
            />
          ))}
          {error && <div style={{ color: "#ef4444", fontSize: "0.8rem", textAlign: "center" }}>⚠ {error}</div>}
          <motion.button onClick={handleLogin} whileHover={{ scale: 1.02, backgroundColor: "#fff" }} whileTap={{ scale: 0.97 }}
            style={{
              padding: "14px", background: "#C8FF2B", color: "#080808", border: "none", borderRadius: 0,
              cursor: "pointer", fontSize: "1rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
            {loading ? <><span style={{ width: 16, height: 16, border: "2px solid #080808", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> SIGNING IN...</> : "SIGN IN →"}
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
    showNote(`Volunteer \${status === "approved" ? "approved ✓" : "rejected"}`);
  };

  const updateArtistAppStatus = (id, appStatus) => {
    setArtists(prev => prev.map(a => a.id === id ? { ...a, appStatus } : a));
    showNote(`Artist \${appStatus === "approved" ? "approved ✓" : "rejected"}`);
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
      className="brut-filter-btn"
      style={{
        padding: "8px 16px", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase",
        background: active === val ? "#C8FF2B" : "transparent",
        color: active === val ? "#080808" : "rgba(255,255,255,0.5)",
        border: `1px solid \${active === val ? "#C8FF2B" : "rgba(255,255,255,0.2)"}`,
        borderRadius: 0, cursor: "pointer", transition: "all 0.2s", fontWeight: active === val ? "bold" : "normal",
      }}>
      {label}
    </button>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#080808", color: "#fff",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #111111; }
        ::-webkit-scrollbar-thumb { background: #C8FF2B; border-radius: 0px; }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Space Mono', monospace; }
        h1, h2, h3, h4, h5, h6, .bebas { font-family: 'Bebas Neue', sans-serif !important; }

        .dashboard-layout { display: flex; min-height: 100vh; flex-direction: row; }
        .sidebar { width: 260px; background: #111111; border-right: 1px solid #C8FF2B; padding: 28px 0; display: flex; flex-direction: column; flex-shrink: 0; position: sticky; top: 0; height: 100vh; }
        .sidebar-nav { flex: 1; padding: 20px 12px; display: flex; flex-direction: column; gap: 8px; }
        .sidebar-btn { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: transparent; border: 1px solid transparent; color: rgba(255,255,255,0.45); cursor: pointer; font-size: 0.85rem; text-align: left; transition: all 0.2s; border-radius: 0; text-transform: uppercase; letter-spacing: 0.05em; }
        .sidebar-btn.active { background: #C8FF2B; color: #080808; border: 1px solid #C8FF2B; font-weight: bold; }
        .sidebar-btn:hover:not(.active) { border-color: rgba(255,255,255,0.2); color: #fff; }
        
        .main-content { flex: 1; padding: 36px 40px; overflow-y: auto; max-width: calc(100vw - 260px); }
        
        .stat-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
        
        .brut-card { transition: border-color 0.2s; border-radius: 0; }
        .brut-card:hover { border-color: #C8FF2B !important; }
        
        .table-container { background: #111111; border: 1px solid rgba(255,255,255,0.1); border-radius: 0; overflow: hidden; }
        .table-responsive table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
        .table-responsive th { padding: 14px 20px; text-align: left; color: #C8FF2B; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .table-responsive td { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .table-responsive tr:hover { background: rgba(255,255,255,0.03); }
        
        .top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
        .brut-input { padding: 12px 16px; background: transparent; border: 1px solid rgba(255,255,255,0.2); border-radius: 0; color: #fff; font-size: 0.85rem; outline: none; width: 100%; transition: border 0.2s; }
        .brut-input:focus { border-color: #C8FF2B; }
        
        .brut-btn-action { padding: 8px 16px; border-radius: 0; cursor: pointer; font-size: 0.75rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em; transition: all 0.2s; border: 1px solid transparent; }
        .brut-btn-approve { background: #10b981; color: #080808; }
        .brut-btn-approve:hover { background: transparent; border-color: #10b981; color: #10b981; }
        .brut-btn-reject { background: #ef4444; color: #080808; }
        .brut-btn-reject:hover { background: transparent; border-color: #ef4444; color: #ef4444; }
        .brut-btn-edit { background: transparent; border-color: #C8FF2B; color: #C8FF2B; }
        .brut-btn-edit:hover { background: #C8FF2B; color: #080808; }

        @media (max-width: 768px) {
          .dashboard-layout { flex-direction: column; }
          .sidebar { width: 100%; height: auto; position: static; flex-direction: column; padding: 16px 0; border-right: none; border-bottom: 1px solid #C8FF2B; }
          .sidebar-nav { flex-direction: row; flex-wrap: wrap; padding: 10px 12px; }
          .sidebar-btn { flex: 1 1 45%; justify-content: center; }
          .main-content { max-width: 100%; padding: 20px 16px; }
          .top-bar { flex-direction: column; align-items: flex-start; gap: 16px; }
          .top-bar .search-container { width: 100%; }
          .top-bar input { width: 100% !important; }
          
          .table-responsive table, .table-responsive thead, .table-responsive tbody, .table-responsive th, .table-responsive td, .table-responsive tr { display: block; width: 100%; }
          .table-responsive thead tr { display: none; }
          .table-responsive tr { margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.2) !important; background: #111111; }
          .table-responsive td { position: relative; padding: 12px 16px 12px 40% !important; min-height: 40px; display: flex; justify-content: flex-end; align-items: center; text-align: right; border: none !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
          .table-responsive td::before { content: attr(data-label); position: absolute; left: 16px; width: 35%; text-align: left; font-size: 0.7rem; color: #C8FF2B; text-transform: uppercase; font-weight: bold; }
          
          .stat-cards { grid-template-columns: 1fr; }
          
          .edit-modal-content { padding: 24px 16px !important; }
        }
      `}</style>

      {/* Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{
              position: "fixed", bottom: 24, right: 24, zIndex: 9999,
              background: "#111", border: `1px solid \${notification.type === "success" ? "#10b981" : "#ef4444"}`,
              color: "#fff", padding: "12px 20px", borderRadius: 0, fontSize: "0.85rem",
            }}>
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ padding: "0 24px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "#C8FF2B", textTransform: "uppercase", marginBottom: 4 }}>Dashboard</div>
            <div className="bebas" style={{ fontSize: "2rem", color: "#fff", letterSpacing: "0.05em", lineHeight: 1 }}>TANGY</div>
          </div>
          <nav className="sidebar-nav">
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSearch(""); }}
                className={`sidebar-btn \${tab === t.id ? "active" : ""}`}>
                <span>{t.icon}</span> {t.label}
                {t.id === "volunteers" && pendingVols > 0 && (
                  <span style={{ marginLeft: "auto", background: tab === t.id ? "#080808" : "#C8FF2B", color: tab === t.id ? "#fff" : "#080808", padding: "2px 6px", fontSize: "0.65rem", fontWeight: 700 }}>{pendingVols}</span>
                )}
                {t.id === "artists" && pendingArtists > 0 && (
                  <span style={{ marginLeft: "auto", background: tab === t.id ? "#080808" : "#C8FF2B", color: tab === t.id ? "#fff" : "#080808", padding: "2px 6px", fontSize: "0.65rem", fontWeight: 700 }}>{pendingArtists}</span>
                )}
              </button>
            ))}
          </nav>
          <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}
              onMouseEnter={e => e.currentTarget.style.color = "#C8FF2B"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
              ← BACK TO SITE
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main className="main-content">
          {/* Top bar */}
          <div className="top-bar">
            <div>
              <h1 className="bebas" style={{ fontSize: "3rem", letterSpacing: "0.06em", marginBottom: 4, textTransform: "uppercase" }}>
                {TABS.find(t => t.id === tab)?.label}
              </h1>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
            {(tab === "bookings" || tab === "volunteers" || tab === "artists") && (
              <div className="search-container">
                <input placeholder="SEARCH..." value={search} onChange={e => setSearch(e.target.value)}
                  className="brut-input" style={{ width: 260 }} />
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">

            {/* ── OVERVIEW ── */}
            {tab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="stat-cards">
                  <StatCard label="Total Revenue" value={`₹\${(totalRevenue / 1000).toFixed(1)}K`} sub={`From \${bookings.filter(b => b.status === "confirmed").length} bookings`} color="#C8FF2B" icon="💰" sparkData={[42, 58, 71, 65, 83, 91, 105, 98, 120, 115, 132, 142]} trend="+24%" />
                  <StatCard label="Tickets Sold" value={totalTickets} sub="Across 3 events" color="#06b6d4" icon="🎟️" sparkData={[12, 18, 22, 19, 28, 34, 29, 38, 45, 41, 52, 58]} trend="+18%" />
                  <StatCard label="Volunteers" value={volunteers.length} sub={`\${pendingVols} pending review`} color="#f59e0b" icon="🤝" sparkData={[2, 3, 3, 4, 4, 5, 6, 6, 7, 8, 8, 9]} trend="+3" />
                  <StatCard label="Upcoming Events" value="3" sub="Next: Aug 15, 2025" color="#ef4444" icon="📅" sparkData={[1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3]} />
                </div>

                {/* Recent bookings table */}
                <div className="table-container">
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "0.85rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", fontWeight: "bold" }}>RECENT BOOKINGS</div>
                    <button onClick={() => setTab("bookings")} style={{ background: "none", border: "none", color: "#C8FF2B", cursor: "pointer", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>VIEW ALL →</button>
                  </div>
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          {["ID", "Name", "Event", "Tickets", "Amount", "Status"].map(h => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((b, i) => (
                          <motion.tr key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                            <td data-label="ID" style={{ color: "#C8FF2B" }}>{b.id}</td>
                            <td data-label="Name"><div>{b.name}</div><div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{b.email}</div></td>
                            <td data-label="Event" style={{ color: "rgba(255,255,255,0.6)" }}>{b.event}</td>
                            <td data-label="Tickets" style={{ color: "rgba(255,255,255,0.6)" }}>{b.tickets}</td>
                            <td data-label="Amount" className="bebas" style={{ fontSize: "1.2rem", letterSpacing: "0.05em" }}>₹{b.amount.toLocaleString("en-IN")}</td>
                            <td data-label="Status"><Badge status={b.status} /></td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Event capacity bars */}
                <div className="brut-card" style={{ marginTop: 24, background: "#111111", border: "1px solid rgba(255,255,255,0.1)", padding: "20px 24px" }}>
                  <div style={{ fontSize: "0.85rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: 20, fontWeight: "bold" }}>EVENT CAPACITY</div>
                  {events.map((ev, i) => (
                    <div key={ev.name} style={{ marginBottom: i < events.length - 1 ? 24 : 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: 8, textTransform: "uppercase" }}>
                        <span style={{ color: "#fff" }}>{ev.name}</span>
                        <span style={{ color: "#C8FF2B" }}>{ev.sold} / {ev.capacity} SOLD</span>
                      </div>
                      <div style={{ height: 12, background: "rgba(255,255,255,0.1)", overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)" }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `\${(ev.sold / ev.capacity) * 100}%` }}
                          transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                          style={{
                            height: "100%",
                            background: ev.sold / ev.capacity > 0.8 ? "#ef4444" : ev.sold / ev.capacity > 0.5 ? "#f59e0b" : "#C8FF2B"
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
                  <div style={{ marginLeft: "auto", fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", textTransform: "uppercase" }}>
                    {filteredBookings.length} RESULT{filteredBookings.length !== 1 ? "S" : ""}
                  </div>
                </div>
                <div className="table-container">
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          {["Booking ID", "Customer", "Event", "Qty", "Amount", "Method", "Date", "Status"].map(h => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {filteredBookings.map((b, i) => (
                            <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                              <td data-label="Booking ID" style={{ color: "#C8FF2B" }}>{b.id}</td>
                              <td data-label="Customer">
                                <div style={{ fontWeight: "bold" }}>{b.name}</div>
                                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>{b.email}</div>
                              </td>
                              <td data-label="Event" style={{ color: "rgba(255,255,255,0.6)" }}>{b.event}</td>
                              <td data-label="Qty" style={{ color: "rgba(255,255,255,0.6)" }}>{b.tickets}</td>
                              <td data-label="Amount" className="bebas" style={{ fontSize: "1.2rem", letterSpacing: "0.04em" }}>₹{b.amount.toLocaleString("en-IN")}</td>
                              <td data-label="Method" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", textTransform: "uppercase" }}>{b.method}</td>
                              <td data-label="Date" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>{b.date}</td>
                              <td data-label="Status"><Badge status={b.status} /></td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                        {filteredBookings.length === 0 && (
                          <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "0.85rem", textTransform: "uppercase" }}>No bookings found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
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
                      <motion.div key={v.id} className="brut-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}
                        style={{
                          background: "#111111", border: "1px solid rgba(255,255,255,0.1)",
                          padding: "18px 22px",
                          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                        }}>
                        <div style={{ width: 44, height: 44, background: "#C8FF2B", border: "1px solid #080808", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: "#080808", flexShrink: 0, fontWeight: "bold" }} className="bebas">
                          {v.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <div style={{ fontWeight: "bold", fontSize: "0.9rem", textTransform: "uppercase" }}>{v.name}</div>
                          <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.4)" }}>{v.email}</div>
                        </div>
                        <div style={{ minWidth: 110 }}>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 3, textTransform: "uppercase" }}>ROLE</div>
                          <div style={{ fontSize: "0.82rem", color: "#06b6d4", textTransform: "uppercase" }}>{v.role}</div>
                        </div>
                        <div style={{ minWidth: 100 }}>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 3, textTransform: "uppercase" }}>EVENT</div>
                          <div style={{ fontSize: "0.82rem", textTransform: "uppercase" }}>{v.event}</div>
                        </div>
                        <div style={{ minWidth: 90 }}>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 3, textTransform: "uppercase" }}>APPLIED</div>
                          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>{v.applied}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Badge status={v.status} />
                          {v.status === "pending" && (
                            <>
                              <button onClick={() => updateVolunteer(v.id, "approved")} className="brut-btn-action brut-btn-approve">APPROVE</button>
                              <button onClick={() => updateVolunteer(v.id, "rejected")} className="brut-btn-action brut-btn-reject">REJECT</button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredVolunteers.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.25)", fontSize: "0.9rem", textTransform: "uppercase" }}>No volunteers found</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── EVENTS ── */}
            {tab === "events" && (
              <motion.div key="events" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {events.map((ev, i) => (
                    <motion.div key={ev.name} className="brut-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.1)", padding: "24px 28px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
                        <div>
                          <div className="bebas" style={{ fontSize: "2rem", letterSpacing: "0.05em", marginBottom: 4, textTransform: "uppercase" }}>{ev.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>📅 {ev.date} · 📍 Bansilal Stepwell</div>
                        </div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <Badge status={ev.status} />
                          <button className="brut-btn-action brut-btn-edit" onClick={() => { setEditingEvent(i); setEditForm({ ...ev }); }}>
                            EDIT EVENT
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 20 }}>
                        {[
                          ["Revenue", `₹\${ev.revenue.toLocaleString("en-IN")}`, "#C8FF2B"],
                          ["Tickets Sold", ev.sold, "#06b6d4"],
                          ["Capacity", ev.capacity, "#f59e0b"],
                          ["Available", ev.capacity - ev.sold, ev.capacity - ev.sold < 30 ? "#ef4444" : "#10b981"],
                        ].map(([label, val, color]) => (
                          <div key={label} style={{ background: "#080808", border: "1px solid rgba(255,255,255,0.1)", padding: "14px 16px" }}>
                            <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                            <div className="bebas" style={{ fontSize: "1.8rem", color, letterSpacing: "0.04em" }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "uppercase" }}>
                          <span>Capacity utilization</span>
                          <span>{Math.round((ev.sold / ev.capacity) * 100)}%</span>
                        </div>
                        <div style={{ height: 12, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `\${(ev.sold / ev.capacity) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.15 }}
                            style={{
                              height: "100%",
                              background: ev.sold / ev.capacity > 0.8 ? "#ef4444" : "#06b6d4"
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
                      <motion.div key={a.id} className="brut-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.05 }}
                        style={{
                          background: "#111111", border: "1px solid rgba(255,255,255,0.1)",
                          padding: "18px 22px",
                          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                        }}>
                        
                        {/* Avatar */}
                        <div style={{ width: 48, height: 48, overflow: "hidden", border: `2px solid \${a.color || "#C8FF2B"}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#080808" }}>
                          {a.avatar ? (
                            <img src={a.avatar} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
                          ) : null}
                          <span className="bebas" style={{ display: a.avatar ? "none" : "flex", fontSize: "1.5rem", color: a.color || "#C8FF2B" }}>
                            {a.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>

                        {/* Name & Genre */}
                        <div style={{ flex: 1, minWidth: 160 }}>
                          <div style={{ fontWeight: "bold", fontSize: "0.95rem", color: "#fff", display: "flex", alignItems: "center", gap: 8, textTransform: "uppercase" }}>
                            {a.name}
                            <span style={{ fontSize: "0.7rem", padding: "2px 6px", background: "transparent", border: `1px solid \${a.color}`, color: a.color, textTransform: "uppercase" }}>{a.tags?.[0] || 'DJ'}</span>
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.4)", marginTop: 2, textTransform: "uppercase" }}>{a.genre}</div>
                        </div>

                        {/* Booking Status */}
                        <div style={{ minWidth: 110 }}>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 3, textTransform: "uppercase" }}>BOOKING STATUS</div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <select
                              value={a.status}
                              onChange={(e) => {
                                setArtists(prev => prev.map(art => art.id === a.id ? { ...art, status: e.target.value } : art));
                                showNote(`\${a.name}'s booking status updated to \${e.target.value}`);
                              }}
                              style={{
                                background: "#080808",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: a.status === "booked" ? "#06b6d4" : a.status === "available" ? "#10b981" : "#f59e0b",
                                fontSize: "0.76rem",
                                padding: "6px 8px",
                                outline: "none",
                                cursor: "pointer",
                                textTransform: "uppercase",
                              }}
                            >
                              <option value="available" style={{ color: "#10b981" }}>AVAILABLE</option>
                              <option value="booked" style={{ color: "#06b6d4" }}>BOOKED</option>
                              <option value="tentative" style={{ color: "#f59e0b" }}>TENTATIVE</option>
                              <option value="unavailable" style={{ color: "#ef4444" }}>UNAVAILABLE</option>
                            </select>
                          </div>
                        </div>

                        {/* Bio teaser */}
                        <div style={{ flex: "1 1 200px", minWidth: 200 }}>
                          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 3, textTransform: "uppercase" }}>BIO</div>
                          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260 }}>
                            "{a.bio}"
                          </div>
                        </div>

                        {/* Approval Status & Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Badge status={a.appStatus || "pending"} />
                          {a.appStatus === "pending" && (
                            <>
                              <button onClick={() => updateArtistAppStatus(a.id, "approved")} className="brut-btn-action brut-btn-approve">APPROVE</button>
                              <button onClick={() => updateArtistAppStatus(a.id, "rejected")} className="brut-btn-action brut-btn-reject">REJECT</button>
                            </>
                          )}
                          {a.appStatus === "approved" && (
                            <button onClick={() => updateArtistAppStatus(a.id, "pending")} className="brut-btn-action" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.6)" }}>REVOKE</button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredArtists.length === 0 && (
                    <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.25)", fontSize: "0.9rem", textTransform: "uppercase" }}>No artists found</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* ── EDIT EVENT BRUTALIST MODAL ── */}
      <AnimatePresence>
        {editingEvent !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(8, 8, 8, 0.9)",
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
              className="edit-modal-content"
              style={{
                background: "#111111",
                border: "2px solid #C8FF2B",
                width: "100%",
                maxWidth: 480,
                padding: "36px 40px",
                position: "relative",
                color: "#fff",
              }}
            >
              <h2 className="bebas" style={{ fontSize: "2.5rem", letterSpacing: "0.06em", marginBottom: 24, color: "#fff", textTransform: "uppercase" }}>
                EDIT EVENT
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: "bold" }}>Event Name</label>
                  <input
                    type="text"
                    className="brut-input"
                    value={editForm.name}
                    onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: "bold" }}>Date</label>
                  <input
                    type="text"
                    className="brut-input"
                    value={editForm.date}
                    onChange={e => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: "bold" }}>Capacity</label>
                    <input
                      type="number"
                      className="brut-input"
                      value={editForm.capacity}
                      onChange={e => setEditForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: "bold" }}>Sold</label>
                    <input
                      type="number"
                      className="brut-input"
                      value={editForm.sold}
                      onChange={e => setEditForm(prev => ({ ...prev, sold: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: "bold" }}>Revenue (₹)</label>
                    <input
                      type="number"
                      className="brut-input"
                      value={editForm.revenue}
                      onChange={e => setEditForm(prev => ({ ...prev, revenue: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", display: "block", marginBottom: 6, fontWeight: "bold" }}>Status</label>
                    <select
                      value={editForm.status}
                      onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                      className="brut-input"
                      style={{ height: "46px" }}
                    >
                      <option value="on-sale">ON SALE</option>
                      <option value="sold-out">SOLD OUT</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                  <button
                    onClick={() => setEditingEvent(null)}
                    style={{
                      flex: 1, padding: "14px", background: "transparent", border: "1px solid rgba(255,255,255,0.4)",
                      color: "#fff", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em"
                    }}
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => {
                      setEvents(prev => prev.map((ev, i) => i === editingEvent ? editForm : ev));
                      setEditingEvent(null);
                      showNote("Event updated successfully!");
                    }}
                    style={{
                      flex: 1, padding: "14px", background: "#C8FF2B", border: "1px solid #C8FF2B",
                      color: "#080808", cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em"
                    }}
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
