// src/components/CreateCategory.jsx
import React, { useState } from 'react';
import '../styles/createCategory.css'; 
import api from '../api'; 

const CreateCategory = ({ onCategoryCreated }) => {
  const [category, setCategory] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokenString = localStorage.getItem('token');
      const token = JSON.parse(tokenString);

      await api.post('api/categories/', category, {
        headers: {
          'Authorization': `Bearer ${token.access}`,
        },
      });

      onCategoryCreated();
      setCategory({ name: '', description: '' }); // Reset form
    } catch (error) {
      console.error('Error creating category:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : 'Failed to create category.');
    }
  };

  return (
    <div className="create-category-container">
      <h2>Create New Category</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="create-category-form">
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={category.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group form-buttons">
          <button type="submit" className="submit-button">Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
