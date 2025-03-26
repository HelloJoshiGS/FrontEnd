// src/components/Header.js
import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
    
    // window.location.href = '/login';
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <header className="header">
        <div className="header-left">
          <span className="logo">Expense<span>Tracker</span></span>
          <nav className="nav-links">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            <NavLink to="/add">Add New</NavLink>
            <NavLink to="/import">ImportData</NavLink>
          </nav>
        </div>
        <div className="header-right">
          <div className="circle" />
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
    </>
  );
};

export default Header;
