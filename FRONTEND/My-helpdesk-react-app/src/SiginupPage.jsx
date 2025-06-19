import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HelpLogo from "./assets/HELPLOGO.svg";
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from 'react';


export const SiginupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    department: '',
    password: '',
    confirmpassword: ''
  });

  const [error, setError] = useState('');

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    if (formData.password) {
      validatePassword(formData.password);
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      validatePassword(value);
      setPasswordMatch(value === formData.confirmpassword);
    }

    if (name === "confirmpassword") {
      setPasswordMatch(value === formData.password);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };



  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 12,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidations(validations);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmpassword) {
      return setError('Passwords do not match');
    }

    const allValid = Object.values(passwordValidations).every(Boolean);
    if (!allValid) {
      return setError("Password doesn't meet all requirements");
    }

    try {
      const res = await axios.post('http://localhost:3000/api/auth/signup', formData);
      if (res.status === 201) {
        alert("Signup successful");
        navigate("/verify-notice");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };


  const [passwordMatch, setPasswordMatch] = useState(null); // null = untouched, true = match, false = no match
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  return (
    <>
      <section id="signupsection">
        <div className="container">
          <div className="top">
            <img src={HelpLogo} alt="" className='help-logo' />
          </div>
          <form onSubmit={handleSubmit}>
            <h1>Sign up</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="form-container">
              <div className="row-one row">
                <div className="firstname-div div ">
                  <p>First Name</p>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    className='diff'
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="lastname-div div ">
                  <p>Last Name</p>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    className='diff'
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row-two row">
                <div className="emailaddress-div div">
                  <p>Email Address</p>
                  <div className=" email-logo input-logo test">
                    <input
                      type="email"
                      name="email"
                      id="emailaddress"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="0.7" className="bi bi-envelope-at" viewBox="0 0 16 16">
                      <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
                      <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
                    </svg>
                  </div>
                </div>

                <div className="department-div div">
                  <p>Department</p>
                  <div className="department-logo input-logo test">
                    <input
                      type="text"
                      name="department"
                      id="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="0.7" className="bi bi-building" viewBox="0 0 16 16">
                      <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                      <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="row-three row">
                <div className="password-div div">
                  <p>Password</p>
                  <div className="password-logo input-logo test">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      style={{ cursor: "pointer", marginLeft: "8px" }}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </span>

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="0.7" className="bi bi-lock" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3" />
                    </svg>
                  </div>
                </div>

                <div className="confirmpassword-div div">
                  <p>Confirm Password</p>
                  <div className="confirmpassword-logo input-logo test">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmpassword"
                      id="confirmpassword"
                      value={formData.confirmpassword}
                      onChange={handleChange}
                      required
                    />
                    <span
                      style={{ cursor: "pointer", marginLeft: "8px" }}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </span>

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="0.7" className="bi bi-lock" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3" />
                    </svg>
                  </div>
                  {passwordMatch === false && (
                    <p style={{ color: 'red', fontSize: '0.9rem', marginTop: '5px' }}>
                      Passwords do not match
                    </p>
                  )}
                  {passwordMatch === true && (
                    <p style={{ color: 'green', fontSize: '0.9rem', marginTop: '5px' }}>
                      Passwords match
                    </p>
                  )}

                  <ul className="password-rules">
                    <li style={{ display: passwordValidations.length ? "none" : "block" }} className='password-warning'>
                      Minimum 12 characters
                    </li>
                    <li style={{ display: passwordValidations.upper ? "none" : "block" }} className='password-warning'>
                      At least one uppercase letter
                    </li>
                    <li style={{ display: passwordValidations.lower ? "none" : "block" }} className='password-warning'>
                      At least one lowercase letter
                    </li>
                    <li style={{ display: passwordValidations.number ? "none" : "block" }} className='password-warning'>
                      At least one number
                    </li>
                    <li style={{ display: passwordValidations.special ? "none" : "block" }} className='password-warning'>
                      At least one special character
                    </li>
                  </ul>

                </div>
              </div>

              <button
                className='submit signupbutton'
                disabled={!Object.values(passwordValidations).every(Boolean) || !passwordMatch}
              >
                Sign Up
              </button>

              <p className='no-account account'>Already have an account? <Link to="/" className='link'>Log in</Link> </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
