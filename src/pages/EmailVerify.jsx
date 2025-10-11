import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { API } from "../constants/api";
import AlertBox from "../components/common/AlertBox";
import Loader from "../components/common/Loader";

export default function EmailVerify() {
  const { id, hash } = useParams();
  const locale = "en";
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await api.get(API.AUTH.EMAIL_VERIFY(locale, id, hash));
        setMessage(res.data?.message || "Email verified successfully!");
        localStorage.setItem("email_verified", "true");

        // redirect after a short delay
        setTimeout(() => navigate("/dashboard"), 2000);
      } catch (err) {
        setError(
          err.response?.data?.message || "Invalid or expired verification link."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id && hash) verifyEmail();
  }, [id, hash, locale, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="container py-5 text-center">
      {message && <AlertBox type="success" message={message} />}
      {error && <AlertBox type="danger" message={error} />}

      {message && (
        <p className="text-muted mt-3">
          Redirecting to dashboard...
        </p>
      )}
    </div>
  );
}
