import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./DashboardSidebar.css";

interface SidebarProps {
  name: string;
  affiliation: string;
};

export const DashboardSidebar: React.FC<SidebarProps> = ({ name, affiliation }) => {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="profile-section">
          <div className="profile-pic"></div>
          <div>Hello,</div>
          <div id="name">{name}</div>
          <div>{affiliation}</div>
        </div>
        
        <nav className="nav-links">
          <button
            className={location.pathname === "/dashboard" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate('/dashboard');
            }}
          >
            <FaHome /> Dashboard
          </button>
          <button
            className={location.pathname === "/account" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate('/account');
            }}
          >
            <FaUser /> Account
          </button>
          <button
            className={location.pathname === "/settings" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              navigate('/settings');
            }}
          >
            <FaCog /> Settings
          </button>
        </nav>
      </div>
      <div className="logout">
        <button className="logout-button" onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}>
            <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};
