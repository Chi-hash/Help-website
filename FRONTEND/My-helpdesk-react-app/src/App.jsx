import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { SiginupPage } from './SiginupPage';
import { SuperAdminDashboard } from "./Components/Superadmin/SuperAdminDashboard";
import { StaffDashboard } from "./Components/Staff/StaffDashboard";
import { ItDashboard } from './Components/ItStaff/ItDashboard';
import { AdminDashboard } from './Components/Admin/AdminDashboard';
import { ManageAdmins } from './Components/Superadmin/ManageAdmins';
import {ManageUsers} from './Components/Superadmin/ManageUsers'
import { MyTickets } from './Components/Superadmin/MyTickets';
import { AllTickets } from './Components/Superadmin/AllTickets';
import { TicketNotes } from './Components/Superadmin/TicketNotes';

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
        <Route path='/manage-admins' element = {<ManageAdmins/>}></Route>
        <Route path='/manage-users' element = {<ManageUsers/>}></Route>
        <Route Path = "/manage-tickets/my-tickets" element = {<MyTickets/>}></Route>
        <Route path='/manage-tickets/all-tickets' element = {<AllTickets/>}></Route>
        <Route path='/manage-tickets/ticket-notes' element = {<TicketNotes/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
