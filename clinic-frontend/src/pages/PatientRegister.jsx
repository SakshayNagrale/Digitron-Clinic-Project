import React from "react";
import PatientForm from "../components/PatientForm";
import "../styles/PatientRegister.css";

const PatientRegister = () => {
  return (
    <div className="patient-register-container">
      <div className="page-header">
        <h1 className="page-title">Patient Registration</h1>
        <p className="page-description">
          Clinic staff can register new patients using this form.
        </p>
      </div>

      <div className="form-wrapper">
        <PatientForm />
      </div>
    </div>
  );
};

export default PatientRegister;
