import PropTypes from "prop-types";
import {
  FiClock,
  FiCreditCard,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiBox,
} from "react-icons/fi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AddReviewModal from "../review/AddReviewModal";

export default function OrderCard({ order }) {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const steps = [
    { key: "pending", label: t("ordercard.pending"), icon: <FiClock /> },
    { key: "paid", label: t("ordercard.paid"), icon: <FiCreditCard /> },
    { key: "shipped", label: t("ordercard.shipped"), icon: <FiTruck /> },
    { key: "completed", label: t("ordercard.completed"), icon: <FiCheckCircle /> },
    { key: "cancelled", label: t("ordercard.cancelled"), icon: <FiXCircle /> },
  ];

  const status = String(order.status).toLowerCase();
  const currentIndex = steps.findIndex((s) => s.key === status);
  const cancelled = status === "cancelled";
  const completed = status === "completed";

  return (
    <div className="modern-order-card">
      <div className="order-header">
        <h5>
          {t("ordercard.order")} #{order.id}
        </h5>
        <span
          className={`status-badge ${
            completed
              ? "completed"
              : cancelled
              ? "cancelled"
              : "in-progress"
          }`}
        >
          {t(`ordercard.${status}`) || order.status.toUpperCase()}
        </span>
      </div>

      {/* Timeline */}
      <div className={`icon-timeline ${cancelled ? "cancelled" : ""}`}>
        <div className="timeline-track"></div>
        <div className="timeline-steps">
          {steps.map((step, index) => {
            const isDone = index <= currentIndex && !cancelled;
            const isCurrent = index === currentIndex && !cancelled;
            return (
              <div
                key={step.key}
                className={`timeline-step ${isDone ? "done" : ""} ${
                  isCurrent ? "current" : ""
                } ${cancelled ? "cancelled" : ""}`}
              >
                <div className="icon-container">{step.icon}</div>
                <small>{step.label}</small>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details */}
      <div className="order-details">
        <p>
          <strong>{t("ordercard.date")}:</strong>{" "}
          {new Date(order.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>{t("ordercard.total")}:</strong>{" "}
          ${parseFloat(order.total_price || 0).toFixed(2)}
        </p>

        {order.shipping_address && (
          <div className="mt-3">
            <p className="mb-1 fw-semibold">
              <FiMapPin className="me-1 text-danger" />{" "}
              {t("ordercard.shipping_address")}:
            </p>
            <p className="small mb-0 text-muted">
              {order.shipping_address.recipient_name},{" "}
              {order.shipping_address.address_line},{" "}
              {order.shipping_address.city},{" "}
              {order.shipping_address.country} (
              {order.shipping_address.postal_code})
            </p>
            <p className="small text-muted">📞 {order.shipping_address.phone}</p>
          </div>
        )}

        {/* Items */}
        <div className="mt-3">
          <p className="fw-semibold d-flex align-items-center gap-1 mb-2">
            <FiBox className="text-primary" /> {t("ordercard.items")}:
          </p>
          <ul className="order-items">
            {order.items?.map((item, i) => {
              const product = item.product || {};
              const variation =
                item.variations && item.variations.length > 0
                  ? item.variations[0]
                  : null;

              return (
                <li key={i} className="border-bottom pb-2 mb-2">
                  <span className="fw-semibold">{product.name}</span>
                  {variation && (
                    <>
                      <span className="badge bg-light text-dark ms-2">
                        {variation.value}
                      </span>
                      {variation.color_code && (
                        <span
                          className="ms-1"
                          style={{
                            display: "inline-block",
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor: variation.color_code,
                            border: "1px solid #ccc",
                          }}
                        ></span>
                      )}
                    </>
                  )}
                  <div className="small text-muted">
                    {t("ordercard.quantity")}: {item.quantity} × ${item.price}
                  </div>

                  {completed && (
                    <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={() => setSelectedProduct(item)}
                    >
                      {t("ordercard.leave_review") || "Leave Review"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {selectedProduct && (
        <AddReviewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onReviewAdded={() => console.log("✅ Review submitted")}
        />
      )}
    </div>
  );
}

OrderCard.propTypes = {
  order: PropTypes.object.isRequired,
};
