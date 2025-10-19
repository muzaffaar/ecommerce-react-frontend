// src/pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { API } from "../constants/api";
import AlertBox from "../components/common/AlertBox";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const { t, i18n } = useTranslation();
  const locale = localStorage.getItem("locale") || "en";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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
      const res = await api.post(API.AUTH.RESET_PASSWORD(locale), {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setMessage(res.data?.message || t("reset.success"));
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || t("reset.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 text-center" style={{ maxWidth: 400 }}>
      <h2 className="fw-bold mb-4">{t("reset.title")}</h2>

      {message && <AlertBox type="success" message={message} />}
      {error && <AlertBox type="danger" message={error} />}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3 text-start">
          <label htmlFor="password">{t("reset.new_password")}</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3 text-start">
          <label htmlFor="password_confirmation">{t("reset.confirm_password")}</label>
          <input
            id="password_confirmation"
            type="password"
            className="form-control"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? t("reset.processing") : t("reset.button")}
        </button>
      </form>
    </div>
  );
}
