import React, { useEffect, useState } from 'react';
import SideNavbar from '../components/Navbar';
import '../styles/expenses.css';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      const tokenString = localStorage.getItem('token');
      if (!tokenString) {
        setError('No token found. Please log in again.');
        return;
      }

      try {
        const token = JSON.parse(tokenString);
        const response = await api.get('api/expenses/', {
          headers: {
            'Authorization': `Bearer ${token.access}`,
          },
        });
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError('Failed to fetch expenses.');
      }
    };

    fetchExpenses();
  }, []);

  const handleEditClick = (id) => {
    navigate(`/expenses/edit/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      setError('No token found. Please log in again.');
      return;
    }

    try {
      const token = JSON.parse(tokenString);
      await api.delete(`api/expenses/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token.access}`,
        },
      });
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('Failed to delete expense.');
    }
  };

  return (
    <div className="expenses-page">
      <SideNavbar />
      <div className="main-content">
        <header className="headerexpenses">
          <h1>Expenses</h1>
          <button
            className="create-expense-button"
            onClick={() => navigate('/expenses/create')}
          >
            <i className="fas fa-plus"></i> Add Expense
          </button>
        </header>
        {error && <p className="error-message">{error}</p>}
        <div className="table-container">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.amount}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{expense.category.name}</td>
                    <td>{expense.description}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEditClick(expense.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteClick(expense.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No expenses available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
