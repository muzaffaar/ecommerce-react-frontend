// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { API } from "../constants/api";
import AlertBox from "../components/common/AlertBox";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t, i18n } = useTranslation();
  const locale = localStorage.getItem("lang") || "en";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

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
      setMessage(res.data.message || t("login.success"));
      setType("success");

      if (res.data.token) localStorage.setItem("token", res.data.token);
      const path = res.data.returnUrl || "/";
      setRedirectPath(path);
    } catch (err) {
      const backendMsg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat().join("\n");
      setMessage(backendMsg || t("login.failed"));
      setType("danger");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await api.get(API.AUTH.GOOGLE_REDIRECT);
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        window.location.href = API.AUTH.GOOGLE_REDIRECT;
      }
    } catch {
      setMessage(t("login.google_failed"));
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
            <h4 className="fw-bold">{t("login.title")}</h4>
            <div className="breadcrumb__links">
              <Link to="/">{t("home")}</Link> <span>{t("auth.title")}</span>
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
                <h4 className="fw-bold mb-4">{t("login.heading")}</h4>

                <AlertBox type={type} message={message} />

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      {t("login.email")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control rounded-3"
                      placeholder={t("login.email_placeholder")}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      {t("login.password")}
                    </label>
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
                    {loading ? t("login.processing") : t("login.button")}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center my-3 text-muted small">─── {t("login.or")} ───</div>

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
                  {t("login.google")}
                </button>

                {/* Links */}
                <div className="text-center mt-4">
                  <Link to="/forgot-password" className="text-decoration-none me-2">
                    {t("login.forgot")}
                  </Link>
                  <span className="text-muted">·</span>
                  <Link to="/register" className="text-decoration-none ms-2">
                    {t("login.create")}
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
