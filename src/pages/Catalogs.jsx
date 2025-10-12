import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { API } from "../constants/api";
import AlertBox from "../components/common/AlertBox";
import { useLocale } from "../context/LocaleContext";

export default function Catalogs() {
  const { locale } = useLocale();
  const [catalogs, setCatalogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCatalogs = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`${API.CATALOG.LIST(locale)}?page=${page}`);
      const data = res.data;
      setCatalogs(data.catalogs || []);
      setPagination(data.pagination || null);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat().join("\n") ||
        "Failed to fetch catalogs";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs(1);
  }, [locale]);

  const renderPagination = () => {
    if (!pagination || pagination.last_page <= 1) return null;
    const pages = [];
    for (let i = 1; i <= pagination.last_page; i++) {
      if (
        i === 1 ||
        i === pagination.last_page ||
        (i >= pagination.current_page - 2 && i <= pagination.current_page + 2)
      ) {
        pages.push(i);
      } else if (
        i === pagination.current_page - 3 ||
        i === pagination.current_page + 3
      ) {
        pages.push("...");
      }
    }

    return (
      <div className="pagination">
        {pagination.prev_page_url && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              fetchCatalogs(pagination.current_page - 1);
            }}
          >
            Prev
          </a>
        )}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="mx-1 text-muted">...</span>
          ) : (
            <a
              href="#"
              key={p}
              onClick={(e) => {
                e.preventDefault();
                fetchCatalogs(p);
              }}
              className={p === pagination.current_page ? "active" : ""}
            >
              {p}
            </a>
          )
        )}
        {pagination.next_page_url && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              fetchCatalogs(pagination.current_page + 1);
            }}
          >
            Next
          </a>
        )}
      </div>
    );
  };

  return (
    <>
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Catalogs</h4>
                <div className="breadcrumb__links">
                  <Link to="/">Home</Link>
                  <span>Catalogs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shop spad">
        <div className="container">
          <div className="section-title text-center mb-5">
            <span>Our Collections</span>
            <h2>Explore Catalogs</h2>
          </div>

          {loading && <AlertBox type="info" message="Loading catalogs..." />}
          {error && <AlertBox type="danger" message={error} />}
          {!loading && !error && catalogs.length === 0 && (
            <AlertBox type="secondary" message="No catalogs available." />
          )}

          <div className="row">
            {catalogs.map((catalog) => {
              const firstImage =
                catalog.images?.[0]?.url
                  ? `${import.meta.env.VITE_APP_BASE_URL}/storage/${catalog.images[0].url}`
                  : "https://via.placeholder.com/400x250?text=No+Image";

              return (
                <div key={catalog.id} className="col-lg-4 col-md-6 col-sm-6 mb-4">
                  <div className="catalog__item">
                    <Link to={`/products?catalog_id=${catalog.id}`}>
                      <div className="catalog__item__img">
                        <img src={firstImage} alt={catalog.name} />
                      </div>
                    </Link>
                    <div className="catalog__item__text">
                      <h5>{catalog.name}</h5>
                      <p>
                        {catalog.description?.length > 80
                          ? catalog.description.slice(0, 80) + "..."
                          : catalog.description || "Explore our latest collection."}
                      </p>

                      {/* View Products button -> /products?catalog_id=... */}
                      <Link
                        to={`/products?catalog_id=${catalog.id}`}
                        className="btn btn-dark btn-sm mt-3 px-4"
                      >
                        View Products
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && !error && catalogs.length > 0 && renderPagination()}
        </div>
      </section>
    </>
  );
}
