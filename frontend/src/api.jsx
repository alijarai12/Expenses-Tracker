// src/api.jsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Replace with your actual API base URL

});


export default api;
