export  function InfoSection() {
  return (
    <div className="col-lg-12" data-aos="fade-right">
      <div
        style={{
          background: "var(--dark)",
          borderRadius: "18px",
          padding: "36px",
        }}
      >
        <h4
          style={{
            color: "#fff",
            fontSize: "1.3rem",
            marginBottom: "8px",
          }}
        >
          Contact Info
        </h4>

        <p
          style={{
            color: "rgba(255,255,255,.55)",
            fontSize: ".85rem",
            marginBottom: "26px",
          }}
        >
          We&apos;re happy to help you plan the perfect dining experience.
        </p>

        <div className="d-flex flex-column gap-3">
          {/* Opening Hours */}
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "11px",
                background: "rgba(232,40,26,.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                fontSize: "1.1rem",
                flexShrink: 0,
              }}
            >
              <i className="fas fa-clock"></i>
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  color: "#ccc",
                  fontSize: ".78rem",
                  textTransform: "uppercase",
                  letterSpacing: ".8px",
                }}
              >
                Opening Hours
              </strong>

              <span
                style={{
                  color: "#fff",
                  fontSize: ".87rem",
                }}
              >
                Wed - Sun, 9 AM - 11 PM
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "11px",
                background: "rgba(232,40,26,.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                fontSize: "1.1rem",
                flexShrink: 0,
              }}
            >
              <i className="fas fa-phone-alt"></i>
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  color: "#ccc",
                  fontSize: ".78rem",
                  textTransform: "uppercase",
                  letterSpacing: ".8px",
                }}
              >
                Call for Booking
              </strong>

              <span
                style={{
                  color: "#fff",
                  fontSize: ".87rem",
                }}
              >
                +1 (800) 123-4567
              </span>
            </div>
          </div>

          {/* Group Dining */}
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "11px",
                background: "rgba(232,40,26,.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                fontSize: "1.1rem",
                flexShrink: 0,
              }}
            >
              <i className="fas fa-users"></i>
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  color: "#ccc",
                  fontSize: ".78rem",
                  textTransform: "uppercase",
                  letterSpacing: ".8px",
                }}
              >
                Group Dining
              </strong>

              <span
                style={{
                  color: "#fff",
                  fontSize: ".87rem",
                }}
              >
                Special menus for 10+ guests
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "11px",
                background: "rgba(232,40,26,.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
                fontSize: "1.1rem",
                flexShrink: 0,
              }}
            >
              <i className="fas fa-map-marker-alt"></i>
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  color: "#ccc",
                  fontSize: ".78rem",
                  textTransform: "uppercase",
                  letterSpacing: ".8px",
                }}
              >
                Location
              </strong>

              <span
                style={{
                  color: "#fff",
                  fontSize: ".87rem",
                }}
              >
                42 Flavor Street, NY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}