import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Divider } from '@mui/material';
import axios from 'axios';

// Format currency in INR
const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(value);

// Format date
const formatDate = (dateString) =>
  new Date(dateString).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5131/api/orders/all', {
          withCredentials: true
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Container sx={{ mt: 4 }}>
      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map(order => {
          const total = order.items?.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0
          );

          return (
            <Card key={order.id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">Order #{order.id}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {order.status}
                </Typography>
                <Typography variant="body2">
                  Date: {formatDate(order.orderDate)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                {order.items?.map(item => (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <Typography>
                      {item.quantity} x Product #{item.productId} @ {formatCurrency(item.unitPrice)}
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" fontWeight="bold">
                  Total: {formatCurrency(total)}
                </Typography>
              </CardContent>
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default UserOrders;

