import { Link } from "react-router-dom";
import { API_BASE } from "../../constants/api";

export default function CartItem({ item, onDelete, onQuantityChange }) {
  const product = item.product;
  const firstImage = product?.images?.[0]?.url;
  const image = firstImage
    ? `${String(API_BASE || "http://meetify.uz/api")
        .replace("/api", "")}/storage/${firstImage}`
    : "/no-image.png";

  return (
    <tr className="border-bottom">
      {/* Product Info */}
      <td className="d-flex align-items-center">
        <img
          src={image}
          alt={product?.name}
          className="rounded me-3"
          width="70"
          height="70"
          style={{ objectFit: "cover" }}
        />
        <div>
          <Link
            to={`/product/${product.slug}`}
            className="fw-semibold text-dark text-decoration-none"
          >
            {product?.name?.toUpperCase()}
          </Link>
          <div className="small text-muted">
            {product?.description?.slice(0, 60)}...
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="text-center">${Number(item.price).toFixed(2)}</td>

      {/* Quantity Controls */}
      <td className="text-center">
        <div className="d-inline-flex align-items-center border rounded">
          <button
            className="btn btn-sm px-2"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >
            −
          </button>
          <input
            type="number"
            value={item.quantity}
            readOnly
            className="form-control form-control-sm text-center border-0"
            style={{ width: "60px" }}
          />
          <button
            className="btn btn-sm px-2"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </td>

      {/* Total */}
      <td className="text-end fw-semibold">
        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
      </td>

      {/* Delete */}
      <td className="text-end">
        <button
          onClick={() => onDelete(item.id)}
          className="btn btn-sm btn-outline-danger"
        >
          <i className="fa fa-trash"></i>
        </button>
      </td>
    </tr>
  );
}
