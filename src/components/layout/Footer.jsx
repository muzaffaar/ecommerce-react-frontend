import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

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
              <p>{t("footer.about_text")}</p>
            </div>
          </div>

          {/* Shopping Links 1 */}
          <div className="col-lg-2 offset-lg-1 col-md-3 col-sm-6">
            <div className="footer__widget">
              <h6>{t("footer.shopping")}</h6>
              <ul>
                <li>
                  <Link to="/catalogs">{t("footer.clothing_store")}</Link>
                </li>
                <li>
                  <Link to="/products">{t("footer.trending_shoes")}</Link>
                </li>
                <li>
                  <Link to="/products">{t("footer.accessories")}</Link>
                </li>
                <li>
                  <Link to="/sale">{t("footer.sale")}</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Help Links */}
          <div className="col-lg-2 col-md-3 col-sm-6">
            <div className="footer__widget">
              <h6>{t("footer.help_support")}</h6>
              <ul>
                <li>
                  <Link to="/contact">{t("footer.contact")}</Link>
                </li>
                <li>
                  <Link to="/payments">{t("footer.payment_methods")}</Link>
                </li>
                <li>
                  <Link to="/delivery">{t("footer.delivery")}</Link>
                </li>
                <li>
                  <Link to="/returns">{t("footer.returns")}</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 offset-lg-1 col-md-6 col-sm-6">
            <div className="footer__widget">
              <h6>{t("footer.newsletter")}</h6>
              <div className="footer__newslatter">
                <p>{t("footer.newsletter_text")}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert(t("footer.subscribed"));
                  }}
                >
                  <input
                    type="email"
                    placeholder={t("footer.email_placeholder")}
                    required
                  />
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
                {t("footer.copyright", {
                  year: new Date().getFullYear(),
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
