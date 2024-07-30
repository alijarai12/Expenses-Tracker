// src/pages/Register.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/register.css';
import api from '../api';

const Register = () => {
    const [formDetails, setFormDetails] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formDetails.password !== formDetails.password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('user/register/', {
        username: formDetails.username,
        email: formDetails.email,
        password: formDetails.password,
        password2: formDetails.password2
      });
      console.log('Registration successful:', response.data);
      navigate('/login');
    } catch (error) {
        console.error('There was a problem with the registration:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : 'Registration failed. Please try again.');
    }
  };



  return (
    <div>
      <Navbar />
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
                type="text"
                name="username"
                value={formDetails.username}
                onChange={inputChange}
                required
                />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={formDetails.email}
                onChange={inputChange}
                required
                />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
                type="password"
                name="password"
                value={formDetails.password}
                onChange={inputChange}
                required
                />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
                type="password"
                name="password2"
                value={formDetails.password2}
                onChange={inputChange}
                required
                />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Register</button>
        </form>

        <p>
          Already a user?{" "}
          <NavLink
            className="login-link"
            to={"/login"}
          >
            Log in
          </NavLink>
        </p>

      </div>
    </div>
  );
};

export default Register;
