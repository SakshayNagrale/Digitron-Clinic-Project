import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StaffDashboard.css";

const StaffDashboard = () => {
  const navigate = useNavigate();

  // Static staff info (can come from backend later)
  const staff = {
    name: "Clinic Staff",
    role: "Reception",
  };

  // Dashboard stats from backend
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalTreatments: 0,
    todayTreatments: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats on page load
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
    <div className="staff-dashboard-page">
      {/* Header */}
      <div className="staff-dashboard-header">
        <div className="staff-dashboard-header-left">
          <h1 className="staff-dashboard-title">Clinic Staff Dashboard</h1>
          <p className="staff-dashboard-subtitle">
            Manage patients, appointments, and treatments
          </p>
        </div>

        <div className="staff-dashboard-header-right">
          <div className="staff-info">
            <div className="staff-avatar">👤</div>
            <div className="staff-details">
              <div className="staff-name">{staff.name}</div>
              <div className="staff-role">{staff.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="staff-dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">
            {loading ? "—" : stats.totalPatients}
          </div>
          <div className="stat-label">Total Patients</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">—</div>
          <div className="stat-label">Appointments</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">
            {loading ? "—" : stats.totalTreatments}
          </div>
          <div className="stat-label">Treatments</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">—</div>
          <div className="stat-label">Pending Bills</div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="staff-dashboard-actions">
        <div
          className="action-card"
          onClick={() => navigate("/add-patient")}
        >
          <div className="action-icon">➕</div>
          <div className="action-title">Register Patient</div>
          <div className="action-desc">
            Add a new patient to the system
          </div>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/patients")}
        >
          <div className="action-icon">📋</div>
          <div className="action-title">Patient List</div>
          <div className="action-desc">
            View and manage patient records
          </div>
        </div>

        <div className="action-card">
          <div className="action-icon">📅</div>
          <div className="action-title">Appointments</div>
          <div className="action-desc">
            View and schedule appointments
          </div>
        </div>

        <div className="action-card">
          <div className="action-icon">💳</div>
          <div className="action-title">Billing</div>
          <div className="action-desc">
            Generate bills and manage payments
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
