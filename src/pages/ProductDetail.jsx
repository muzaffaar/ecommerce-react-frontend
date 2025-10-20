import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { API, API_BASE } from "../constants/api";
import Loader from "../components/common/Loader";
import AlertBox from "../components/common/AlertBox";
import { useLocale } from "../context/LocaleContext";
import { useTranslation } from "react-i18next";

export default function ProductDetail() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const { t, i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [finalPrice, setFinalPrice] = useState(0);

  const baseURL = String(API_BASE || "http://meetify.uz/api").replace("/api", "");

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  // Auto-hide alerts
  useEffect(() => {
    if (error || addedToCart) {
      const timer = setTimeout(() => {
        setError("");
        setAddedToCart(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [error, addedToCart]);

  // Ensure guest token
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

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(API.PRODUCT.DETAIL(locale, slug));
        const prod = res.data?.product || res.data;
        setProduct(prod);
        if (prod.images?.length > 0) setActiveImage(prod.images[0]);
        setFinalPrice(Number(prod.discounted_price || prod.price || 0));
      } catch {
        setError(t("productdetail.not_found"));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [locale, slug, t]);

  // Recalculate price
  const updatePrice = (updatedSelections) => {
    let base = Number(product.discounted_price || product.price || 0);
    let modifiers = 0;

    Object.values(updatedSelections).forEach((val) => {
      if (product.discounted_price && val.discounted_modifier)
        modifiers += Number(val.discounted_modifier || 0);
      else modifiers += Number(val.price_modifier || 0);
    });

    setFinalPrice((base + modifiers).toFixed(2));
  };

  // Variation selection
  const handleVariationClick = (variationName, val) => {
    setSelectedVariations((prev) => {
      const updated = { ...prev, [variationName]: val };
      updatePrice(updated);
      if (val.images?.length > 0) setActiveImage(val.images[0]);
      else if (product.images?.length > 0) setActiveImage(product.images[0]);
      return updated;
    });
  };

  // Add to cart
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
      setError(t("productdetail.add_failed"));
    }
  };

  if (loading) return <Loader />;
  if (!product)
    return (
      <div className="container py-5">
        <AlertBox type="info" message={t("productdetail.not_found")} />
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
              <a href="/">{t("home")}</a> <span>{t("productdetail.title")}</span>
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

              {product.images?.length > 1 && (
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${baseURL}/storage/${img.url}`}
                      alt="thumb"
                      onClick={() => setActiveImage(img)}
                      className={`rounded-3 shadow-sm ${activeImage?.url === img.url
                          ? "border border-dark"
                          : "border"
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
                                className={`variation-pill ${isSelected
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

                {error && <AlertBox type="danger" message={error} />}
                {addedToCart && (
                  <AlertBox
                    type="success"
                    message={t("productdetail.added_to_cart")}
                  />
                )}

                {/* ADD TO CART */}
                <button
                  className="btn btn-dark btn-lg px-5 py-2 rounded-1 shadow-sm"
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                >
                  {addedToCart
                    ? t("productdetail.added_button")
                    : t("productdetail.add_button")}
                </button>

                {/* DISCOUNT INFO */}
                {product.discount && (
                  <div className="alert alert-info mt-4 py-2">
                    <strong>{t("productdetail.discount")}:</strong>{" "}
                    {product.discount.type === "percentage"
                      ? `${product.discount.value}%`
                      : `$${product.discount.value}`}{" "}
                    {t("productdetail.valid_until")}:{" "}
                    {new Date(product.discount.ends_at).toLocaleDateString()}
                  </div>
                )}
                
                {/* CATALOG DISCOUNT INFO */}
                {product.catalog_discount && (
                  <div className="alert alert-info mt-4 py-2">
                    <strong>{t("productdetail.discount")}:</strong>{" "}
                    {product.catalog_discount.type === "percentage"
                      ? `${product.catalog_discount.value}%`
                      : `$${product.catalog_discount.value}`}{" "}
                    {t("productdetail.valid_until")}:{" "}
                    {new Date(product.catalog_discount.ends_at).toLocaleDateString()}
                  </div>
                )}

                {/* REVIEW SUMMARY */}
                {product.review_summary && (
                  <div className="review-summary mt-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <i
                            key={num}
                            className={`fa fa-star ${num <= product.review_summary.average_rating ? "text-warning" : "text-muted"
                              }`}
                          ></i>
                        ))}
                      </div>
                      <span className="fw-semibold">
                        {product.review_summary.average_rating.toFixed(1)} / 5
                      </span>
                      <small className="text-muted">
                        ({product.review_summary.total_reviews}{" "}
                        {t("productdetail.reviews_label")})
                      </small>
                    </div>
                    <hr />
                  </div>
                )}

                {/* REVIEWS SECTION */}
                {Array.isArray(product.reviews) && product.reviews.length > 0 && (
                  <div className="mt-3">
                    <h5 className="fw-bold mb-3">{t("productdetail.customer_reviews")}</h5>
                    <div className="d-flex flex-column gap-3">
                      {product.reviews.map((r) => (
                        <div
                          key={r.id}
                          className="border rounded-3 p-3 shadow-sm bg-light"
                          style={{ borderLeft: "5px solid #0d6efd" }}
                        >
                          <div className="d-flex align-items-center justify-content-between">
                            <strong>{r.user}</strong>
                            <small className="text-muted">
                              {new Date(r.created_at).toLocaleDateString()}
                            </small>
                          </div>

                          <div className="mb-1">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <i
                                key={num}
                                className={`fa fa-star ${num <= r.rating ? "text-warning" : "text-muted"
                                  }`}
                              ></i>
                            ))}
                          </div>

                          <p className="mb-0">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                {/* META INFO */}
                <ul className="list-unstyled mt-4">
                  <li>
                    <strong>{t("productdetail.availability")}</strong>{" "}
                    <span>{t("productdetail.in_stock")}</span>
                  </li>
                  {product.catalog && (
                    <li>
                      <strong>{t("productdetail.category")}</strong>{" "}
                      <span>{String(product.catalog).toUpperCase()}</span>
                    </li>
                  )}
                  {Array.isArray(product.tags) && product.tags.length > 0 && (
                    <li>
                      <strong>{t("productdetail.tags")}</strong>{" "}
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
