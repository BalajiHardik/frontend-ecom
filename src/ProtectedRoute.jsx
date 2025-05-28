import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (!user) return <Navigate to="/" />;
  if (user.role !== allowedRole) return <Navigate to={`/${user.role.toLowerCase()}`} />;

  return children;
};

export default ProtectedRoute;
