import React, { useEffect, useState } from 'react';
import SideNavbar from '../components/Navbar';
import DownloadPDFButton from '../components/DownloadPDFButton'; 
import '../styles/expenses.css';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Adjust page size as needed

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const handleYearChange = (e) => setYear(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, [currentPage, searchQuery]);

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
          Authorization: `Bearer ${token.access}`,
        },
        params: {
          page: currentPage,
          page_size: pageSize,
          search: searchQuery, // Ensure this matches your backend filter
        },
      });
      setExpenses(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
      setFilteredExpenses(response.data.results);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to fetch expenses.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
          Authorization: `Bearer ${token.access}`,
        },
      });
      setExpenses(expenses.filter((expense) => expense.id !== id));
      setFilteredExpenses(filteredExpenses.filter((expense) => expense.id !== id));
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
          <div className="date-inputs">
          <div className="download-pdf-heading">
            <span>Download</span>
            <span>Expenses PDF</span>
          </div>
            <label>
              Year:
              <input
                type="number"
                value={year}
                onChange={handleYearChange}
                min="2000"
                max={new Date().getFullYear()}
              />
            </label>
            <label>
              Month:
              <input
                type="number"
                value={month}
                onChange={handleMonthChange}
                min="1"
                max="12"
              />
            </label>
            <div className="download-pdf-button">
              <DownloadPDFButton year={year} month={month} />
            </div>
          </div>
          <button
            className="create-expense-button"
            onClick={() => navigate('/expenses/create')}
          >
            <i className="fas fa-plus"></i> Add Expense
          </button>
        </header>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Search expenses"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
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
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
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
        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="pagination-info">
            <span>Page {currentPage} of {totalPages}</span>
          </div>
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
