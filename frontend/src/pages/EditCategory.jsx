import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import SideNavbar from '../components/Navbar';
import '../styles/category.css';

const EditCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      const tokenString = localStorage.getItem('token');
      if (!tokenString) {
        setError('No token found. Please log in again.');
        return;
      }

      try {
        const token = JSON.parse(tokenString);
        const response = await api.get(`api/categories/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token.access}`,
          },
        });
        setCategory(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
      } catch (error) {
        console.error('Error fetching category:', error);
        setError('Failed to fetch category.');
      }
    };

    fetchCategory();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      setError('No token found. Please log in again.');
      return;
    }

    try {
      const token = JSON.parse(tokenString);
      await api.put(`api/categories/${id}/`, { name, description }, {
        headers: {
          'Authorization': `Bearer ${token.access}`,
        },
      });
      navigate('/category'); // Redirect to categories page
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category.');
    }
  };

  return (
    <div className="category-container">
      <SideNavbar />
      <div className="category-content">
        <h1>Edit Category</h1>
        {error && <p className="error-message">{error}</p>}
        {category && (
          <form onSubmit={handleSave} className="edit-category-form">
            <label>
              Category Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <button type="submit">Save</button>
            
          </form>
        )}
      </div>
    </div>
  );
};

export default EditCategory;
