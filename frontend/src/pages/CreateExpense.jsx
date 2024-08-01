import React, { useState, useEffect } from 'react';
import SideNavbar from '../components/Navbar'; // Adjust the path if needed
import api from '../api';
import '../styles/createExpense.css'; // Adjust the path if needed
import { useNavigate } from 'react-router-dom';

const CreateExpense = () => {
  const [expense, setExpense] = useState({
    amount: '',
    date: '',
    category: '', // This will hold the selected category ID
    description: ''
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories when the component mounts
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
        console.log('Fetched categories:', response.data); // Debugging line
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);

      console.log('Submitting expense:', expense); // Debugging line

      await api.post('api/expenses/', expense, {
        headers: {
          'Authorization': `Bearer ${token.access}`,
        },
      });

      navigate('/expenses');
    } catch (error) {
      console.error('Error creating expense:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : 'Failed to create expense.');
    }
  };

  return (
    <div className="create-expense-container">
      <SideNavbar />
      <div className="create-expense-content">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="create-expense-form">
        <h2>Create New Expense</h2>
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
              {categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="">No categories available</option>
              )}
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
          <button type="submit" className="submit-button">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateExpense;
