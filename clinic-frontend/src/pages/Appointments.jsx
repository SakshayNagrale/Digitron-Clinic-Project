import React, { useEffect, useState } from "react";
import "../styles/Appointments.css";

const STATUS_COLORS = {
  scheduled: "scheduled",
  completed: "completed",
  cancelled: "cancelled",
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_name: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
    status: "scheduled",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/appointments");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:5000/patients");
      const data = await res.json();
      setPatients(data);
    } catch {}
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
  };

  const openAddForm = () => {
    setEditingAppointment(null);
    setFormData({
      patient_id: "",
      doctor_name: "",
      appointment_date: "",
      appointment_time: "",
      reason: "",
      status: "scheduled",
    });
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (appt) => {
    setEditingAppointment(appt);
    setFormData({
      patient_id: appt.patient_id,
      doctor_name: appt.doctor_name,
      appointment_date: appt.appointment_date,
      appointment_time: appt.appointment_time,
      reason: appt.reason || "",
      status: appt.status,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.patient_id || !formData.doctor_name || !formData.appointment_date || !formData.appointment_time) {
      setFormError("Please fill in all required fields");
      return;
    }

    setFormLoading(true);
    try {
      const url = editingAppointment
        ? `http://localhost:5000/edit-appointment/${editingAppointment.id}`
        : "http://localhost:5000/add-appointment";
      const method = editingAppointment ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setShowForm(false);
      fetchAppointments();
      showSuccess(editingAppointment ? "Appointment updated!" : "Appointment scheduled!");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5000/delete-appointment/${selectedId}`, {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      setSelectedId(null);
      fetchAppointments();
      showSuccess("Appointment deleted.");
    } catch (err) {
      alert(err.message);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const filtered = appointments.filter((a) => {
    const term = searchTerm.trim().toLowerCase();
    const matchSearch =
      !term ||
      a.patient_name?.toLowerCase().includes(term) ||
      a.doctor_name?.toLowerCase().includes(term);
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="ap-page">
      {/* Header */}
      <div className="ap-header">
        <div className="ap-header-left">
          <h1 className="ap-title">Appointments</h1>
          <p className="ap-subtitle">
            {filtered.length} {filtered.length === 1 ? "appointment" : "appointments"} found
          </p>
        </div>
        <button className="ap-add-btn" onClick={openAddForm}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="ap-filters">
        <div className="ap-search">
          <svg className="ap-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="ap-search-input"
            type="text"
            placeholder="Search by patient or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="ap-status-filters">
          {["all", "scheduled", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              className={`ap-filter-btn ${filterStatus === s ? "ap-filter-btn--active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="ap-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="ap-empty-state">
          <div className="ap-spinner" />
          <span>Loading appointments...</span>
        </div>
      )}

      {error && (
        <div className="ap-error-state">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="ap-empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>No appointments found</span>
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="ap-table-card">
          <table className="ap-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => (
                <tr key={appt.id} className={appt.appointment_date === today ? "ap-row--today" : ""}>
                  <td className="ap-cell-patient">
                    <div className="ap-name-avatar">
                      {appt.patient_name?.charAt(0).toUpperCase()}
                    </div>
                    {appt.patient_name}
                  </td>
                  <td className="ap-cell-doctor">{appt.doctor_name}</td>
                  <td className="ap-cell-date">
                    {appt.appointment_date === today ? (
                      <span className="ap-today-tag">Today</span>
                    ) : (
                      appt.appointment_date
                    )}
                  </td>
                  <td className="ap-cell-time">{appt.appointment_time}</td>
                  <td className="ap-cell-reason">{appt.reason || "--"}</td>
                  <td>
                    <span className={`ap-status-badge ap-status-badge--${STATUS_COLORS[appt.status]}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="ap-cell-actions">
                    <button className="ap-btn ap-btn--edit" onClick={() => openEditForm(appt)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="ap-btn ap-btn--delete"
                      onClick={() => { setSelectedId(appt.id); setShowDeleteModal(true); }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="ap-overlay" onClick={() => setShowForm(false)}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header">
              <div className="ap-modal-title-wrap">
                <div className="ap-modal-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <h2 className="ap-modal-title">
                    {editingAppointment ? "Edit Appointment" : "New Appointment"}
                  </h2>
                  <p className="ap-modal-subtitle">
                    {editingAppointment ? "Update appointment details" : "Schedule a new appointment"}
                  </p>
                </div>
              </div>
              <button className="ap-close-btn" onClick={() => setShowForm(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form className="ap-form" onSubmit={handleSubmit}>
              <div className="ap-form-row">
                <div className="ap-form-field">
                  <label className="ap-form-label">Patient *</label>
                  <select className="ap-form-select" name="patient_id" value={formData.patient_id} onChange={handleChange} required>
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.patientName}</option>
                    ))}
                  </select>
                </div>
                <div className="ap-form-field">
                  <label className="ap-form-label">Doctor Name *</label>
                  <input className="ap-form-input" type="text" name="doctor_name" placeholder="Dr. Name" value={formData.doctor_name} onChange={handleChange} required />
                </div>
              </div>

              <div className="ap-form-row">
                <div className="ap-form-field">
                  <label className="ap-form-label">Date *</label>
                  <input className="ap-form-input" type="date" name="appointment_date" value={formData.appointment_date} onChange={handleChange} required />
                </div>
                <div className="ap-form-field">
                  <label className="ap-form-label">Time *</label>
                  <input className="ap-form-input" type="time" name="appointment_time" value={formData.appointment_time} onChange={handleChange} required />
                </div>
              </div>

              <div className="ap-form-row">
                <div className="ap-form-field">
                  <label className="ap-form-label">Reason</label>
                  <input className="ap-form-input" type="text" name="reason" placeholder="Reason for visit" value={formData.reason} onChange={handleChange} />
                </div>
                <div className="ap-form-field">
                  <label className="ap-form-label">Status</label>
                  <select className="ap-form-select" name="status" value={formData.status} onChange={handleChange}>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="ap-form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {formError}
                </div>
              )}

              <div className="ap-form-actions">
                <button type="button" className="ap-form-btn ap-form-btn--cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="ap-form-btn ap-form-btn--save" disabled={formLoading}>
                  {formLoading ? <span className="ap-form-spinner" /> : (editingAppointment ? "Update" : "Schedule")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && (
        <div className="ap-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="ap-del-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-del-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="ap-del-title">Delete Appointment</h3>
            <p className="ap-del-text">Are you sure you want to delete this appointment? This cannot be undone.</p>
            <div className="ap-del-actions">
              <button className="ap-del-btn ap-del-btn--cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="ap-del-btn ap-del-btn--confirm" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;