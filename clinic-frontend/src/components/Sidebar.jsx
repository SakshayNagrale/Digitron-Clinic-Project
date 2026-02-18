import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Clinic Info */}
      <div className="sidebar-header">
        <div className="clinic-logo">🩺</div>
        <div className="clinic-name">Digitron Clinic</div>
        <div className="clinic-role">Clinic Staff</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className="sidebar-link">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/add-patient" className="sidebar-link">
          ➕ Register Patient
        </NavLink>

        <NavLink to="/patients" className="sidebar-link">
          📋 Patient List
        </NavLink>

        <NavLink to="/appointments" className="sidebar-link disabled">
          📅 Appointments
        </NavLink>

        <NavLink to="/billing" className="sidebar-link disabled">
          💳 Billing
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="logout-btn">🚪 Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
