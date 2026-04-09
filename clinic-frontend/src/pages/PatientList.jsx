import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditPatient from "../components/EditPatient";
import "../styles/PatientList.css";

const PatientList = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatients(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletePatient = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/delete-patient/${selectedPatientId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Delete failed");
      setShowDeleteModal(false);
      setSelectedPatientId(null);
      fetchPatients();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditSuccess = () => {
    fetchPatients();
    setSuccessMsg("Patient updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleViewPatient = (id) => navigate(`/patients/${id}`);

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      patient.patientName.toLowerCase().includes(term) ||
      patient.contactNumber.includes(term) ||
      patient.id.toString() === term ||
      patient.id.toString().includes(term)
    );
  });

  return (
    <div className="pl-page">
      {/* Header */}
      <div className="pl-header">
        <div className="pl-header-left">
          <h1 className="pl-title">Patients</h1>
          <p className="pl-subtitle">
            {filteredPatients.length} {filteredPatients.length === 1 ? "record" : "records"} found
          </p>
        </div>
        <div className="pl-search">
          <svg className="pl-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="pl-search-input"
            type="text"
            placeholder="Search by ID, name or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div className="pl-toast-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {successMsg}
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="pl-empty-state">
          <div className="pl-spinner"></div>
          <span>Loading patients...</span>
        </div>
      )}

      {error && (
        <div className="pl-error-state">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && filteredPatients.length === 0 && (
        <div className="pl-empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          <span>No patients found</span>
        </div>
      )}

      {/* Table */}
      {!loading && !error && filteredPatients.length > 0 && (
        <div className="pl-table-card">
          <table className="pl-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="pl-cell-id">#{patient.id}</td>
                  <td className="pl-cell-name">
                    <div className="pl-name-avatar">
                      {patient.patientName.charAt(0).toUpperCase()}
                    </div>
                    {patient.patientName}
                  </td>
                  <td>{patient.age}</td>
                  <td>
                    <span className={`pl-gender-badge pl-gender-badge--${patient.gender.toLowerCase()}`}>
                      {patient.gender}
                    </span>
                  </td>
                  <td className="pl-cell-contact">{patient.contactNumber}</td>
                  <td className="pl-cell-actions">
                    <button className="pl-btn pl-btn--view" onClick={() => handleViewPatient(patient.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      View
                    </button>
                    {/* ✅ NEW Edit button */}
                    <button className="pl-btn pl-btn--edit" onClick={() => setEditingPatient(patient)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="pl-btn pl-btn--delete"
                      onClick={() => { setSelectedPatientId(patient.id); setShowDeleteModal(true); }}
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

      {/* Edit Modal */}
      {editingPatient && (
        <EditPatient
          patient={editingPatient}
          onClose={() => setEditingPatient(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="pl-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="pl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pl-modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="pl-modal-title">Delete Patient</h3>
            <p className="pl-modal-text">
              Are you sure? This will permanently delete the patient and <strong>all associated treatment records</strong>.
            </p>
            <div className="pl-modal-actions">
              <button className="pl-modal-btn pl-modal-btn--cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="pl-modal-btn pl-modal-btn--delete" onClick={confirmDeletePatient}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;