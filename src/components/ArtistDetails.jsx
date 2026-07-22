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
    color: "#C8FF2B",
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
    color: "#C9A24B",
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
    color: "#F9E0A2",
    accent: "#C9A24B",
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
    color: "#C9A24B",
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
    accent: "#C8FF2B",
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
    accent: "#F26D4F",
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
    accent: "#C9A24B",
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
    color: "#C8FF2B",
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

// Pure React counter hook that counts smoothly up to the target number
function Counter({ value, duration = 1.4 }) {
  const [count, setCount] = useState(0);
  const parsedVal = parseFloat(value);
  const isInt = !value.includes(".");
  const suffix = value.replace(/[0-9.]/g, "");

  useEffect(() => {
    let start = 0;
    const end = parsedVal;
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    const totalMiliseconds = duration * 1000;
    const incrementTime = 25;
    const steps = Math.ceil(totalMiliseconds / incrementTime);
    const stepVal = end / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount((prev) => prev + stepVal);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, parsedVal, duration]);

  const formattedCount = isInt ? Math.floor(count) : count.toFixed(1);
  return (
    <span>
      {formattedCount}
      {suffix}
    </span>
  );
}

// Subcomponent stat card featuring high-end glassmorphic glow reflection and hover animation
function StatCard({ label, val, artist, delay }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, type: "spring", stiffness: 85, damping: 14 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "36px 28px",
        borderRadius: 24,
        textAlign: "center",
        overflow: "hidden",
        cursor: "pointer",
        background: hovered
          ? `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, ${artist.color}18 100%)`
          : "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        border: hovered
          ? `1px solid ${artist.color}88`
          : `1px solid ${artist.color}22`,
        backdropFilter: "blur(38px) saturate(180%)",
        WebkitBackdropFilter: "blur(38px) saturate(180%)",
        boxShadow: hovered
          ? `0 35px 80px rgba(0,0,0,0.9), 0 0 45px ${artist.color}35, inset 0 1px 0 rgba(255,255,255,0.22)`
          : `0 20px 45px rgba(0,0,0,0.75), inset 0 1px 0 ${artist.color}0c`,
        transform: hovered ? "translateY(-8px) scale(1.03)" : "translateY(0) scale(1)",
        transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {/* Light sheen sweeping reflect animation */}
      <div style={{
        position: "absolute",
        top: 0,
        left: hovered ? "140%" : "-100%",
        width: "50%",
        height: "100%",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)",
        transform: "skewX(-25deg)",
        transition: hovered ? "left 0.85s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none"
      }} />

      {/* Floating accent glow node */}
      <div style={{
        position: "absolute",
        top: "-20%",
        right: "-20%",
        width: "40%",
        height: "40%",
        borderRadius: "50%",
        background: artist.color,
        filter: "blur(25px)",
        opacity: hovered ? 0.25 : 0.08,
        transition: "opacity 0.4s"
      }} />

      {/* Bottom glowing border bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: "5%",
        width: "90%",
        height: 3,
        borderRadius: "3px 3px 0 0",
        background: hovered ? artist.color : `${artist.color}38`,
        boxShadow: hovered ? `0 0 15px ${artist.color}, 0 0 5px ${artist.color}` : "none",
        transition: "all 0.4s"
      }} />

      {/* Numerical counter */}
      <div style={{
        fontFamily: "'Instrument Serif', sans-serif",
        fontSize: "2.85rem",
        color: "#fff",
        letterSpacing: "0.05em",
        marginBottom: 8,
        textShadow: hovered ? `0 0 25px ${artist.color}66` : `0 0 12px ${artist.color}25`,
        transition: "text-shadow 0.4s"
      }}>
        <Counter value={val} />
      </div>

      {/* Text label */}
      <div style={{
        fontSize: "0.68rem",
        color: hovered ? "#fff" : "rgba(255,255,255,0.42)",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        fontFamily: "monospace",
        fontWeight: "600",
        transition: "color 0.4s"
      }}>
        {label}
      </div>
    </motion.div>
  );
}

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

  // Track keyboard navigation for lightbox & lock body scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
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

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleBack();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(2, 2, 3, 0.45)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "0px" : "30px 20px"
      }}
    >
      <div 
        className="inner-overlay-card"
        style={{
          width: "100%",
          maxWidth: "1220px",
          maxHeight: isMobile ? "100vh" : "90vh",
          overflowY: "auto",
          background: "linear-gradient(180deg, rgba(8, 8, 12, 0.94) 0%, rgba(3, 3, 5, 0.98) 100%)",
          borderRadius: isMobile ? "0px" : "24px",
          border: isMobile ? "none" : `1px solid ${artist.color}33`,
          boxShadow: "0 50px 120px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.05)",
          position: "relative",
          overflowX: "hidden",
          paddingBottom: 100,
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif"
        }}
      >
      {/* ── Global Styles overrides ─────────────────────────────────────────── */}
      <style>{`
        .inner-overlay-card::-webkit-scrollbar {
          width: 6px;
        }
        .inner-overlay-card::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.01);
          border-radius: 0 24px 24px 0;
        }
        .inner-overlay-card::-webkit-scrollbar-thumb {
          background: ${artist.color}55;
          border-radius: 3px;
        }
        .glass-panel {
          background: linear-gradient(135deg, rgba(12,12,18,0.78) 0%, rgba(6,6,10,0.5) 100%);
          backdrop-filter: blur(35px) saturate(180%);
          -webkit-backdrop-filter: blur(35px) saturate(180%);
          border: 1px solid ${artist.color}25;
          box-shadow: 0 25px 60px rgba(0,0,0,0.85), inset 0 1px 0 ${artist.color}15;
        }
        .text-glow {
          text-shadow: 0 0 45px ${artist.color}45, 0 0 15px ${artist.color}25;
        }
        .glow-border-hover {
          transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glow-border-hover:hover {
          border-color: ${artist.color}66 !important;
          box-shadow: 0 25px 60px rgba(0,0,0,0.9), 0 0 35px ${artist.color}20, inset 0 1px 0 ${artist.color}35;
          transform: translateY(-4px);
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
          padding: 10px 22px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid ${artist.color}22;
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .embed-btn.active {
          background: ${artist.color};
          color: #fff;
          border-color: ${artist.color};
          box-shadow: 0 0 25px ${artist.color}55;
        }
        
        /* Hardware accelerated drift animations for ambient drifting particles */
        @keyframes floatOrbA {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(60px, -50px) scale(1.15); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes floatOrbB {
          0% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-80px, 60px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1.1); }
        }
        
        /* Neon status light blinking effect */
        @keyframes neonPulse {
          0% { opacity: 0.8; box-shadow: 0 0 8px ${artist.statusColor}; }
          50% { opacity: 1; box-shadow: 0 0 16px ${artist.statusColor}, 0 0 25px ${artist.statusColor}aa; }
          100% { opacity: 0.8; box-shadow: 0 0 8px ${artist.statusColor}; }
        }
      `}</style>

      {/* ── Ambient Drifting Orbs ── */}
      <div style={{
        position: "fixed",
        top: "10%",
        left: "5%",
        width: "45vw",
        height: "45vw",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${artist.color}0a 0%, transparent 68%)`,
        zIndex: 0,
        pointerEvents: "none",
        animation: "floatOrbA 24s infinite ease-in-out"
      }} />
      <div style={{
        position: "fixed",
        bottom: "15%",
        right: "5%",
        width: "40vw",
        height: "40vw",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${artist.accent}06 0%, transparent 70%)`,
        zIndex: 0,
        pointerEvents: "none",
        animation: "floatOrbB 28s infinite ease-in-out"
      }} />

      {/* ── Navigation Header ── */}
      <header style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(2,2,3,0.72)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid " + artist.color + "22",
        padding: "18px 5vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 40px ${artist.color}05`
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
          fontFamily: "'Instrument Serif', sans-serif",
          fontSize: "1.75rem",
          letterSpacing: "0.12em",
          color: "#fff",
          display: "flex",
          alignItems: "center"
        }}>
          TANGY<span style={{ color: artist.color }}>.</span>SESSIONS
        </div>
      </header>

      {/* ── Cinematic Hero Section ── */}
      <section style={{
        position: "relative",
        height: "76vh",
        minHeight: "560px",
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        borderBottom: "1px solid " + artist.color + "18"
      }}>
        {/* Banner image with smooth parallax scale filter */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `url(${artist.banner}) no-repeat center center`,
          backgroundSize: "cover",
          filter: "brightness(0.48) saturate(0.85)",
          transform: "scale(1.05)",
          zIndex: 0
        }} />

        {/* Dynamic deep darkness gradient grids */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, #020203 15%, rgba(2,2,3,0.35) 60%, rgba(2,2,3,0) 100%)",
          zIndex: 1
        }} />

        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 75% 55%, ${artist.color}12 0%, transparent 60%)`,
          zIndex: 1
        }} />

        {/* Hero Content Overlay */}
        <div style={{
          width: "90vw",
          maxWidth: 1200,
          margin: "0 auto",
          paddingBottom: "90px",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}>
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <span style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: artist.statusColor,
              animation: "neonPulse 1.8s infinite ease-in-out"
            }} />
            <span style={{
              fontSize: "0.72rem",
              fontFamily: "monospace",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: artist.statusColor,
              fontWeight: "bold",
              textShadow: `0 0 10px ${artist.statusColor}88`
            }}>
              {artist.availability}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 55, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.12, type: "spring", damping: 15 }}
            style={{
              fontFamily: "'Instrument Serif', sans-serif",
              fontSize: "clamp(4.2rem, 11vw, 8.5rem)",
              lineHeight: 0.85,
              letterSpacing: "0.02em",
              color: "#fff",
              margin: 0,
              textShadow: `0 0 90px ${artist.color}35, 0 10px 40px rgba(0,0,0,0.5)`
            }}
          >
            {artist.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            style={{
              fontSize: "0.78rem",
              fontFamily: "monospace",
              letterSpacing: "0.28em",
              color: artist.color,
              textTransform: "uppercase",
              fontWeight: "600",
              textShadow: `0 0 15px ${artist.color}33`
            }}
          >
            {artist.role} — {artist.location}
          </motion.div>
        </div>
      </section>

      {/* ── Main Layout Grid ── */}
      <main style={{
        width: "90vw",
        maxWidth: 1200,
        margin: "-50px auto 0",
        position: "relative",
        zIndex: 20,
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 40
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 40
        }} className="main-content-layout">
          <style>{`
            @media (min-width: 992px) {
              .main-content-layout {
                grid-template-columns: 1.62fr 1fr;
              }
            }
          `}</style>

          {/* ── LEFT: Content & Media ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 60 }}>
            {/* 1. Staggered Counter Statistics Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20
            }} className="stats-grid">
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
                <StatCard
                  key={idx}
                  label={s.label}
                  val={s.val}
                  artist={artist}
                  delay={idx * 0.12}
                />
              ))}
            </div>

            {/* 2. Narrative Biography */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="glass-panel"
              style={{
                padding: "44px 40px",
                borderRadius: 24,
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Radial gradient ambient lighting accent */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "180px",
                height: "180px",
                background: `radial-gradient(circle, ${artist.color}0a 0%, transparent 72%)`,
                pointerEvents: "none"
              }} />

              <h2 style={{
                fontFamily: "'Instrument Serif', sans-serif",
                fontSize: "2.4rem",
                letterSpacing: "0.08em",
                color: "#fff",
                marginBottom: 10
              }}>
                Sonic Narrative
              </h2>
              <div style={{
                height: 3,
                width: 48,
                background: `linear-gradient(to right, ${artist.color}, transparent)`,
                marginBottom: 32,
                borderRadius: 2
              }} />

              <p style={{
                fontSize: "1.15rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                marginBottom: 28,
                borderLeft: `3px solid ${artist.color}44`,
                paddingLeft: 24,
                textShadow: "0 2px 10px rgba(0,0,0,0.3)"
              }}>
                "{artist.quote}"
              </p>

              <p style={{
                fontSize: "0.95rem",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.65)"
              }}>
                {artist.bio}
              </p>
            </motion.section>

            {/* 3. Media Gallery */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <h2 style={{
                    fontFamily: "'Instrument Serif', sans-serif",
                    fontSize: "2.4rem",
                    letterSpacing: "0.08em",
                    color: "#fff",
                    margin: 0
                  }}>
                    Atmospheric Gallery
                  </h2>
                  <div style={{
                    height: 3,
                    width: 48,
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
                        border: "1px solid " + artist.color + "22",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        color: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.95rem",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = artist.color; e.currentTarget.style.background = `${artist.color}18`; e.currentTarget.style.transform = "scale(1.05)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = artist.color + "22"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "none"; }}
                    >
                      {dir === "left" ? "←" : "→"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Scroll Container */}
              <div
                ref={galleryRef}
                style={{
                  display: "flex",
                  gap: 20,
                  overflowX: "auto",
                  paddingBottom: 15,
                  scrollBehavior: "smooth"
                }}
                className="gallery-scroll"
              >
                <style>{`
                  .gallery-scroll::-webkit-scrollbar {
                    height: 4px;
                  }
                  .gallery-scroll::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.02);
                  }
                  .gallery-scroll::-webkit-scrollbar-thumb {
                    background: ${artist.color}38;
                    border-radius: 4px;
                  }
                `}</style>

                {artist.gallery.map((g, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightbox(g)}
                    className="glass-panel"
                    style={{
                      flex: "0 0 310px",
                      borderRadius: 18,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "1px solid " + artist.color + "22",
                      transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = artist.color; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 25px 50px rgba(0,0,0,0.85), 0 0 25px ${artist.color}15`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = artist.color + "22"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ height: 195, overflow: "hidden", position: "relative" }}>
                      <img
                        src={g.img}
                        alt={g.label}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s", transformOrigin: "center" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      />
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(2,2,3,0.92) 0%, transparent 62%)"
                      }} />
                    </div>
                    <div style={{ padding: "20px 24px" }}>
                      <div style={{
                        fontSize: "0.68rem",
                        fontFamily: "monospace",
                        color: artist.color,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        marginBottom: 4,
                        fontWeight: "600"
                      }}>
                        Aesthetic Capture
                      </div>
                      <div style={{
                        fontSize: "0.88rem",
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

            {/* 4. Live Music/Video Previews */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="glass-panel"
              style={{
                padding: "40px",
                borderRadius: 24,
                display: "flex",
                flexDirection: "column",
                gap: 28
              }}
            >
              <div>
                <h2 style={{
                  fontFamily: "'Instrument Serif', sans-serif",
                  fontSize: "2.4rem",
                  letterSpacing: "0.08em",
                  color: "#fff",
                  margin: 0
                }}>
                  Vibrational Previews
                </h2>
                <div style={{
                  height: 3,
                  width: 48,
                  background: `linear-gradient(to right, ${artist.color}, transparent)`,
                  marginTop: 8,
                  borderRadius: 2
                }} />
              </div>

              {/* Selector with custom anims */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16
              }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {["spotify", "soundcloud", "youtube"].map(type => (
                    <button
                      key={type}
                      className={`embed-btn ${activeEmbed === type ? "active" : ""}`}
                      onClick={() => setActiveEmbed(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Pulsing Equalizer */}
                <div style={{ display: "flex", gap: 3.5, alignItems: "flex-end", height: 28 }}>
                  <div className="equalizer-bar" style={{ animationDelay: "0.1s", background: artist.color }} />
                  <div className="equalizer-bar" style={{ animationDelay: "0.38s", background: artist.color }} />
                  <div className="equalizer-bar" style={{ animationDelay: "0.55s", background: artist.color }} />
                  <div className="equalizer-bar" style={{ animationDelay: "0.22s", background: artist.color }} />
                  <div className="equalizer-bar" style={{ animationDelay: "0.45s", background: artist.color }} />
                </div>
              </div>

              {/* Dynamic Frame container */}
              <div style={{
                background: "#040405",
                borderRadius: 24,
                border: "1px solid " + artist.color + "18",
                overflow: "hidden",
                height: activeEmbed === "youtube" ? 360 : activeEmbed === "spotify" ? 80 : 166,
                transition: "height 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.6)"
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

            {/* 5. Upcoming Performances */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              style={{ display: "flex", flexDirection: "column", gap: 24 }}
            >
              <div>
                <h2 style={{
                  fontFamily: "'Instrument Serif', sans-serif",
                  fontSize: "2.4rem",
                  letterSpacing: "0.08em",
                  color: "#fff",
                  margin: 0
                }}>
                  Upcoming Alignments
                </h2>
                <div style={{
                  height: 3,
                  width: 48,
                  background: `linear-gradient(to right, ${artist.color}, transparent)`,
                  marginTop: 8,
                  borderRadius: 2
                }} />
              </div>

              {/* Event Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {artist.upcoming.map((e, idx) => (
                  <div
                    key={idx}
                    className="glass-panel glow-border-hover"
                    style={{
                      padding: "26px 32px",
                      borderRadius: 18,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 20
                    }}
                  >
                    <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
                      <div style={{
                        background: `${artist.color}15`,
                        border: `1px solid ${artist.color}25`,
                        padding: "12px 18px",
                        borderRadius: 10,
                        textAlign: "center"
                      }}>
                        <div style={{
                          fontSize: "0.68rem",
                          fontFamily: "monospace",
                          color: artist.color,
                          letterSpacing: "0.1em",
                          fontWeight: "bold"
                        }}>
                          DATE
                        </div>
                        <div style={{
                          fontSize: "0.95rem",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                          color: "#fff",
                          marginTop: 3
                        }}>
                          {e.date.split(",")[0]}
                        </div>
                      </div>

                      <div>
                        <h4 style={{
                          fontSize: "1.15rem",
                          color: "#fff",
                          fontWeight: "500",
                          margin: 0
                        }}>
                          {e.venue}
                        </h4>
                        <p style={{
                          fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.45)",
                          margin: "6px 0 0"
                        }}>
                          {e.city}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <span style={{
                        fontSize: "0.72rem",
                        fontFamily: "monospace",
                        color: e.status === "Selling Out" ? "#ef4444" : "rgba(255,255,255,0.4)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: "bold"
                      }}>
                        {e.status}
                      </span>
                      <button
                        onClick={() => toast({ message: "Booking links will align shortly! 🎟️", type: "info" })}
                        style={{
                          background: "transparent",
                          border: `1px solid ${artist.color}45`,
                          color: "#fff",
                          padding: "11px 22px",
                          borderRadius: 10,
                          fontSize: "0.82rem",
                          fontWeight: "600",
                          fontFamily: "inherit",
                          cursor: "pointer",
                          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = artist.color; e.currentTarget.style.borderColor = artist.color; e.currentTarget.style.boxShadow = `0 0 15px ${artist.color}66`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${artist.color}45`; e.currentTarget.style.boxShadow = "none"; }}
                      >
                        Secure Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* ── RIGHT: Sticky Booking Card & Socials ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 28 }}>
              {/* Premium Booking Glass Panel */}
              <motion.section
                initial={{ opacity: 0, x: 35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="glass-panel"
                style={{
                  padding: "44px 36px",
                  borderRadius: 24,
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Accent circular radial background blur */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "150px",
                  height: "150px",
                  background: `radial-gradient(circle, ${artist.color}0a 0%, transparent 72%)`,
                  pointerEvents: "none"
                }} />

                <h3 style={{
                  fontFamily: "'Instrument Serif', sans-serif",
                  fontSize: "2.1rem",
                  letterSpacing: "0.08em",
                  color: "#fff",
                  marginBottom: 6
                }}>
                  Reserve Alignment
                </h3>
                <p style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.45)",
                  marginBottom: 28,
                  lineHeight: 1.5
                }}>
                  Direct dynamic inquiry desk to coordinates representing the artist’s manager.
                </p>

                <form onSubmit={handleInquiry} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name / Organization"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "14px 18px",
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid " + artist.color + "22",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontFamily: "inherit",
                        outline: "none",
                        transition: "all 0.3s"
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = artist.color}
                      onBlur={e => e.currentTarget.style.borderColor = artist.color + "22"}
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
                        padding: "14px 18px",
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid " + artist.color + "22",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontFamily: "inherit",
                        outline: "none",
                        transition: "all 0.3s"
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = artist.color}
                      onBlur={e => e.currentTarget.style.borderColor = artist.color + "22"}
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
                        padding: "14px 18px",
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid " + artist.color + "22",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontFamily: "inherit",
                        outline: "none",
                        transition: "all 0.3s"
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = artist.color}
                      onBlur={e => e.currentTarget.style.borderColor = artist.color + "22"}
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
                        padding: "14px 18px",
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid " + artist.color + "22",
                        borderRadius: 10,
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontFamily: "inherit",
                        outline: "none",
                        resize: "none",
                        transition: "all 0.3s"
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = artist.color}
                      onBlur={e => e.currentTarget.style.borderColor = artist.color + "22"}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "15px",
                      background: `linear-gradient(135deg, ${artist.color} 0%, ${artist.color}bd 100%)`,
                      border: "none",
                      borderRadius: 10,
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: `0 8px 25px ${artist.color}35`,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 30px ${artist.color}58`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 25px ${artist.color}35`; }}
                  >
                    Check Availability
                  </button>
                </form>

                {/* Management Desk info */}
                <div style={{
                  borderTop: "1px solid " + artist.color + "1a",
                  marginTop: 32,
                  paddingTop: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Agent In-Charge:</span>
                    <span style={{ fontSize: "0.72rem", color: "#fff", fontWeight: "500" }}>Tangy Bookings Desk</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Average Response:</span>
                    <span style={{ fontSize: "0.72rem", color: artist.accent, fontWeight: "bold", textShadow: `0 0 10px ${artist.accent}33` }}>&lt; 6 Hours</span>
                  </div>
                </div>
              </motion.section>

              {/* Social Links Panel */}
              <motion.section
                initial={{ opacity: 0, x: 35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="glass-panel"
                style={{
                  padding: "26px 36px",
                  borderRadius: 24,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{
                  fontSize: "0.78rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.45)",
                  fontWeight: "bold"
                }}>
                  CONNECT
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  {Object.entries(artist.socials).map(([net, url]) => (
                    <a
                      key={net}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid " + artist.color + "22",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.55)",
                        textDecoration: "none",
                        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = artist.color; e.currentTarget.style.background = `${artist.color}15`; e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.borderColor = artist.color + "22"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "none"; }}
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
              background: "rgba(2,2,3,0.96)",
              backdropFilter: "blur(25px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 18
              }}
            >
              <img
                src={lightbox.img}
                alt={lightbox.label}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  borderRadius: 24,
                  boxShadow: `0 0 100px ${artist.color}33`,
                  border: "1px solid " + artist.color + "44"
                }}
              />
              <div style={{ textAlign: "center" }}>
                <h4 style={{
                  fontFamily: "'Instrument Serif', sans-serif",
                  fontSize: "1.9rem",
                  letterSpacing: "0.1em",
                  color: "#fff",
                  margin: 0
                }}>
                  {lightbox.label}
                </h4>
                <p style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "monospace",
                  letterSpacing: "0.12em",
                  marginTop: 6
                }}>
                  ESC TO COLLAPSE
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
