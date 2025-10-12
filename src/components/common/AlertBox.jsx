import { useEffect, useState } from "react";

export default function AlertBox({ type = "info", message, duration = 4000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!visible || !message) return null;

  const getColors = () => {
    switch (type) {
      case "success":
        return { bg: "#d1e7dd", text: "#0f5132", accent: "#198754" };
      case "danger":
        return { bg: "#f8d7da", text: "#842029", accent: "#dc3545" };
      case "warning":
        return { bg: "#fff3cd", text: "#664d03", accent: "#ffc107" };
      default:
        return { bg: "#cff4fc", text: "#055160", accent: "#0dcaf0" };
    }
  };

  const { bg, text, accent } = getColors();

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{
        zIndex: 99999,           // ensures alert is always visible on top
        top: "80px",             // just below navbar
        right: "20px",
        pointerEvents: "none",   // allow clicks through background
      }}
    >
      <div
        className="shadow-lg fade show border-0 rounded-3 position-relative"
        role="alert"
        style={{
          background: `linear-gradient(145deg, ${bg}, #ffffff)`,
          color: text,
          minWidth: "300px",
          padding: "1rem 1.2rem",
          borderLeft: `6px solid ${accent}`,
          animation: "slideIn 0.4s ease-out, fadeOut 0.5s ease-in ${duration - 600}ms forwards",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          pointerEvents: "auto", // enable close button click
        }}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ fontWeight: 500 }}>{message}</div>

          {/* ✖️ Modern close button */}
          <button
            onClick={() => setVisible(false)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: accent,
              lineHeight: "1",
              marginLeft: "1rem",
              cursor: "pointer",
              transition: "transform 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.3)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            &times;
          </button>
        </div>
      </div>

      <style>
        {`
        @keyframes slideIn {
          from {
            transform: translateY(-15px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          to {
            transform: translateY(-10px);
            opacity: 0;
          }
        }
      `}
      </style>
    </div>
  );
}
