// src/pages/ForgotPassword.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { API } from "../constants/api";
import AlertBox from "../components/common/AlertBox";
import { useTranslation } from "react-i18next";

export default function ForgotPassword() {
  const { t, i18n } = useTranslation();
  const locale = localStorage.getItem("locale") || "en";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await api.post(API.AUTH.FORGOT_PASSWORD(locale), { email });
      setMessage(res.data?.message || t("forgot.success"));
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || t("forgot.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 text-center" style={{ maxWidth: 400 }}>
      <h2 className="fw-bold mb-4">{t("forgot.title")}</h2>

      {message && <AlertBox type="success" message={message} />}
      {error && <AlertBox type="danger" message={error} />}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3 text-start">
          <label htmlFor="email">{t("forgot.email")}</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? t("forgot.processing") : t("forgot.button")}
        </button>
      </form>
    </div>
  );
}
