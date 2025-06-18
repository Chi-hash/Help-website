import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { SiginupPage } from './SiginupPage';
import {SuperAdminDashboard} from "../src/Components/Superadmin/SuperAdminDashboard"
import {StaffDashboard} from "./Components/Staff/StaffDashboard"
import { ItDashboard } from './Components/ItStaff/ItDashboard';
import { AdminDashboard } from './Components/Admin/AdminDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />}></Route>
                <Route path = "/signup" element = {<SiginupPage/>}></Route>
                <Route path='/super-admin-dashboard' element = {<SuperAdminDashboard/>}></Route>
                <Route path='/admin-dashboard' element = {<AdminDashboard/>}></Route>
                <Route path='/it-dashboard' element = {<ItDashboard/>}></Route>
                <Route path='/staff-dashboard' element = {<StaffDashboard/>}></Route>
            </Routes>
        </Router>
    )
}


export default App;