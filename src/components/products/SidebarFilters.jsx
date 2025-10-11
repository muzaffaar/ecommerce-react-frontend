import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../api/products";
import ProductList from "./ProductList";

export default function SidebarFilters({ locale = "en" }) {
  const [filters, setFilters] = useState({
    search: "",
    catalog_id: "",
    price_min: "",
    price_max: "",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const loadProducts = async (params = {}) => {
    setLoading(true);
    try {
      const data = await fetchProducts(locale, {
        ...params,
        page: 1,
        per_page: 12,
      });
      setProducts(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    loadProducts(filters);
  };

  useEffect(() => {
    loadProducts(); // initial
  }, []);

  return (
    <section className="shop spad">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="shop__sidebar">
              <div className="shop__sidebar__search">
                <form onSubmit={handleApply}>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search..."
                  />
                  <button type="submit">
                    <span className="icon_search"></span>
                  </button>
                </form>
              </div>

              <div className="shop__sidebar__accordion">
                <div className="accordion" id="accordionExample">
                  {/* Category Filter */}
                  <div className="card">
                    <div className="card-heading">
                      <a data-toggle="collapse" data-target="#collapseOne">
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
                          <ul className="nice-scroll">
                            <li>
                              <a href="#">Men</a>
                            </li>
                            <li>
                              <a href="#">Women</a>
                            </li>
                            <li>
                              <a href="#">Accessories</a>
                            </li>
                            <li>
                              <a href="#">Shoes</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="card">
                    <div className="card-heading">
                      <a data-toggle="collapse" data-target="#collapseThree">
                        Filter Price
                      </a>
                    </div>
                    <div
                      id="collapseThree"
                      className="collapse show"
                      data-parent="#accordionExample"
                    >
                      <div className="card-body">
                        <div className="shop__sidebar__price">
                          <ul>
                            <li>
                              <a href="#">$0 - $50</a>
                            </li>
                            <li>
                              <a href="#">$50 - $100</a>
                            </li>
                            <li>
                              <a href="#">$100 - $200</a>
                            </li>
                            <li>
                              <a href="#">$200+</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply button */}
                  <div className="mt-3 text-center">
                    <button
                      onClick={handleApply}
                      className="btn btn-dark w-100"
                      type="button"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="col-lg-9">
            {loading ? (
              <p className="text-center text-muted">Loading products...</p>
            ) : (
              <ProductList products={products} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
