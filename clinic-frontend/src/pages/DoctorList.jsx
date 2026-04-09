import React, { useEffect, useState } from "react";
import "../styles/DoctorList.css";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    contact: "",
    available: 1,
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/doctors");
      if (!res.ok) throw new Error("Failed to fetch doctors");
      const data = await res.json();
      setDoctors(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const openAddForm = () => {
    setEditingDoctor(null);
    setFormData({ name: "", specialization: "", contact: "", available: 1 });
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      name: doc.name,
      specialization: doc.specialization,
      contact: doc.contact,
      available: doc.available,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact" && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setFormError("");
  };

  const validate = () => {
    if (formData.name.trim().length < 3) return "Doctor name must be at least 3 characters";
    if (formData.specialization.trim().length < 2) return "Specialization is required";
    if (formData.contact.length !== 10) return "Contact number must be exactly 10 digits";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const err = validate();
    if (err) { setFormError(err); return; }

    setFormLoading(true);
    try {
      const url = editingDoctor
        ? `http://localhost:5000/edit-doctor/${editingDoctor.id}`
        : "http://localhost:5000/add-doctor";
      const method = editingDoctor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");

      setShowForm(false);
      fetchDoctors();
      showSuccess(editingDoctor ? "Doctor updated successfully!" : "Doctor added successfully!");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:5000/delete-doctor/${selectedId}`, {
        method: "DELETE",
      });
      setShowDeleteModal(false);
      setSelectedId(null);
      fetchDoctors();
      showSuccess("Doctor deleted.");
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = doctors.filter((doc) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      doc.name.toLowerCase().includes(term) ||
      doc.specialization.toLowerCase().includes(term) ||
      doc.contact.includes(term)
    );
  });

  return (
    <div className="dl-page">
      {/* Header */}
      <div className="dl-header">
        <div className="dl-header-left">
          <h1 className="dl-title">Doctors</h1>
          <p className="dl-subtitle">
            {filtered.length} {filtered.length === 1 ? "doctor" : "doctors"} found
          </p>
        </div>
        <div className="dl-header-right">
          <div className="dl-search">
            <svg className="dl-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="dl-search-input"
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="dl-add-btn" onClick={openAddForm}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Doctor
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="dl-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="dl-empty-state">
          <div className="dl-spinner" />
          <span>Loading doctors...</span>
        </div>
      )}

      {error && (
        <div className="dl-error-state">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="dl-empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>No doctors found</span>
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="dl-table-card">
          <table className="dl-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td className="dl-cell-id">#{doc.id}</td>
                  <td className="dl-cell-name">
                    <div className="dl-name-avatar">
                      {doc.name.charAt(0).toUpperCase()}
                    </div>
                    {doc.name}
                  </td>
                  <td>
                    <span className="dl-spec-badge">{doc.specialization}</span>
                  </td>
                  <td className="dl-cell-contact">{doc.contact}</td>
                  <td>
                    <span className={`dl-status-badge ${doc.available ? "dl-status-badge--available" : "dl-status-badge--unavailable"}`}>
                      {doc.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="dl-cell-actions">
                    <button className="dl-btn dl-btn--edit" onClick={() => openEditForm(doc)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="dl-btn dl-btn--delete"
                      onClick={() => { setSelectedId(doc.id); setShowDeleteModal(true); }}
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
        <div className="dl-overlay" onClick={() => setShowForm(false)}>
          <div className="dl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dl-modal-header">
              <div className="dl-modal-title-wrap">
                <div className="dl-modal-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h2 className="dl-modal-title">{editingDoctor ? "Edit Doctor" : "Add Doctor"}</h2>
                  <p className="dl-modal-subtitle">
                    {editingDoctor ? `Update details for Dr. ${editingDoctor.name}` : "Add a new doctor to the system"}
                  </p>
                </div>
              </div>
              <button className="dl-close-btn" onClick={() => setShowForm(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form className="dl-form" onSubmit={handleSubmit}>
              <div className="dl-form-row">
                <div className="dl-form-field">
                  <label className="dl-form-label">Doctor Name *</label>
                  <input
                    className="dl-form-input"
                    type="text"
                    name="name"
                    placeholder="e.g. Dr. Rajan Mehta"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="dl-form-field">
                  <label className="dl-form-label">Specialization *</label>
                  <input
                    className="dl-form-input"
                    type="text"
                    name="specialization"
                    placeholder="e.g. Cardiologist"
                    value={formData.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="dl-form-row">
                <div className="dl-form-field">
                  <label className="dl-form-label">Contact Number *</label>
                  <input
                    className="dl-form-input"
                    type="text"
                    name="contact"
                    maxLength="10"
                    placeholder="10-digit number"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="dl-form-field">
                  <label className="dl-form-label">Availability</label>
                  <select
                    className="dl-form-select"
                    name="available"
                    value={formData.available}
                    onChange={handleChange}
                  >
                    <option value={1}>Available</option>
                    <option value={0}>Unavailable</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="dl-form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {formError}
                </div>
              )}

              <div className="dl-form-actions">
                <button type="button" className="dl-form-btn dl-form-btn--cancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="dl-form-btn dl-form-btn--save" disabled={formLoading}>
                  {formLoading ? (
                    <span className="dl-form-spinner" />
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      {editingDoctor ? "Save Changes" : "Add Doctor"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="dl-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="dl-del-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dl-del-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="dl-del-title">Delete Doctor</h3>
            <p className="dl-del-text">
              Are you sure you want to delete this doctor? This action cannot be undone.
            </p>
            <div className="dl-del-actions">
              <button className="dl-del-btn dl-del-btn--cancel" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="dl-del-btn dl-del-btn--confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;