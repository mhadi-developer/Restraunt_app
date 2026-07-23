"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import UserAvatar from "./utils/UserAvatar";

export default function Navbar() {
  
  const { loginUser } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg" id="nav">
      <div className="container">
        {/* Logo */}
        <Link href="/" className="navbar-brand">
          <div className="blogo">
            <div className="bico">
              <i className="fas fa-utensils"></i>
            </div>

            <div>
              <div className="bname">
                Sar<span>ab</span>
              </div>
              <div className="bsub">Fast Food & Restaurant</div>
            </div>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navmenu"
          aria-controls="navmenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i
            className="fas fa-bars"
            style={{
              color: "var(--primary)",
              fontSize: "1.35rem",
            }}
          ></i>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link active">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/about" className="nav-link">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/menu" className="nav-link">
                Menu
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/chefs" className="nav-link">
                Chefs
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/reservation" className="nav-link">
                Reservation
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/reviews" className="nav-link">
                Reviews
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
            </li>
          </ul>

          {/* Right Actions */}

          <div className="d-flex align-items-center gap-1">
            {
              loginUser?.email ? (<>
                <div>
                  <UserAvatar fullName={`${loginUser?.firstName} ${loginUser?.lastName}`} />
                  </div>
                <Link href="/menu" className="nav-link nav-cta">
                  Order Now
                </Link>

                
              </>
                
              ) : (
                <>
                  <Link href="/register" className="nav-link nav-cta">
                    Register Now
                  </Link>
                  <Link href="/login" className="nav-link nav-cta">
                    Login
                  </Link>
                </>
              )
            }
          </div>
        </div>
      </div>
    </nav>
  );
}