import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="product__item">
      <div
        className="product__item__pic set-bg"
        style={{
          backgroundImage: `url(${product.image || "/img/product/default.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {product.is_sale && <span className="label">Sale</span>}

        <ul className="product__hover">
          <li>
            <Link to={`/favorites`}>
              <img src="/img/icon/heart.png" alt="wishlist" />
            </Link>
          </li>
          <li>
            <Link to="#">
              <img src="/img/icon/compare.png" alt="compare" /> <span>Compare</span>
            </Link>
          </li>
          <li>
            <Link to={`/product/${product.slug}`}>
              <img src="/img/icon/search.png" alt="view" />
            </Link>
          </li>
        </ul>
      </div>

      <div className="product__item__text">
        <h6>{product.name}</h6>
        <Link to={`/cart/add/${product.id}`} className="add-cart">
          + Add To Cart
        </Link>
        <div className="rating">
          {[...Array(5)].map((_, i) => (
            <i
              key={i}
              className={`fa ${i < (product.rating || 0) ? "fa-star" : "fa-star-o"}`}
            ></i>
          ))}
        </div>
        <h5>${product.price}</h5>
      </div>
    </div>
  );
}
