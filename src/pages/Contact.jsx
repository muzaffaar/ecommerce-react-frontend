import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { API } from "../constants/api";
import AlertBox from "../components/common/AlertBox";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      // Send to Laravel endpoint
      await api.post(API.CONTACT.SEND, form);
      setAlert({
        type: "success",
        message: "✅ Your message has been sent successfully!",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setAlert({
        type: "danger",
        message:
          err.response?.data?.message ||
          "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="breadcrumb__text">
            <h4>Contact Us</h4>
            <div className="breadcrumb__links">
              <Link to="/">Home</Link>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section – University of Debrecen */}
      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2780.994237847167!2d21.62311717653292!3d47.552305071178554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470eb7a3fca4d3%3A0x80b207dbb9e303e4!2sUniversity%20of%20Debrecen!5e0!3m2!1sen!2shu!4v1732809273105!5m2!1sen!2shu"
          height="500"
          style={{ border: 0, width: "100%" }}
          allowFullScreen=""
          loading="lazy"
          title="University of Debrecen Map"
        ></iframe>
      </div>

      {/* Contact Section */}
      <section className="contact spad">
        <div className="container">
          <div className="row">
            {/* Info */}
            <div className="col-lg-6 col-md-6">
              <div className="contact__text">
                <div className="section-title">
                  <span>Information</span>
                  <h2>Contact Us</h2>
                  <p>
                    We are based in Debrecen, Hungary — at the University of Debrecen campus.
                    Feel free to reach out to us for collaborations, support, or any inquiries.
                  </p>
                </div>
                <ul>
                  <li>
                    <h4>Hungary</h4>
                    <p>
                      University of Debrecen, 70 Kolónia Street, Debrecen
                      <br />
                      <a href="tel:+36705430298">+36 70 543 0298</a>
                    </p>
                  </li>
                  <li>
                    <h4>Uzbekistan</h4>
                    <p>
                      Tashkent City
                      <br />
                      <a href="tel:+998900000000">+998 90 000 0000</a>
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="col-lg-6 col-md-6">
              <div className="contact__form">
                {alert.message && (
                    <AlertBox type={alert.type} message={alert.message} />
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-6">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-12">
                      <textarea
                        name="message"
                        placeholder="Message"
                        value={form.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <button
                        type="submit"
                        className="site-btn"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
