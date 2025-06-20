import React, { useState } from 'react';
import HelpLogo from "./assets/HELPLOGO.svg";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

     
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
console.log("Token being sent:", token);

      console.log("User logged in:", user);
console.log("Redirecting to dashboard:", user.role);


      // Redirect based on role
      switch (user.role) {
        case "staff":
          navigate("/staff-dashboard");
          break;
        case "it":
          navigate("/it-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "superAdmin":
          navigate("/super-admin-dashboard");
          break;
        default:
          navigate("/");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <section id="loginsection">
      <div className="container">
        <div className="top">
          <img src={HelpLogo} alt="Logo" className='help-logo' />
        </div>
        <form onSubmit={handleLogin}>
          <h1 className='login'>Log In</h1>

          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

          <div className="emaildiv div">
            <p className='login-text'>Email Address</p>
            <div className="email-logo input-logo">
              <input 
                type="email" 
                name="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              {/* email icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="0.7" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
              </svg>
            </div>
          </div>

          <div className="passworddiv div">
            <p className='login-text'>Password</p>
            <div className="password-logo input-logo" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* password lock icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="0.7" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3" />
              </svg>

              {/* password toggle icon */}
              <div onClick={togglePassword} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </div>

          <button type="submit" className='login-button submit'>Log In</button>
          <p className='no-account account'>Don't have an account? <Link to="/signup" className='link'>Sign up</Link> </p>
        </form>
      </div>
    </section>
  );
};
