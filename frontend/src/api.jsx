// src/api.jsx
import axios from 'axios';

// Use the environment variable for the base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/', // Fallback to default if env variable is not set

});


export default api;
