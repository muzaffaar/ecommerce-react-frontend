export default function NotFound() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
      style={{
        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
      }}
    >
      {/* 🚫 404 Bubble */}
      <div
        className="rounded-circle d-flex justify-content-center align-items-center mb-4 shadow-lg"
        style={{
          width: "150px",
          height: "150px",
          background:
            "radial-gradient(circle at 30% 30%, #dc3545 0%, #a71d2a 100%)",
          color: "white",
          fontSize: "3rem",
          fontWeight: "bold",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
      >
        404
      </div>

      {/* Message */}
      <h2 className="fw-bold text-dark mb-3">Oops! Page Not Found</h2>
      <p className="text-muted mb-4" style={{ maxWidth: "400px" }}>
        It looks like the page you’re searching for doesn’t exist or has been
        moved. Try going back to the homepage.
      </p>

      {/* Button */}
      <a
        href="/"
        className="btn btn-lg text-white px-4 py-2"
        style={{
          background: "linear-gradient(90deg, #1b212bff, #1f2329ff)",
          border: "none",
          borderRadius: "50px",
          boxShadow: "0 4px 10px rgba(40, 63, 98, 0.3)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.target.style.background = "linear-gradient(90deg, #425572ff, #363e49ff)")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = "linear-gradient(90deg, #3f4959ff, #40464fff)")
        }
      >
        Go Back Home
      </a>

      {/* Optional Decorative SVG */}
      <div className="position-absolute bottom-0 opacity-10" style={{ zIndex: -1 }}>
        <svg width="100%" height="150" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,100 Q200,0 400,100 T800,100 V150 H0 Z"
            fill="#0d6efd"
          />
        </svg>
      </div>
    </div>
  );
}
