import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PatientList.css";

const PatientList = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

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

  const handleViewPatient = (id) => {
    navigate(`/patients/${id}`);
  };

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.trim().toLowerCase();

    // If search box is empty, show all
    if (!term) return true;

    return (
      patient.patientName.toLowerCase().includes(term) ||
      patient.contactNumber.includes(term) ||
      patient.id.toString() === term ||          // exact ID match
      patient.id.toString().includes(term)       // partial ID match
    );
  });


  return (
    <div className="patient-list-page">
      {/* Header */}
      <div className="patient-list-header">
        <h1 className="patient-list-title">Patient List</h1>
        <p className="patient-list-subtitle">
          Clinic staff can view and manage registered patients.
        </p>
      </div>

      {/* Search */}
      <div className="patient-search-box">
        <input
          type="text"
          placeholder="Search by ID, Name or Contact"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* States */}
      {loading && <div className="patient-list-state">Loading patients...</div>}
      {error && <div className="patient-list-error">{error}</div>}

      {!loading && !error && filteredPatients.length === 0 && (
        <div className="patient-list-state">No patients found</div>
      )}

      {/* Table */}
      {!loading && !error && filteredPatients.length > 0 && (
        <div className="patient-list-table-wrapper">
          <table className="patient-list-table">
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
                  <td>{patient.id}</td>
                  <td>{patient.patientName}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.contactNumber}</td>
                  <td className="patient-list-actions">
                    <button
                      className="patient-list-view-btn"
                      onClick={() => handleViewPatient(patient.id)}
                    >
                      View
                    </button>

                    <button
                      className="patient-list-delete-btn"
                      onClick={() => {
                        setSelectedPatientId(patient.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Patient</h3>
            <p>
              Are you sure you want to delete this patient?
              <br />
              <strong>This will also delete all treatments.</strong>
            </p>

            <div className="modal-actions">
              <button
                className="modal-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-delete-btn"
                onClick={confirmDeletePatient}
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

export default PatientList;
