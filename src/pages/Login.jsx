import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { API } from "../constants/api";
import AlertBox from "../components/common/AlertBox";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [redirectPath, setRedirectPath] = useState(null);

  const locale = localStorage.getItem("locale") || "en";
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setType("info");
    setRedirectPath(null);

    try {
      const res = await api.post(API.AUTH.LOGIN(locale), formData);
      setMessage(res.data.message);
      setType("success");

      if (res.data.token) localStorage.setItem("token", res.data.token);

      const path = res.data.returnUrl || "/";
      setRedirectPath(path);
    } catch (err) {
      const backendMsg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat().join("\n");
      setMessage(backendMsg || "Login failed.");
      setType("danger");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 🔹 Call backend redirect endpoint
      const res = await api.get(API.AUTH.GOOGLE_REDIRECT);
      if (res.data?.url) {
        // Redirect user to Google login
        window.location.href = res.data.url;
      } else {
        // If API returns redirect directly (302), fallback to full URL
        window.location.href = `${API.AUTH.GOOGLE_REDIRECT}`;
      }
    } catch {
      setMessage("Failed to start Google login.");
      setType("danger");
    }
  };

  useEffect(() => {
    if (redirectPath && type === "success") {
      const timer = setTimeout(() => navigate(redirectPath), 1500);
      return () => clearTimeout(timer);
    }
  }, [redirectPath, type, navigate]);

  return (
    <>
      {/* 🧭 Breadcrumb */}
      <section className="breadcrumb-option bg-light py-4">
        <div className="container">
          <div className="breadcrumb__text">
            <h4 className="fw-bold">Login</h4>
            <div className="breadcrumb__links">
              <Link to="/">Home</Link> <span>Auth</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🔐 Auth Section */}
      <section className="checkout spad">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="checkout__form card border-0 shadow-sm p-4 rounded-4">
                <h4 className="fw-bold mb-4">Login to Your Account</h4>

                <AlertBox type={type} message={message} />

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control rounded-3"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control rounded-3"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100 py-2 fw-semibold rounded-3"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Login"}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center my-3 text-muted small">
                  ─── or ───
                </div>

                {/* 🔵 Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  className="btn btn-light border w-100 py-2 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2"
                >
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    width="20"
                    height="20"
                  />
                  Continue with Google
                </button>

                {/* Links */}
                <div className="text-center mt-4">
                  <Link
                    to="/forgot-password"
                    className="text-decoration-none me-2"
                  >
                    Forgot password?
                  </Link>
                  <span className="text-muted">·</span>
                  <Link to="/register" className="text-decoration-none ms-2">
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
