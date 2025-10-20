import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { API, API_BASE } from "../constants/api";
import AlertBox from "../components/common/AlertBox";
import { useLocale } from "../context/LocaleContext";
import { useTranslation } from "react-i18next"; // ✅ Import translation hook

export default function Catalogs() {
  const { locale } = useLocale();
  const { t, i18n } = useTranslation();
  const [catalogs, setCatalogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const baseURL = String(API_BASE || "http://meetify.uz/api").replace("/api", "");

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
        t("errors.load_catalogs_failed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    i18n.changeLanguage(locale);
    fetchCatalogs(1);
  }, [locale, i18n]);

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
            {t("pagination.prev")}
          </a>
        )}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="mx-1 text-muted">
              ...
            </span>
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
            {t("pagination.next")}
          </a>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="breadcrumb__text">
            <h4>{t("catalogpage.title")}</h4>
            <div className="breadcrumb__links">
              <Link to="/">{t("home")}</Link>
              <span>{t("catalogpage.title")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="shop spad">
        <div className="container">
          <div className="section-title text-center mb-5">
            <h2>{t("catalogpage.explore_catalogs")}</h2>
          </div>

          {loading && <AlertBox type="info" message={t("catalogpage.loading")} />}
          {error && <AlertBox type="danger" message={error} />}
          {!loading && !error && catalogs.length === 0 && (
            <AlertBox type="secondary" message={t("catalogpage.no_catalogs")} />
          )}

          <div className="row">
            {catalogs.map((catalog) => {
              const firstImage =
                catalog.images?.[0]?.url
                  ? `${baseURL}/storage/${catalog.images[0].url}`
                  : "https://via.placeholder.com/400x250?text=No+Image";

              // check if discount exists
              const hasDiscount = catalog.discount !== null;
              const discountValue =
                hasDiscount && catalog.discount.type === "percentage"
                  ? `${catalog.discount.value}%`
                  : hasDiscount
                    ? `$${catalog.discount.value}`
                    : null;

              return (
                <div key={catalog.id} className="col-lg-4 col-md-6 col-sm-6 mb-4">
                  <div className="catalog-card shadow-sm rounded-3 h-100 overflow-hidden position-relative">
                    {/* 🏷 Discount Ribbon */}
                    {hasDiscount && (
                      <div className="discount-ribbon position-absolute">
                        <span>-{discountValue}</span>
                      </div>
                    )}

                    <Link to={`/products?catalog_id=${catalog.id}`}>
                      <div className="catalog-image-wrapper position-relative">
                        <img
                          src={firstImage}
                          alt={catalog.name}
                          className="catalog-image img-fluid"
                          loading="lazy"
                        />
                      </div>
                    </Link>

                    <div className="catalog-info p-3">
                      <h5 className="fw-bold mb-2">{catalog.name}</h5>
                      <p className="text-muted mb-3">
                        {catalog.description?.length > 80
                          ? catalog.description.slice(0, 80) + "..."
                          : catalog.description ||
                          t("catalogpage.default_description")}
                      </p>
                      <Link
                        to={`/products?catalog_id=${catalog.id}`}
                        className="btn btn-outline-dark btn-sm px-4 rounded-pill"
                      >
                        {t("catalogpage.view_products")}
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
