import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { SiginupPage } from './SiginupPage';
import {SuperAdminDashboard} from "../src/Components/Superadmin/SuperAdminDashboard"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />}></Route>
                <Route path = "/signup" element = {<SiginupPage/>}></Route>
                <Route path='/superAdmin-Dashboard' element = {<SuperAdminDashboard/>}></Route>
            </Routes>
        </Router>
    )
}


export default App;