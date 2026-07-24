"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import UserAvatar from "./utils/UserAvatar";
import { ShoppingBag } from 'lucide-react';
import { useState } from "react";
import "@/assets/CSS/cart-icon.css"

export default function Navbar() {
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  
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
               <button className="premium-cart-btn" aria-label="Open Order Cart">
      {/* Background glow overlay */}
      <div className="premium-cart-glow"></div>
      
      {/* Custom Refined Multi-Tone Icon */}
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        className="premium-cart-icon" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Basket Frame - Main structure and handles, transitions on hover */}
        <path 
          d="M8.5 2H23.5M2 8H30L26 23C25.5 25 24 26 22 26H10C8 26 6.5 25 6 23L2 8Z" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none" 
          className="icon-frame" 
        />
        
        {/* Upper Handle Curves */}
        <path 
          d="M23.5 2C26.5 2 29 4 29 8M8.5 2C5.5 2 3 4 3 8" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          fill="none" 
          strokeLinecap="round" 
        />

        {/* --- Central Premium Details --- */}
        {/* White Plate Base */}
        <ellipse cx="16" cy="18" rx="8" ry="2" fill="#FFFFFF" />
        
        {/* Restaurant Cloche with a central Gold core */}
        <path 
          d="M10 18C10 15 12 12.5 16 12.5C20 12.5 22 15 22 18H10Z" 
          fill="#FFFFFF" 
          stroke="#FFFFFF" 
          strokeWidth="0.5" 
        />
        
        {/* Glowing Gold Cloche Handle (Focal point, always Gold) */}
        <circle cx="16" cy="12.5" r="2" fill="var(--color-gold, #d4a24c)" />

        {/* Decorative Gold Rivets (Always Gold) */}
        <circle cx="10" cy="22" r="1" fill="var(--color-gold, #d4a24c)" />
        <circle cx="22" cy="22" r="1" fill="var(--color-gold, #d4a24c)" />

        {/* Hidden Steam Trails (Controlled by Hover in CSS) */}
        <g className="icon-steam" stroke="var(--color-gold, #d4a24c)" fill="none" strokeWidth="1">
          <path d="M14 9C14 7.5 15 7.5 15 6" />
          <path d="M18 9.5C18 8 19 8 19 6.5" />
        </g>
      </svg>
      
      {/* Dynamic Item Counter Badge */}
      {cartItemCount > 0 && (
        <span className="premium-cart-badge">
          {cartItemCount}
        </span>
      )}
    </button>
                
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