import { useEffect, useState } from "react";
import api from "../services/api";
import { API } from "../constants/api";
import Loader from "../components/common/Loader";
import ProductCard from "../components/products/ProductCard";
import AlertBox from "../components/common/AlertBox";

export default function Home() {
  const locale = "en";
  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);

  // 🧠 Fetch products
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

  // 🧠 Fetch catalogs
  const fetchCatalogs = async () => {
    try {
      const res = await api.get(API.CATALOG.LIST(locale));
      setCatalogs(res.data?.catalogs || res.data || []);
    } catch (err) {
      console.error("❌ Catalog fetch failed", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCatalogs();
  }, []);

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
      <section className="categories py-5">
        <div className="container">
          <h3 className="text-center mb-4 fw-bold">Explore Categories</h3>
          <div className="row g-4 justify-content-center">
            {catalogs.slice(0, 4).map((cat) => (
              <div key={cat.id} className="col-6 col-md-3 text-center">
                <div className="category-card p-3 border rounded-3 shadow-sm">
                  <div
                    className="rounded-circle mx-auto mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      backgroundImage: `url(${cat.image || "/img/categories/default.jpg"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <h6 className="text-capitalize">{cat.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🛍️ Product Section */}
      <section className="products py-5 bg-light">
        <div className="container">
          <h3 className="mb-4 text-center fw-bold">Latest Products</h3>

          {initialLoad && <Loader />}

          {!initialLoad && error && <AlertBox type="danger" message={error} />}

          {!initialLoad && !error && products.length === 0 && (
            <AlertBox type="info" message="No products found." />
          )}

          {!initialLoad && !error && products.length > 0 && (
            <>
              <div className="row g-4 justify-content-center">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="col-sm-6 col-md-4 col-lg-3 d-flex"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Load More */}
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
