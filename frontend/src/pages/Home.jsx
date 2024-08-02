import React from 'react';
import SideNavbar from '../components/Navbar';
import '../styles/home.css';

const Home = () => {
  
  return (
    <div className="home-container">
      <SideNavbar />
      <div className="home-content">
        <header className="hero-section">
          <h1>Welcome to Expense Tracker</h1>
          <p>Your personal finance management tool</p>
        </header>
        <section className="features-section">
          <div className="feature">
            <i className="fas fa-chart-line"></i>
            <h2>Track Expenses</h2>
            <p>Monitor your spending and manage your budget effectively.</p>
          </div>
          <div className="feature">
            <i className="fas fa-wallet"></i>
            <h2>Manage Budgets</h2>
            <p>Set and stick to your financial goals with our budgeting tools.</p>
          </div>
          <div className="feature">
            <i className="fas fa-shield-alt"></i>
            <h2>Secure</h2>
            <p>Your data is safe with us. We prioritize your privacy and security.</p>
          </div>
        </section>
        <section className="stats-section">
          <div className="stat">
            <h3>500+</h3>
            <p>Happy Users</p>
          </div>
          <div className="stat">
            <h3>1000+</h3>
            <p>Expenses Tracked</p>
          </div>
          <div className="stat">
            <h3>200+</h3>
            <p>Budgets Managed</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
