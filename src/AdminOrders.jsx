import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Pagination,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5131/api/admin/orders', {
        params: { status: statusFilter, page, pageSize },
        withCredentials: true
      });
      setOrders(res.data.orders);
      setTotalItems(res.data.totalItems);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5131/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>All Orders</Typography>

      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>
      ) : (
        <>
          {orders.map(order => (
            <Card key={order.id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">Order #{order.id}</Typography>
                <Typography variant="body2" color="text.secondary">User ID: {order.userId}</Typography>
                <Typography variant="body2">Date: {new Date(order.orderDate).toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Status: {order.status}</Typography>

                <Divider sx={{ my: 1 }} />

                {order.items.map(item => (
                  <Box key={item.id} sx={{ mb: 1 }}>
                    <Typography>{item.quantity} x Product #{item.productId} @ ₹{item.unitPrice}</Typography>
                  </Box>
                ))}

                <Box mt={2} display="flex" gap={2}>
                  <TextField
                    label="Update Status"
                    size="small"
                    defaultValue={order.status}
                    onBlur={(e) => handleStatusChange(order.id, e.target.value)}
                  />
                  <Button variant="outlined" onClick={() => fetchOrders()}>Refresh</Button>
                </Box>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default AdminOrders;
