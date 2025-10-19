// src/pages/auth/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { API } from "../../constants/api";
import AlertBox from "../../components/common/AlertBox";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t, i18n } = useTranslation();
  const locale = localStorage.getItem("locale") || "en";
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
      if (err.response) {
        const backendMsg =
          err.response.data?.message ||
          Object.values(err.response.data?.errors || {}).flat().join("\n");
        setMessage(backendMsg || t("login.failed"));
        setType("danger");
      }
    } finally {
      setLoading(false);
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
      {/* Breadcrumb */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="breadcrumb__text">
            <h4>{t("login.title")}</h4>
            <div className="breadcrumb__links">
              <Link to="/">{t("home")}</Link>
              <span>{t("auth.title")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section className="checkout spad">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="checkout__form">
                <h4>{t("login.heading")}</h4>

                <AlertBox type={type} message={message} />

                <form onSubmit={handleSubmit}>
                  <div className="checkout__input">
                    <p>
                      {t("login.email")}<span>*</span>
                    </p>
                    <input
                      type="email"
                      name="email"
                      placeholder={t("login.email_placeholder")}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="checkout__input">
                    <p>
                      {t("login.password")}<span>*</span>
                    </p>
                    <input
                      type="password"
                      name="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="site-btn" disabled={loading}>
                    {loading ? "..." : t("login.button")}
                  </button>
                </form>

                <div className="mt-3">
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
