import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import StaffDashboard from "./pages/StaffDashboard";
import PatientRegister from "./pages/PatientRegister";
import PatientList from "./pages/PatientList";
import PatientProfile from "./pages/PatientProfile";
import Appointments from "./pages/Appointments";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected - all inside Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="add-patient" element={<PatientRegister />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;