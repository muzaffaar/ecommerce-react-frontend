import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { API } from "../constants/api";
import AlertBox from "../components/common/AlertBox";
import CartItem from "../components/cart/CartItem";
import { useLocale } from "../context/LocaleContext"; 

export default function Cart() {
  const { locale } = useLocale();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false); // no hard loading screen
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchCart = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.get(API.CART.LIST(locale));
      setItems(res.data?.items || []);
      setTotal(Number(res.data?.total_price || 0));
    } catch (err) {
      console.error("❌ Fetch cart error:", err);
      setMessage({
        type: "danger",
        text: err.response?.data?.message || "Failed to load cart.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [locale]);

  // ✅ Update Quantity — fetch fresh localized response
  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    setMessage({ type: "", text: "" });

    try {
      const res = await api.put(
        `${API.CART.UPDATE(locale)}?cart_item_id=${itemId}&quantity=${newQty}`
      );

      const updatedCart = res.data;
      if (updatedCart?.items) {
        setItems(updatedCart.items);
        setTotal(Number(updatedCart.total_price || 0));
      } else {
        await fetchCart();
      }

      const msg =
        updatedCart?.message ||
        updatedCart?.success ||
        "Cart updated successfully.";
      setMessage({ type: "success", text: msg });
    } catch (err) {
      console.error("❌ Update quantity error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update quantity.";
      setMessage({ type: "danger", text: msg });
    }
  };

  // ✅ Delete Item
  const handleDelete = async (itemId) => {
    setMessage({ type: "", text: "" });
    try {
      const res = await api.delete(`${API.CART.DELETE(locale)}?cart_item_id=${itemId}`);
      await fetchCart(); // ensure synced cart
      setMessage({
        type: "success",
        text: res.data?.message || "Item removed from cart.",
      });
    } catch (err) {
      console.error("❌ Delete error:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to delete item.";
      setMessage({ type: "danger", text: msg });
    }
  };
  
window.dispatchEvent(new Event("cartUpdated"));

  return (
    <>
    {/* Alerts */}
          {message.text && (
            <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050 }}>
              <AlertBox type={message.type} message={message.text} />
            </div>
          )}
      {/* Breadcrumb */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="breadcrumb__text">
            <h4>Shopping Cart</h4>
            <div className="breadcrumb__links">
              <Link to="/">Home</Link>
              <span>Cart</span>
            </div>
          </div>
        </div>
      </section>

      <section className="shopping-cart spad">
        <div className="container">
          

          {items.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-3">Your cart is empty.</p>
              <Link to="/" className="btn btn-outline-dark">
                🛍 Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="row g-4 align-items-start">
              {/* LEFT SIDE */}
              <div className="col-lg-8">
                <div className="shopping__cart__table bg-white rounded shadow-sm p-3">
                  <table className="table table-borderless align-middle">
                    <thead className="border-bottom">
                      <tr className="text-uppercase small text-muted">
                        <th className="text-start">Product</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          onDelete={handleDelete}
                          onQuantityChange={handleQuantityChange}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between mt-3">
                  <Link to="/" className="btn btn-outline-dark">
                    Continue Shopping
                  </Link>
                  <button
                    className="btn btn-dark d-flex align-items-center gap-2"
                    onClick={fetchCart}
                    disabled={loading}
                  >
                    {loading && (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                    )}
                    Refresh Cart
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="col-lg-4">
                <div
                  className="cart__summary shadow-sm bg-light rounded p-4 sticky-top"
                  style={{ top: "100px" }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-uppercase mb-0">Cart Summary</h5>
                    {loading && (
                      <div
                        className="spinner-border spinner-border-sm text-secondary"
                        role="status"
                      ></div>
                    )}
                  </div>

                  <ul className="list-unstyled mb-4">
                    <li className="d-flex justify-content-between mb-2">
                      <span>Subtotal</span>
                      <strong>${total.toFixed(2)}</strong>
                    </li>
                    <li className="d-flex justify-content-between mb-2">
                      <span>Shipping</span>
                      <strong>Free</strong>
                    </li>
                    <li className="d-flex justify-content-between border-top pt-2 mt-2">
                      <span>Total</span>
                      <strong>${total.toFixed(2)}</strong>
                    </li>
                  </ul>

                  <Link to="/checkout" className="btn btn-dark w-100 py-2">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
