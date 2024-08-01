// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import SideNavbar from '../components/Navbar';
import api from '../api';
import '../styles/profile.css'; // Adjust the path if needed

const Profile = () => {
    const [user, setUser] = useState({
      username: '',
      email: ''
    });
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const tokenString = localStorage.getItem('token');
          if (!tokenString) {
            setError('No token found. Please log in again.');
            return;
          }
          const token = JSON.parse(tokenString);
          const response = await api.get('user/profile/', {
            headers: {
              'Authorization': `Bearer ${token.access}`,
            },
          });
          setUser(response.data.data); // Use 'data' from the response object
        } catch (error) {
          console.error('Error fetching profile:', error);
          setError(error.response?.data?.detail || 'Failed to fetch profile.'); // Extract detail from error
        }
      };
  
      fetchUserProfile();
    }, []);
  
    const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const tokenString = localStorage.getItem('token');
        if (!tokenString) {
          setError('No token found. Please log in again.');
          return;
        }
        const token = JSON.parse(tokenString);
  
        await api.put('user/profile/update/', user, {
          headers: {
            'Authorization': `Bearer ${token.access}`,
          },
        });
  
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error.response ? error.response.data : error.message);
        setError(error.response?.data?.detail || 'Failed to update profile.'); // Extract detail from error
      }
    };
  
    return (
      <div className="profile-container">
        <SideNavbar />
        <div className="profile-content">
          <h2>User Profile</h2>
          {error && <p className="error-message">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group form-buttons">
              <button type="submit" className="submit-button">Update Profile</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
export default Profile;
