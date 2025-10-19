// src/pages/VerifyNotice.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { API } from "../constants/api";
import AlertBox from "../components/common/AlertBox";
import { useTranslation } from "react-i18next";

export default function VerifyNotice() {
  const { t, i18n } = useTranslation();
  const locale = localStorage.getItem("locale") || "en";

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendUrl, setResendUrl] = useState("");

  useEffect(() => {
    i18n.changeLanguage(locale);

    const saved = localStorage.getItem("verify_notice");
    if (saved) {
      const data = JSON.parse(saved);
      setMessage(data.message);
      setResendUrl(data.resend_url);
      localStorage.removeItem("verify_notice");
    }
  }, [locale, i18n]);

  const handleResend = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (resendUrl) {
        await api.post(resendUrl);
        setMessage(t("verify.resent_inbox"));
      } else {
        await api.post(API.AUTH.EMAIL_RESEND(locale));
        setMessage(t("verify.resent"));
      }
    } catch (err) {
      setError(err.response?.data?.message || t("verify.failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 text-center">
      <h2 className="fw-bold mb-4 text-uppercase">{t("verify.title")}</h2>

      {message && <AlertBox type="info" message={message} />}
      {error && <AlertBox type="danger" message={error} />}

      <p className="text-muted mb-4">{t("verify.description")}</p>

      <button
        onClick={handleResend}
        className="btn btn-primary px-4"
        disabled={loading}
      >
        {loading ? t("verify.processing") : t("verify.button")}
      </button>
    </div>
  );
}
