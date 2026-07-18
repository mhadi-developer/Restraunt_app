import React from "react";
import "../resources/css/not-found.css";

const NotFound: React.FC = () => {
  return (
    <div className="error-body">
      <div className="error-layout">

        {/* Subtle Brand Header */}
        <div className="error-brand">
          <h2>
            Maison<span>Chili</span>
          </h2>
        </div>


        {/* Main 404 Content */}
        <main className="error-content">

          <h1 className="error-code">
            404
          </h1>


          <div className="decorative-line"></div>


          <h2 className="error-title">
            This table is currently empty.
          </h2>


          <p className="error-message">
            The page you are looking for might have been removed,
            had its name changed, or is temporarily unavailable.
            Let us guide you back to the main service.
          </p>


          <a
            href="/"
            className="btn-primary"
          >
            Return to Dashboard
          </a>


        </main>

      </div>
    </div>
  );
};

export default NotFound;