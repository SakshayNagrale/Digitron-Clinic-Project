// ================= LIBRARIES =================
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ================= LAYOUT =================
import Layout from "./components/Layout";

// ================= PAGES =================
import StaffDashboard from "./pages/StaffDashboard";
import PatientRegister from "./pages/PatientRegister";
import PatientList from "./pages/PatientList";
import PatientProfile from "./pages/PatientProfile";
import EditPatient from "./pages/EditPatient";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";

// ================= APP =================
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Layout Wrapper (Protected Area in future) */}
        <Route element={<Layout />}>

          {/* Dashboard */}
          <Route path="/dashboard" element={<StaffDashboard />} />

          {/* Patient Routes */}
          <Route path="/add-patient" element={<PatientRegister />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
          <Route path="/edit-patient/:id" element={<EditPatient />} />

          {/* Appointments */}
          <Route path="/appointments" element={<Appointments />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;