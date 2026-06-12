import { useState, useEffect, useRef, createContext, useContext } from "react";
import { useSharedStore, MOCK_INITIAL_ARTISTS } from './src/store';
import { useModal } from './src/components/ModalProvider';

/* ============================================================
   TANGY SESSIONS — ARTIST PORTAL
   Underground electronic music · Bansilal Stepwell · Hyderabad
   ============================================================ */

// ── Fonts & Global Styles ────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { 
      background: #070707; 
      color: #ffffff; 
      font-family: 'DM Sans', sans-serif;
      overflow-x: hidden;
      min-height: 100vh;
    }

    :root {
      --tangy-black:    #070707;
      --tangy-deep:     #050505;
      --tangy-card:     rgba(8,8,12,0.72);
      --tangy-border:   rgba(139, 92, 246,0.22);
      --tangy-amber:    #8B5CF6;
      --tangy-amber-dim:#6d28d9;
      --tangy-rust:     #06b6d4;
      --tangy-cream:    #ffffff;
      --tangy-muted:    rgba(255,255,255,0.65);
      --tangy-glow:     rgba(139, 92, 246,0.2);
      --glass-bg:       linear-gradient(135deg, rgba(8,8,12,0.82) 0%, rgba(8,8,12,0.62) 100%);
      --glass-border:   rgba(139, 92, 246,0.28);
      --glass-blur:     24px;
      --glass-shadow:   0 20px 40px rgba(0,0,0,0.7), 0 0 30px rgba(139, 92, 246,0.12), inset 0 1px 1px rgba(255,255,255,0.05);
    }

    ::selection { background: var(--tangy-amber); color: #070707; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--tangy-black); }
    ::-webkit-scrollbar-thumb { background: var(--tangy-amber-dim); border-radius: 2px; }

    /* Grain overlay */
    .grain::after {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 180px;
      opacity: 0.032;
      pointer-events: none;
      z-index: 9999;
    }

    .font-display { font-family: 'Bebas Neue', sans-serif; }
    .font-mono    { font-family: 'DM Sans', sans-serif; }
    .font-syne    { font-family: 'DM Sans', sans-serif; }

    /* Animations */
    @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes pulse    { 0%,100%{opacity:.4;} 50%{opacity:1;} }
    @keyframes float    { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-10px);} }
    @keyframes shimmer  { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
    @keyframes rotateSlow { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
    @keyframes slideIn  { from{transform:translateX(100%);opacity:0;} to{transform:translateX(0);opacity:1;} }
    @keyframes ambientPulse { 0%,100%{opacity:0.3;transform:scale(1);} 50%{opacity:0.6;transform:scale(1.08);} }
    @keyframes subtleZoom {
      0% { transform: scale(1); }
      100% { transform: scale(1.1); }
    }

    .anim-fadeup  { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
    .anim-fadein  { animation: fadeIn 0.6s ease both; }
    .anim-float   { animation: float 6s ease-in-out infinite; }
    .anim-pulse   { animation: pulse 2.5s ease-in-out infinite; }

    /* Glass card — premium glassmorphism system */
    .glass {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      box-shadow: var(--glass-shadow);
    }

    /* Lighter glass for nested elements */
    .glass-sm {
      background: rgba(8,8,12,0.55);
      border: 1px solid rgba(139, 92, 246,0.18);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
    }

    /* Card component — for dashboard cards, artist cards etc. */
    .t-card {
      background: linear-gradient(135deg, rgba(8,8,12,0.78) 0%, rgba(8,8,12,0.55) 100%);
      border: 1px solid rgba(139, 92, 246,0.22);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 16px 32px rgba(0,0,0,0.6), 0 0 20px rgba(139, 92, 246,0.08), inset 0 1px 0 rgba(255,255,255,0.04);
      border-radius: 12px;
      transition: box-shadow 0.3s, border-color 0.3s;
    }
    .t-card:hover {
      border-color: rgba(139, 92, 246,0.38);
      box-shadow: 0 20px 40px rgba(0,0,0,0.7), 0 0 30px rgba(139, 92, 246,0.18), inset 0 1px 0 rgba(255,255,255,0.06);
    }

    /* Amber glow text */
    .text-amber { color: var(--tangy-amber); }
    .text-muted  { color: var(--tangy-muted); }
    .text-cream  { color: var(--tangy-cream); }

    /* Input */
    .t-input {
      width: 100%;
      background: rgba(0,0,0,0.45);
      border: 1px solid rgba(139, 92, 246,0.2);
      border-radius: 6px;
      padding: 0.85rem 1rem;
      color: var(--tangy-cream);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.875rem;
      transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
      outline: none;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
    .t-input:focus {
      border-color: var(--tangy-amber);
      background: rgba(139, 92, 246,0.08);
      box-shadow: 0 0 0 3px rgba(139, 92, 246,0.12), 0 0 16px rgba(139, 92, 246,0.1);
    }
    .t-input::placeholder { color: rgba(255,255,255,0.3); }

    /* Button */
    .t-btn-primary {
      background: var(--tangy-amber);
      color: #070707;
      border: none;
      padding: 0.9rem 2rem;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 3px;
      transition: all 0.25s;
      position: relative;
      overflow: hidden;
    }
    .t-btn-primary:hover { background: #a855f7; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(139, 92, 246,0.3); }
    .t-btn-primary:active { transform: translateY(0); }

    .t-btn-ghost {
      background: transparent;
      color: var(--tangy-cream);
      border: 1px solid rgba(255,255,255,0.15);
      padding: 0.85rem 1.8rem;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      border-radius: 3px;
      transition: all 0.25s;
    }
    .t-btn-ghost:hover { border-color: var(--tangy-amber); color: var(--tangy-amber); background: rgba(139, 92, 246,0.05); }

    /* Nav */
    .nav-link {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--tangy-muted);
      text-decoration: none;
      cursor: pointer;
      transition: color 0.2s;
      background: none; border: none; padding: 0;
    }
    .nav-link:hover, .nav-link.active { color: var(--tangy-amber); }

    /* Availability dots */
    .dot-available    { background: #4ade80; }
    .dot-booked       { background: var(--tangy-rust); }
    .dot-tentative    { background: var(--tangy-amber); }
    .dot-unavailable  { background: rgba(255,255,255,0.2); }

    /* Notification badge */
    .notif-badge {
      position: absolute; top: -4px; right: -4px;
      width: 16px; height: 16px; border-radius: 50%;
      background: var(--tangy-rust);
      font-size: 0.55rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-family: 'DM Sans', sans-serif;
    }

    /* Step progress */
    .step-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
    .step-line.done { background: var(--tangy-amber); }

    /* Calendar cell */
    .cal-cell {
      aspect-ratio: 1;
      border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: all 0.15s;
      border: 1px solid transparent;
      position: relative;
    }
    .cal-cell:hover { border-color: rgba(139, 92, 246,0.3); background: rgba(139, 92, 246,0.06); }
    .cal-cell.today { border-color: var(--tangy-amber); color: var(--tangy-amber); font-weight: 700; }
    .cal-cell.selected { background: var(--tangy-amber); color: #070707; font-weight: 700; border-color: var(--tangy-amber); }

    /* Tag */
    .tag {
      display: inline-flex; align-items: center;
      padding: 0.3rem 0.75rem;
      background: rgba(8,8,12,0.6);
      border: 1px solid rgba(139, 92, 246,0.3);
      border-radius: 999px;
      font-size: 0.65rem;
      font-family: 'DM Sans', sans-serif;
      letter-spacing: 0.08em;
      color: var(--tangy-amber);
      background: rgba(139, 92, 246,0.06);
    }

    /* Scroll reveal */
    .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    @media(max-width:768px){
      .hide-mobile { display: none !important; }
    }
    @media(min-width:769px){
      .hide-desktop { display: none !important; }
    }
  `}</style>
);

// ── Auth Context ─────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setUser({ id: '1', email, name: 'Arjun Mehta', role: 'artist', genre: 'Techno / Deep House', city: 'Hyderabad', avatar: null, profileComplete: 72 });
    setLoading(false);
    return true;
  };

  const logout = () => setUser(null);
  const updateUser = (updates) => setUser(u => ({ ...u, ...updates }));

  return <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>{children}</AuthContext.Provider>;
};

// ── Router Context ───────────────────────────────────────────
const RouterContext = createContext(null);
const useRouter = () => useContext(RouterContext);

// ── Ambient Background ───────────────────────────────────────
const AmbientBg = ({ variant = 'default' }) => {
  const configs = {
    default: { c1: '#8B5CF6', c2: '#06b6d4', c3: '#1a0f2e' },
    blue:    { c1: '#2a4a8a', c2: '#1a2a5a', c3: '#0a0f1e' },
    green:   { c1: '#1a4a2a', c2: '#0a2a1a', c3: '#050f0a' },
  };
  const c = configs[variant] || configs.default;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: `radial-gradient(circle, ${c.c1}18 0%, transparent 70%)`,
        animation: 'ambientPulse 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', right: '-5%',
        width: '50vw', height: '50vw', borderRadius: '50%',
        background: `radial-gradient(circle, ${c.c2}12 0%, transparent 70%)`,
        animation: 'ambientPulse 11s ease-in-out infinite reverse',
      }} />
      <div style={{
        position: 'absolute', top: '40%', left: '40%',
        width: '30vw', height: '30vw', borderRadius: '50%',
        background: `radial-gradient(circle, ${c.c3}20 0%, transparent 70%)`,
        animation: 'ambientPulse 14s ease-in-out infinite',
      }} />
    </div>
  );
};

// ── Nav ────────────────────────────────────────────────────────
const Nav = ({ page, setPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const { user, logout } = useAuth();
  const modal = useModal();

  const publicLinks = [
    { label: 'Artists', route: 'artists' },
    { label: 'Events', route: 'home' },
    { label: 'Apply', route: 'apply' },
  ];
  const artistLinks = [
    { label: 'Dashboard', route: 'dashboard' },
    { label: 'Calendar', route: 'calendar' },
    { label: 'Profile', route: 'profile' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '1.2rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'linear-gradient(to bottom, rgba(5,5,8,0.92) 0%, rgba(5,5,8,0.6) 100%)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(139, 92, 246,0.12)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    }}>
      {/* Logo */}
      <button onClick={() => setPage('home')} style={{
        background: 'none', border: 'none', cursor: 'pointer',
      }}>
        <img
          src="/logo.svg"
          alt="Tangy Sessions Logo"
          style={{ height: 40 }}
        />
      </button>

      {/* Desktop Links */}
      <div className="hide-mobile" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {publicLinks.filter(l => !(user && l.route === 'apply')).map(l => (
          <button key={l.route} className={`nav-link${page === l.route ? ' active' : ''}`} onClick={() => setPage(l.route)}>{l.label}</button>
        ))}
        {user && artistLinks.map(l => (
          <button key={l.route} className={`nav-link${page === l.route ? ' active' : ''}`} onClick={() => setPage(l.route)}>{l.label}</button>
        ))}
      </div>

      {/* Auth actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <NotificationBell setPage={setPage} />
            <button onClick={() => setPage('profile')} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--tangy-amber), var(--tangy-rust))',
              border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem',
              color: '#070707', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {user.name[0]}
            </button>
            <button className="nav-link" onClick={logout}>Exit</button>
          </>
        ) : (
          <>
            <button className="nav-link" onClick={() => setPage('login')}>Login</button>
            <button className="t-btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.6rem' }} onClick={() => setPage('signup')}>
              Join
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

// ── Notification Bell ────────────────────────────────────────
const NotificationBell = ({ setPage }) => {
  const [show, setShow] = useState(false);
  const modal = useModal();
  const notifs = [
    { id: 1, type: 'invite', title: 'Event Invitation', msg: 'You\'ve been invited to perform at Underground Vol. 4', time: '2h ago', unread: true },
    { id: 2, type: 'confirm', title: 'Booking Confirmed', msg: 'Your slot at Stepwell Sessions is confirmed', time: '1d ago', unread: true },
    { id: 3, type: 'reminder', title: 'Performance Tomorrow', msg: 'Don\'t forget — you\'re on at 11PM tomorrow', time: '1d ago', unread: false },
  ];
  const unreadCount = notifs.filter(n => n.unread).length;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShow(s => !s)} style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid var(--tangy-border)',
        borderRadius: '50%', width: 36, height: 36, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tangy-cream)',
        transition: 'all 0.2s',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {show && (
        <div className="glass" style={{
          position: 'absolute', top: '110%', right: 0, width: 320,
          borderRadius: 8, padding: '1rem', zIndex: 999,
          animation: 'fadeUp 0.3s ease',
        }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--tangy-amber)', marginBottom: '0.8rem', textTransform: 'uppercase' }}>Notifications</p>
          {notifs.map(n => (
            <div key={n.id} onClick={() => { setShow(false); setPage('dashboard'); modal.toast({ message: `Navigating to: ${n.title}` }); }} style={{
              padding: '0.75rem', borderRadius: 6,
              background: n.unread ? 'rgba(139, 92, 246,0.06)' : 'transparent',
              borderLeft: n.unread ? '2px solid var(--tangy-amber)' : '2px solid transparent',
              marginBottom: '0.5rem', cursor: 'pointer',
            }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--tangy-cream)', marginBottom: '0.2rem' }}>{n.title}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--tangy-muted)' }}>{n.msg}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-amber)', marginTop: '0.3rem' }}>{n.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Protected Route ──────────────────────────────────────────
const ProtectedRoute = ({ children, setPage }) => {
  const { user } = useAuth();
  useEffect(() => { if (!user) setPage('login'); }, [user]);
  if (!user) return null;
  return children;
};

// ── Divider ──────────────────────────────────────────────────
const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
    <div style={{ flex: 1, height: 1, background: 'var(--tangy-border)' }} />
    {label && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', letterSpacing: '0.1em' }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: 'var(--tangy-border)' }} />
  </div>
);

// ── Stat Card ────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent }) => (
  <div className="glass" style={{ borderRadius: 8, padding: '1.2rem', flex: 1, minWidth: 120 }}>
    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</p>
    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', fontWeight: 700, color: accent || 'var(--tangy-amber)', lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ fontSize: '0.7rem', color: 'var(--tangy-muted)', marginTop: '0.3rem' }}>{sub}</p>}
  </div>
);

// ── Artist Card ──────────────────────────────────────────────
const ArtistCard = ({ artist, setPage, setSelectedArtist }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => {
        if (setSelectedArtist) setSelectedArtist(artist);
        setPage('artist-profile');
      }}
      style={{
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        background: hov
          ? 'linear-gradient(135deg, rgba(8,8,12,0.88) 0%, rgba(8,8,12,0.72) 100%)'
          : 'linear-gradient(135deg, rgba(8,8,12,0.80) 0%, rgba(8,8,12,0.60) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${hov ? 'rgba(139, 92, 246,0.45)' : 'rgba(139, 92, 246,0.2)'}`,
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hov
          ? '0 24px 60px rgba(0,0,0,0.75), 0 0 40px rgba(139, 92, 246,0.18), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 12px 32px rgba(0,0,0,0.6), 0 0 20px rgba(139, 92, 246,0.06), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: '#0a0a0a' }}>
        {artist.avatar ? (
          <img 
            src={artist.avatar} 
            alt={artist.name} 
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: hov ? 'scale(1.08)' : 'scale(1.02)',
              transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
              filter: hov ? 'brightness(1.05) contrast(1.1)' : 'brightness(0.8) contrast(1.1) grayscale(20%)',
            }} 
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 40% 40%, ${artist.color}40, transparent 70%)`,
          }} />
        )}
        
        {/* Color tinted glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at top right, ${artist.color}30, transparent 70%)`,
          mixBlendMode: 'overlay',
          opacity: hov ? 1 : 0.6,
          transition: 'opacity 0.5s ease',
          zIndex: 1,
        }} />

        {/* Cinematic blend into card body — now matches glass bg */}
        <div style={{
          position: 'absolute', bottom: -1, left: 0, right: 0, height: '80%',
          background: 'linear-gradient(to top, rgba(8,8,12,0.95) 0%, transparent 100%)',
          zIndex: 1,
        }} />

        {/* Availability Badge */}
        <div style={{
          position: 'absolute', top: '0.8rem', right: '0.8rem',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.35rem 0.8rem', borderRadius: 999,
          background: 'rgba(5,5,8,0.65)', backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(139, 92, 246,0.2)',
          zIndex: 2,
        }}>
          <div className={`dot-${artist.status}`} style={{ width: 6, height: 6, borderRadius: '50%', boxShadow: `0 0 8px var(--tangy-${artist.status === 'available' ? 'green' : 'amber'})` }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {artist.status}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{
        padding: '1.4rem', position: 'relative', zIndex: 2,
        background: 'transparent',
        borderTop: '1px solid rgba(139, 92, 246,0.1)',
      }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--tangy-cream)', marginBottom: '0.3rem', letterSpacing: '0.04em' }}>{artist.name}</h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: 'var(--tangy-amber)', letterSpacing: '0.1em', marginBottom: '0.8rem', textTransform: 'uppercase' }}>{artist.genre}</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--tangy-muted)', lineHeight: 1.6, marginBottom: '1.2rem' }}>{artist.bio}</p>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {artist.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
    </div>
  );
};

