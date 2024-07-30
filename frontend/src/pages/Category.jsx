// src/pages/Category.jsx
import React, { useEffect, useState } from 'react';
import SideNavbar from '../components/Navbar';
import CreateCategory from '../components/CreateCategory';
import '../styles/category.css';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      setError('No token found. Please log in again.');
      return;
    }

    try {
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

  const handleEditClick = (id) => {
    navigate(`/category/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      setError('No token found. Please log in again.');
      return;
    }
    try {
      const token = JSON.parse(tokenString);
      await api.delete(`api/categories/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token.access}`,
        },
      });
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category.');
    }
  };

  const handleCategoryCreated = () => {
    fetchCategories();  // Refetch categories after creation
  };

  return (
    <div className="category-container">
      <SideNavbar />
      <div className="category-content">
        <div className="form-table-container">
          <CreateCategory onCategoryCreated={handleCategoryCreated} />
          <div className="table-container">
            <h1>Categories</h1>
            {error && <p className="error-message">{error}</p>}
            <table className="category-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length ? (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <button
                          className="edit-button"
                          onClick={() => handleEditClick(category.id)}
                        >
                          Edit
                        </button>

                        <button 
                          className="delete-button" 
                          onClick={() => handleDelete(category.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
