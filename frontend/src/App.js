// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Expenses from './pages/Expenses';
import CreateExpense from './pages/CreateExpense';
import EditExpense from './pages/EditExpense';
import EditCategory from './pages/EditCategory';
import Category from './pages/Category';

import Profile from './pages/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/create" element={<CreateExpense />} />
        <Route path="/expenses/edit/:id" element={<EditExpense />} />
        <Route path="/category/edit/:id" element={<EditCategory />} />
        
        <Route path="/category" element={<Category />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  );
};

export default App;
