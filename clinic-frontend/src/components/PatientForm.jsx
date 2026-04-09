import React, { useState } from "react";
import "../styles/PatientForm.css";

const PatientForm = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    contactNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNumber" && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    if (formData.patientName.trim().length < 3)
      return "Patient name must be at least 3 characters";
    if (formData.age <= 0 || formData.age > 120) return "Enter a valid age";
    if (formData.contactNumber.length !== 10)
      return "Contact number must be exactly 10 digits";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/add-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setFormData({
        patientName: "",
        age: "",
        gender: "",
        contactNumber: "",
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="pf-card">
      <form className="pf-form" onSubmit={handleSubmit}>
        <div className="pf-row">
          <div className="pf-field">
            <label className="pf-label">
              <svg className="pf-label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Patient Name
            </label>
            <input
              className="pf-input"
              type="text"
              name="patientName"
              placeholder="Enter full name"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pf-field">
            <label className="pf-label">
              <svg className="pf-label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Age
            </label>
            <input
              className="pf-input"
              type="number"
              name="age"
              placeholder="e.g. 32"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="pf-row">
          <div className="pf-field">
            <label className="pf-label">Gender</label>
            <select
              className="pf-select"
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

          <div className="pf-field">
            <label className="pf-label">
              <svg className="pf-label-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Contact Number
            </label>
            <input
              className="pf-input"
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

        <button className="pf-submit" type="submit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          Register Patient
        </button>
      </form>

      {success && (
        <div className="pf-toast pf-toast--success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Patient registered successfully
        </div>
      )}

      {error && (
        <div className="pf-toast pf-toast--error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default PatientForm;
