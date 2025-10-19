import { useEffect, useState } from "react";
import api from "../../services/api";
import { API } from "../../constants/api";
import AlertBox from "../../components/common/AlertBox";
import OrderCard from "../../components/orders/OrderCard";

// ✅ Import modern icons
import { FiClock, FiCheckCircle } from "react-icons/fi";

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

  // 🧠 Segregate orders
  const completedStatuses = ["completed", "delivered", "finished"];
  const completedOrders = orders.filter((o) =>
    completedStatuses.includes(String(o.status).toLowerCase())
  );
  const otherOrders = orders.filter(
    (o) => !completedStatuses.includes(String(o.status).toLowerCase())
  );

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
          <div className="alert alert-light text-center">No orders found.</div>
        )}

        {/* 🕒 ACTIVE / PENDING */}
        {!loading && otherOrders.length > 0 && (
          <div className="mb-5">
            <h4 className="section-title border-bottom pb-2">
              <FiClock size={20} color="#0d6efd" />
              <span>Active / Pending Orders</span>
            </h4>
            <div className="d-flex flex-column gap-3">
              {otherOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {/* ✅ COMPLETED */}
        {!loading && completedOrders.length > 0 && (
          <div>
            <h4 className="section-title border-bottom pb-2">
              <FiCheckCircle size={20} color="#28a745" />
              <span>Completed Orders</span>
            </h4>
            <div className="d-flex flex-column gap-3">
              {completedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
