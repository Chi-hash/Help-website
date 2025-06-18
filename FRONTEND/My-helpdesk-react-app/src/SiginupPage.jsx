import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HelpLogo from './assets/HELPLOGO.svg';

export const SiginupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
    department: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/auth/signup', {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        department: formData.department,
      });

      alert('Signup successful!');
      navigate('/');
    } catch (error) {
      console.error(error.response?.data?.message || 'Signup failed');
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <section id="signupsection">
      <div className="container">
        <div className="top">
          <img src={HelpLogo} alt="" className="help-logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Sign up</h1>
          <div className="form-container">
            <div className="row-one row">
              <div className="firstname-div div">
                <p>First Name</p>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="diff"
                  required
                />
              </div>
              <div className="lastname-div div">
                <p>Last Name</p>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="diff"
                  required
                />
              </div>
            </div>

            <div className="row-two row">
              <div className="emailaddress-div div">
                <p>Email Address</p>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="department-div div">
                <p>Department</p>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row-three row">
              <div className="password-div div">
                <p>Password</p>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="confirmpassword-div div">
                <p>Confirm Password</p>
                <input
                  type="password"
                  name="confirmpassword"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit signupbutton">
              Sign Up
            </button>
            <p className="no-account account">
              Already have an account? <Link to="/">Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
