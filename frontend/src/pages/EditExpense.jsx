// src/pages/EditExpense.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import SideNavbar from '../components/Navbar';
import '../styles/editExpense.css';

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState({
    amount: '',
    date: '',
    category: '',
    description: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const tokenString = localStorage.getItem('token');
        const token = JSON.parse(tokenString);
        const response = await api.get(`api/expenses/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token.access}`,
          },
        });
        setExpense(response.data);
      } catch (error) {
        console.error('Error fetching expense:', error);
        setError('Failed to fetch expense.');
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);
      await api.put(`api/expenses/${id}/`, expense, {
        headers: {
          'Authorization': `Bearer ${token.access}`,
        },
      });
      navigate('/expenses');
    } catch (error) {
      console.error('Error updating expense:', error);
      setError('Failed to update expense.');
    }
  };

  return (
    <div className="edit-expense-container">
      <SideNavbar />
      <div className="edit-expense-content">
        <h1>Edit Expense</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={expense.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={expense.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={expense.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={expense.description}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Update Expense</button>
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
