// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import AddNew from './pages/AddNew/AddNew';
import ImportData from './pages/ImportData/ImportData';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';


function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard or login based on auth */}
        <Route path="/" element={
          isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/transactions" element={
          <PrivateRoute>
            <Layout>
              <Transactions />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/add" element={
          <PrivateRoute>
            <Layout>
              <AddNew />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/import" element={
          <PrivateRoute>
            <Layout>
              <ImportData />
            </Layout>
          </PrivateRoute>
        } />

        {/* Catch-All Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
