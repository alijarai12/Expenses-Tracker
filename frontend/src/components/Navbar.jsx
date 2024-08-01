import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/sidenavbar.css';

const SideNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="sidenavbar">
      <h1 className="sidenavbar-logo">ExpenseTracker</h1>
      <ul className="sidenavbar-links">
        <li>
          <Link to="/" className="sidenavbar-link">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
        </li>
        {isLoggedIn && (
          <>
            <li>
              <Link to="/expenses" className="sidenavbar-link">
                <i className="fas fa-money-bill-wave"></i>
                <span>Expenses</span>
              </Link>
            </li>
            <li>
              <Link to="/category" className="sidenavbar-link">
                <i className="fas fa-list"></i>
                <span>Category</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="sidenavbar-link">
                <i className="fas fa-list"></i>
                <span>Profile</span>
              </Link>
            </li>
          </>
        )}
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/login" className="sidenavbar-link">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
            </li>
            <li>
              <Link to="/register" className="sidenavbar-link">
                <i className="fas fa-user-plus"></i>
                <span>Register</span>
              </Link>
            </li>
          </>
        ) : (
          <li>
            <button className="sidenavbar-link btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default SideNavbar;
