import React from "react";
import { Link } from "react-router";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>
          Sarab<span>Foods</span>
        </h2>
      </div>

      <nav className="nav-menu">
        <Link to="#" className="nav-item active">
          <span className="nav-text">Overview</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-text">Live Orders</span>
          <span className="badge badge-chili">12</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-text">Menu Management</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-text">Reservations</span>
          <span className="badge badge-gold">4</span>
        </Link>

        <Link to="#" className="nav-item">
          <span className="nav-text">Analytics</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">H</div>

          <div className="user-info">
            <span className="user-name">Hadi</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;