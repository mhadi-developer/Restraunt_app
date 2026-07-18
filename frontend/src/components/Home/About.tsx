import Link from "next/link"

export const AboutSection = () => {
    return (
        
        <section id="about">
  <div className="container">
    <div className="row align-items-center g-5">

      {/* Left Image Section */}
      <div className="col-lg-5" data-aos="fade-right">
        <div className="astack">

          <div className="aexp">
            <span className="anum">12+</span>
            <small>
              Years of
              <br />
              Excellence
            </small>
          </div>

          <div className="amain">
            <img src="/img/about1.jpg" alt="Restaurant" />
          </div>

          <div className="asm">
            <img src="/img/about2.jpg" alt="Restaurant interior" />
          </div>

        </div>
      </div>


      {/* Right Content Section */}
      <div className="col-lg-7" data-aos="fade-left">

        <span className="slbl">
          Our Story
        </span>

        <h2 className="stitle text-start">
          We Invite You to Visit
          <br />
          Our <span>Food Restaurant</span>
        </h2>

        <div className="sline lft"></div>


        <p className="sdesc mb-4">
          Founded in 2012, Sarab began as a small corner joint with a big dream
          - to serve food that brings people together. Today we&apos;re proud to
          serve thousands of happy customers every week with the same passion
          that started it all.
        </p>


        <div className="mb-4">

          {/* Feature 1 */}
          <div className="fti">

            <div className="ftico r">
              <i className="fas fa-leaf"></i>
            </div>

            <div>
              <h6>
                100% Fresh Ingredients
              </h6>

              <p>
                We source locally and sustainably. Every ingredient is
                hand-picked daily for maximum freshness.
              </p>
            </div>

          </div>


          {/* Feature 2 */}
          <div className="fti">

            <div className="ftico y">
              <i className="fas fa-award"></i>
            </div>

            <div>
              <h6>
                Award-Winning Recipes
              </h6>

              <p>
                Our signature recipes have won national culinary awards
                5 years in a row.
              </p>
            </div>

          </div>


          {/* Feature 3 */}
          <div className="fti">

            <div className="ftico g">
              <i className="fas fa-shipping-fast"></i>
            </div>

            <div>
              <h6>
                Lightning-Fast Delivery
              </h6>

              <p>
                Order online and get hot, fresh food at your door in under
                25 minutes, guaranteed.
              </p>
            </div>

          </div>

        </div>


        <Link href="/menu" className="btn-red">
          <i className="fas fa-book-open"></i>
          View Full Menu
        </Link>

      </div>

    </div>
  </div>
</section>
        
    )
}