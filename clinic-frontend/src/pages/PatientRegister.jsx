import React from "react";
import PatientForm from "../components/PatientForm";
import "../styles/PatientRegister.css";

const PatientRegister = () => {
  return (
    <div className="register-page">
      <div className="register-header">
        <div className="register-header-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </div>
        <div>
          <h1 className="register-title">Patient Registration</h1>
          <p className="register-subtitle">
            Register a new patient into the clinic system.
          </p>
        </div>
      </div>

      <div className="register-body">
        <PatientForm />
      </div>
    </div>
  );
};

export default PatientRegister;
