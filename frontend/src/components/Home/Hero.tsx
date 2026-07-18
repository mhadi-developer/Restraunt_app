import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero">
      <div className="hs hs1"></div>
      <div className="hs hs2"></div>

      <div className="hbgtxt">FOOD</div>

      <div className="container">
        <div
          className="row align-items-center g-5"
          style={{ minHeight: "88vh" }}
        >
          {/* Left Content */}
          <div className="col-lg-6">
            <div className="hbadge">
              <div className="hbi">
                <i className="fas fa-star"></i>
              </div>

              <span>#1 Rated Fast Food Restaurant in New York</span>
            </div>

            <h1 className="htitle">
              Delicious <span className="hl">Fast Food</span>
              <br />
              for Every Moment
            </h1>

            <p className="hdesc">
              Experience bold flavors crafted from premium ingredients. From
              crispy burgers to gourmet pizzas — every bite is an adventure
              worth savoring.
            </p>

            <div className="d-flex flex-wrap gap-3 mb-2">
              <Link href="/menu" className="btn-red">
                <i className="fas fa-utensils"></i>
                Explore Menu
              </Link>

              <Link
                href="https://www.youtube.com/watch?v=l8sHvnJkQtY"
                className="magnific_popup btn-play popup-youtube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="pico">
                  <i className="fas fa-play"></i>
                </div>

                <span>Watch Our Story</span>
              </Link>
            </div>

            <div className="hstats d-flex gap-3 flex-wrap mt-4">
              <div className="hstat">
                <span className="snum">
                  850<em>+</em>
                </span>
                <small>Happy Customers</small>
              </div>

              <div className="sdiv"></div>

              <div className="hstat">
                <span className="snum">
                  120<em>+</em>
                </span>
                <small>Menu Items</small>
              </div>

              <div className="sdiv"></div>

              <div className="hstat">
                <span className="snum">
                  15<em>+</em>
                </span>
                <small>Expert Chefs</small>
              </div>

              <div className="sdiv"></div>

              <div className="hstat">
                <span className="snum">
                  12<em>yr</em>
                </span>
                <small>Experience</small>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-lg-6">
            <div
              style={{
                position: "relative",
                textAlign: "center",
              }}
            >
              <div className="hcircle">
                <Image
                  src="/img/banner-img.jpg"
                  alt="Burger"
                  width={550}
                  height={550}
                  priority
                />
              </div>

              <div className="fcard fc1">
                <div className="fcoi r">
                  <i className="fas fa-fire"></i>
                </div>

                <div>
                  <span className="fcnum">Hot Deal</span>
                  <span className="fcsm">30% off today</span>
                </div>
              </div>

              <div className="fcard fc2">
                <div className="fcoi y">
                  <i className="fas fa-star"></i>
                </div>

                <div>
                  <span className="fcnum">4.9/5</span>
                  <span className="fcsm">2k+ reviews</span>
                </div>
              </div>

              <div className="fcard fc3">
                <div className="fcoi g">
                  <i className="fas fa-clock"></i>
                </div>

                <div>
                  <span className="fcnum">20 min</span>
                  <span className="fcsm">Fast delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}