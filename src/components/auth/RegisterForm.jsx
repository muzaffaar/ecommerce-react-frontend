// src/pages/auth/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { API } from "../../constants/api";
import AlertBox from "../../components/common/AlertBox";
import { useTranslation } from "react-i18next";

export default function Register() {
  const { t, i18n } = useTranslation();
  const locale = localStorage.getItem("locale") || "en";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [returnUrl, setReturnUrl] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setType("info");
    setReturnUrl(null);

    try {
      const res = await api.post(API.AUTH.REGISTER(locale), formData);
      setMessage(res.data.message || t("register.success"));
      setType("success");

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.redirectUrl) setReturnUrl(res.data.redirectUrl);
    } catch (err) {
      if (err.response) {
        const backendMsg =
          err.response.data?.message ||
          Object.values(err.response.data?.errors || {}).flat().join("\n");
        setMessage(backendMsg || t("register.failed"));
        setType("danger");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (returnUrl) {
      const timer = setTimeout(() => navigate(returnUrl), 2000);
      return () => clearTimeout(timer);
    }
  }, [returnUrl, navigate]);

  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="breadcrumb__text">
            <h4>{t("register.title")}</h4>
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
                <h4>{t("register.heading")}</h4>

                <AlertBox type={type} message={message} />

                <form onSubmit={handleSubmit}>
                  <div className="checkout__input">
                    <p>
                      {t("register.name")}<span>*</span>
                    </p>
                    <input
                      type="text"
                      name="name"
                      placeholder={t("register.name_placeholder")}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="checkout__input">
                    <p>
                      {t("register.email")}<span>*</span>
                    </p>
                    <input
                      type="email"
                      name="email"
                      placeholder={t("register.email_placeholder")}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="checkout__input">
                    <p>
                      {t("register.password")}<span>*</span>
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

                  <div className="checkout__input">
                    <p>
                      {t("register.confirm_password")}<span>*</span>
                    </p>
                    <input
                      type="password"
                      name="password_confirmation"
                      placeholder="********"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="site-btn" disabled={loading}>
                    {loading ? "..." : t("register.button")}
                  </button>
                </form>

                <div className="mt-3">
                  <p>
                    {t("register.have_account")}{" "}
                    <Link to="/login" className="text-decoration-none">
                      {t("register.login_here")}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
