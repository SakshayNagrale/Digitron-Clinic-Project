import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StaffDashboard.css";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const staffName = localStorage.getItem("staff_name") || "Clinic Staff";
  const staffRole = localStorage.getItem("staff_role") || "Reception";

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalTreatments: 0,
    todayTreatments: 0,
    todayAppointments: 0,
    totalAppointments: 0,
    totalDoctors: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/dashboard-stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Top Bar */}
      <header className="dashboard-topbar">
        <div className="dashboard-topbar-left">
          <h1 className="dashboard-heading">Dashboard</h1>
          <p className="dashboard-subheading">
            Welcome back. Here is your clinic overview.
          </p>
        </div>
        <div className="dashboard-topbar-right">
          <div className="dashboard-avatar">{staffName.charAt(0)}</div>
          <div className="dashboard-user-meta">
            <span className="dashboard-user-name">{staffName}</span>
            <span className="dashboard-user-role">{staffRole}</span>
          </div>
        </div>
      </header>

      {/* Stat Cards */}
      <section className="dashboard-stats">
        {/* Total Patients */}
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon dashboard-stat-icon--teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="dashboard-stat-body">
            <span className="dashboard-stat-value">
              {loading ? "--" : stats.totalPatients}
            </span>
            <span className="dashboard-stat-label">Total Patients</span>
          </div>
        </div>

        {/* Total Doctors */}
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon dashboard-stat-icon--indigo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
              <line x1="12" y1="14" x2="12" y2="17" />
              <line x1="10.5" y1="15.5" x2="13.5" y2="15.5" />
            </svg>
          </div>
          <div className="dashboard-stat-body">
            <span className="dashboard-stat-value">
              {loading ? "--" : stats.totalDoctors}
            </span>
            <span className="dashboard-stat-label">Total Doctors</span>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon dashboard-stat-icon--amber">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="dashboard-stat-body">
            <span className="dashboard-stat-value">
              {loading ? "--" : stats.todayAppointments}
            </span>
            <span className="dashboard-stat-label">Today's Appointments</span>
          </div>
        </div>

        {/* Total Treatments */}
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon dashboard-stat-icon--rose">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="dashboard-stat-body">
            <span className="dashboard-stat-value">
              {loading ? "--" : stats.totalTreatments}
            </span>
            <span className="dashboard-stat-label">Treatments</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-actions-section">
        <h2 className="dashboard-section-title">Quick Actions</h2>
        <div className="dashboard-actions">
          <button className="dashboard-action-card" onClick={() => navigate("/add-patient")}>
            <div className="dashboard-action-icon dashboard-action-icon--teal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <div className="dashboard-action-text">
              <span className="dashboard-action-title">Register Patient</span>
              <span className="dashboard-action-desc">Add a new patient to the system</span>
            </div>
            <svg className="dashboard-action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <button className="dashboard-action-card" onClick={() => navigate("/patients")}>
            <div className="dashboard-action-icon dashboard-action-icon--amber">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="dashboard-action-text">
              <span className="dashboard-action-title">Patient List</span>
              <span className="dashboard-action-desc">View and manage patient records</span>
            </div>
            <svg className="dashboard-action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <button className="dashboard-action-card" onClick={() => navigate("/doctors")}>
            <div className="dashboard-action-icon dashboard-action-icon--indigo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <line x1="12" y1="14" x2="12" y2="17" />
                <line x1="10.5" y1="15.5" x2="13.5" y2="15.5" />
              </svg>
            </div>
            <div className="dashboard-action-text">
              <span className="dashboard-action-title">Doctors</span>
              <span className="dashboard-action-desc">Manage doctor profiles</span>
            </div>
            <svg className="dashboard-action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <button className="dashboard-action-card" onClick={() => navigate("/appointments")}>
            <div className="dashboard-action-icon dashboard-action-icon--green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="dashboard-action-text">
              <span className="dashboard-action-title">Appointments</span>
              <span className="dashboard-action-desc">View and schedule appointments</span>
            </div>
            <svg className="dashboard-action-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <button className="dashboard-action-card dashboard-action-card--disabled">
            <div className="dashboard-action-icon dashboard-action-icon--rose">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div className="dashboard-action-text">
              <span className="dashboard-action-title">Billing</span>
              <span className="dashboard-action-desc">Generate bills and manage payments</span>
            </div>
            <span className="dashboard-action-soon">Coming Soon</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default StaffDashboard;