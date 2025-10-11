import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { API } from "../../constants/api";
import AlertBox from "../../components/common/AlertBox";

export default function Register() {
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

  const locale = localStorage.getItem("locale") || "en";
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setType("info");
    setReturnUrl(null);

    try {
      const res = await api.post(API.AUTH.REGISTER(locale), formData);

      setMessage(res.data.message);
      setType("success");

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.redirectUrl) setReturnUrl(res.data.redirectUrl);
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
            <h4>Register</h4>
            <div className="breadcrumb__links">
              <Link to="/">Home</Link>
              <span>Auth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section className="checkout spad">
        <div className="container">
          <div className="row justify-content-center">
            {/* Register */}
            <div className="col-lg-6">
              <div className="checkout__form">
                <h4>Create Account</h4>

                {/* Alert */}
                <AlertBox type={type} message={message} />

                <form onSubmit={handleSubmit}>
                  <div className="checkout__input">
                    <p>
                      Full Name<span>*</span>
                    </p>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="checkout__input">
                    <p>
                      Email<span>*</span>
                    </p>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your email address"
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

                  <div className="checkout__input">
                    <p>
                      Confirm Password<span>*</span>
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
                    {loading ? "..." : "Register"}
                  </button>
                </form>

                <div className="mt-3">
                  <p>
                    Already have an account?{" "}
                    <Link to="/login" className="text-decoration-none">
                      Login here
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
