import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { API } from "../constants/api";
import { useLocale } from "../context/LocaleContext";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import AlertBox from "../components/common/AlertBox";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const { locale } = useLocale();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipient_name: "",
    country_code: "+36",
    phone_number: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "Hungary",
    save_address: true,
  });

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const fetchCart = async () => {
    try {
      const res = await api.get(API.CART.LIST(locale));
      setCartItems(res.data?.items || []);
      setTotal(Number(res.data?.total_price || 0));
    } catch (err) {
      console.error("❌ Fetch cart failed:", err);
      setAlert({
        type: "danger",
        message:
          err.response?.data?.message || t("checkoutpage.cart_load_failed"),
      });
    }
  };

  useEffect(() => {
    i18n.changeLanguage(locale);
    const ensureGuestToken = async () => {
      const existing = localStorage.getItem("guest_token");
      if (!existing) {
        try {
          const res = await api.post(API.AUTH.GUEST_TOKEN(locale));
          const guestToken = res.data?.guest_token;
          if (guestToken) localStorage.setItem("guest_token", guestToken);
        } catch (err) {
          console.error("❌ Failed to get guest token:", err);
        }
      }
    };
    ensureGuestToken();
    fetchCart();
  }, [locale, i18n]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });
    setLoading(true);

    try {
      const phone = `${formData.country_code}${formData.phone_number}`;
      const payload = {
        recipient_name: formData.recipient_name,
        phone,
        address_line: formData.address_line,
        city: formData.city,
        postal_code: formData.postal_code,
        country: formData.country,
        save_address: formData.save_address ? 1 : 0,
      };

      const res = await api.post(API.CHECKOUT.CREATE(locale), payload);
      if (!res.data.client_secret)
        throw new Error("No client_secret returned from backend.");

      setClientSecret(res.data.client_secret);
      setAlert({ type: "success", message: t("checkoutpage.proceed_payment") });
    } catch (err) {
      console.error("Checkout error:", err);
      setAlert({
        type: "danger",
        message:
          err.response?.data?.message ||
          err.message ||
          t("checkoutpage.failed_checkout"),
      });
    } finally {
      setLoading(false);
    }
  };

  window.dispatchEvent(new Event("cartUpdated"));

  return (
    <>
      <section className="breadcrumb-option">
        <div className="container">
          <div className="breadcrumb__text">
            <h4>{t("checkoutpage.title")}</h4>
            <div className="breadcrumb__links">
              <Link to="/">{t("home")}</Link>
              <span>{t("checkoutpage.title_short")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="checkout spad py-5">
        <div className="container">
          {alert.message && (
            <div className="mb-3">
              <AlertBox type={alert.type} message={alert.message} />
            </div>
          )}

          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm clientSecret={clientSecret} />
            </Elements>
          ) : (
            <div className="row g-4">
              {/* LEFT: Billing Form */}
              <div className="col-lg-8 col-md-6">
                <form
                  onSubmit={handleCheckout}
                  className="checkout__form bg-white shadow-sm p-4 rounded"
                >
                  <h5 className="fw-bold mb-4 text-uppercase">
                    {t("checkoutpage.billing_details")}
                  </h5>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">
                        {t("checkoutpage.full_name")}
                      </label>
                      <input
                        type="text"
                        name="recipient_name"
                        className="form-control"
                        value={formData.recipient_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <label className="form-label">
                        {t("checkoutpage.phone")}
                      </label>
                      <div className="input-group">
                        <select
                          name="country_code"
                          className="form-select"
                          style={{ maxWidth: "90px" }}
                          value={formData.country_code}
                          onChange={handleChange}
                        >
                          <option value="+36">🇭🇺 +36</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+49">🇩🇪 +49</option>
                          <option value="+998">🇺🇿 +998</option>
                        </select>
                        <input
                          type="text"
                          name="phone_number"
                          className="form-control"
                          placeholder={t("checkoutpage.phone_placeholder")}
                          value={formData.phone_number}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        {t("checkoutpage.country")}
                      </label>
                      <input
                        type="text"
                        name="country"
                        className="form-control"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        {t("checkoutpage.address")}
                      </label>
                      <input
                        type="text"
                        name="address_line"
                        className="form-control"
                        value={formData.address_line}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        {t("checkoutpage.city")}
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        {t("checkoutpage.postal_code")}
                      </label>
                      <input
                        type="text"
                        name="postal_code"
                        className="form-control"
                        value={formData.postal_code}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 form-check mt-2">
                      <input
                        type="checkbox"
                        name="save_address"
                        className="form-check-input"
                        id="saveAddress"
                        checked={formData.save_address}
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="saveAddress"
                        className="form-check-label"
                      >
                        {t("checkoutpage.save_address")}
                      </label>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      className="btn btn-dark px-5"
                      disabled={loading}
                    >
                      {loading
                        ? t("checkoutpage.processing")
                        : t("checkoutpage.proceed")}
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT: Order Summary */}
              <div className="col-lg-4 col-md-6">
                <div className="checkout__order shadow-sm rounded p-4 bg-light">
                  <h5 className="fw-bold mb-3 text-uppercase">
                    {t("checkoutpage.your_order")}
                  </h5>

                  <div className="checkout__order__products border-bottom pb-2 mb-3 d-flex justify-content-between">
                    <span>{t("checkoutpage.product")}</span>
                    <span>{t("checkoutpage.total")}</span>
                  </div>

                  <ul className="list-unstyled mb-3">
                    {cartItems.map((item, i) => (
                      <li
                        key={i}
                        className="d-flex justify-content-between mb-2 small"
                      >
                        <span>
                          {i + 1}. {item.product?.name?.toUpperCase()}
                        </span>
                        <span>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <ul className="list-unstyled border-top pt-2">
                    <li className="d-flex justify-content-between">
                      <span>{t("checkoutpage.subtotal")}</span>
                      <strong>${total.toFixed(2)}</strong>
                    </li>
                    <li className="d-flex justify-content-between">
                      <span>{t("checkoutpage.shipping")}</span>
                      <strong>{t("checkoutpage.free")}</strong>
                    </li>
                    <li className="d-flex justify-content-between">
                      <span>{t("checkoutpage.total")}</span>
                      <strong>${total.toFixed(2)}</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function PaymentForm({ clientSecret }) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: elements.getElement(CardElement) } }
    );

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent.status === "succeeded") {
      setMessage(t("checkoutpage.payment_success"));
      setTimeout(() => navigate("/orders"), 1500);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handlePayment}
      className="mx-auto shadow-sm bg-white p-4 rounded"
      style={{ maxWidth: "500px" }}
    >
      <h5 className="mb-3 text-center text-uppercase">
        {t("checkoutpage.payment_details")}
      </h5>
      <div className="mb-3 border rounded p-3">
        <CardElement />
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="btn btn-success px-5"
          disabled={!stripe || loading}
        >
          {loading ? t("checkoutpage.processing") : t("checkoutpage.pay_now")}
        </button>
      </div>
      {message && (
        <div className="mt-3">
          <AlertBox type="info" message={message} />
        </div>
      )}
    </form>
  );
}
