import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  // modal = { id, type: 'alert' | 'confirm' | 'toast', title, message, onConfirm, onCancel, ... }
  const openModal = (modal) => {
    const id = Date.now().toString();
    setModals((prev) => [...prev, { ...modal, id }]);
    
    // Auto-close toasts
    if (modal.type === "toast") {
      setTimeout(() => {
        closeModal(id);
      }, modal.duration || 3000);
    }
  };

  const closeModal = (id) => {
    setModals((prev) => prev.filter((m) => m.id !== id));
  };

  const confirm = (options) => {
    openModal({ ...options, type: "confirm" });
  };

  const alert = (options) => {
    openModal({ ...options, type: "alert" });
  };

  const toast = (options) => {
    openModal({ ...options, type: "toast" });
  };

  return (
    <ModalContext.Provider value={{ confirm, alert, toast }}>
      {children}
      {/* Portals or fixed overlay for modals */}
      <AnimatePresence>
        {modals.map((m) => (
          m.type === "toast" ? (
            <Toast key={m.id} modal={m} onClose={() => closeModal(m.id)} />
          ) : (
            <ModalOverlay key={m.id} modal={m} onClose={() => closeModal(m.id)} />
          )
        ))}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

const ModalOverlay = ({ modal, onClose }) => {
  const { title, message, type, onConfirm, onCancel } = modal;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(9, 9, 9, 0.8)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px"
      }}
      onClick={(e) => { if (e.target === e.currentTarget) { if(onCancel) onCancel(); onClose(); } }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{
          background: "linear-gradient(135deg, #111 0%, #0d0d0d 100%)",
          border: "1px solid rgba(229, 192, 123, 0.3)",
          boxShadow: "0 25px 50px -12px rgba(229, 192, 123, 0.25)",
          borderRadius: "16px", padding: "30px", width: "100%", maxWidth: "420px",
          color: "#fff", fontFamily: "'DM Sans', sans-serif"
        }}
      >
        {title && (
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.05em", color: "var(--tangy-cream, #fff)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
            {type === 'confirm' ? <span style={{ color: '#f59e0b' }}>⚠️</span> : <span style={{ color: '#E5C07B' }}>✦</span>}
            {title}
          </h3>
        )}
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          {type === "confirm" && (
            <button
              onClick={() => { if (onCancel) onCancel(); onClose(); }}
              style={{
                padding: "10px 20px", background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px",
                color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => { if (onConfirm) onConfirm(); onClose(); }}
            style={{
              padding: "10px 24px", background: "#E5C07B",
              border: "none", borderRadius: "8px",
              color: "#fff", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
              transition: "all 0.2s", boxShadow: "0 4px 12px rgba(229, 192, 123,0.3)"
            }}
            onMouseEnter={(e) => { e.target.style.background = "#E5C07B"; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.target.style.background = "#E5C07B"; e.target.style.transform = "none"; }}
          >
            {type === "confirm" ? "Confirm" : "Okay"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Toast = ({ modal, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: "fixed", bottom: "24px", right: "24px", zIndex: 10001,
        background: "#111", border: "1px solid #E5C07B",
        color: "#fff", padding: "14px 24px", borderRadius: "10px", fontSize: "0.9rem",
        boxShadow: "0 10px 30px rgba(229, 192, 123, 0.2)", maxWidth: "320px",
        fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: "12px"
      }}
    >
      <span style={{ color: "#E5C07B" }}>✦</span>
      {modal.message}
    </motion.div>
  );
};
