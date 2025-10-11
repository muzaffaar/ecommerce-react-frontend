import { useState } from "react";

export default function OrderCard({ order }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="order-card mb-4 border rounded shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="order-header d-flex justify-content-between align-items-center px-4 py-3"
        style={{
          backgroundColor: "#111",
          color: "#fff",
          cursor: "pointer",
        }}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div>
          <strong>Order #{order.id}</strong>
          <span className="badge ms-3 text-uppercase"
            style={{
              backgroundColor:
                order.status === "completed"
                  ? "#28a745"
                  : order.status === "pending"
                  ? "#ffc107"
                  : order.status === "shipped"
                  ? "#17a2b8"
                  : "#6c757d",
              color:
                order.status === "pending" || order.status === "shipped"
                  ? "#000"
                  : "#fff",
            }}
          >
            {order.status}
          </span>
        </div>

        <div className="text-end">
          <span className="fw-semibold">${Number(order.total_price).toFixed(2)}</span>
          <div className="small text-light">
            {new Date(order.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        className={`order-body px-4 py-3 bg-white ${
          open ? "d-block" : "d-none"
        }`}
      >
        {/* 🧾 Items */}
        {order.items && order.items.length > 0 ? (
          <>
            <h6 className="fw-bold mb-3 text-uppercase text-secondary">
              Items
            </h6>
            <div className="list-group border-0">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="list-group-item border-0 border-bottom py-3 px-0 d-flex justify-content-between align-items-start"
                >
                  <div className="d-flex align-items-start">
                    {/* 🖼️ Product image */}
                    {item.product?.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="me-3 rounded"
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      />
                    )}

                    <div>
                      <div className="fw-semibold text-capitalize">
                        {item.product?.name || "Unnamed Product"}
                      </div>
                      <div className="text-muted small">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </div>

                      {/* 🎨 Variations */}
                      {item.variations && item.variations.length > 0 && (
                        <div className="mt-1 small">
                          {item.variations.map((v) => (
                            <span
                              key={v.id}
                              className="badge bg-light text-dark me-1 border"
                              style={{
                                borderColor: v.color_code || "#ccc",
                              }}
                            >
                              {v.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-end fw-semibold text-primary">
                    ${Number(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted mb-3">No items in this order.</p>
        )}

        {/* 🚚 Shipping */}
        {order.shipping_address && (
          <div className="mt-3 p-3 border rounded bg-light">
            <h6 className="fw-bold text-uppercase text-secondary mb-2">
              Shipping Address
            </h6>
            <div className="small">
              <strong>{order.shipping_address.recipient_name}</strong>
              <br />
              {order.shipping_address.address_line}, {order.shipping_address.city},{" "}
              {order.shipping_address.postal_code}, {order.shipping_address.country}
              <br />
              <span className="text-muted">{order.shipping_address.phone}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