// ── Home Page ────────────────────────────────────────────────
const HomePage = ({ setPage }) => {
  const { user } = useAuth();
  const modal = useModal();
  const events = [
    { name: "Tangy Sessions Vol. 1", date: "Aug 15, 2025", status: "on-sale", venue: "Bansilal Stepwell" },
    { name: "Tangy Sessions Vol. 2", date: "Sep 20, 2025", status: "on-sale", venue: "Bansilal Stepwell" },
    { name: "Tangy Sessions: Solstice", date: "Dec 21, 2025", status: "on-sale", venue: "Secret Location" },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '6rem 2rem', position: 'relative' }}>
      <AmbientBg />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--tangy-amber)', textTransform: 'uppercase', marginBottom: '1.5rem', animation: 'fadeUp 0.6s ease both' }}>
          Underground Electronic · Bansilal Stepwell · Hyderabad
        </p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 900, lineHeight: 0.95, color: 'var(--tangy-cream)', marginBottom: '1.5rem', animation: 'fadeUp 0.8s 0.1s ease both' }}>
          Music<br /><em style={{ color: 'var(--tangy-amber)' }}>Beneath</em><br />History
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--tangy-muted)', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.7, animation: 'fadeUp 0.8s 0.2s ease both' }}>
          Where ancient stone meets underground sound. An immersive music experience unlike anything else.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem', animation: 'fadeUp 0.8s 0.35s ease both' }}>
          <button className="t-btn-primary" onClick={() => setPage('artists')}>Discover Artists</button>
          {!user && <button className="t-btn-ghost" onClick={() => setPage('apply')}>Apply as Artist</button>}
          {user && <button className="t-btn-ghost" onClick={() => setPage('dashboard')}>Go to Dashboard</button>}
        </div>

        {/* Events Section */}
        <div style={{ textAlign: 'left', animation: 'fadeUp 0.8s 0.5s ease both' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: 'var(--tangy-cream)', marginBottom: '1.5rem' }}>Upcoming Events</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {events.map((ev, i) => (
              <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color: 'var(--tangy-cream)', marginBottom: '0.2rem' }}>{ev.name}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: 'var(--tangy-muted)' }}>{ev.date} · {ev.venue}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 140 }}>
                  {!user && <button className="t-btn-primary" style={{ padding: '0.7rem 1.5rem' }} onClick={() => modal.alert({ title: "Redirecting", message: "Redirecting to tickets..." })}>Get Tickets</button>}
                  <button className="t-btn-ghost" style={{ padding: '0.7rem 1.5rem', fontSize: '0.65rem' }}>View Lineup</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// LOGIN PAGE
