import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* About / Logo section */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="footer__about">
              <div className="footer__logo">
                <Link
                  to="/"
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "28px",
                    textDecoration: "none",
                  }}
                >
                  Meetify
                </Link>
              </div>
              <p>
                The customer is at the heart of our unique business model, which
                includes design and quality.
              </p>
              {/* <img src="/img/payment.png" alt="Payment methods" /> */}
            </div>
          </div>

          {/* Shopping Links 1 */}
          <div className="col-lg-2 offset-lg-1 col-md-3 col-sm-6">
            <div className="footer__widget">
              <h6>Shopping</h6>
              <ul>
                <li>
                  <Link to="/catalogs">Clothing Store</Link>
                </li>
                <li>
                  <Link to="/products">Trending Shoes</Link>
                </li>
                <li>
                  <Link to="/products">Accessories</Link>
                </li>
                <li>
                  <Link to="/sale">Sale</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Shopping Links 2 */}
          <div className="col-lg-2 col-md-3 col-sm-6">
            <div className="footer__widget">
              <h6>Help & Support</h6>
              <ul>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link to="/payments">Payment Methods</Link>
                </li>
                <li>
                  <Link to="/delivery">Delivery</Link>
                </li>
                <li>
                  <Link to="/returns">Return & Exchanges</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 offset-lg-1 col-md-6 col-sm-6">
            <div className="footer__widget">
              <h6>Newsletter</h6>
              <div className="footer__newslatter">
                <p>
                  Be the first to know about new arrivals, look books, sales &
                  promos!
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("Subscribed successfully!");
                  }}
                >
                  <input type="email" placeholder="Your email" required />
                  <button type="submit">
                    <span className="icon_mail_alt"></span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="footer__copyright__text">
              <p>
                Copyright © {new Date().getFullYear()} All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
