// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import SideNavbar from '../components/Navbar'; // Use SideNavbar instead of Navbar
import '../styles/home.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="home-container">
      <SideNavbar />
      <div className="home-content">
        <h1>Welcome to MyApp</h1>
        <h2>Your one-stop solution for managing your activities</h2>
        {isLoggedIn ? (
          <p className="welcome-message">You are logged in!</p>
        ) : (
          <p className="welcome-message">Please log in to access more features</p>
        )}
      </div>
    </div>
  );
};

export default Home;
