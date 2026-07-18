import React from "react";

 export const HomeContent: React.FC = () => {
     return (<>
  
      <header className="topbar">
        <div className="header-titles">
          <h1>Dashboard</h1>
          <p className="subtitle">
            Thursday, Oct 24 • Dinner Service
          </p>
        </div>

        <button className="btn-primary">
          New Order
        </button>
      </header>

      {/* KPI Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">
            Today's Revenue
          </h3>

          <div className="stat-value">
            $4,250.00
          </div>

          <div className="stat-trend trend-up">
            ↑ 18% vs yesterday
          </div>
        </div>


        <div className="stat-card">
          <h3 className="stat-title">
            Active Orders
          </h3>

          <div className="stat-value">
            24
          </div>

          <div className="stat-trend trend-neutral">
            Normal volume
          </div>
        </div>


        <div className="stat-card">
          <h3 className="stat-title">
            Table Occupancy
          </h3>

          <div className="stat-value">
            85%
          </div>

          <div className="stat-trend trend-up">
            ↑ 5% vs yesterday
          </div>
        </div>
         </section>
         </>
  );
};

