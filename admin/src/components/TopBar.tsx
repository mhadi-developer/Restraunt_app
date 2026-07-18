import React from "react";
import"../resources/css/topbar.css"

interface GlobalBrandingBarProps {
  restaurantName?: string;
  serviceDate?: string;
  serviceName?: string;
  userName?: string;
}

const GlobalBrandingBar: React.FC<GlobalBrandingBarProps> = ({
  restaurantName = "Sarab",
  serviceDate = "Oct 24",
  serviceName = "Dinner Service",
  userName 
}) => {
  return (
    <header className="global-branding-bar">
      <div className="branding-container">
        {/* Brand */}
        <div className="topbar-brand">
          <a href="/" className="brand-link">
            <h2>
              {restaurantName}
              <span>Foods</span>
            </h2>
          </a>
        </div>

        {/* Right Actions */}
        <div className="topbar-actions">
          <span className="topbar-date">
            {serviceDate} • {serviceName}
          </span>

          <div className="topbar-divider" />

          <div className="topbar-profile">
            <span className="topbar-greeting">
              Welcome, {userName}
            </span>

            <div className="topbar-avatar">
              {userName?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalBrandingBar;