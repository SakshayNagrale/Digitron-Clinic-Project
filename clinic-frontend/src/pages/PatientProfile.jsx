import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "../styles/PatientProfile.css";

const PatientProfile = () => {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    diagnosis: "",
    medicines: "",
    notes: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState(null);

  const fetchPatient = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/patients/${id}`);
      const data = await response.json();
      setPatient(data);
    } catch (error) {
      console.error("Error fetching patient:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchTreatments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/treatments/${id}`);
      const data = await response.json();
      setTreatments(data);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
    fetchTreatments();
  }, [fetchPatient, fetchTreatments]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTreatment = async (e) => {
    e.preventDefault();
    if (!formData.diagnosis.trim()) {
      alert("Diagnosis is required");
      return;
    }
    try {
      await fetch("http://localhost:5000/add-treatment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: id,
          diagnosis: formData.diagnosis,
          medicines: formData.medicines,
          notes: formData.notes,
        }),
      });
      setFormData({ diagnosis: "", medicines: "", notes: "" });
      fetchTreatments();
    } catch (error) {
      console.error("Error adding treatment:", error);
    }
  };

  const openDeleteModal = (treatmentId) => {
    setSelectedTreatmentId(treatmentId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setSelectedTreatmentId(null);
    setShowDeleteModal(false);
  };

  const confirmDeleteTreatment = async () => {
    try {
      await fetch(
        `http://localhost:5000/delete-treatment/${selectedTreatmentId}`,
        { method: "DELETE" }
      );
      fetchTreatments();
    } catch (error) {
      console.error("Error deleting treatment:", error);
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) {
    return (
      <div className="pp-page">
        <div className="pp-loading">
          <div className="pp-spinner"></div>
          <span>Loading patient profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pp-page">
      {/* Header */}
      <div className="pp-header">
        <h1 className="pp-title">Patient Profile</h1>
        <p className="pp-subtitle">Patient details and treatment history</p>
      </div>

      {/* Patient Info Card */}
      {patient && (
        <div className="pp-info-card">
          <div className="pp-info-top">
            <div className="pp-info-avatar">
              {patient.patientName.charAt(0).toUpperCase()}
            </div>
            <div className="pp-info-meta">
              <h2 className="pp-info-name">{patient.patientName}</h2>
              <span className="pp-info-id">Patient #{patient.id}</span>
            </div>
          </div>
          <div className="pp-info-grid">
            <div className="pp-info-item">
              <span className="pp-info-label">Age</span>
              <span className="pp-info-value">{patient.age} years</span>
            </div>
            <div className="pp-info-item">
              <span className="pp-info-label">Gender</span>
              <span className="pp-info-value">{patient.gender}</span>
            </div>
            <div className="pp-info-item">
              <span className="pp-info-label">Contact</span>
              <span className="pp-info-value">{patient.contactNumber}</span>
            </div>
            <div className="pp-info-item">
              <span className="pp-info-label">Treatments</span>
              <span className="pp-info-value">{treatments.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Two-column layout: Add Treatment + History */}
      <div className="pp-content-grid">
        {/* Add Treatment */}
        <div className="pp-treatment-form-card">
          <h3 className="pp-section-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Treatment
          </h3>
          <form className="pp-form" onSubmit={handleAddTreatment}>
            <div className="pp-form-field">
              <label className="pp-form-label">Diagnosis</label>
              <input
                className="pp-form-input"
                type="text"
                name="diagnosis"
                placeholder="Enter diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                required
              />
            </div>
            <div className="pp-form-field">
              <label className="pp-form-label">Medicines</label>
              <input
                className="pp-form-input"
                type="text"
                name="medicines"
                placeholder="Prescribed medicines"
                value={formData.medicines}
                onChange={handleChange}
              />
            </div>
            <div className="pp-form-field">
              <label className="pp-form-label">Notes</label>
              <textarea
                className="pp-form-textarea"
                name="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <button className="pp-form-submit" type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Treatment
            </button>
          </form>
        </div>

        {/* Treatment History */}
        <div className="pp-history-card">
          <h3 className="pp-section-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Treatment History
            <span className="pp-history-count">{treatments.length}</span>
          </h3>

          {treatments.length === 0 ? (
            <div className="pp-history-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>No treatment records yet</span>
            </div>
          ) : (
            <div className="pp-history-list">
              {treatments.map((t) => (
                <div key={t.id} className="pp-treatment-item">
                  <div className="pp-treatment-top">
                    <span className="pp-treatment-date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {t.date}
                    </span>
                    <button
                      className="pp-treatment-delete"
                      onClick={() => openDeleteModal(t.id)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                  <div className="pp-treatment-body">
                    <div className="pp-treatment-row">
                      <span className="pp-treatment-label">Diagnosis</span>
                      <span className="pp-treatment-value">{t.diagnosis}</span>
                    </div>
                    <div className="pp-treatment-row">
                      <span className="pp-treatment-label">Medicines</span>
                      <span className="pp-treatment-value">{t.medicines || "--"}</span>
                    </div>
                    {t.notes && (
                      <div className="pp-treatment-row">
                        <span className="pp-treatment-label">Notes</span>
                        <span className="pp-treatment-value pp-treatment-notes">{t.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="pp-modal-overlay" onClick={closeDeleteModal}>
          <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pp-modal-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3 className="pp-modal-title">Delete Treatment</h3>
            <p className="pp-modal-text">
              Are you sure you want to delete this treatment record? This action cannot be undone.
            </p>
            <div className="pp-modal-actions">
              <button className="pp-modal-btn pp-modal-btn--cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="pp-modal-btn pp-modal-btn--delete" onClick={confirmDeleteTreatment}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;
