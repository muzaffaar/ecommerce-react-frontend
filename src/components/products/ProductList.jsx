import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  if (!products.length)
    return <div className="alert alert-info">No products found.</div>;

  return (
    <>
      <div className="shop__product__option">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="shop__product__option__left">
              <p>Showing {products.length} results</p>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="shop__product__option__right">
              <p>Sort by Price:</p>
              <select>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-lg-4 col-md-6 col-sm-6">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="row mt-4">
        <div className="col-lg-12">
          <div className="product__pagination">
            <a className="active" href="#">
              1
            </a>
            <a href="#">2</a>
            <a href="#">3</a>
            <span>...</span>
            <a href="#">Next</a>
          </div>
        </div>
      </div>
    </>
  );
}
