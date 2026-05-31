import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "./ModalProvider";

// High-fidelity database of artists for the premium profile universe
const ARTIST_DB = {
  kryzen: {
    name: "KRYZEN",
    role: "Deep House / Hypnotic Techno",
    avatar: "/artists/artist1.jpg",
    banner: "/artists/artist1.jpg",
    location: "Mumbai, India",
    followers: "24.5K",
    yearsActive: "7 Years",
    performances: "140+",
    collabs: "32+",
    hosted: "45",
    availability: "Available for bookings",
    statusColor: "#10b981",
    color: "#8b5cf6",
    accent: "#10b981",
    bio: "KRYZEN is an architect of deep, hypnotic soundscapes. Blurring the line between time and space, their sets are designed to transport listeners to the outer limits of perception. Heavily influenced by Berlin's industrial landscape and classical minimalism, they craft experiences that linger in the consciousness long after the night ends. Having played major underground sanctuaries across Europe and Asia, their return to India marks a new chapter in dark spatial audio design.",
    quote: "Sound is the canvas; time is the illusion. We are but shadows moving through the frequency.",
    gallery: [
      { img: "/gallery/tangy1.jpg", label: "Midnight Session, Bansilal" },
      { img: "/gallery/tangy3.jpg", label: "Mainstage Alignment" },
      { img: "/gallery/tangy5.jpg", label: "Modular Rehearsal, Studio" },
      { img: "/gallery/tangy6.jpg", label: "Laser Array Sync" }
    ],
    upcoming: [
      { date: "JUN 14, 2026", venue: "The Great Descent", city: "Hyderabad, India", status: "Selling Out" },
      { date: "JUL 05, 2026", venue: "Warehouse 10", city: "Mumbai, India", status: "Tickets Available" },
      { date: "AUG 22, 2026", venue: "Sunken Sanctuary", city: "Goa, India", status: "Announcing Soon" }
    ],
    embeds: {
      spotify: "https://open.spotify.com/embed/track/4PTG3Z6ehGkBF3zI7Y1G9j",
      soundcloud: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/499310892&color=%237c3aed",
      youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    socials: {
      instagram: "https://instagram.com",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
      soundcloud: "https://soundcloud.com"
    }
  },
  aurawav: {
    name: "Aura.wav",
    role: "Ambient / Ambient House / IDM",
    avatar: "/artists/artist2.jpg",
    banner: "/artists/artist2.jpg",
    location: "Bangalore, India",
    followers: "18.2K",
    yearsActive: "5 Years",
    performances: "98+",
    collabs: "15+",
    hosted: "20",
    availability: "Available for bookings",
    statusColor: "#10b981",
    color: "#06b6d4",
    accent: "#ec4899",
    bio: "Aura.wav crafts delicate, breathtaking sonic landscapes from field recordings, modular synths, and processing algorithms. Their work is a translation of nature's chaos into crystalline structures of sound. By weaving elements of organic glitch, field acoustics, and warm ambient pads, Aura.wav builds worlds where listeners can dissolve. They are a resident developer of sonic architecture for relaxation spaces.",
    quote: "Every sound has a soul waiting to be uncovered in the quiet spaces between noise.",
    gallery: [
      { img: "/gallery/tangy2.jpg", label: "Dawn Rituals, Outdoor" },
      { img: "/gallery/tangy4.jpg", label: "Ambient Room Setup" },
      { img: "/gallery/tangy8.jpg", label: "Sound Check Freq" },
      { img: "/gallery/tangy9.jpg", label: "After Hours Sunset" }
    ],
    upcoming: [
      { date: "JUN 21, 2026", venue: "Summer Solstice Sanctuary", city: "Bangalore, India", status: "Available" },
      { date: "JUL 19, 2026", venue: "The Dome Experience", city: "Pune, India", status: "Limited Access" }
    ],
    embeds: {
      spotify: "https://open.spotify.com/embed/track/4PTG3Z6ehGkBF3zI7Y1G9j",
      soundcloud: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/499310892&color=%2306b6d4",
      youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    socials: {
      instagram: "https://instagram.com",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
      soundcloud: "https://soundcloud.com"
    }
  },
  sonder: {
    name: "SONDER",
    role: "Live Modular / Experimental",
    avatar: "/artists/artist3.jpg",
    banner: "/artists/artist3.jpg",
    location: "New Delhi, India",
    followers: "31.0K",
    yearsActive: "8 Years",
    performances: "165+",
    collabs: "40+",
    hosted: "55",
    availability: "Limited Availability",
    statusColor: "#ef4444",
    color: "#a855f7",
    accent: "#06b6d4",
    bio: "SONDER represents the realization that each random passerby is living a life as vivid and complex as one's own. This philosophical concept forms the foundation of their raw modular acts. Eschewing computers and pre-recorded tracks, SONDER builds electronic storms completely live using patch cables and analog hardware, ensuring that no two performances are ever the same.",
    quote: "No presets. No laptops. Just human emotion driving electrical current through copper wire.",
    gallery: [
      { img: "/gallery/tangy3.jpg", label: "Modular Cage Setup" },
      { img: "/gallery/tangy5.jpg", label: "Cabinet Close-Up" },
      { img: "/gallery/tangy7.jpg", label: "Ancient Descent Stage" },
      { img: "/gallery/tangy10.jpg", label: "Hypnotic Rituals" }
    ],
    upcoming: [
      { date: "JUN 14, 2026", venue: "The Great Descent", city: "Hyderabad, India", status: "Selling Out" },
      { date: "AUG 10, 2026", venue: "National Art Gallery", city: "New Delhi, India", status: "Invites Only" }
    ],
    embeds: {
      spotify: "https://open.spotify.com/embed/track/4PTG3Z6ehGkBF3zI7Y1G9j",
      soundcloud: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/499310892&color=%23a855f7",
      youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    socials: {
      instagram: "https://instagram.com",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
      soundcloud: "https://soundcloud.com"
    }
  },
  ritvik: {
    name: "Ritvik",
    role: "Classical Fusion / Electronic Live",
    avatar: "/artists/artist4.jpg",
    banner: "/artists/artist4.jpg",
    location: "Chennai, India",
    followers: "42.1K",
    yearsActive: "9 Years",
    performances: "210+",
    collabs: "64+",
    hosted: "70",
    availability: "Available for bookings",
    statusColor: "#10b981",
    color: "#06b6d4",
    accent: "#f59e0b",
    bio: "Ritvik is a pioneer in classical electronic synthesis. By taking Carnatic ragas and ancient acoustic vocal lines and running them through modular pitch-shifters, delay arrays, and analog synthesisers, they create a bridges between centuries-old devotion and underground club rave dynamics. A truly spellbinding performance where vocal purity meets synthesis power.",
    quote: "Tradition is not the worship of ashes, but the preservation of fire. We process that fire.",
    gallery: [
      { img: "/gallery/tangy4.jpg", label: "Reverb Tests, Stepwell" },
      { img: "/gallery/tangy1.jpg", label: "Vocal Alignment" },
      { img: "/gallery/tangy6.jpg", label: "Mainstage Descent" },
      { img: "/gallery/tangy9.jpg", label: "Sunrise Closing" }
    ],
    upcoming: [
      { date: "JUL 12, 2026", venue: "Classical Future Showcase", city: "Chennai, India", status: "Announced" },
      { date: "AUG 30, 2026", venue: "Stone Echoes Festival", city: "Hampi, India", status: "Pre-sale Active" }
    ],
    embeds: {
      spotify: "https://open.spotify.com/embed/track/4PTG3Z6ehGkBF3zI7Y1G9j",
      soundcloud: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/499310892&color=%2306b6d4",
      youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    socials: {
      instagram: "https://instagram.com",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
      soundcloud: "https://soundcloud.com"
    }
  },
  zeph: {
    name: "ZEPH",
    role: "Techno / Berlin / Experimental Percussion",
    avatar: "/artists/artist5.jpg",
    banner: "/artists/artist5.jpg",
    location: "Kochi, India",
    followers: "15.7K",
    yearsActive: "4 Years",
    performances: "78+",
    collabs: "12+",
    hosted: "15",
    availability: "Available for bookings",
    statusColor: "#10b981",
    color: "#f59e0b",
    accent: "#8b5cf6",
    bio: "ZEPH fuses the relentless, unforgiving driving rhythms of Berlin techno with acoustic South Asian acoustic percussion like the mridangam and kanjira. The resulting tracks are aggressive, high-energy mechanical rituals that push subwoofers to their physical limits. Intensely hypnotic and body-moving.",
    quote: "Rhythm is the oldest language we possess. Techno is its logical evolution in the digital era.",
    gallery: [
      { img: "/gallery/tangy5.jpg", label: "Drum Rehearsals" },
      { img: "/gallery/tangy3.jpg", label: "Peak Time Energy" },
      { img: "/gallery/tangy7.jpg", label: "Subterranean Session" },
      { img: "/gallery/tangy8.jpg", label: "Analog Drum Sync" }
    ],
    upcoming: [
      { date: "JUN 28, 2026", venue: "The Factory Club", city: "Kochi, India", status: "Tickets Available" },
      { date: "JUL 25, 2026", venue: "The Underground Tunnel", city: "Goa, India", status: "Limited Tickets" }
    ],
    embeds: {
      spotify: "https://open.spotify.com/embed/track/4PTG3Z6ehGkBF3zI7Y1G9j",
      soundcloud: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/499310892&color=%23f59e0b",
      youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    socials: {
      instagram: "https://instagram.com",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
      soundcloud: "https://soundcloud.com"
    }
  },
  noctis: {
    name: "Noctis",
    role: "Dark Ambient / Drone / Noise",
    avatar: "/artists/artist6.jpg",
    banner: "/artists/artist6.jpg",
    location: "Kolkata, India",
    followers: "12.8K",
    yearsActive: "6 Years",
    performances: "60+",
    collabs: "8+",
    hosted: "12",
    availability: "Available for bookings",
    statusColor: "#10b981",
    color: "#ef4444",
    accent: "#7c3aed",
    bio: "Noctis operates in the lower, somatic frequencies of sound. Creating monolithic walls of dark sub drone, modular noise, and processed heavy industrial feedback, their music feels like a physical presence inside a room. An immersive sonic weight designed for deep introspection in unique acoustic spaces.",
    quote: "Listen deep enough into the darkness, and you will hear the sound of the universe collapsing.",
    gallery: [
      { img: "/gallery/tangy6.jpg", label: "Pitch-Black Ritual" },
      { img: "/gallery/tangy8.jpg", label: "Drone Calibration" },
      { img: "/gallery/tangy1.jpg", label: "Catacomb Sessions" },
      { img: "/gallery/tangy10.jpg", label: "Ambient Collapse" }
    ],
    upcoming: [
      { date: "JUL 04, 2026", venue: "The Abandoned Crypt", city: "Kolkata, India", status: "Announced" },
      { date: "AUG 15, 2026", venue: "Tangy Sessions Vol. 1", city: "Hyderabad, India", status: "Selling Out" }
    ],
    embeds: {
      spotify: "https://open.spotify.com/embed/track/4PTG3Z6ehGkBF3zI7Y1G9j",
      soundcloud: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/499310892&color=%23ef4444",
      youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    socials: {
      instagram: "https://instagram.com",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
      soundcloud: "https://soundcloud.com"
    }
  },
  priyak: {
    name: "Priya K",
    role: "Vocalist / Live Processing / Dream House",
    avatar: "/artists/artist7.jpg",
    banner: "/artists/artist7.jpg",
    location: "Hyderabad, India",
    followers: "53.4K",
    yearsActive: "6 Years",
    performances: "132+",
    collabs: "45+",
    hosted: "28",
    availability: "Available for bookings",
    statusColor: "#10b981",
    color: "#ec4899",
    accent: "#06b6d4",
    bio: "Priya K combines ethereal, dreamlike vocal sequences with modular pitch-shifting, delay arrays, and driving deep house structures. Her haunting vocals weave effortlessly through heavy basslines, taking listeners on a emotional journey that is both club-ready and deeply personal. She is one of the most recognizable voices in modern electronic fusion.",
    quote: "The voice is the first synthesiser. Processing it is how we expose the ghosts inside.",
    gallery: [
      { img: "/gallery/tangy7.jpg", label: "The Descent Reverb" },
      { img: "/gallery/tangy1.jpg", label: "Vocal Recording" },
      { img: "/gallery/tangy3.jpg", label: "Stepwell Stage Aura" },
      { img: "/gallery/tangy9.jpg", label: "After Hours Vibe" }
    ],
    upcoming: [
      { date: "JUN 14, 2026", venue: "The Great Descent", city: "Hyderabad, India", status: "Selling Out" },
      { date: "JUL 18, 2026", venue: "The Liquid Sky", city: "Goa, India", status: "Available" }
    ],
    embeds: {
      spotify: "https://open.spotify.com/embed/track/4PTG3Z6ehGkBF3zI7Y1G9j",
      soundcloud: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/499310892&color=%23ec4899",
      youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    socials: {
      instagram: "https://instagram.com",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
      soundcloud: "https://soundcloud.com"
    }
  },
  axiom: {
    name: "AXIOM",
    role: "Bass Music / Leftfield Bass",
    avatar: "/artists/artist8.jpg",
    banner: "/artists/artist8.jpg",
    location: "Pune, India",
    followers: "28.9K",
    yearsActive: "5 Years",
    performances: "105+",
    collabs: "22+",
    hosted: "18",
    availability: "Limited Availability",
    statusColor: "#ef4444",
    color: "#10b981",
    accent: "#ec4899",
    bio: "AXIOM crafts deep, heavy sub frequencies and organic sound textures designed to test the physical boundaries of heavy custom sound systems. Drawing heavily from UK dubstep, sound system culture, and experimental glitch electronic, their sets are physically felt in the chest cavity as much as they are heard.",
    quote: "Frequency is physical. If the bass doesn't make the walls sweat, it's not low enough.",
    gallery: [
      { img: "/gallery/tangy8.jpg", label: "Sound System Calibration" },
      { img: "/gallery/tangy2.jpg", label: "Sub Cabinets Stack" },
      { img: "/gallery/tangy6.jpg", label: "Laser Rig Sync" },
      { img: "/gallery/tangy5.jpg", label: "Studio Bass Check" }
    ],
    upcoming: [
      { date: "JUN 27, 2026", venue: "Sub Terranean Sessions", city: "Pune, India", status: "Selling Fast" },
      { date: "AUG 01, 2026", venue: "Heavy Duty Warehouse", city: "Mumbai, India", status: "Announced" }
    ],
    embeds: {
      spotify: "https://open.spotify.com/embed/track/4PTG3Z6ehGkBF3zI7Y1G9j",
      soundcloud: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/499310892&color=%2310b981",
      youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    socials: {
      instagram: "https://instagram.com",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
      soundcloud: "https://soundcloud.com"
    }
  },
  kali: {
    name: "KALI",
    role: "Techno / Dark Ambient",
    avatar: "/artists/artist1.jpg",
    banner: "/artists/artist10.jpg",
    location: "Hyderabad, India",
    followers: "47.8K",
    yearsActive: "6 Years",
    performances: "155+",
    collabs: "38+",
    hosted: "42",
    availability: "Available for bookings",
    statusColor: "#10b981",
    color: "#8b5cf6",
    accent: "#ec4899",
    bio: "KALI is a Hyderabad-born sonic architect whose live performances descend like dark, ancient rituals. Fusing deep modular loops with industrial textures and hypnotic techno, their shows are designed to echo inside historical spaces, completely transforming stepwells and stone sanctuaries into modern temples of bass.",
    quote: "Our sets are structured like ancient stone steps—descending deep into the earth where the echo never dies.",
    gallery: [
      { img: "/gallery/tangy10.jpg", label: "Bansilal Devotion Act" },
      { img: "/gallery/tangy1.jpg", label: "Stepwell Echo Check" },
      { img: "/gallery/tangy3.jpg", label: "Hyd Underground Session" },
      { img: "/gallery/tangy7.jpg", label: "Ambient Chamber Focus" }
    ],
    upcoming: [
      { date: "JUN 14, 2026", venue: "The Great Descent", city: "Hyderabad, India", status: "Selling Out" },
      { date: "SEP 20, 2025", venue: "Tangy Sessions Vol. 2", city: "Hyderabad, India", status: "Completed" }
    ],
    embeds: {
      spotify: "https://open.spotify.com/embed/track/4PTG3Z6ehGkBF3zI7Y1G9j",
      soundcloud: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/499310892&color=%238b5cf6",
      youtube: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    socials: {
      instagram: "https://instagram.com",
      spotify: "https://spotify.com",
      youtube: "https://youtube.com",
      soundcloud: "https://soundcloud.com"
    }
  }
};

export default function ArtistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modal = useModal();
  const toast = modal.toast;

  const [lightbox, setLightbox] = useState(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", date: "", details: "" });
  const [activeEmbed, setActiveEmbed] = useState("spotify");
  const galleryRef = useRef(null);

  // Normalize ID (e.g. "kryzen" or "aura.wav" to "aurawav")
  const normalizedId = (id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const artist = ARTIST_DB[normalizedId] || ARTIST_DB.kryzen;

  // Track keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [id]);

  const handleInquiry = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast({ message: "Please fill in your name and email.", type: "error" });
      return;
    }
    setInquirySent(true);
    toast({ message: `Inquiry submitted for ${artist.name}! 🎵`, type: "success" });
    setTimeout(() => {
      setInquirySent(false);
      setForm({ name: "", email: "", date: "", details: "" });
    }, 5000);
  };

  const handleBack = () => {
    navigate("/");
    // Smooth scroll back to artists list on landing page
    setTimeout(() => {
      document.getElementById("artists")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmt = 320;
      galleryRef.current.scrollBy({
        left: direction === "left" ? -scrollAmt : scrollAmt,
        behavior: "smooth"
      });
    }
  };

  return (
    <div style={{
      background: "#030304",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflowX: "hidden",
      paddingBottom: 80
    }}>
      {/* ── Global Styles overrides ─────────────────────────────────────────── */}
      <style>{`
        .glass-panel {
          background: linear-gradient(135deg, rgba(8,8,12,0.82) 0%, rgba(5,5,8,0.6) 100%);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.02);
        }
        .text-glow {
          text-shadow: 0 0 40px ${artist.color}35, 0 0 12px ${artist.color}25;
        }
        .glow-border-hover {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glow-border-hover:hover {
          border-color: ${artist.color}45 !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.8), 0 0 25px ${artist.color}15;
          transform: translateY(-2px);
        }
        .equalizer-bar {
          width: 3px;
          height: 15px;
          background: ${artist.color};
          border-radius: 2px;
          animation: bounce 1s infinite alternate;
        }
        @keyframes bounce {
          0% { height: 4px; }
          100% { height: 28px; }
        }
        .embed-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
        }
        .embed-btn.active {
          background: ${artist.color};
          color: #fff;
          border-color: ${artist.color};
          box-shadow: 0 0 20px ${artist.color}35;
        }
      `}</style>

      {/* ── Ambient Background Lighting ────────────────────────────────────── */}
      <div style={{
        position: "fixed",
        top: "-10%",
        left: "-10%",
        width: "60vw",
        height: "60vw",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${artist.color}08 0%, transparent 70%)`,
        zIndex: 0,
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed",
        bottom: "10%",
        right: "-10%",
        width: "50vw",
        height: "50vw",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${artist.accent}05 0%, transparent 70%)`,
        zIndex: 0,
        pointerEvents: "none"
      }} />

      {/* ── Back Navigation Header ────────────────────────────────────────── */}
      <header style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(3,3,4,0.7)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        padding: "16px 5vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <button
          onClick={handleBack}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.82rem",
            fontFamily: "inherit",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            transition: "color 0.3s"
          }}
          onMouseEnter={e => e.target.style.color = "#fff"}
          onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}
        >
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>←</span> Back to Roster
        </button>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "1.6rem",
          letterSpacing: "0.1em",
          color: "#fff",
          display: "flex",
          alignItems: "center"
        }}>
          TANGY<span style={{ color: artist.color }}>.</span>SESSIONS
        </div>
      </header>

      {/* ── Cinematic Hero Section ────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        height: "75vh",
        minHeight: "550px",
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        {/* Layered cinematic backgrounds */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `url(${artist.banner}) no-repeat center center`,
          backgroundSize: "cover",
          filter: "brightness(0.2) saturate(0.65) blur(4px)",
          transform: "scale(1.05)",
          zIndex: 0
        }} />

        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, #030304 8%, rgba(3,3,4,0.6) 50%, rgba(3,3,4,0.1) 100%)",
          zIndex: 1
        }} />

        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 80% 50%, ${artist.color}0c 0%, transparent 60%)`,
          zIndex: 1
        }} />

        {/* Hero Content Overlay */}
        <div style={{
          width: "90vw",
          maxWidth: 1200,
          margin: "0 auto",
          paddingBottom: "80px",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: artist.statusColor,
              boxShadow: `0 0 10px ${artist.statusColor}`
            }} />
            <span style={{
              fontSize: "0.72rem",
              fontFamily: "monospace",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)"
            }}>
              {artist.availability}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3.8rem, 10vw, 8rem)",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              color: "#fff",
              margin: 0,
              textShadow: `0 0 80px ${artist.color}25`
            }}
          >
            {artist.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              fontSize: "0.75rem",
              fontFamily: "monospace",
              letterSpacing: "0.3em",
              color: artist.color,
              textTransform: "uppercase"
            }}
          >
            {artist.role} — {artist.location}
          </motion.div>
        </div>
      </section>

      {/* ── Main Layout Grid ──────────────────────────────────────────────── */}
      <main style={{
        width: "90vw",
        maxWidth: 1200,
        margin: "-40px auto 0",
        position: "relative",
        zIndex: 20,
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 40
      }}>
        {/* Responsive dual column */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 40
        }} className="main-content-layout">
          <style>{`
            @media (min-width: 992px) {
              .main-content-layout {
                grid-template-columns: 1.6fr 1fr;
              }
            }
          `}</style>

          {/* ── LEFT: Content & Media ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
            {/* 1. Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16
              }}
              className="stats-grid"
            >
              <style>{`
                @media (min-width: 576px) {
                  .stats-grid {
                    grid-template-columns: repeat(4, 1fr);
                  }
                }
              `}</style>

              {[
                { label: "Performances", val: artist.performances },
                { label: "Years Active", val: artist.yearsActive },
                { label: "Followers", val: artist.followers },
                { label: "Collaborations", val: artist.collabs }
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="glass-panel glow-border-hover"
                  style={{
                    padding: "24px 16px",
                    borderRadius: 12,
                    textAlign: "center"
                  }}
                >
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "2.2rem",
                    color: "#fff",
                    letterSpacing: "0.05em",
                    marginBottom: 4
                  }} className="text-glow">
                    {s.val}
                  </div>
                  <div style={{
                    fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontFamily: "monospace"
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* 2. Biography */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel"
              style={{
                padding: "36px",
                borderRadius: 16,
                position: "relative"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "150px",
                height: "150px",
                background: `radial-gradient(circle, ${artist.color}06 0%, transparent 70%)`,
                pointerEvents: "none"
              }} />

              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2.2rem",
                letterSpacing: "0.08em",
                color: "#fff",
                marginBottom: 10
              }}>
                Sonic Narrative
              </h2>
              <div style={{
                height: 2,
                width: 40,
                background: `linear-gradient(to right, ${artist.color}, transparent)`,
                marginBottom: 28,
                borderRadius: 2
              }} />

              <p style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.8)",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                marginBottom: 24,
                borderLeft: `2px solid ${artist.color}33`,
                paddingLeft: 20
              }}>
                "{artist.quote}"
              </p>

              <p style={{
                fontSize: "0.93rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.65)"
              }}>
                {artist.bio}
              </p>
            </motion.section>

            {/* 3. Media Gallery */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <h2 style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "2.2rem",
                    letterSpacing: "0.08em",
                    color: "#fff",
                    margin: 0
                  }}>
                    Atmospheric Gallery
                  </h2>
                  <div style={{
                    height: 2,
                    width: 40,
                    background: `linear-gradient(to right, ${artist.color}, transparent)`,
                    marginTop: 8,
                    borderRadius: 2
                  }} />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  {["left", "right"].map(dir => (
                    <button
                      key={dir}
                      onClick={() => scrollGallery(dir)}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        color: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.9rem",
                        transition: "all 0.3s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = artist.color; e.currentTarget.style.background = `${artist.color}15`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    >
                      {dir === "left" ? "←" : "→"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Horizontal Wrapper */}
              <div
                ref={galleryRef}
                style={{
                  display: "flex",
                  gap: 16,
                  overflowX: "auto",
                  paddingBottom: 15,
                  scrollBehavior: "smooth"
                }}
                className="gallery-scroll"
              >
                <style>{`
                  .gallery-scroll::-webkit-scrollbar {
                    height: 3px;
                  }
                  .gallery-scroll::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.02);
                  }
                  .gallery-scroll::-webkit-scrollbar-thumb {
                    background: ${artist.color}33;
                    border-radius: 2px;
                  }
                `}</style>

                {artist.gallery.map((g, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightbox(g)}
                    className="glass-panel"
                    style={{
                      flex: "0 0 280px",
                      borderRadius: 14,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.05)",
                      transition: "all 0.4s"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = artist.color; e.currentTarget.style.transform = "scale(1.02)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "none"; }}
                  >
                    <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
                      <img
                        src={g.img}
                        alt={g.label}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)"
                      }} />
                    </div>
                    <div style={{ padding: "16px 20px" }}>
                      <div style={{
                        fontSize: "0.68rem",
                        fontFamily: "monospace",
                        color: artist.color,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        marginBottom: 4
                      }}>
                        Aesthetic Capture
                      </div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "#fff",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {g.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 4. Live Previews */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel"
              style={{
                padding: "36px",
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                gap: 24
              }}
            >
              <div>
                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "2.2rem",
                  letterSpacing: "0.08em",
                  color: "#fff",
                  margin: 0
                }}>
                  Vibrational Previews
                </h2>
                <div style={{
                  height: 2,
                  width: 40,
                  background: `linear-gradient(to right, ${artist.color}, transparent)`,
                  marginTop: 8,
                  borderRadius: 2
                }} />
              </div>

              {/* Music Equalizer and Selector */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16
              }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {["spotify", "soundcloud", "youtube"].map(type => (
                    <button
                      key={type}
                      className={`embed-btn ${activeEmbed === type ? "active" : ""}`}
                      onClick={() => setActiveEmbed(type)}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Animated Equalizer */}
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 28 }}>
                  <div className="equalizer-bar" style={{ animationDelay: "0.1s" }} />
                  <div className="equalizer-bar" style={{ animationDelay: "0.3s" }} />
                  <div className="equalizer-bar" style={{ animationDelay: "0.5s" }} />
                  <div className="equalizer-bar" style={{ animationDelay: "0.2s" }} />
                  <div className="equalizer-bar" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>

              {/* Audio Embed Render */}
              <div style={{
                background: "#050506",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.03)",
                overflow: "hidden",
                height: activeEmbed === "youtube" ? 360 : activeEmbed === "spotify" ? 80 : 166,
                transition: "height 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
              }}>
                {activeEmbed === "spotify" && (
                  <iframe
                    src={artist.embeds.spotify}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allowtransparency="true"
                    allow="encrypted-media"
                    style={{ border: "none", display: "block" }}
                  />
                )}
                {activeEmbed === "soundcloud" && (
                  <iframe
                    src={artist.embeds.soundcloud}
                    width="100%"
                    height="166"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    style={{ border: "none", display: "block" }}
                  />
                )}
                {activeEmbed === "youtube" && (
                  <iframe
                    src={artist.embeds.youtube}
                    width="100%"
                    height="100%"
                    title="Live Set Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: "none", display: "block" }}
                  />
                )}
              </div>
            </motion.section>

            {/* 5. Upcoming Alignments (Timeline) */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              <div>
                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "2.2rem",
                  letterSpacing: "0.08em",
                  color: "#fff",
                  margin: 0
                }}>
                  Upcoming Alignments
                </h2>
                <div style={{
                  height: 2,
                  width: 40,
                  background: `linear-gradient(to right, ${artist.color}, transparent)`,
                  marginTop: 8,
                  borderRadius: 2
                }} />
              </div>

              {/* Event Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {artist.upcoming.map((e, idx) => (
                  <div
                    key={idx}
                    className="glass-panel glow-border-hover"
                    style={{
                      padding: "24px 28px",
                      borderRadius: 14,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 20
                    }}
                  >
                    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                      <div style={{
                        background: `${artist.color}15`,
                        border: `1px solid ${artist.color}25`,
                        padding: "10px 14px",
                        borderRadius: 8,
                        textAlign: "center"
                      }}>
                        <div style={{
                          fontSize: "0.68rem",
                          fontFamily: "monospace",
                          color: artist.color,
                          letterSpacing: "0.1em"
                        }}>
                          DATE
                        </div>
                        <div style={{
                          fontSize: "0.85rem",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                          color: "#fff",
                          marginTop: 2
                        }}>
                          {e.date.split(",")[0]}
                        </div>
                      </div>

                      <div>
                        <h4 style={{
                          fontSize: "1.1rem",
                          color: "#fff",
                          fontWeight: "500",
                          margin: 0
                        }}>
                          {e.venue}
                        </h4>
                        <p style={{
                          fontSize: "0.82rem",
                          color: "rgba(255,255,255,0.4)",
                          margin: "4px 0 0"
                        }}>
                          {e.city}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <span style={{
                        fontSize: "0.7rem",
                        fontFamily: "monospace",
                        color: e.status === "Selling Out" ? "#ef4444" : "rgba(255,255,255,0.4)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase"
                      }}>
                        {e.status}
                      </span>
                      <button
                        onClick={() => toast({ message: "Booking links will align shortly! 🎟️", type: "info" })}
                        style={{
                          background: "transparent",
                          border: `1px solid ${artist.color}45`,
                          color: "#fff",
                          padding: "10px 18px",
                          borderRadius: 8,
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          fontFamily: "inherit",
                          cursor: "pointer",
                          transition: "all 0.3s"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = artist.color; e.currentTarget.style.borderColor = artist.color; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${artist.color}45`; }}
                      >
                        Secure Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* ── RIGHT: Sticky Booking & Socials ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            {/* Booking Card */}
            <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 24 }}>
              <motion.section
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-panel"
                style={{
                  padding: "36px",
                  borderRadius: 20,
                  position: "relative"
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "120px",
                  height: "120px",
                  background: `radial-gradient(circle, ${artist.color}08 0%, transparent 70%)`,
                  pointerEvents: "none"
                }} />

                <h3 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.9rem",
                  letterSpacing: "0.08em",
                  color: "#fff",
                  marginBottom: 6
                }}>
                  Reserve Alignment
                </h3>
                <p style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 24
                }}>
                  Direct inquiry line to the artist’s management desk.
                </p>

                <form onSubmit={handleInquiry} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name / Organization"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        background: "rgba(0,0,0,0.45)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontFamily: "inherit",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        background: "rgba(0,0,0,0.45)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontFamily: "inherit",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Target Event Date (Optional)"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        background: "rgba(0,0,0,0.45)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontFamily: "inherit",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Describe target space and concept"
                      value={form.details}
                      onChange={e => setForm({ ...form, details: e.target.value })}
                      rows="3"
                      style={{
                        width: "100%",
                        padding: "13px 16px",
                        background: "rgba(0,0,0,0.45)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontFamily: "inherit",
                        outline: "none",
                        resize: "none"
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: `linear-gradient(to right, ${artist.color}, ${artist.color}dd)`,
                      border: "none",
                      borderRadius: 8,
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      boxShadow: `0 4px 15px ${artist.color}35`,
                      letterSpacing: "0.05em"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${artist.color}55`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 4px 15px ${artist.color}35`; }}
                  >
                    Check Availability
                  </button>
                </form>

                {/* Management Info */}
                <div style={{
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  marginTop: 28,
                  paddingTop: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Agent In-Charge:</span>
                    <span style={{ fontSize: "0.72rem", color: "#fff", fontWeight: "500" }}>Tangy Bookings Desk</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Average Response:</span>
                    <span style={{ fontSize: "0.72rem", color: artist.accent, fontWeight: "600" }}>&lt; 6 Hours</span>
                  </div>
                </div>
              </motion.section>

              {/* Social Links Panel */}
              <motion.section
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-panel"
                style={{
                  padding: "24px 30px",
                  borderRadius: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.4)"
                }}>
                  CONNECT
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  {Object.entries(artist.socials).map(([net, url]) => (
                    <a
                      key={net}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.6)",
                        textDecoration: "none",
                        transition: "all 0.3s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = artist.color; e.currentTarget.style.background = `${artist.color}15`; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    >
                      {net === "instagram" ? "IG" : net === "spotify" ? "SP" : net === "youtube" ? "YT" : "SC"}
                    </a>
                  ))}
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </main>

      {/* ── Lightbox Overlay Modal ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 3000,
              background: "rgba(3,3,4,0.95)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16
              }}
            >
              <img
                src={lightbox.img}
                alt={lightbox.label}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  borderRadius: 12,
                  boxShadow: `0 0 80px ${artist.color}25`
                }}
              />
              <div style={{ textAlign: "center" }}>
                <h4 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.8rem",
                  letterSpacing: "0.1em",
                  color: "#fff",
                  margin: 0
                }}>
                  {lightbox.label}
                </h4>
                <p style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "monospace",
                  letterSpacing: "0.1em",
                  marginTop: 4
                }}>
                  ESC TO COLLAPSE
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
