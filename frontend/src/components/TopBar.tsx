export const TopBar = () => {
  return (
    <div id="topbar">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="top-contact d-flex flex-wrap">
            <span>
              <i className="fas fa-phone-alt"></i> +1 (800) 123-4567
            </span>

            <span>
              <i className="fas fa-envelope"></i> hello@sarabfood.com
            </span>

            <span>
              <i className="fas fa-map-marker-alt"></i> 42 Flavor Street, NY
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="ttag">
              <i className="fas fa-fire me-1"></i>
              Free Delivery Today!
            </span>

            <div className="tsoc">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>

              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>

              <a href="#" aria-label="TikTok">
                <i className="fab fa-tiktok"></i>
              </a>

              <a href="#" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