const LoginPage = ({ setPage }) => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async () => {
    if (!email || !pass) { setErr('Please fill in all fields'); return; }
    setErr('');
    const ok = await login(email, pass);
    if (ok) setPage('dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative' }}>
      <AmbientBg />

      {/* Left panel — branding */}
      <div className="hide-mobile" style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '5rem', position: 'relative', zIndex: 1,
        borderRight: '1px solid var(--tangy-border)',
      }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--tangy-amber)', textTransform: 'uppercase', marginBottom: '3rem' }}>
          Artist Portal
        </p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 900, lineHeight: 1.05, color: 'var(--tangy-cream)', marginBottom: '1.5rem' }}>
          Your Stage<br />Awaits.
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--tangy-muted)', lineHeight: 1.75, maxWidth: 400, marginBottom: '3rem' }}>
          Manage your artist identity, performance schedule, and creative journey — all from one cinematic workspace.
        </p>
        {/* Decorative lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {['Secure Authentication', 'Performance Calendar', 'Media Upload', 'Event Invitations'].map((f, i) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 20, height: 1, background: 'var(--tangy-amber)' }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: 'var(--tangy-muted)', letterSpacing: '0.06em' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: '100%', maxWidth: 480, margin: 'auto',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '5rem 3rem', position: 'relative', zIndex: 1,
      }}>
        <button onClick={() => setPage('home')} style={{
          background: 'none', border: 'none', cursor: 'pointer', marginBottom: '3rem',
          textAlign: 'left',
        }}>
          <img
            src="/logo.svg"
            alt="Tangy Sessions Logo"
            style={{ height: 50 }}
          />
        </button>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', fontWeight: 700, color: 'var(--tangy-cream)', marginBottom: '0.5rem' }}>
          Welcome back
        </h1>
        <p style={{ color: 'var(--tangy-muted)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
          Sign in to your artist portal
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <input className="t-input" type="email" placeholder="artist@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input className="t-input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                style={{ accentColor: 'var(--tangy-amber)', width: 14, height: 14 }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--tangy-muted)' }}>Remember me</span>
            </label>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tangy-amber)', fontSize: '0.75rem', fontFamily: "'DM Sans', sans-serif" }}>
              Forgot password?
            </button>
          </div>

          {err && <p style={{ color: '#f87171', fontSize: '0.75rem', fontFamily: "'DM Sans', sans-serif" }}>{err}</p>}

          <button className="t-btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Authenticating...' : 'Enter Portal →'}
          </button>
        </div>

        <Divider label="or continue with" />

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {['Google', 'Spotify', 'SoundCloud'].map(s => (
            <button key={s} className="t-btn-ghost" style={{ flex: 1, fontSize: '0.6rem', padding: '0.7rem 0.5rem' }}>{s}</button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--tangy-muted)', marginTop: '2rem' }}>
          New artist?{' '}
          <button onClick={() => setPage('signup')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tangy-amber)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem' }}>
            Apply here
          </button>
        </p>
      </div>
    </div>
  );
};

// SIGNUP / APPLY PAGE (multi-step)
const SignupPage = ({ setPage }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [form, setForm] = useState({ name: '', email: '', password: '', genre: [], city: '', bio: '', instagram: '', soundcloud: '', experience: '' });
  const [done, setDone] = useState(false);
  const [artists, setArtists] = useSharedStore("artists", MOCK_INITIAL_ARTISTS);

  const genres = ['Techno', 'Deep House', 'Ambient', 'Afrobeat', 'Jazz Fusion', 'Psytrance', 'Drum & Bass', 'Experimental', 'World Music', 'Electronic'];

  const toggleGenre = g => setForm(f => ({ ...f, genre: f.genre.includes(g) ? f.genre.filter(x => x !== g) : [...f.genre, g] }));

  const next = () => {
    if (step < totalSteps) {
      setStep(s => s + 1);
    } else {
      const newArtist = {
        id: `A${Date.now()}`,
        name: form.name || 'New Artist',
        genre: form.genre.join(', ') || 'Electronic',
        city: form.city || 'Unknown',
        bio: form.bio || 'Pending review...',
        status: 'tentative',
        color: '#f59e0b',
        tags: form.genre.length > 0 ? form.genre : ['Electronic'],
        avatar: '',
        appStatus: 'pending',
        appliedAt: new Date().toISOString()
      };
      setArtists(prev => [...prev, newArtist]);
      setDone(true);
    }
  };
  const back = () => setStep(s => s - 1);

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', position: 'relative' }}>
      <AmbientBg />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--tangy-amber), var(--tangy-rust))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '2rem', animation: 'float 3s ease-in-out infinite' }}>✦</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', fontWeight: 700, color: 'var(--tangy-cream)', marginBottom: '1rem' }}>Application Submitted</h2>
        <p style={{ color: 'var(--tangy-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>Your artist application has been received. The Tangy Sessions team will review your profile and be in touch within 3–5 days.</p>
        <button className="t-btn-primary" onClick={() => setPage('login')}>Go to Login</button>
      </div>
    </div>
  );

  const stepTitles = ['Identity', 'Sound', 'Story', 'Links'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 3rem', position: 'relative' }}>
      <AmbientBg />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 560 }}>

        {/* Progress */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {stepTitles.map((t, i) => (
              <>
                <div key={t} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    background: i + 1 <= step ? 'var(--tangy-amber)' : 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem',
                    color: i + 1 <= step ? '#070707' : 'var(--tangy-muted)',
                    transition: 'all 0.3s',
                  }}>{i + 1 < step ? '✓' : i + 1}</div>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', color: i + 1 === step ? 'var(--tangy-amber)' : 'var(--tangy-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t}</span>
                </div>
                {i < stepTitles.length - 1 && <div style={{ flex: 1, height: 1, background: i + 1 < step ? 'var(--tangy-amber)' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />}
              </>
            ))}
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 12, padding: '2.5rem' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--tangy-cream)', marginBottom: '0.5rem' }}>
            {step === 1 && 'Who are you?'}
            {step === 2 && 'What\'s your sound?'}
            {step === 3 && 'Tell your story'}
            {step === 4 && 'Connect the dots'}
          </h2>
          <p style={{ color: 'var(--tangy-muted)', fontSize: '0.82rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            {step === 1 && 'Start with the basics — your artist identity.'}
            {step === 2 && 'Select your genres and experience level.'}
            {step === 3 && 'Write a compelling artist bio and tell us your city.'}
            {step === 4 && 'Add your social links so people can discover you.'}
          </p>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Artist Name</label>
                <input className="t-input" placeholder="Your artist name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input className="t-input" type="email" placeholder="artist@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Password</label>
                <input className="t-input" type="password" placeholder="Create a strong password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>Select Genres (multiple)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {genres.map(g => (
                  <button key={g} onClick={() => toggleGenre(g)} style={{
                    padding: '0.4rem 0.9rem', borderRadius: 999, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem',
                    border: `1px solid ${form.genre.includes(g) ? 'var(--tangy-amber)' : 'rgba(255,255,255,0.12)'}`,
                    background: form.genre.includes(g) ? 'rgba(139, 92, 246,0.15)' : 'transparent',
                    color: form.genre.includes(g) ? 'var(--tangy-amber)' : 'var(--tangy-muted)',
                    transition: 'all 0.2s',
                  }}>{g}</button>
                ))}
              </div>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Experience Level</label>
              <select className="t-input" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}>
                <option value="">Select level</option>
                <option>Emerging (1–2 years)</option>
                <option>Mid-level (3–5 years)</option>
                <option>Established (5+ years)</option>
                <option>Veteran (10+ years)</option>
              </select>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>City / Location</label>
                <input className="t-input" placeholder="e.g. Hyderabad, India" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Artist Bio</label>
                <textarea className="t-input" rows={5} placeholder="Write a compelling artist bio... Tell us who you are, what you do, and what makes your sound unique." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'instagram', label: 'Instagram', placeholder: '@yourhandle' },
                { key: 'soundcloud', label: 'SoundCloud', placeholder: 'soundcloud.com/yourname' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>{label}</label>
                  <input className="t-input" placeholder={placeholder} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 8, padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={e => e.target.style.borderColor = 'rgba(139, 92, 246,0.3)'} onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: 'var(--tangy-muted)', letterSpacing: '0.1em' }}>↑ UPLOAD PROFILE IMAGE</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--tangy-muted)', marginTop: '0.4rem' }}>JPG, PNG up to 10MB</p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
            {step > 1 ? (
              <button className="t-btn-ghost" onClick={back}>← Back</button>
            ) : (
              <button className="t-btn-ghost" onClick={() => setPage('login')}>Have an account?</button>
            )}
            <button className="t-btn-primary" onClick={next}>
              {step === totalSteps ? 'Submit Application' : `Continue →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ARTISTS DISCOVERY PAGE
const ArtistsPage = ({ setPage, setSelectedArtist }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [allArtists] = useSharedStore("artists", MOCK_INITIAL_ARTISTS);
  
  // Only show approved artists to the public
  const artists = allArtists.filter(a => a.appStatus === 'approved');

  const genres = ['All', 'Techno', 'House', 'Ambient', 'Jazz', 'World'];
  const filtered = artists.filter(a =>
    (filter === 'All' || a.tags.includes(filter)) &&
    (search === '' || a.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5rem', position: 'relative' }}>
      <AmbientBg />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem 3rem', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '0.3em', color: 'var(--tangy-amber)', textTransform: 'uppercase', marginBottom: '1rem', animation: 'fadeUp 0.6s ease both' }}>
          The Roster
        </p>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, color: 'var(--tangy-cream)', marginBottom: '1rem', lineHeight: 0.95, animation: 'fadeUp 0.7s 0.1s ease both' }}>
          The <em style={{ color: 'var(--tangy-amber)' }}>Artists</em>
        </h1>
        <p style={{ color: 'var(--tangy-muted)', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.7, animation: 'fadeUp 0.7s 0.2s ease both' }}>
          A curated collective of underground artists pushing sonic boundaries at Bansilal Stepwell.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', padding: '0 2rem 2rem', position: 'relative', zIndex: 1 }}>
        <input className="t-input" style={{ maxWidth: 280, flex: '1 1 200px' }} placeholder="Search artists..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {genres.map(g => (
            <button key={g} onClick={() => setFilter(g)} style={{
              padding: '0.5rem 1rem', borderRadius: 999, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '0.06em',
              border: `1px solid ${filter === g ? 'var(--tangy-amber)' : 'rgba(255,255,255,0.1)'}`,
              background: filter === g ? 'rgba(139, 92, 246,0.12)' : 'transparent',
              color: filter === g ? 'var(--tangy-amber)' : 'var(--tangy-muted)',
              transition: 'all 0.2s',
            }}>{g}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        padding: '0 2rem 5rem',
        maxWidth: 1200, margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>
        {filtered.map((a, i) => (
          <div key={a.id} style={{ animation: `fadeUp 0.6s ${i * 0.08}s ease both` }}>
            <ArtistCard artist={a} setPage={setPage} setSelectedArtist={setSelectedArtist} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ARTIST PROFILE PAGE
const ArtistProfilePage = ({ setPage, artist: propArtist }) => {
  const modal = useModal();
  const fallbackArtist = {
    name: 'KALI', genre: 'Techno / Dark Ambient',
    avatar: '/artists/artist1.jpg',
    bio: `KALI is a sonic architect whose sets descend like ancient rituals — dark, ceremonial, and utterly consuming. Drawing from Hyderabad's layered history, their music weaves threads of industrial texture with hypnotic techno rhythms, creating something that feels both ancestral and futuristic.\n\nBorn in the shadow of the Charminar, KALI's journey into electronic music began as an act of sonic rebellion — finding signal in noise, finding presence in abstraction. Each performance is a meditation; each track a prayer to the underground.`,
    tags: ['Techno', 'Dark Ambient', 'Industrial', 'Ritual'],
    color: '#8b5cf6',
    status: 'available',
  };

  const artist = {
    city: 'Hyderabad, India',
    performances: 47,
    years: 6,
    upcoming: [
      { event: 'Stepwell Sessions Vol. 12', date: 'Jun 14, 2025', time: '11:00 PM', venue: 'Bansilal Stepwell' },
      { event: 'Underground Vol. 4', date: 'Jul 2, 2025', time: '10:30 PM', venue: 'Secret Location' },
    ],
    gallery: ['#1a0f2e', '#0f1a2e', '#2a0f1e', '#1a2a0f', '#2a1a0f'],
    ...(propArtist || fallbackArtist),
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '4.5rem', position: 'relative' }}>
      <AmbientBg />

      {/* Hero */}
      <div style={{
        minHeight: '75vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'flex-end',
        background: '#050505',
      }}>
        {/* Full-bleed background image */}
        {artist.avatar && (
          <img 
            src={artist.avatar} 
            alt={artist.name} 
            style={{ 
              position: 'absolute', 
              top: 0, right: 0, 
              width: '100%', height: '100%', 
              objectFit: 'cover', 
              objectPosition: 'center 20%',
              opacity: 0.65, 
              filter: 'grayscale(15%) contrast(1.1) brightness(0.9)',
              animation: 'subtleZoom 20s linear infinite alternate'
            }} 
          />
        )}

        {/* Ambient color overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 60% 30%, ${artist.color}40, transparent 70%)`,
          mixBlendMode: 'overlay',
          zIndex: 1
        }} />

        {/* Shadow overlays for readability & seamless blending */}
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(to right, #070707 5%, rgba(9,9,9,0.4) 50%, transparent 100%)',
          zIndex: 1 
        }} />
        <div style={{ 
          position: 'absolute', inset: 0, 
          background: 'linear-gradient(to top, var(--tangy-black) 0%, rgba(9,9,9,0.8) 15%, transparent 60%)',
          zIndex: 1 
        }} />

        {/* Content */}
        <div style={{ padding: '4rem 3rem', position: 'relative', zIndex: 2, width: '100%', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem', animation: 'fadeUp 0.6s ease both' }}>
            <div className={`dot-${artist.status}`} style={{ width: 8, height: 8, borderRadius: '50%', boxShadow: `0 0 12px var(--tangy-${artist.status === 'available' ? 'green' : 'amber'})` }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{artist.status} for bookings</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 15vw, 11rem)', fontWeight: 900, lineHeight: 0.85, color: '#fff', marginBottom: '0.8rem', animation: 'fadeUp 0.8s 0.1s ease both', textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
            {artist.name}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', color: 'var(--tangy-amber)', letterSpacing: '0.2em', textTransform: 'uppercase', animation: 'fadeUp 0.8s 0.2s ease both', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            {artist.genre} · {artist.city}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '4rem', alignItems: 'start' }}>

          {/* Left */}
          <div>
            {/* Tags */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {artist.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>

            {/* Bio */}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-amber)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Biography</p>
            {artist.bio.split('\n\n').map((p, i) => (
              <p key={i} style={{ fontSize: '0.92rem', color: 'var(--tangy-muted)', lineHeight: 1.85, marginBottom: '1.2rem' }}>{p}</p>
            ))}

            {/* Gallery */}
            <div style={{ marginTop: '3rem' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-amber)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>Gallery</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {artist.gallery.map((c, i) => (
                  <div key={i} style={{ aspectRatio: '1', borderRadius: 6, background: `linear-gradient(135deg, ${c}, #070707)`, border: '1px solid var(--tangy-border)' }} />
                ))}
              </div>
            </div>

            {/* Upcoming */}
            <div style={{ marginTop: '3rem' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-amber)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Upcoming Performances</p>
              {artist.upcoming.map((u, i) => (
                <div key={i} className="glass" style={{ padding: '1.2rem 1.5rem', borderRadius: 8, marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--tangy-cream)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{u.event}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'var(--tangy-muted)' }}>{u.venue}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: 'var(--tangy-amber)' }}>{u.date}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)' }}>{u.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'sticky', top: '6rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <StatCard label="Performances" value={artist.performances} accent={artist.color} />
              <StatCard label="Years Active" value={artist.years} />
            </div>

            {/* Booking CTA */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.5rem', textAlign: 'center' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Book This Artist</p>
              <button className="t-btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }} onClick={() => modal.toast({ message: `Inquiry sent to ${artist.name}!` })}>Send Inquiry →</button>
              <button className="t-btn-ghost" style={{ width: '100%', fontSize: '0.6rem' }} onClick={() => modal.alert({ title: "Availability", message: `Viewing availability calendar for ${artist.name}...` })}>View Availability</button>
            </div>

            {/* Social links */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.2rem' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Links</p>
              {['Instagram', 'SoundCloud', 'Resident Advisor', 'Bandcamp'].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--tangy-border)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--tangy-muted)' }}>{s}</span>
                  <span style={{ color: 'var(--tangy-amber)', fontSize: '0.75rem' }}>↗</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ARTIST DASHBOARD
const DashboardPage = ({ setPage }) => {
  const { user } = useAuth();

  const upcomingShows = [
    { event: 'Stepwell Sessions Vol. 12', date: 'Jun 14', status: 'confirmed', venue: 'Bansilal Stepwell', time: '11 PM' },
    { event: 'Underground Vol. 4', date: 'Jul 2', status: 'pending', venue: 'TBA', time: '10:30 PM' },
  ];

  const invites = [
    { event: 'Monsoon Rave', date: 'Aug 10', deadline: '3 days left', organizer: 'Tangy Sessions' },
  ];

  const quickActions = [
    { label: 'Update Bio', icon: '✍', action: () => setPage('profile') },
    { label: 'Set Availability', icon: '📅', action: () => setPage('calendar') },
    { label: 'Upload Media', icon: '🎵', action: () => {} },
    { label: 'View Profile', icon: '👁', action: () => setPage('artist-profile') },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5rem', position: 'relative' }}>
      <AmbientBg />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-amber)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem', animation: 'fadeUp 0.5s ease both' }}>
            Artist Portal
          </p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: 'var(--tangy-cream)', animation: 'fadeUp 0.6s 0.1s ease both' }}>
            Good evening, <em style={{ color: 'var(--tangy-amber)' }}>{user?.name}</em>
          </h1>
          <p style={{ color: 'var(--tangy-muted)', fontSize: '0.85rem', marginTop: '0.4rem', animation: 'fadeUp 0.6s 0.2s ease both' }}>
            {user?.genre} · {user?.city}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', animation: 'fadeUp 0.6s 0.25s ease both' }}>
          <StatCard label="Upcoming Shows" value="2" sub="Next: Jun 14" />
          <StatCard label="Profile Complete" value={`${user?.profileComplete}%`} sub="Add media to reach 100%" accent="#4ade80" />
          <StatCard label="Pending Invites" value="1" sub="Respond by Jun 1" accent="var(--tangy-rust)" />
          <StatCard label="Total Shows" value="47" sub="Since 2019" />
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          {/* Left col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Upcoming performances */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.8rem', animation: 'fadeUp 0.6s 0.3s ease both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'var(--tangy-amber)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Upcoming Performances</p>
                <button className="nav-link" onClick={() => setPage('calendar')}>View Calendar →</button>
              </div>
              {upcomingShows.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: i < upcomingShows.length - 1 ? '1px solid var(--tangy-border)' : 'none', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--tangy-cream)', marginBottom: '0.2rem' }}>{s.event}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)' }}>{s.venue} · {s.time}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: 'var(--tangy-muted)' }}>{s.date}</span>
                    <span style={{
                      padding: '0.25rem 0.65rem', borderRadius: 999, fontSize: '0.6rem',
                      fontFamily: "'DM Sans', sans-serif",
                      background: s.status === 'confirmed' ? 'rgba(74,222,128,0.12)' : 'rgba(139, 92, 246,0.12)',
                      color: s.status === 'confirmed' ? '#4ade80' : 'var(--tangy-amber)',
                      border: `1px solid ${s.status === 'confirmed' ? 'rgba(74,222,128,0.3)' : 'rgba(139, 92, 246,0.3)'}`,
                    }}>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Event invitations */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.8rem', animation: 'fadeUp 0.6s 0.4s ease both' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'var(--tangy-amber)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Event Invitations</p>
              {invites.map((inv, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'rgba(139, 92, 246,0.05)', borderRadius: 8, border: '1px solid rgba(139, 92, 246,0.15)', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--tangy-cream)', marginBottom: '0.2rem' }}>{inv.event}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-muted)' }}>{inv.organizer} · {inv.date}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-rust)', marginTop: '0.3rem' }}>⏱ {inv.deadline}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="t-btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.6rem' }}>Accept</button>
                    <button className="t-btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.6rem' }}>Decline</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Profile completion */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.8rem', animation: 'fadeUp 0.6s 0.5s ease both' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'var(--tangy-amber)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Profile Completion</p>
              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tangy-muted)' }}>Overall progress</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'var(--tangy-amber)' }}>{user?.profileComplete}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${user?.profileComplete}%`, background: 'linear-gradient(90deg, var(--tangy-amber), var(--tangy-rust))', borderRadius: 2, transition: 'width 1s ease' }} />
                </div>
              </div>
              {[
                { label: 'Profile photo', done: false },
                { label: 'Artist bio', done: true },
                { label: 'Genre tags', done: true },
                { label: 'Social links', done: true },
                { label: 'Media upload', done: false },
                { label: 'Availability set', done: false },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: item.done ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${item.done ? '#4ade80' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: item.done ? '#4ade80' : 'transparent', flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: '0.78rem', color: item.done ? 'var(--tangy-cream)' : 'var(--tangy-muted)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Quick actions */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.5rem', animation: 'fadeUp 0.6s 0.35s ease both' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'var(--tangy-amber)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Actions</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {quickActions.map((qa, i) => (
                  <button key={i} onClick={qa.action} style={{
                    padding: '1rem', borderRadius: 8, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--tangy-border)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                    transition: 'all 0.2s', color: 'var(--tangy-muted)', fontSize: '0.72rem',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139, 92, 246,0.3)'; e.currentTarget.style.background = 'rgba(139, 92, 246,0.05)'; e.currentTarget.style.color = 'var(--tangy-cream)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--tangy-border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--tangy-muted)'; }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{qa.icon}</span>
                    {qa.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mini calendar preview */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.5rem', animation: 'fadeUp 0.6s 0.45s ease both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'var(--tangy-amber)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>June 2025</p>
                <button className="nav-link" onClick={() => setPage('calendar')}>Full Calendar →</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.2rem' }}>
                {['S','M','T','W','T','F','S'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', color: 'var(--tangy-muted)', padding: '0.3rem 0' }}>{d}</div>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
                  <div key={d} className="cal-cell" style={{
                    fontSize: '0.62rem',
                    background: d === 14 ? 'var(--tangy-amber)' : d === 2 ? 'rgba(196,92,42,0.3)' : 'transparent',
                    color: d === 14 ? '#070707' : d === 2 ? 'var(--tangy-rust)' : 'var(--tangy-muted)',
                    border: d === 14 ? '1px solid var(--tangy-amber)' : '1px solid transparent',
                  }}>{d}</div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.5rem', animation: 'fadeUp 0.6s 0.55s ease both' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', color: 'var(--tangy-amber)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Recent Activity</p>
              {[
                { msg: 'Booking confirmed for Stepwell Vol. 12', time: '2h ago' },
                { msg: 'New invitation received from Tangy', time: '1d ago' },
                { msg: 'Profile viewed 23 times this week', time: '3d ago' },
              ].map((a, i) => (
                <div key={i} style={{ padding: '0.6rem 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--tangy-muted)', lineHeight: 1.5, marginBottom: '0.2rem' }}>{a.msg}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'rgba(139, 92, 246,0.5)' }}>{a.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CALENDAR PAGE
const CalendarPage = () => {
  const modal = useModal();
  const [selectedDates, setSelectedDates] = useState(['2025-08-15', '2025-08-22', '2025-09-05']);
  const [month, setMonth] = useState(5); // June (0-indexed)
  const [year] = useState(2025);
  const [selected, setSelected] = useState(null);
  const [availability, setAvailability] = useState({
    14: 'booked', 20: 'available', 21: 'available', 22: 'available',
    5: 'unavailable', 6: 'unavailable', 7: 'unavailable',
    10: 'tentative', 11: 'tentative',
  });
  const [mode, setMode] = useState('available');

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = new Date();

  const setDay = (day) => {
    setAvailability(prev => ({ ...prev, [day]: mode }));
    setSelected(day);
  };

  const legendItems = [
    { key: 'available', label: 'Available', color: '#4ade80' },
    { key: 'booked', label: 'Booked', color: 'var(--tangy-rust)' },
    { key: 'tentative', label: 'Tentative', color: 'var(--tangy-amber)' },
    { key: 'unavailable', label: 'Unavailable', color: 'rgba(255,255,255,0.2)' },
  ];

  const bgForStatus = s => ({
    available: 'rgba(74,222,128,0.15)',
    booked: 'rgba(196,92,42,0.2)',
    tentative: 'rgba(139, 92, 246,0.15)',
    unavailable: 'rgba(255,255,255,0.04)',
  }[s] || 'transparent');

  const colorForStatus = s => ({
    available: '#4ade80',
    booked: 'var(--tangy-rust)',
    tentative: 'var(--tangy-amber)',
    unavailable: 'rgba(255,255,255,0.25)',
  }[s] || 'var(--tangy-muted)');

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5rem', position: 'relative' }}>
      <AmbientBg />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-amber)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Artist Portal</p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--tangy-cream)' }}>
            Availability <em>Calendar</em>
          </h1>
          <p style={{ color: 'var(--tangy-muted)', fontSize: '0.82rem', marginTop: '0.4rem' }}>Click any date and select a status to manage your availability</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '2rem', alignItems: 'start' }}>

          {/* Calendar */}
          <div className="glass" style={{ borderRadius: 12, padding: '2rem' }}>
            {/* Month nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <button onClick={() => setMonth(m => Math.max(0, m - 1))} className="t-btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.65rem' }}>←</button>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--tangy-cream)' }}>
                {monthNames[month]} {year}
              </h2>
              <button onClick={() => setMonth(m => Math.min(11, m + 1))} className="t-btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.65rem' }}>→</button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '0.55rem', color: 'var(--tangy-muted)', padding: '0.3rem' }}>{d}</div>
              ))}
            </div>

            {/* Days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3rem' }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const status = availability[day];
                const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                return (
                  <div
                    key={day}
                    onClick={() => setDay(day)}
                    style={{
                      aspectRatio: '1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', cursor: 'pointer',
                      background: selected === day ? bgForStatus(mode) : status ? bgForStatus(status) : 'transparent',
                      color: status ? colorForStatus(status) : isToday ? 'var(--tangy-amber)' : 'var(--tangy-muted)',
                      border: `1px solid ${isToday ? 'var(--tangy-amber)' : status ? colorForStatus(status) + '40' : 'transparent'}`,
                      fontWeight: isToday ? 700 : 400,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!status) e.currentTarget.style.background = 'rgba(139, 92, 246,0.06)'; }}
                    onMouseLeave={e => { if (!status) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {day}
                    {status === 'booked' && <span style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 3, height: 3, borderRadius: '50%', background: colorForStatus(status) }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            {/* Mode selector */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.4rem' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Set Status</p>
              {legendItems.map(item => (
                <button key={item.key} onClick={() => setMode(item.key)} style={{
                  width: '100%', textAlign: 'left', padding: '0.65rem 0.85rem', borderRadius: 6, marginBottom: '0.4rem',
                  display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer',
                  background: mode === item.key ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: `1px solid ${mode === item.key ? 'rgba(255,255,255,0.12)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: mode === item.key ? 'var(--tangy-cream)' : 'var(--tangy-muted)', letterSpacing: '0.06em' }}>{item.label}</span>
                  {mode === item.key && <span style={{ marginLeft: 'auto', color: 'var(--tangy-amber)', fontSize: '0.6rem' }}>●</span>}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.4rem' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Legend</p>
              {legendItems.map(item => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--tangy-muted)' }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="glass" style={{ borderRadius: 10, padding: '1.4rem' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>This Month</p>
              {legendItems.map(item => {
                const count = Object.values(availability).filter(v => v === item.key).length;
                return (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--tangy-muted)' }}>{item.label}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: item.color }}>{count} days</span>
                  </div>
                );
              })}
            </div>

            <button className="t-btn-primary" style={{ width: '100%' }} onClick={() => alert('Availability saved successfully!')}>Save Availability →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// PROFILE PAGE
const ProfilePage = ({ setPage }) => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('info');

  const tabs = ['info', 'media', 'links', 'settings'];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5rem', position: 'relative' }}>
      <AmbientBg />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>

        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--tangy-amber), var(--tangy-rust))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', fontWeight: 700, color: '#070707',
            boxShadow: '0 0 40px rgba(139, 92, 246,0.3)', cursor: 'pointer', position: 'relative', overflow: 'hidden'
          }} title="Click to change photo" onClick={() => document.getElementById('photoUpload').click()}>
            {user?.avatar ? <img src={user.avatar} alt={user.name} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : user?.name[0]}
            <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem'}} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>CHANGE</div>
          </div>
          <input type="file" id="photoUpload" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
            if(e.target.files && e.target.files[0]) {
               const url = URL.createObjectURL(e.target.files[0]);
               updateUser({ avatar: url });
            }
          }} />
          <div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', fontWeight: 700, color: 'var(--tangy-cream)' }}>{user?.name}</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: 'var(--tangy-amber)', letterSpacing: '0.08em', marginTop: '0.3rem' }}>{user?.genre}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--tangy-muted)', marginTop: '0.2rem' }}>{user?.city}</p>
          </div>
          <button className="t-btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => setPage('artist-profile')}>View Public Profile ↗</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '2rem', borderBottom: '1px solid var(--tangy-border)', paddingBottom: '0' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.6rem 1.2rem', background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase',
              color: tab === t ? 'var(--tangy-amber)' : 'var(--tangy-muted)',
              borderBottom: `2px solid ${tab === t ? 'var(--tangy-amber)' : 'transparent'}`,
              transition: 'all 0.2s', marginBottom: '-1px',
            }}>{t}</button>
          ))}
        </div>

        {tab === 'info' && (
          <div className="glass" style={{ borderRadius: 12, padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              {[
                { label: 'Artist Name', val: user?.name },
                { label: 'Email', val: user?.email },
                { label: 'Genre', val: user?.genre },
                { label: 'City', val: user?.city },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>{f.label}</label>
                  <input className="t-input" defaultValue={f.val} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.2rem' }}>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>Bio</label>
              <textarea className="t-input" rows={5} defaultValue="Sonic architect whose sets descend like ancient rituals — dark, ceremonial, and utterly consuming." style={{ resize: 'vertical' }} />
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <button className="t-btn-primary">Save Changes →</button>
              <button className="t-btn-ghost">Reset</button>
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="glass" style={{ borderRadius: 12, padding: '2rem' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-amber)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Media Upload</p>
            <div style={{ border: '2px dashed rgba(139, 92, 246,0.2)', borderRadius: 10, padding: '3rem', textAlign: 'center', marginBottom: '1.5rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎵</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', color: 'var(--tangy-muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>DROP FILES HERE</p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>MP3, WAV, FLAC · Images · Videos</p>
              <button className="t-btn-ghost" style={{ marginTop: '1.2rem', fontSize: '0.6rem' }}>Browse Files</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {['#1a1225','#0f1a2e','#2a0f1e','#1a2a0f'].map((c, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 8, background: `linear-gradient(135deg, ${c}, #070707)`, border: '1px solid var(--tangy-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer' }}>🖼</div>
              ))}
            </div>
          </div>
        )}

        {tab === 'links' && (
          <div className="glass" style={{ borderRadius: 12, padding: '2rem' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-amber)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Social & Platform Links</p>
            {['Instagram', 'SoundCloud', 'Resident Advisor', 'Bandcamp', 'YouTube', 'Spotify'].map(platform => (
              <div key={platform} style={{ marginBottom: '1rem' }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem' }}>{platform}</label>
                <input className="t-input" placeholder={`Your ${platform} URL or handle`} />
              </div>
            ))}
            <button className="t-btn-primary" style={{ marginTop: '0.5rem' }}>Save Links →</button>
          </div>
        )}

        {tab === 'settings' && (
          <div className="glass" style={{ borderRadius: 12, padding: '2rem' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', color: 'var(--tangy-amber)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Account Settings</p>
            {[
              { label: 'Email notifications for bookings', on: true },
              { label: 'Event invitation alerts', on: true },
              { label: 'Profile visibility (public)', on: true },
              { label: 'Available for booking', on: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: i < 3 ? '1px solid var(--tangy-border)' : 'none' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--tangy-muted)' }}>{s.label}</span>
                <div style={{
                  width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
                  background: s.on ? 'var(--tangy-amber)' : 'rgba(255,255,255,0.1)',
                  position: 'relative', transition: 'background 0.2s',
                }}>
                  <div style={{ position: 'absolute', top: 3, left: s.on ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: s.on ? '#070707' : 'rgba(255,255,255,0.4)', transition: 'left 0.2s' }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--tangy-border)' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-rust)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Danger Zone</p>
              <button className="t-btn-ghost" style={{ borderColor: 'rgba(196,92,42,0.3)', color: 'var(--tangy-rust)', fontSize: '0.6rem' }}>Delete Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// APPLY PAGE (public version)
const ApplyPage = ({ setPage }) => (
  <SignupPage setPage={setPage} />
);

// ── Footer ───────────────────────────────────────────────────
const Footer = ({ setPage }) => {
  const { user } = useAuth();
  return (
  <footer style={{ borderTop: '1px solid var(--tangy-border)', padding: '3rem 2rem', position: 'relative', zIndex: 1 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
      <div>
        <img
          src="/logo.svg"
          alt="Tangy Sessions Logo"
          style={{ height: 40, marginBottom: '0.5rem' }}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--tangy-muted)', lineHeight: 1.6 }}>Underground electronic music at Bansilal Stepwell, Hyderabad.</p>
      </div>
      <div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-amber)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Portal</p>
        {[['Artists', 'artists'], !user ? ['Apply', 'apply'] : null, !user ? ['Login', 'login'] : null].filter(Boolean).map(([l, r]) => (
          <button key={r} className="nav-link" onClick={() => setPage(r)} style={{ display: 'block', marginBottom: '0.5rem', textAlign: 'left' }}>{l}</button>
        ))}
      </div>
      <div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.58rem', color: 'var(--tangy-muted)', letterSpacing: '0.1em', marginTop: '1rem' }}>
          © 2025 Tangy Sessions · Music Beneath History
        </p>
      </div>
    </div>
  </footer>
)};

// ── App Shell ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home');
  const [selectedArtist, setSelectedArtist] = useState(null);

  const publicPages = ['home', 'artists', 'artist-profile', 'login', 'signup', 'apply'];
  const protectedPages = ['dashboard', 'calendar', 'profile'];
  const hideFooter = ['login', 'signup', 'apply'];

  return (
    <AuthProvider>
      <GlobalStyles />
      <div className="grain" style={{ minHeight: '100vh', background: 'var(--tangy-black)' }}>
        <Nav page={page} setPage={setPage} />

        <main>
          {page === 'home' && <HomePage setPage={setPage} />}
          {page === 'artists' && <ArtistsPage setPage={setPage} setSelectedArtist={setSelectedArtist} />}
          {page === 'artist-profile' && <ArtistProfilePage setPage={setPage} artist={selectedArtist} />}
          {page === 'login' && <LoginPage setPage={setPage} />}
          {page === 'signup' && <SignupPage setPage={setPage} />}
          {page === 'apply' && <ApplyPage setPage={setPage} />}
          {page === 'dashboard' && (
            <ProtectedRoute setPage={setPage}>
              <DashboardPage setPage={setPage} />
            </ProtectedRoute>
          )}
          {page === 'calendar' && (
            <ProtectedRoute setPage={setPage}>
              <CalendarPage />
            </ProtectedRoute>
          )}
          {page === 'profile' && (
            <ProtectedRoute setPage={setPage}>
              <ProfilePage setPage={setPage} />
            </ProtectedRoute>
          )}
        </main>

        {!hideFooter.includes(page) && <Footer setPage={setPage} />}
      </div>
    </AuthProvider>
  );
}
