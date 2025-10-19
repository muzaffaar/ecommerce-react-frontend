import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      navigate(`/login${error ? `?error=${error}` : ""}`);
    }
  }, [navigate]);

  return (
    <div className="container text-center py-5">
      <h4>Signing you in with Google...</h4>
      <p>Please wait a moment.</p>
    </div>
  );
}
