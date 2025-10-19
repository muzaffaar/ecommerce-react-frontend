import { useEffect, useState } from "react";
import api from "../../services/api";
import { API } from "../../constants/api";
import AlertBox from "../../components/common/AlertBox";
import OrderCard from "../../components/orders/OrderCard";
import { FiClock, FiCheckCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function Orders() {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const locale = localStorage.getItem("locale") || "en";
  const token = localStorage.getItem("token");

  // ✅ Switch language once when locale changes
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  // ✅ Fetch orders only when locale or token changes
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setMessage("");
      try {
        if (!token) {
          setMessage(t("errors.not_logged_in"));
          setType("danger");
          return;
        }

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
        } else {
          setMessage(t("errors.load_orders_failed"));
          setType("danger");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [locale, token]); // ❗ removed i18n & t to prevent infinite loop

  const completedStatuses = ["completed", "delivered", "finished"];
  const completedOrders = orders.filter((o) =>
    completedStatuses.includes(String(o.status).toLowerCase())
  );
  const otherOrders = orders.filter(
    (o) => !completedStatuses.includes(String(o.status).toLowerCase())
  );

  return (
    <>
      {/* 🧭 Breadcrumb */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>{t("orderpage.title")}</h4>
                <div className="breadcrumb__links">
                  <a href="/">{t("home")}</a>
                  <span>{t("orderpage.title")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧾 Orders List */}
      <div className="container py-5">
        {message && <AlertBox type={type} message={message} />}

        {loading && <p>{t("orderpage.loading")}</p>}

        {!loading && orders.length === 0 && !message && (
          <div className="alert alert-light text-center">
            {t("orderpage.no_orders")}
          </div>
        )}

        {/* 🕒 ACTIVE / PENDING */}
        {!loading && otherOrders.length > 0 && (
          <div className="mb-5">
            <h4 className="section-title border-bottom pb-2 d-flex align-items-center gap-2">
              <FiClock size={20} color="#0d6efd" />
              <span>{t("orderpage.active_orders")}</span>
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
            <h4 className="section-title border-bottom pb-2 d-flex align-items-center gap-2">
              <FiCheckCircle size={20} color="#28a745" />
              <span>{t("orderpage.completed_orders")}</span>
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
