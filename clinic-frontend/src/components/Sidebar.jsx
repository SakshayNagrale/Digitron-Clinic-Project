import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    localStorage.removeItem("auth_token");
    localStorage.removeItem("staff_name");
    localStorage.removeItem("staff_role");
    navigate("/login");
  };

  const staffName = localStorage.getItem("staff_name") || "Clinic Staff";
  const staffRole = localStorage.getItem("staff_role") || "Reception";
  const initials = staffName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      {/* Close button (mobile only) */}
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">Digitron</span>
          <span className="sidebar-brand-label">Clinic</span>
        </div>
      </div>

      {/* Nav */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Main Menu</span>
        <nav className="sidebar-nav">

          {/* Dashboard */}
          <NavLink to="/dashboard" onClick={onClose} className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}>
            <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Dashboard</span>
          </NavLink>

          {/* Register Patient */}
          <NavLink to="/add-patient" onClick={onClose} className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}>
            <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            <span>Register Patient</span>
          </NavLink>

          {/* Patient List */}
          <NavLink to="/patients" onClick={onClose} className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}>
            <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Patient List</span>
          </NavLink>

          {/* Doctors — NEW */}
          <NavLink to="/doctors" onClick={onClose} className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}>
            <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
              <line x1="12" y1="14" x2="12" y2="17" />
              <line x1="10.5" y1="15.5" x2="13.5" y2="15.5" />
            </svg>
            <span>Doctors</span>
          </NavLink>

          {/* Appointments */}
          <NavLink to="/appointments" onClick={onClose} className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}>
            <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Appointments</span>
          </NavLink>

          {/* Billing — disabled */}
          <NavLink
            to="/billing"
            className={({ isActive }) => `sidebar-nav-item disabled ${isActive ? "active" : ""}`}
          >
            <svg className="sidebar-nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <span>Billing</span>
            <span className="sidebar-badge">Soon</span>
          </NavLink>

        </nav>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{staffName}</span>
            <span className="sidebar-user-role">{staffRole}</span>
          </div>
        </div>
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;