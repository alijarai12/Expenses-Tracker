// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import SideNavbar from '../components/Navbar'; // Use SideNavbar instead of Navbar
import '../styles/dashboard.css';

const Dashboard = () => {
  
  return (
    <div className="dashboard-container">
      <SideNavbar />
      <div className="dashboard-content">
        
      </div>
    </div>
  );
};

export default Dashboard;
