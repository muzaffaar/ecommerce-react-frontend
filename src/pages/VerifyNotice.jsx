import { useState } from "react";
import api from "../services/api";
import { API } from "../constants/api";
import AlertBox from "../components/common/AlertBox";

export default function VerifyNotice() {
  const locale = "en";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post(API.AUTH.EMAIL_RESEND(locale));
      setMessage(res.data?.message || "Verification email has been resent.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to resend verification email. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h2 className="fw-bold mb-4 text-uppercase">Email Verification</h2>

      {message && <AlertBox type="success" message={message} />}
      {error && <AlertBox type="danger" message={error} />}

      <p className="text-muted mb-4">
        Your email address is not verified yet.  
        Please check your inbox for the verification link.
      </p>

      <button
        onClick={handleResend}
        className="btn btn-primary px-4"
        disabled={loading}
      >
        {loading ? "Sending..." : "Resend Verification Email"}
      </button>
    </div>
  );
}
