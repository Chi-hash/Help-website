import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { SiginupPage } from './SiginupPage';
import { SuperAdminDashboard } from "./Components/Superadmin/SuperAdminDashboard";
import { StaffDashboard } from "./Components/Staff/StaffDashboard";
import { ItDashboard } from './Components/ItStaff/ItDashboard';
import { AdminDashboard } from './Components/Admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SiginupPage />} />
        <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/it-dashboard" element={<ItDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
