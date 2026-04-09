import React, { useState, useEffect } from "react";
import "../styles/EditPatient.css";

const EditPatient = ({ patient, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    contactNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        patientName: patient.patientName || "",
        age: patient.age || "",
        gender: patient.gender || "",
        contactNumber: patient.contactNumber || "",
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNumber" && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const validate = () => {
    if (formData.patientName.trim().length < 3)
      return "Patient name must be at least 3 characters";
    if (formData.age <= 0 || formData.age > 120)
      return "Enter a valid age";
    if (formData.contactNumber.length !== 10)
      return "Contact number must be exactly 10 digits";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/edit-patient/${patient.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ep-overlay" onClick={onClose}>
      <div className="ep-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ep-modal-header">
          <div className="ep-modal-title-wrap">
            <div className="ep-modal-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div>
              <h2 className="ep-modal-title">Edit Patient</h2>
              <p className="ep-modal-subtitle">Update details for Patient #{patient?.id}</p>
            </div>
          </div>
          <button className="ep-close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form className="ep-form" onSubmit={handleSubmit}>
          <div className="ep-row">
            <div className="ep-field">
              <label className="ep-label">
                <svg className="ep-label-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Patient Name
              </label>
              <input
                className="ep-input"
                type="text"
                name="patientName"
                placeholder="Enter full name"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="ep-field">
              <label className="ep-label">
                <svg className="ep-label-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Age
              </label>
              <input
                className="ep-input"
                type="number"
                name="age"
                placeholder="e.g. 32"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="ep-row">
            <div className="ep-field">
              <label className="ep-label">Gender</label>
              <select
                className="ep-select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="ep-field">
              <label className="ep-label">
                <svg className="ep-label-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Contact Number
              </label>
              <input
                className="ep-input"
                type="text"
                name="contactNumber"
                maxLength="10"
                placeholder="10-digit number"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && (
            <div className="ep-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <div className="ep-actions">
            <button type="button" className="ep-btn ep-btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="ep-btn ep-btn--save" disabled={loading}>
              {loading ? (
                <span className="ep-spinner" />
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatient;