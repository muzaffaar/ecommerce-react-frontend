import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { API } from "../constants/api";
import { useLocale } from "../context/LocaleContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import AlertBox from "../components/common/AlertBox";

// ✅ Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const { locale } = useLocale();
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

  // 🧾 Load cart items for order summary
  const fetchCart = async () => {
    try {
      const res = await api.get(API.CART.LIST(locale));
      setCartItems(res.data?.items || []);
      setTotal(Number(res.data?.total_price || 0));
    } catch (err) {
      console.error("❌ Fetch cart failed:", err);
      setAlert({
        type: "danger",
        message: err.response?.data?.message || "Failed to load cart.",
      });
    }
  };

  // 🧾 Ensure guest token & load cart
  useEffect(() => {
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
  }, [locale]);

  // 🔁 Form field handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🧾 Checkout handler (Stripe intent)
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
      setAlert({ type: "success", message: "Proceeding to payment..." });
    } catch (err) {
      console.error("Checkout error:", err);
      setAlert({
        type: "danger",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to start checkout.",
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
            <h4>Checkout</h4>
            <div className="breadcrumb__links">
              <Link to="/">Home</Link>
              <span>Checkout</span>
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
                  <h5 className="fw-bold mb-4 text-uppercase">Billing Details</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Full Name</label>
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
                      <label className="form-label">Phone Number</label>
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
                          placeholder="301234567"
                          value={formData.phone_number}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Country</label>
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
                      <label className="form-label">Address Line</label>
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
                      <label className="form-label">City</label>
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
                      <label className="form-label">Postal Code</label>
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
                      <label htmlFor="saveAddress" className="form-check-label">
                        Save this address for future orders
                      </label>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      className="btn btn-dark px-5"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Proceed to Payment"}
                    </button>
                  </div>
                </form>
              </div>

              {/* RIGHT: Order Summary */}
              <div className="col-lg-4 col-md-6">
                <div className="checkout__order shadow-sm rounded p-4 bg-light">
                  <h5 className="fw-bold mb-3 text-uppercase">Your Order</h5>

                  <div className="checkout__order__products border-bottom pb-2 mb-3 d-flex justify-content-between">
                    <span>Product</span>
                    <span>Total</span>
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
                      <span>Subtotal</span>
                      <strong>${total.toFixed(2)}</strong>
                    </li>
                    <li className="d-flex justify-content-between">
                      <span>Shipping</span>
                      <strong>Free</strong>
                    </li>
                    <li className="d-flex justify-content-between">
                      <span>Total</span>
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
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent.status === "succeeded") {
      setMessage("✅ Payment successful! Thank you for your order.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handlePayment}
      className="mx-auto shadow-sm bg-white p-4 rounded"
      style={{ maxWidth: "500px" }}
    >
      <h5 className="mb-3 text-center text-uppercase">Payment Details</h5>
      <div className="mb-3 border rounded p-3">
        <CardElement />
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="btn btn-success px-5"
          disabled={!stripe || loading}
        >
          {loading ? "Processing..." : "Pay Now"}
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
