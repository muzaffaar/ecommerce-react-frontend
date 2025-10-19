import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { API, API_BASE } from "../constants/api";
import Loader from "../components/common/Loader";
import AlertBox from "../components/common/AlertBox";

export default function ProductDetail() {
  const { slug } = useParams();
  const locale = localStorage.getItem("lang") || "en";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [finalPrice, setFinalPrice] = useState(0);

  const baseURL = String(API_BASE || "http://meetify.uz/api").replace("/api", "");

  // 🕒 Auto-hide alerts
  useEffect(() => {
    if (error || addedToCart) {
      const timer = setTimeout(() => {
        setError("");
        setAddedToCart(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [error, addedToCart]);

  // 🔑 Ensure guest token
  useEffect(() => {
    const ensureGuestToken = async () => {
      if (!localStorage.getItem("guest_token")) {
        try {
          const res = await api.post(API.AUTH.GUEST_TOKEN(locale));
          localStorage.setItem("guest_token", res.data?.guest_token);
        } catch {
          console.error("Failed to create guest token");
        }
      }
    };
    ensureGuestToken();
  }, [locale]);

  // 🛒 Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(API.PRODUCT.DETAIL(locale, slug));
        console.log("Product detail response:", res);
        const prod = res.data?.product || res.data;
        setProduct(prod);
        if (prod.images?.length > 0) setActiveImage(prod.images[0]);
        setFinalPrice(Number(prod.discounted_price || prod.price || 0));
      } catch {
        setError("Product not found or server error.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [locale, slug]);

  // 💰 Recalculate price dynamically
  const updatePrice = (updatedSelections) => {
    let base = Number(product.discounted_price || product.price || 0);
    let modifiers = 0;

    Object.values(updatedSelections).forEach((val) => {
      // Prefer discounted_modifier if product has discount
      if (product.discounted_price && val.discounted_modifier)
        modifiers += Number(val.discounted_modifier || 0);
      else modifiers += Number(val.price_modifier || 0);
    });

    setFinalPrice((base + modifiers).toFixed(2));
  };

  // 🎨 Handle variation selection
  const handleVariationClick = (variationName, val) => {
    setSelectedVariations((prev) => {
      const updated = { ...prev, [variationName]: val };
      updatePrice(updated);

      // 🖼 Switch image when variation has its own images
      if (val.images?.length > 0) setActiveImage(val.images[0]);
      else if (product.images?.length > 0) setActiveImage(product.images[0]);

      return updated;
    });
  };

  // 🛍 Add to Cart
  const handleAddToCart = async () => {
    try {
      const variationValueIds = Object.values(selectedVariations).map((v) => v.id);
      await api.post(API.CART.ADD(locale), {
        product_id: product.id,
        quantity: 1,
        variation_value_ids: variationValueIds,
      });
      setAddedToCart(true);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      setError("Failed to add to cart.");
    }
  };

  if (loading) return <Loader />;
  if (!product)
    return (
      <div className="container py-5">
        <AlertBox type="info" message="Product not found." />
      </div>
    );

  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="breadcrumb__text">
            <h4>{product.name.toUpperCase()}</h4>
            <div className="breadcrumb__links">
              <a href="/">HOME</a> <span>PRODUCT DETAILS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section className="product-details spad">
        <div className="container">
          <div className="row align-items-start">
            {/* LEFT IMAGES */}
            <div className="col-lg-6 col-md-6 mb-4 mb-md-0">
              <div className="main-image border rounded-3 shadow-sm mb-3">
                <img
                  src={
                    activeImage
                      ? `${baseURL}/storage/${activeImage.url}`
                      : "/no-image.png"
                  }
                  alt={product.name}
                  className="img-fluid rounded-3"
                  style={{
                    width: "100%",
                    height: "500px",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* THUMBNAILS */}
              {product.images?.length > 1 && (
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${baseURL}/storage/${img.url}`}
                      alt="thumb"
                      onClick={() => setActiveImage(img)}
                      className={`rounded-3 shadow-sm ${
                        activeImage?.url === img.url ? "border border-dark" : "border"
                      }`}
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        cursor: "pointer",
                        transition: "0.3s",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT INFO */}
            <div className="col-lg-6 col-md-6">
              <div className="product-info">
                <h2 className="fw-bold mb-2 text-uppercase">{product.name}</h2>
                <p className="text-muted mb-3" style={{ fontSize: "15px" }}>
                  {product.description}
                </p>

                {/* PRICE */}
                <div className="d-flex align-items-center mb-4">
                  <h3 className="fw-bold text-dark mb-0">${finalPrice}</h3>
                  {product.discounted_price && (
                    <span className="text-muted text-decoration-line-through ms-3">
                      ${product.price}
                    </span>
                  )}
                </div>

                {/* VARIATIONS */}
                {product.variations?.length > 0 && (
                  <div className="mb-4">
                    {product.variations.map((variation) => (
                      <div key={variation.id} className="mb-3">
                        <h6 className="fw-semibold text-uppercase mb-2">
                          {variation.name}
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                          {variation.values.map((val) => {
                            const isSelected =
                              selectedVariations[variation.name]?.id === val.id;
                            return (
                              <div
                                key={val.id}
                                onClick={() =>
                                  handleVariationClick(variation.name, val)
                                }
                                className={`variation-pill ${
                                  isSelected
                                    ? "variation-selected"
                                    : "variation-normal"
                                }`}
                                style={{
                                  border: isSelected
                                    ? "2px solid #000"
                                    : "1px solid #ccc",
                                  borderRadius: "20px",
                                  padding: "6px 12px",
                                  cursor: "pointer",
                                  transition: "0.3s",
                                }}
                              >
                                {val.color_code && (
                                  <span
                                    className="me-2"
                                    style={{
                                      backgroundColor: val.color_code,
                                      width: "16px",
                                      height: "16px",
                                      borderRadius: "50%",
                                      display: "inline-block",
                                    }}
                                  ></span>
                                )}
                                {val.value}
                                {val.price_modifier !== "0.00" && (
                                  <small className="text-muted ms-1">
                                    (+${val.price_modifier})
                                  </small>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ALERTS */}
                {error && <AlertBox type="danger" message={error} />}
                {addedToCart && (
                  <AlertBox type="success" message="Product added to cart!" />
                )}

                {/* ADD TO CART */}
                <button
                  className="btn btn-dark btn-lg px-5 py-2 rounded-1 shadow-sm"
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                >
                  {addedToCart ? "✅ ADDED TO CART" : "🛒 ADD TO CART"}
                </button>

                {/* META INFO */}
                <ul className="list-unstyled mt-4">
                  <li>
                    <strong>AVAILABILITY:</strong> <span>IN STOCK</span>
                  </li>

                  {product.catalog && (
                    <li>
                      <strong>CATEGORY:</strong>{" "}
                      <span>{String(product.catalog).toUpperCase()}</span>
                    </li>
                  )}

                  {Array.isArray(product.tags) && product.tags.length > 0 && (
                    <li>
                      <strong>TAGS:</strong>{" "}
                      {product.tags.map((t) => String(t).toUpperCase()).join(", ")}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
