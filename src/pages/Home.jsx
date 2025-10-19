import { useEffect, useState } from "react";
import api from "../services/api";
import { API } from "../constants/api";
import Loader from "../components/common/Loader";
import ProductCard from "../components/products/ProductCard";
import AlertBox from "../components/common/AlertBox";
import { useLocale } from "../context/LocaleContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { locale } = useLocale();
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
        "Failed to load products. Please try again later."
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
    fetchProducts();
    fetchCatalogs();
    fetchRecommended();

    const interval = setInterval(() => fetchRecommended(true), 20000);
    return () => clearInterval(interval);
  }, [locale]);

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
          <h1 className="display-4 fw-bold mb-3">Welcome to Meetify</h1>
          <p className="lead mb-4">
            Discover the latest trends and timeless classics.
          </p>
          <a href="/products" className="btn btn-light btn-lg px-5">
            Shop Now
          </a>
        </div>
      </section>

      {/* 🧩 Featured Categories */}
      <section className="categories py-5 bg-light">
        <div className="container">
          <h3 className="text-center mb-4 fw-bold text-uppercase">
            Explore Categories
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
                    <Link to={`/products?catalog_id=${cat.id}`} className="text-decoration-none text-dark">
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
                      <h6 className="fw-semibold text-uppercase mt-3">{cat.name}</h6>
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
                AI Recommended For You
              </h3>
              <p className="text-muted small mb-1">
                Auto-refreshing recommendations every <b>20s</b>
              </p>

              {refreshing && (
                <div className="d-inline-block small text-success">
                  <i className="fa fa-sync-alt fa-spin me-1"></i>Refreshing...
                </div>
              )}
            </div>

            <div className="row g-4 justify-content-center">
              {recommended.slice(0, 8).map((product) => (
                <div
                  key={product.id}
                  className="col-sm-6 col-md-4 col-lg-3 d-flex"
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
          <h3 className="mb-4 text-center fw-bold">Latest Products</h3>

          {initialLoad && <Loader />}

          {!initialLoad && error && <AlertBox type="danger" message={error} />}

          {!initialLoad && !error && products.length === 0 && (
            <AlertBox type="info" message="No products found." />
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
                  <p>No products found.</p>
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
                      {loading ? "Loading..." : "Load More"}
                    </button>
                    <p className="text-muted small mt-2">
                      Showing {products.length} of {pagination.total} products
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
