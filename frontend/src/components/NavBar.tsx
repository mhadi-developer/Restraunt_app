"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import UserAvatar from "./utils/UserAvatar";
import { useState, useEffect, useRef } from "react";
import "@/assets/CSS/cart-icon.css";
import { redirect } from "next/navigation";
import { useCart } from "@/context/CartProvider";

export default function Navbar() {
  const { cart } = useCart();
  const { loginUser , logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const navRef = useRef(null);
  const dropdownRef = useRef(null);

  // Auto-close both the mobile menu and the avatar dropdown when crossing into desktop (lg, 992px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Close avatar dropdown on outside click (separate ref so it doesn't fight the menu's own outside-click logic)
  useEffect(() => {
    const handleClickOutsideDropdown = (e) => {
      if (avatarDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAvatarDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => document.removeEventListener("mousedown", handleClickOutsideDropdown);
  }, [avatarDropdownOpen]);

  // Close avatar dropdown on Escape key (accessibility)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setAvatarDropdownOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar navbar-expand-lg" id="nav" ref={navRef}>
      <div className="container">
        {/* Logo */}
        <Link href="/" className="navbar-brand" onClick={closeMenu}>
          <div className="blogo">
            <div className="bico"><i className="fas fa-utensils"></i></div>
            <div>
              <div className="bname">Sar<span>ab</span></div>
              <div className="bsub">Fast Food & Restaurant</div>
            </div>
          </div>
        </Link>

        {/* Always-visible mobile row */}
        <div className="d-flex align-items-center gap-2 order-lg-3 mobile-quick-actions">
          {loginUser?.email && (
            <>
              {/* Avatar + dropdown wrapper */}
              <div className="avatar-dropdown-wrapper" ref={dropdownRef}>
                <button
                  type="button"
                  className="avatar-trigger-btn"
                  aria-haspopup="true"
                  aria-expanded={avatarDropdownOpen}
                  onClick={() => setAvatarDropdownOpen((prev) => !prev)}
                >
                  <UserAvatar fullName={`${loginUser?.firstName} ${loginUser?.lastName}`} />
                </button>

               {avatarDropdownOpen && (
  <div className="avatar-dropdown-menu" role="menu">
    <Link href="/profile" className="dropdown-item" role="menuitem" onClick={() => setAvatarDropdownOpen(false)}>
      <i className="fas fa-user dropdown-item-icon"></i>
      My Profile
    </Link>

    <Link href="/user-orders" className="dropdown-item" role="menuitem" onClick={() => setAvatarDropdownOpen(false)}>
      <i className="fas fa-receipt dropdown-item-icon"></i>
      My Orders
    </Link>

    <div className="dropdown-divider"></div>

    <button
      type="button"
      className="dropdown-item dropdown-item-danger"
      role="menuitem"
      onClick={() => logoutUser()}
    >
      <i className="fas fa-sign-out-alt dropdown-item-icon"></i>
      Logout
    </button>
  </div>
)}
              </div>

              <button onClick={() => redirect('/cart')} className="premium-cart-btn" aria-label="Open Order Cart">
                <div className="premium-cart-glow"></div>
                <svg width="32" height="32" viewBox="0 0 32 32" className="premium-cart-icon" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 2H23.5M2 8H30L26 23C25.5 25 24 26 22 26H10C8 26 6.5 25 6 23L2 8Z" stroke="currentColor" strokeWidth="1.5" fill="none" className="icon-frame" />
                  <path d="M23.5 2C26.5 2 29 4 29 8M8.5 2C5.5 2 3 4 3 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <ellipse cx="16" cy="18" rx="8" ry="2" fill="#FFFFFF" />
                  <path d="M10 18C10 15 12 12.5 16 12.5C20 12.5 22 15 22 18H10Z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="0.5" />
                  <circle cx="16" cy="12.5" r="2" fill="var(--color-gold, #d4a24c)" />
                  <circle cx="10" cy="22" r="1" fill="var(--color-gold, #d4a24c)" />
                  <circle cx="22" cy="22" r="1" fill="var(--color-gold, #d4a24c)" />
                  <g className="icon-steam" stroke="var(--color-gold, #d4a24c)" fill="none" strokeWidth="1">
                    <path d="M14 9C14 7.5 15 7.5 15 6" />
                    <path d="M18 9.5C18 8 19 8 19 6.5" />
                  </g>
                </svg>
                <span className="premium-cart-badge">{cart.length}</span>
              </button>
            </>
          )}

          {/* Controlled burger */}
          <button
            className="navbar-toggler border-0"
            type="button"
            aria-controls="navmenu"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <i
              className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}
              style={{ color: "var(--primary)", fontSize: "1.35rem" }}
            ></i>
          </button>
        </div>

        {/* Collapsible nav links + auth CTAs */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navmenu">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item"><Link href="/" className="nav-link active" onClick={closeMenu}>Home</Link></li>
            <li className="nav-item"><Link href="/about" className="nav-link" onClick={closeMenu}>About</Link></li>
            <li className="nav-item"><Link href="/menu" className="nav-link" onClick={closeMenu}>Menu</Link></li>
            <li className="nav-item"><Link href="/chefs" className="nav-link" onClick={closeMenu}>Chefs</Link></li>
            <li className="nav-item"><Link href="/reservation" className="nav-link" onClick={closeMenu}>Reservation</Link></li>
            <li className="nav-item"><Link href="/reviews" className="nav-link" onClick={closeMenu}>Reviews</Link></li>
            <li className="nav-item"><Link href="/contact" className="nav-link" onClick={closeMenu}>Contact</Link></li>
          </ul>

          <div className="d-flex align-items-center gap-1 flex-wrap desktop-actions">
            {loginUser?.email ? (
              <Link href="/menu" className="nav-link nav-cta" onClick={closeMenu}>Order Now</Link>
            ) : (
              <>
                <Link href="/register" className="nav-link nav-cta" onClick={closeMenu}>Register Now</Link>
                <Link href="/login" className="nav-link nav-cta" onClick={closeMenu}>Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}