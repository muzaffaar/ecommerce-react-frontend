import React, { useEffect, useState, useRef } from "react";
import { fetchProducts } from "../api/products";
import ProductCard from "../components/products/ProductCard";
import { useLocale } from "../context/LocaleContext";
import axios from "axios";
import { API } from "../constants/api";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";


const Products = () => {
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

  const { locale } = useLocale();
  const firstLoad = useRef(true);

  // ✅ Load catalogs dynamically
  const loadCatalogs = async () => {
    try {
      const res = await axios.get(API.CATALOG.LIST(locale));
      setCatalogs(res.data.catalogs || res.data || []);
    } catch (error) {
      console.error("Failed to fetch catalogs:", error);
    }
  };

  // ✅ Load products
  const loadProducts = async (params = {}) => {
    try {
      const res = await fetchProducts(locale, {
        ...params,
        page: params.page || pagination.current_page,
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

  useEffect(() => {
    loadProducts();
    loadCatalogs();
  }, [locale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => loadProducts({ ...filters, page: 1 });
  const clearFilters = () => {
    const reset = {
      search: "",
      catalog_id: "",
      price_min: "",
      price_max: "",
      sort_by: "",
      sort_order: "",
    };
    setFilters(reset);
    loadProducts({ ...reset, page: 1 });
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      loadProducts({ ...filters, page });
    }
  };

  const getPageNumbers = () => {
    const total = pagination.last_page;
    const current = pagination.current_page;
    const delta = 2;
    const pages = [];

    for (
      let i = Math.max(1, current - delta);
      i <= Math.min(total, current + delta);
      i++
    ) {
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
                <h4>Shop</h4>
                <div className="breadcrumb__links">
                  <a href="/">Home</a>
                  <span>Shop</span>
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
                      placeholder="Search..."
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
                        <a
                          data-toggle="collapse"
                          data-target="#collapseOne"
                          className="fw-bold text-uppercase"
                        >
                          Categories
                        </a>
                      </div>

                      <div
                        id="collapseOne"
                        className="collapse show"
                        data-parent="#accordionExample"
                      >
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
                                      setFilters((f) => ({
                                        ...f,
                                        catalog_id: "",
                                      }));
                                      applyFilters();
                                    }}
                                  >
                                    All
                                  </a>
                                </li>

                                {catalogs.map((cat) => (
                                  <li key={cat.id}>
                                    <a
                                      href="#"
                                      className={
                                        filters.catalog_id == cat.id ? "active" : ""
                                      }
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setFilters((f) => ({
                                          ...f,
                                          catalog_id: cat.id,
                                        }));
                                        applyFilters();
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
                        <a
                          data-toggle="collapse"
                          data-target="#collapsePrice"
                          className="fw-bold text-uppercase"
                        >
                          Filter Price
                        </a>
                      </div>
                      <div
                        id="collapsePrice"
                        className="collapse show"
                        data-parent="#accordionExample"
                      >
                        <div className="card-body">
                          <div className="shop__sidebar__price">
                            <div className="d-flex gap-2">
                              <input
                                type="number"
                                name="price_min"
                                placeholder="Min"
                                value={filters.price_min}
                                onChange={handleChange}
                                className="price-input"
                              />
                              <input
                                type="number"
                                name="price_max"
                                placeholder="Max"
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
                        <a
                          data-toggle="collapse"
                          data-target="#collapseSort"
                          className="fw-bold text-uppercase"
                        >
                          Sorting
                        </a>
                      </div>

                      <div
                        id="collapseSort"
                        className="collapse show"
                        data-parent="#accordionExample"
                      >
                        <div className="card-body">
                          <div className="d-flex flex-column gap-2">
                            <select
                              name="sort_by"
                              className="sort-select"
                              value={filters.sort_by}
                              onChange={handleChange}
                            >
                              <option value="">Default</option>
                              <option value="price">Price</option>
                              <option value="name">Name</option>
                              <option value="created_at">Newest</option>
                            </select>

                            <select
                              name="sort_order"
                              className="sort-select"
                              value={filters.sort_order}
                              onChange={handleChange}
                            >
                              <option value="">Default</option>
                              <option value="asc">Ascending</option>
                              <option value="desc">Descending</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="mt-4">
                      <button
                        className="site-btn w-100 mb-2"
                        onClick={applyFilters}
                      >
                        Apply
                      </button>
                      <button
                        className="btn btn-outline-dark w-100"
                        onClick={clearFilters}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-9">
              <div className="shop__product__option mb-4">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="shop__product__option__left">
                      <p>
                        Showing {products.length} of {pagination.total} results
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
                  <p>No products found.</p>
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
                            className={
                              page === pagination.current_page ? "active" : ""
                            }
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
