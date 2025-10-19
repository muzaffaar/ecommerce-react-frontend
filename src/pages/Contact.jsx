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
          "❌ Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🧭 Breadcrumb */}
      <section className="breadcrumb-option bg-light py-4">
        <div className="container">
          <div className="breadcrumb__text">
            <h4 className="fw-bold">Contact Us</h4>
            <div className="breadcrumb__links">
              <Link to="/">Home</Link>
              <span>Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🗺️ Map */}
      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2780.994237847167!2d21.62311717653292!3d47.552305071178554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47470eb7a3fca4d3%3A0x80b207dbb9e303e4!2sUniversity%20of%20Debrecen!5e0!3m2!1sen!2shu!4v1732809273105!5m2!1sen!2shu"
          height="400"
          style={{ border: 0, width: "100%" }}
          allowFullScreen=""
          loading="lazy"
          title="University of Debrecen Map"
        ></iframe>
      </div>

      {/* 📩 Contact Section */}
      <section className="contact-section py-5">
        <div className="container">
          <div className="row g-4">
            {/* Info */}
            <div className="col-lg-5">
              <div className="contact-info card border-0 shadow-sm p-4 rounded-4 h-100">
                <div className="section-title mb-4">
                  <h3 className="fw-bold text-dark mb-2">Get in Touch</h3>
                  <p className="text-muted">
                    We're based in Debrecen, Hungary. Reach out to us for
                    inquiries, support, or collaborations — we'll get back to
                    you within 24 hours.
                  </p>
                </div>

                <ul className="list-unstyled">
                  <li className="mb-4 d-flex">
                    <div className="me-3">
                      <i className="fa fa-map-marker text-danger fs-5"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Hungary</h6>
                      <p className="mb-0 text-muted small">
                        University of Debrecen, Kolónia Street 70, Debrecen
                      </p>
                    </div>
                  </li>
                  <li className="mb-4 d-flex">
                    <div className="me-3">
                      <i className="fa fa-phone text-success fs-5"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Call Us</h6>
                      <p className="mb-0">
                        <a
                          href="tel:+36705430298"
                          className="text-decoration-none text-dark"
                        >
                          +36 70 543 0298
                        </a>
                      </p>
                    </div>
                  </li>
                  <li className="d-flex">
                    <div className="me-3">
                      <i className="fa fa-envelope text-primary fs-5"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Email</h6>
                      <p className="mb-0">
                        <a
                          href="mailto:muzaffar-shoshiy@mailbox.unideb.hu"
                          className="text-decoration-none text-dark"
                        >
                          muzaffar-shoshiy@mailbox.unideb.hu
                        </a>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="col-lg-7">
              <div className="contact-form card border-0 shadow-sm p-4 rounded-4">
                <h4 className="fw-bold mb-4">Send Us a Message</h4>

                {alert.message && (
                  <AlertBox type={alert.type} message={alert.message} />
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="form-control"
                          placeholder="Your Name"
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="name">Your Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="form-control"
                          placeholder="Your Email"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          name="message"
                          id="message"
                          className="form-control"
                          placeholder="Message"
                          style={{ height: "150px" }}
                          value={form.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                        <label htmlFor="message">Your Message</label>
                      </div>
                    </div>
                    <div className="col-12 text-end">
                      <button
                        type="submit"
                        className="btn btn-dark px-4 py-2 rounded-pill"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <i className="fa fa-spinner fa-spin me-2"></i>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-paper-plane me-2"></i>Send
                            Message
                          </>
                        )}
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
