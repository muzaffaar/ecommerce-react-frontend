import { useEffect, useState } from "react";
import api from "../services/api";
import { API } from "../constants/api";
import Loader from "../components/common/Loader";
import ProductCard from "../components/products/ProductCard";
import AlertBox from "../components/common/AlertBox";
import { useLocale } from "../context/LocaleContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ import for localization

export default function Home() {
  const { locale } = useLocale();
  const { t, i18n } = useTranslation();

  const [products, setProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);

  // 🧠 Fetch latest products
  const fetchProducts = async (page = 1, append = false) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`${API.PRODUCT.LIST(locale)}?page=${page}`);
      const newProducts = res.data?.products || [];
      const paginationData = res.data?.pagination || null;

      if (append) setProducts((prev) => [...prev, ...newProducts]);
      else setProducts(newProducts);

      setPagination(paginationData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("errors.load_products_failed")
      );
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // 🧩 Fetch catalogs
  const fetchCatalogs = async () => {
    try {
      const res = await api.get(API.CATALOG.LIST(locale));
      setCatalogs(res.data?.catalogs || res.data || []);
    } catch (err) {
      console.error("❌ Catalog fetch failed", err);
    }
  };

  // 🤖 Fetch AI recommended products
  const fetchRecommended = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await api.get(API.PRODUCT.RECOMMENDED(locale));
      const data = res.data?.recommendations || [];
      setRecommended(data);
    } catch (err) {
      console.error("❌ Recommended fetch failed", err);
    } finally {
      if (isRefresh) setTimeout(() => setRefreshing(false), 800);
    }
  };

  // 🔁 Auto-refresh recommended every 20 seconds
  useEffect(() => {
    i18n.changeLanguage(locale); // keep sync
    fetchProducts();
    fetchCatalogs();
    fetchRecommended();

    const interval = setInterval(() => fetchRecommended(true), 20000);
    return () => clearInterval(interval);
  }, [locale, i18n]);

  const handleLoadMore = () => {
    if (pagination && pagination.current_page < pagination.last_page) {
      fetchProducts(pagination.current_page + 1, true);
    }
  };

  return ( 
    <>
      {/* 🖼️ Hero Section */}
      <section
        className="hero d-flex align-items-center text-center"
        style={{
          backgroundImage: "url('/img/hero/banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "70vh",
          color: "#fff",
          position: "relative",
        }}
      >
        <div
          className="overlay position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        ></div>
        <div className="container position-relative z-2">
          <h1 className="display-4 fw-bold mb-3">
            {t("homepage.welcome_title")}
          </h1>
          <p className="lead mb-4">{t("homepage.welcome_subtitle")}</p>
          <a href="/products" className="btn btn-light btn-lg px-5">
            {t("buttons.shop_now")}
          </a>
        </div>
      </section>

      {/* 🧩 Featured Categories */}
      <section className="categories py-5 bg-light">
        <div className="container">
          <h3 className="text-center mb-4 fw-bold text-uppercase">
            {t("homepage.explore_categories")}
          </h3>
          <div className="row g-4 justify-content-center">
            {catalogs.slice(0, 4).map((cat) => {
              const baseURL = String(API.BASE || "http://meetify.uz/api").replace("/api", "");
              const image =
                cat.images?.[0]?.url
                  ? `${baseURL}/storage/${cat.images[0].url}`
                  : "https://via.placeholder.com/300x300?text=No+Image";

              return (
                <div key={cat.id} className="col-6 col-md-3 text-center">
                  <div className="category-card p-3 rounded-4 shadow-sm bg-white h-100 hover-shadow transition">
                    <Link
                      to={`/products?catalog_id=${cat.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div
                        className="rounded-circle mx-auto mb-3 border"
                        style={{
                          width: "130px",
                          height: "130px",
                          backgroundImage: `url(${image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          transition: "all 0.3s ease",
                        }}
                      ></div>
                      <h6 className="fw-semibold text-uppercase mt-3">
                        {cat.name}
                      </h6>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🤖 AI Recommended Products */}
      {recommended.length > 0 && (
        <section className="recommended-products py-5 bg-light position-relative">
          <div className="container">
            <div className="text-center mb-4">
              <h3 className="fw-bold text-uppercase">
                <i className="fa fa-robot text-primary me-2"></i>
                {t("homepage.ai_recommended")}
              </h3>
              <p className="text-muted small mb-1">
                {t("homepage.auto_refresh_note")}
              </p>

              {refreshing && (
                <div className="d-inline-block small text-success">
                  <i className="fa fa-sync-alt fa-spin me-1"></i>
                  {t("homepage.refreshing")}
                </div>
              )}
            </div>

            <div className="row g-5">
              {recommended.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="col-lg-4 col-md-6 col-sm-6"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🛍️ Latest Products */}
      <section className="products py-5">
        <div className="container">
          <h3 className="mb-4 text-center fw-bold">
            {t("homepage.latest_products")}
          </h3>

          {initialLoad && <Loader />}

          {!initialLoad && error && <AlertBox type="danger" message={error} />}

          {!initialLoad && !error && products.length === 0 && (
            <AlertBox type="info" message={t("homepage.no_products")} />
          )}

          {!initialLoad && !error && products.length > 0 && (
            <>
              <div className="row g-5">
                {products.length > 0 ? (
                  products.map((p) => (
                    <div key={p.id} className="col-lg-4 col-md-6 col-sm-6">
                      <ProductCard product={p} />
                    </div>
                  ))
                ) : (
                  <p>{t("homepage.no_products")}</p>
                )}
              </div>

              {pagination &&
                pagination.current_page < pagination.last_page && (
                  <div className="text-center mt-5">
                    <button
                      className="btn btn-dark px-5 py-2"
                      onClick={handleLoadMore}
                      disabled={loading}
                    >
                      {loading ? t("buttons.loading") : t("buttons.load_more")}
                    </button>
                    <p className="text-muted small mt-2">
                      {t("homepage.showing_count", {
                        shown: products.length,
                        total: pagination.total,
                      })}
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
