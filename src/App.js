import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import Admin from './Admin';
import AdminOrders from './AdminOrders';
import User from './User';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="Admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRole="User">
              <User />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
