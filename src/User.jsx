import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import Navbar from './Navbar';
import UserOrders from './UserOrders'
const User = () => {
  return (
    <>
    <Navbar role="User" />
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="orders" element={<UserOrders />} />
    </Routes>
    </>
  );
};

export default User;
