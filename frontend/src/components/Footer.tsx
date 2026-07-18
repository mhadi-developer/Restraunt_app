import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row g-5">
          {/* Brand */}
          <div className="col-lg-4">
            <div className="fnm">
              Sar<span>ab</span>
            </div>

            <p className="fdesc">
              We bring the world&apos;s finest flavors together in a fast,
              friendly, and affordable experience. Every meal crafted
              with love.
            </p>

            <div className="fsoc">
              <Link href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </Link>

              <Link href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </Link>

              <Link href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </Link>

              <Link href="#" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </Link>

              <Link href="#" aria-label="TikTok">
                <i className="fab fa-tiktok"></i>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-sm-6 col-lg-2">
            <div className="ftit">Quick Links</div>

            <ul className="flinks ps-0">
              <li>
                <Link href="/">
                  <i className="fas fa-chevron-right"></i> Home
                </Link>
              </li>

              <li>
                <Link href="/about">
                  <i className="fas fa-chevron-right"></i> About Us
                </Link>
              </li>

              <li>
                <Link href="/menu">
                  <i className="fas fa-chevron-right"></i> Our Menu
                </Link>
              </li>

              <li>
                <Link href="/reservation">
                  <i className="fas fa-chevron-right"></i> Reservation
                </Link>
              </li>

              <li>
                <Link href="/blog">
                  <i className="fas fa-chevron-right"></i> Blog
                </Link>
              </li>

              <li>
                <Link href="/contact">
                  <i className="fas fa-chevron-right"></i> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Menu */}
          <div className="col-sm-6 col-lg-2">
            <div className="ftit">Our Menu</div>

            <ul className="flinks ps-0">
              <li>
                <Link href="/menu">
                  <i className="fas fa-chevron-right"></i> Burgers
                </Link>
              </li>

              <li>
                <Link href="/menu">
                  <i className="fas fa-chevron-right"></i> Pizza
                </Link>
              </li>

              <li>
                <Link href="/menu">
                  <i className="fas fa-chevron-right"></i> Fried Chicken
                </Link>
              </li>

              <li>
                <Link href="/menu">
                  <i className="fas fa-chevron-right"></i> Wraps &amp; Rolls
                </Link>
              </li>

              <li>
                <Link href="/menu">
                  <i className="fas fa-chevron-right"></i> Pasta
                </Link>
              </li>

              <li>
                <Link href="/menu">
                  <i className="fas fa-chevron-right"></i> Desserts
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4">
            <div className="ftit">Get In Touch</div>

            <div className="fci">
              <div className="fciico">
                <i className="fas fa-map-marker-alt"></i>
              </div>

              <div className="fciinfo">
                <strong>Address</strong>
                <br />
                42 Flavor Street, Manhattan, NY 10001
              </div>
            </div>

            <div className="fci">
              <div className="fciico">
                <i className="fas fa-phone-alt"></i>
              </div>

              <div className="fciinfo">
                <strong>Phone</strong>
                <br />
                +1 (800) 123-4567
              </div>
            </div>

            <div className="fci">
              <div className="fciico">
                <i className="fas fa-envelope"></i>
              </div>

              <div className="fciinfo">
                <strong>Email</strong>
                <br />
                hello@sarabfood.com
              </div>
            </div>

            <div className="fci">
              <div className="fciico">
                <i className="fas fa-clock"></i>
              </div>

              <div className="fciinfo">
                <strong>Hours</strong>
                <br />
                Wed - Sun: 09 AM - 11 PM
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="fbot">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <p>
              &copy; 2026 <span>Sarab Restaurant</span>. All Rights Reserved by{" "}
              <a
                href="https://bestwpware.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-0 fw-bold text-success"
              >
                Bestwpware
              </a>
              . Made with{" "}
              <span>
                <i className="fas fa-heart"></i>
              </span>
              <br />
              Distributed by{" "}
              <a
                href="https://themewagon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-0 fw-bold text-success"
              >
                ThemeWagon
              </a>
            </p>

            <div className="d-flex gap-3">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}