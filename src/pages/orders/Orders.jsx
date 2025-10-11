import { useEffect, useState } from "react";
import api from "../../services/api";
import { API } from "../../constants/api";
import AlertBox from "../../components/common/AlertBox";
import OrderCard from "../../components/orders/OrderCard";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const locale = localStorage.getItem("locale") || "en";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setMessage("");
      try {
        const res = await api.get(API.ORDER.LIST(locale), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
        setType("success");
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
    fetchOrders();
  }, [locale, token]);

  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Orders</h4>
                <div className="breadcrumb__links">
                  <a href="/">Home</a>
                  <span>Orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">

        <AlertBox type={type} message={message} />

        {loading && <p>Loading...</p>}

        {!loading && orders.length === 0 && !message && (
          <div className="alert alert-light">No orders found.</div>
        )}

        <div className="d-flex flex-column gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </>
  );
}
