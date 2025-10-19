import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/products";
import ProductCard from "../components/products/ProductCard";
import { useLocale } from "../context/LocaleContext";
import axios from "axios";
import { API } from "../constants/api";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useTranslation } from "react-i18next"; // ✅ Localization hook

const Products = () => {
  const { locale } = useLocale();
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    catalog_id: "",
    price_min: "",
    price_max: "",
    sort_by: "",
    sort_order: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  });

  const firstLoad = useRef(true);

  // Load catalogs
  const loadCatalogs = async () => {
    try {
      const res = await axios.get(API.CATALOG.LIST(locale));
      setCatalogs(res.data.catalogs || res.data || []);
    } catch (error) {
      console.error("Failed to fetch catalogs:", error);
    }
  };

  // Load products
  const loadProducts = async (params = {}) => {
    try {
      const res = await fetchProducts(locale, {
        ...params,
        page: params.page || 1,
        per_page: 12,
      });

      if (res.products) setProducts(res.products);
      else if (res.data) setProducts(res.data);

      if (res.pagination) setPagination(res.pagination);
      else if (res.meta) {
        setPagination({
          current_page: res.meta.current_page,
          last_page: res.meta.last_page,
          per_page: res.meta.per_page,
          total: res.meta.total,
        });
      }
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    } finally {
      firstLoad.current = false;
    }
  };

  // Read catalog_id from URL and auto-apply
  useEffect(() => {
    i18n.changeLanguage(locale);
    loadCatalogs();

    const fromUrl = searchParams.get("catalog_id") || "";
    if (fromUrl) {
      setFilters((f) => ({ ...f, catalog_id: fromUrl }));
      loadProducts({ catalog_id: fromUrl, page: 1 });
    } else {
      loadProducts({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, searchParams.toString()]);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.catalog_id) params.set("catalog_id", String(filters.catalog_id));
    if (filters.search) params.set("search", filters.search);
    if (filters.price_min) params.set("price_min", String(filters.price_min));
    if (filters.price_max) params.set("price_max", String(filters.price_max));
    if (filters.sort_by) params.set("sort_by", filters.sort_by);
    if (filters.sort_order) params.set("sort_order", filters.sort_order);
    setSearchParams(params);

    loadProducts({ ...filters, page: 1 });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      catalog_id: "",
      price_min: "",
      price_max: "",
      sort_by: "",
      sort_order: "",
    });
    setSearchParams(new URLSearchParams());
    loadProducts({ page: 1 });
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      loadProducts({ ...filters, page });
      const params = new URLSearchParams(searchParams);
      params.set("page", String(page));
      setSearchParams(params);
    }
  };

  const getPageNumbers = () => {
    const total = pagination.last_page;
    const current = pagination.current_page;
    const delta = 2;
    const pages = [];

    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }
    if (pages[0] > 2) pages.unshift("...");
    if (pages[0] !== 1) pages.unshift(1);
    if (pages[pages.length - 1] < total - 1) pages.push("...");
    if (pages[pages.length - 1] !== total) pages.push(total);

    return pages;
  };

  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>{t("productpage.shop")}</h4>
                <div className="breadcrumb__links">
                  <a href="/">{t("home")}</a>
                  <span>{t("productpage.shop")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="shop spad">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="shop__sidebar">
                {/* Search */}
                <div className="shop__sidebar__search">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      applyFilters();
                    }}
                  >
                    <input
                      type="text"
                      name="search"
                      placeholder={t("productpage.search_placeholder")}
                      value={filters.search}
                      onChange={handleChange}
                    />
                    <button type="submit">
                      <span className="icon_search"></span>
                    </button>
                  </form>
                </div>

                <div className="shop__sidebar__accordion">
                  <div className="accordion" id="accordionExample">
                    {/* Categories */}
                    <div className="card">
                      <div className="card-heading">
                        <a data-toggle="collapse" data-target="#collapseOne" className="fw-bold text-uppercase">
                          {t("productpage.categories")}
                        </a>
                      </div>

                      <div id="collapseOne" className="collapse show" data-parent="#accordionExample">
                        <div className="card-body">
                          <div className="shop__sidebar__categories">
                            <PerfectScrollbar style={{ maxHeight: "60vh" }}>
                              <ul className="list-unstyled mb-0 category-list">
                                <li>
                                  <a
                                    href="#"
                                    className={!filters.catalog_id ? "active" : ""}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setFilters((f) => ({ ...f, catalog_id: "" }));
                                      const params = new URLSearchParams(searchParams);
                                      params.delete("catalog_id");
                                      setSearchParams(params);
                                      loadProducts({ page: 1 });
                                    }}
                                  >
                                    {t("productpage.all")}
                                  </a>
                                </li>

                                {catalogs.map((cat) => (
                                  <li key={cat.id}>
                                    <a
                                      href="#"
                                      className={String(filters.catalog_id) === String(cat.id) ? "active" : ""}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setFilters((f) => ({ ...f, catalog_id: cat.id }));
                                        const params = new URLSearchParams(searchParams);
                                        params.set("catalog_id", String(cat.id));
                                        params.delete("page");
                                        setSearchParams(params);
                                        loadProducts({ catalog_id: cat.id, page: 1 });
                                      }}
                                    >
                                      {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </PerfectScrollbar>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Filter */}
                    <div className="card">
                      <div className="card-heading">
                        <a data-toggle="collapse" data-target="#collapsePrice" className="fw-bold text-uppercase">
                          {t("productpage.filter_price")}
                        </a>
                      </div>
                      <div id="collapsePrice" className="collapse show" data-parent="#accordionExample">
                        <div className="card-body">
                          <div className="shop__sidebar__price">
                            <div className="d-flex gap-2">
                              <input
                                type="number"
                                name="price_min"
                                placeholder={t("productpage.price_min")}
                                value={filters.price_min}
                                onChange={handleChange}
                                className="price-input"
                              />
                              <input
                                type="number"
                                name="price_max"
                                placeholder={t("productpage.price_max")}
                                value={filters.price_max}
                                onChange={handleChange}
                                className="price-input"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sorting */}
                    <div className="card">
                      <div className="card-heading">
                        <a data-toggle="collapse" data-target="#collapseSort" className="fw-bold text-uppercase">
                          {t("productpage.sorting")}
                        </a>
                      </div>

                      <div id="collapseSort" className="collapse show" data-parent="#accordionExample">
                        <div className="card-body">
                          <div className="d-flex flex-column gap-2">
                            <select name="sort_by" className="sort-select" value={filters.sort_by} onChange={handleChange}>
                              <option value="">{t("productpage.default")}</option>
                              <option value="price">{t("productpage.price")}</option>
                              <option value="name">{t("productpage.name")}</option>
                              <option value="created_at">{t("productpage.newest")}</option>
                            </select>

                            <select
                              name="sort_order"
                              className="sort-select"
                              value={filters.sort_order}
                              onChange={handleChange}
                            >
                              <option value="">{t("productpage.default")}</option>
                              <option value="asc">{t("productpage.ascending")}</option>
                              <option value="desc">{t("productpage.descending")}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button className="site-btn w-100 mb-2" onClick={applyFilters}>
                        {t("buttons.apply")}
                      </button>
                      <button className="btn btn-outline-dark w-100" onClick={clearFilters}>
                        {t("buttons.clear")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9">
              <div className="shop__product__option mb-4">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="shop__product__option__left">
                      <p>
                        {t("productpage.showing_results", {
                          shown: products.length,
                          total: pagination.total,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                {products.length > 0 ? (
                  products.map((p) => (
                    <div key={p.id} className="col-lg-4 col-md-6 col-sm-6">
                      <ProductCard product={p} />
                    </div>
                  ))
                ) : (
                  <p>{t("productpage.no_products")}</p>
                )}
              </div>

              {pagination.last_page > 1 && (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="product__pagination">
                      {getPageNumbers().map((page, idx) =>
                        page === "..." ? (
                          <span key={idx}>...</span>
                        ) : (
                          <a
                            key={idx}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(page);
                            }}
                            className={page === pagination.current_page ? "active" : ""}
                          >
                            {page}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Products;
