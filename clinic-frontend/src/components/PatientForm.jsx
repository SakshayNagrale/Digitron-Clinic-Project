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

    // Allow only digits for contact number
    if (name === "contactNumber" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
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
    <div className="patient-form-container">
      <form className="patient-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient Name</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            maxLength="10"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        <button className="submit-btn" type="submit">
          Register Patient
        </button>
      </form>

      {success && (
        <div className="success-message">Patient registered successfully</div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default PatientForm;
