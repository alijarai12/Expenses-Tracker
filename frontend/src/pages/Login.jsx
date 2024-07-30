// src/pages/Login.jsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/login.css';
import api from '../api';

const Login = () => {
    const [formDetails, setFormDetails] = useState({
      username: '',
      password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const inputChange = (e) => {
      const { name, value } = e.target;
      setFormDetails({
        ...formDetails,
        [name]: value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await api.post('user/login/', {
            username: formDetails.username,
            password: formDetails.password
        });

        // Store the entire token object
        localStorage.setItem('token', JSON.stringify(response.data.token));
        console.log('Token stored:', localStorage.getItem('token')); // Add this line


        console.log('Login successful:', response.data);
        navigate('/');
      } catch (error) {
        console.error('There was a problem with the login:', error);
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error.non_field_errors[0]);
        } else {
          setError('Login failed. Please try again.');
        }
      }
    };
  
    return (
      <div>
        <Navbar />
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="username"
                name="username"
                value={formDetails.username}
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
            {error && <p className="error">{error}</p>}
            <button type="submit">Login</button>
          </form>
  
          <p>
            Don't have an account?{' '}
            <NavLink className="register-link" to="/register">
              Register
            </NavLink>
          </p>
        </div>
      </div>
    );
  };
  
  export default Login;