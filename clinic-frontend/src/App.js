import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import StaffDashboard from "./pages/StaffDashboard";
import PatientRegister from "./pages/PatientRegister";
import PatientList from "./pages/PatientList";
import PatientProfile from "./pages/PatientProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Layout wrapper */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<StaffDashboard />} />
          <Route path="/add-patient" element={<PatientRegister />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
