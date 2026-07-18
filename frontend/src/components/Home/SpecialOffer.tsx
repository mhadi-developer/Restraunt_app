import Image from "next/image";
import Link from "next/link";

 export const SpecialOfferSection = () => {
  return (
    <section id="special">
      <div className="spbg"></div>

      <div
        className="container"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="row align-items-center g-5">
          <div
            className="col-lg-6"
            data-aos="fade-right"
          >
            <div className="sptag"><i className="fas fa-bolt me-1"></i> Limited Time Offer
            </div>

            <h2 className="sptitle">
              Get 30% Off
              <br />
              Our Signature
              <br />
              <span>Burger</span> Meal
            </h2>

            <p className="spdesc">
              Don&apos;t miss our weekend special - grab our award-winning signature
              burger combo with loaded fries and a premium shake at an
              unbeatable price.
            </p>

            <div className="cdwrap">
              <div className="cditem">
                <span className="cdnum" id="cdH">
                  08
                </span>
                <span className="cdlbl">Hours</span>
              </div>

              <div className="cditem">
                <span className="cdnum" id="cdM">
                  45
                </span>
                <span className="cdlbl">Minutes</span>
              </div>

              <div className="cditem">
                <span className="cdnum" id="cdS">
                  30
                </span>
                <span className="cdlbl">Seconds</span>
              </div>
            </div>

            <Link href="#menu" className="btn-red">
              <i className="fas fa-shopping-cart"></i>{" "}
              Grab the Deal
            </Link>
          </div>

          <div
            className="col-lg-6"
            data-aos="fade-left"
          >
            <div className="spimgw">
              <div className="spglow"></div>

              <div className="sppbdg">
                <span className="old">$24.99</span>
                <span className="np">$17.49</span>
              </div>

              <Image
                src="/img/off-img.jpg"
                alt="Special Burger"
                width={600}
                height={600}
                className="img-fluid"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

