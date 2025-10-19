import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useLocale } from "../../context/LocaleContext";
import { useTranslation } from "react-i18next"; // ✅ i18next hook
import api from "../../services/api";
import { API } from "../../constants/api";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);

  const { locale, changeLocale } = useLocale();
  const { t, i18n } = useTranslation();

  // 🧾 Fetch cart summary (localized)
  const fetchCartSummary = async () => {
    setLoadingCart(true);
    try {
      const res = await api.get(API.CART.LIST(locale));
      const items = res.data?.items || [];
      const total = Number(res.data?.total_price || 0);
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
      setCartTotal(total);
    } catch (err) {
      console.error("❌ Failed to load cart summary:", err);
      setCartCount(0);
      setCartTotal(0);
    } finally {
      setLoadingCart(false);
    }
  };

  // 👤 Check login + fetch cart once locale or token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user_name");
    setIsLoggedIn(!!token);
    if (storedUser) setUserName(storedUser);

    fetchCartSummary();
  }, [locale]);

  // 🧹 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // 🌍 Sync i18n with LocaleContext
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);

  useEffect(() => {
    window.addEventListener("cartUpdated", fetchCartSummary);
    return () => window.removeEventListener("cartUpdated", fetchCartSummary);
  }, [locale]);

  return (
    <header className="header">
      {/* Top bar */}
      <div className="header__top">
        <div className="container">
          <div className="row align-items-center justify-content-end">
            <div className="col-lg-12 col-md-12">
              <div className="header__top__right d-flex justify-content-end align-items-center gap-3">
                {/* ✅ Login / Logout */}
                {isLoggedIn ? (
                  <div className="header__top__links d-flex align-items-center gap-2">
                    <span className="fw-semibold text-dark">
                      👤 {userName}
                    </span>
                    <button
                      className="btn btn-sm btn-dark px-3"
                      onClick={handleLogout}
                    >
                      {t("logout")}
                    </button>
                  </div>
                ) : (
                  <div className="header__top__links">
                    <Link to="/login">{t("sign_in")}</Link>
                    <Link to="/register">{t("register")}</Link>
                  </div>
                )}

                {/* 🌐 Language selector */}
                <div className="header__top__hover">
                  <span>
                    {locale.toUpperCase()}{" "}
                    <i className="arrow_carrot-down"></i>
                  </span>
                  <ul>
                    <li onClick={() => changeLocale("en")}>English</li>
                    <li onClick={() => changeLocale("hu")}>Magyar</li>
                    <li onClick={() => changeLocale("ru")}>Русский</li>
                    <li onClick={() => changeLocale("uz")}>O'zbekcha</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container">
        <div className="row align-items-center">
          {/* Logo */}
          <div className="col-lg-3 col-md-3">
            <div className="header__logo">
              <Link
                to="/"
                style={{ color: "black", fontWeight: 700, fontSize: 28 }}
              >
                Meetify
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-lg-6 col-md-6">
            <nav className="header__menu mobile-menu">
              <ul>
                <li>
                  <NavLink to="/" end>
                    {t("home")}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/products">{t("shop")}</NavLink>
                </li>
                <li>
                  <NavLink to="/catalogs">{t("catalogs")}</NavLink>
                </li>
                <li>
                  <NavLink to="/orders">{t("orders")}</NavLink>
                </li>
                <li>
                  <NavLink to="/contact">{t("contact")}</NavLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Cart & Icons */}
          <div className="col-lg-3 col-md-3">
            <div className="header__nav__option d-flex align-items-center">
              <Link to="/search" className="me-2" title={t("search")}>
                <img src="/img/icon/search.png" alt="search" />
              </Link>
              <Link to="/favorites" className="me-2" title={t("favorites")}>
                <img src="/img/icon/heart.png" alt="favorites" />
              </Link>

              {/* 🛒 Dynamic Cart */}
              <Link to="/cart" className="position-relative" title={t("cart")}>
                <img src="/img/icon/cart.png" alt="cart" />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="canvas__open">
          <i className="fa fa-bars"></i>
        </div>
      </div>
    </header>
  );
}
