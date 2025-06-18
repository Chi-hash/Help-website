import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { SiginupPage } from './SiginupPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />}></Route>
                <Route path = "/signup" element = {<SiginupPage/>}></Route>
            </Routes>
        </Router>
    )
}


export default App;