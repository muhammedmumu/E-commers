import React, { useContext, useMemo, useRef } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from "../Assets/arrow.png";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef();
  const dropdownRef = useRef();
  const { getTotalCartItems, isAuthenticated, logoutUser, currentUser } =
    useContext(ShopContext);

  const activeMenu = useMemo(() => {
    if (pathname.startsWith("/mens")) return "mens";
    if (pathname.startsWith("/womens")) return "womens";
    if (pathname.startsWith("/kids")) return "kids";
    return "shop";
  }, [pathname]);

  const dropdownToggle = () => {
    menuRef.current.classList.toggle("nav-menu-visible");
    dropdownRef.current.classList.toggle("open");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link className="nav-logo" to="/">
        <img src={logo} alt="Shopper logo" />
        <p>SHOPPER</p>
      </Link>

      <img
        ref={dropdownRef}
        className="nav-dropdown"
        onClick={dropdownToggle}
        src={nav_dropdown}
        alt="Toggle navigation"
      />

      <ul ref={menuRef} className="nav-menu">
        <li>
          <Link className="nav-link" to="/">
            Shop
          </Link>
          {activeMenu === "shop" ? <hr /> : null}
        </li>
        <li>
          <Link className="nav-link" to="/mens">
            Men
          </Link>
          {activeMenu === "mens" ? <hr /> : null}
        </li>
        <li>
          <Link className="nav-link" to="/womens">
            Women
          </Link>
          {activeMenu === "womens" ? <hr /> : null}
        </li>
        <li>
          <Link className="nav-link" to="/kids">
            Kids
          </Link>
          {activeMenu === "kids" ? <hr /> : null}
        </li>
      </ul>

      <div className="nav-login-cart">
        {isAuthenticated ? (
          <button onClick={handleLogout}>
            Logout{currentUser?.username ? ` ${currentUser.username}` : ""}
          </button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart" className="nav-cart-link">
          <img src={cart_icon} alt="Cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
