import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // Ensure this points to your configured Axios instance
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
  const [categories, setCategories] = useState([]);
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
        setExpense({
          ...response.data,
          category: response.data.category.id // Assuming category is an object with id and name
        });
      } catch (error) {
        console.error('Error fetching expense:', error);
        setError('Failed to fetch expense.');
      }
    };

    const fetchCategories = async () => {
      try {
        const tokenString = localStorage.getItem('token');
        const token = JSON.parse(tokenString);
        const response = await api.get('api/categories/', {
          headers: {
            'Authorization': `Bearer ${token.access}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories.');
      }
    };

    fetchExpense();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);
      const response = await api.put(`api/expenses/${id}/`, {
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        description: expense.description
      }, {
        headers: {
          'Authorization': `Bearer ${token.access}`,
        },
      });

      // Handle successful response
      navigate('/expenses');
    } catch (error) {
      console.error('Error updating expense:', error);
      setError('Failed to update expense.');
    }
  };

  return (
    <div className="edit-expense-page">
      <SideNavbar />
      <div className="edit-expense-content">
        <div className="form-container">
          <header className="header">
            <h1>Edit Expense</h1>
          </header>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="expense-form">
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
              <select
                name="category"
                value={expense.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
    </div>
  );
};

export default EditExpense;
