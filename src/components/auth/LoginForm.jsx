import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { API } from "../../constants/api";
import AlertBox from "../../components/common/AlertBox";

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
      if (err.response) {
        const backendMsg =
          err.response.data?.message ||
          Object.values(err.response.data?.errors || {}).flat().join("\n");
        setMessage(backendMsg);
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
      <section class="breadcrumb-option">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="breadcrumb__text">
                        <h4>Login</h4>
                        <div class="breadcrumb__links">
                            <Link to="/">Home</Link>
                            <span>Auth</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

      {/* Auth Section */}
      <section className="checkout spad">
        <div className="container">
          <div className="row justify-content-center">
            {/* Login Form */}
            <div className="col-lg-6">
              <div className="checkout__form">
                <h4>Login</h4>

                <AlertBox type={type} message={message} />

                <form onSubmit={handleSubmit}>
                  <div className="checkout__input">
                    <p>
                      Email<span>*</span>
                    </p>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="checkout__input">
                    <p>
                      Password<span>*</span>
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

                  <button
                    type="submit"
                    className="site-btn"
                    disabled={loading}
                  >
                    {loading ? "..." : "Login"}
                  </button>
                </form>

                <div className="mt-3">
                  <Link
                    to="/forgot-password"
                    className="text-decoration-none me-2"
                  >
                    Forgot password?
                  </Link>
                  <span className="text-muted">·</span>
                  <Link
                    to="/register"
                    className="text-decoration-none ms-2"
                  >
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
