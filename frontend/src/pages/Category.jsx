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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  const fetchCategories = async (page) => {
    setLoading(true);
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      setError('No token found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const token = JSON.parse(tokenString);
      const response = await api.get(`api/categories/?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token.access}`,
        },
      });
      setCategories(response.data.results || []);
      setTotalPages(response.data.count ? Math.ceil(response.data.count / response.data.results.length) : 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories.');
      setLoading(false);
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
      fetchCategories(page);  // Refresh categories after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category.');
    }
  };

  const handleCategoryCreated = () => {
    fetchCategories(page);  // Refetch categories after creation
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="category-container">
      <SideNavbar />
      <div className="category-content">
        <div className="form-table-container">
          <CreateCategory onCategoryCreated={handleCategoryCreated} />
          <div className="table-container">
            <h1>Categories</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
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
                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="page-info">Page {page} of {totalPages}</span>
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
