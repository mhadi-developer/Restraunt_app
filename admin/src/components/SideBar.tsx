import React from "react";
import { Link } from "react-router";
import { useAdminAuth } from "../context/AdminAuthProvider";

const Sidebar: React.FC = () => {
  const { loginAdmin, logoutAdmin } = useAdminAuth();
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

        <Link to="/add/category" className="nav-item">
          <span className="nav-text">Add Category</span>
        </Link>
         <Link to="/add/item" className="nav-item">
          <span className="nav-text">Add MenuItem</span>
        </Link>
      </nav>

     
      <div className="sidebar-footer">
         {
        loginAdmin?.adminEmail && loginAdmin.role === 'admin' ? (
         <div className="user-profile">
          <div className="avatar">H</div>

          <div className="user-info">
                <span className="user-name">{loginAdmin.adminName }</span>
                <span className="user-role">{ loginAdmin.role}</span>
              </div>
              <div className="side-bar-logout-btn">
                <button  type="button" onClick={()=>logoutAdmin()}>
                   Logout
                </button>

              </div>
        </div>
        ) : (
            <div className="footer-login-btn">
              <Link to='/admin/login' className="btn login-btn">
                Login
              </Link>
            </div>
        )

        }

       
      </div>
    </aside>
  );
};

export default Sidebar;