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

  // 🔴 Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState(null);

  // ================================
  // Fetch Patient Details
  // ================================
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

  // ================================
  // Fetch Treatment History
  // ================================
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

  // ================================
  // Form handling
  // ================================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================================
  // Add Treatment
  // ================================
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

  // ================================
  // Delete Treatment (Modal)
  // ================================
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

  // ================================
  // Loading
  // ================================
  if (loading) {
    return (
      <div className="patient-profile-page">
        <h1 className="patient-profile-title">Loading...</h1>
      </div>
    );
  }

  // ================================
  // UI
  // ================================
  return (
    <div className="patient-profile-page">
      {/* Header */}
      <div className="patient-profile-header">
        <h1>Patient Profile</h1>
        <p>Patient details and treatment history</p>
      </div>

      {/* Patient Info */}
      {patient && (
        <div className="patient-info-card">
          <h2>Patient Information</h2>
          <div className="patient-info-grid">
            <div><strong>Name:</strong> {patient.patientName}</div>
            <div><strong>Age:</strong> {patient.age}</div>
            <div><strong>Gender:</strong> {patient.gender}</div>
            <div><strong>Contact:</strong> {patient.contactNumber}</div>
          </div>
        </div>
      )}

      {/* Add Treatment */}
      <div className="treatment-card">
        <h2>Add Treatment</h2>
        <form className="treatment-form" onSubmit={handleAddTreatment}>
          <input
            type="text"
            name="diagnosis"
            placeholder="Diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="medicines"
            placeholder="Medicines"
            value={formData.medicines}
            onChange={handleChange}
          />
          <textarea
            name="notes"
            placeholder="Doctor notes"
            value={formData.notes}
            onChange={handleChange}
          />
          <button type="submit">Add Treatment</button>
        </form>
      </div>

      {/* Treatment History */}
      <div className="treatment-history-card">
        <h2>Treatment History</h2>

        {treatments.length === 0 ? (
          <p className="empty-text">No treatment records found</p>
        ) : (
          treatments.map((t) => (
            <div key={t.id} className="treatment-item">
              <div className="treatment-item-header">
                <div className="treatment-date">Date: {t.date}</div>
                <button
                  className="delete-treatment-btn"
                  onClick={() => openDeleteModal(t.id)}
                >
                  Delete
                </button>
              </div>

              <div><strong>Diagnosis:</strong> {t.diagnosis}</div>
              <div><strong>Medicines:</strong> {t.medicines}</div>
              <div><strong>Notes:</strong> {t.notes}</div>
            </div>
          ))
        )}
      </div>

      {/* 🔴 Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Treatment</h3>
            <p>
              Are you sure you want to delete this treatment record?
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button
                className="modal-delete-btn"
                onClick={confirmDeleteTreatment}
              >
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
