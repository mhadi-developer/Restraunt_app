import Image from "next/image";

export  function ChefsSection() {
  return (
    <section id="chefs">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="slbl">The Culinary Team</span>
          <h2 className="stitle">
            Meet Our Expert <span>Chefs</span>
          </h2>
          <div className="sline"></div>
        </div>

        <div className="row g-4">
          <div
            className="col-sm-6 col-lg-3"
            data-aos="fade-up"
            data-aos-delay="0"
          >
            <div className="chcard">
              <div className="chimg">
                <Image
                  src="/img/chefs/1.jpg"
                  alt="Alice Mortal"
                  width={400}
                  height={500}
                />
                <div className="chsoc">
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>

              <div className="chbody">
                <div className="chnm">Alice Mortal</div>
                <div className="chrole">Head Chef</div>
                <div className="chexp">12 years experience</div>
              </div>
            </div>
          </div>

          <div
            className="col-sm-6 col-lg-3"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            <div className="chcard">
              <div className="chimg">
                <Image
                  src="/img/chefs/2.jpg"
                  alt="Michael Corn"
                  width={400}
                  height={500}
                />
                <div className="chsoc">
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>

              <div className="chbody">
                <div className="chnm">Michael Corn</div>
                <div className="chrole">Grill Master</div>
                <div className="chexp">8 years experience</div>
              </div>
            </div>
          </div>

          <div
            className="col-sm-6 col-lg-3"
            data-aos="fade-up"
            data-aos-delay="160"
          >
            <div className="chcard">
              <div className="chimg">
                <Image
                  src="/img/chefs/3.jpg"
                  alt="Faz Chowdel"
                  width={400}
                  height={500}
                />
                <div className="chsoc">
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>

              <div className="chbody">
                <div className="chnm">Faz Chowdel</div>
                <div className="chrole">Pastry Chef</div>
                <div className="chexp">10 years experience</div>
              </div>
            </div>
          </div>

          <div
            className="col-sm-6 col-lg-3"
            data-aos="fade-up"
            data-aos-delay="240"
          >
            <div className="chcard">
              <div className="chimg">
                <Image
                  src="/img/chefs/4.jpg"
                  alt="William Latnum"
                  width={400}
                  height={500}
                />
                <div className="chsoc">
                  <a href="#">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>

              <div className="chbody">
                <div className="chnm">William Latnum</div>
                <div className="chrole">Pizza Artisan</div>
                <div className="chexp">9 years experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}