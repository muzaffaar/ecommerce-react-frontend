import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const BASE_URL = "http://meetify.uz/storage/";

  // 🖼 Get main image (fallback to default)
  const mainImage =
    product.images?.[0]?.url
      ? `${BASE_URL}${product.images[0].url}`
      : "/img/product/default.jpg";

  // 💰 Determine pricing
  const hasDiscount = !!product.discounted_price && product.discounted_price < product.price;
  const finalPrice = hasDiscount ? product.discounted_price : product.price;

  // ⭐ Rating info
  const avgRating = product.review_summary?.average_rating || 0;

  return (
    <div className="product__item">
      <div
        className="product__item__pic set-bg"
        style={{
          backgroundImage: `url(${mainImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {hasDiscount && <span className="label">Sale</span>}

        <ul className="product__hover">
          {/* <li>
            <Link to="/favorites">
              <img src="/img/icon/heart.png" alt="wishlist" />
            </Link>
          </li>
          <li>
            <Link to="/compare">
              <img src="/img/icon/compare.png" alt="compare" /> <span>Compare</span>
            </Link>
          </li> */}
          <li>
            <Link to={`/product/${product.slug}`}>
              <img src="/img/icon/search.png" alt="view" />
            </Link>
          </li>
        </ul>
      </div>

      <div className="product__item__text">
        <h6>
          <Link to={`/product/${product.slug}`} className="text-dark">
            {product.name}
          </Link>
        </h6>

        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`fa ${i < avgRating ? "fa-star" : "fa-star-o"}`}
            ></i>
          ))}
        </div>

        <div className="product__price">
          ${parseFloat(finalPrice).toFixed(2)}
          {hasDiscount && (
            <span style={{ textDecoration: "line-through", marginLeft: "8px", color: "#888" }}>
              ${parseFloat(product.price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
