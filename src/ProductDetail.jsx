import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  TextField,
  Alert
} from '@mui/material';
import axios from 'axios';

const ProductDetail = () => {
  const { state: product } = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">Product not found.</Typography>
        <Button onClick={() => navigate('/user')}>Back to Products</Button>
      </Container>
    );
  }

  const handleBuy = async () => {
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post(
        'http://localhost:5131/api/orders',
        {
          items: [{ productId: product.id, quantity: parseInt(quantity) }]
        },
        { withCredentials: true }
      );

      setMessage(`Order placed successfully! Order ID: ${res.data.id}`);
    } catch (err) {
      if (err.response) {
        setError(err.response.data);
      } else {
        setError('Failed to place order. Please try again.');
      }
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={() => navigate('/user')}>
        ← Back to Products
      </Button>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>{product.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">{product.category}</Typography>
          <Typography variant="h6" color="primary">₹{product.price}</Typography>
          <Typography variant="body1" mt={2}><strong>Stock:</strong> {product.stock}</Typography>
          <Typography variant="body2" mt={1}><strong>Description:</strong> {product.description}</Typography>

          <Box mt={3} display="flex" alignItems="center" gap={2}>
            <TextField
              label="Quantity"
              type="number"
              size="small"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputProps={{ min: 1, max: product.stock }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleBuy}
              disabled={quantity < 1 || quantity > product.stock}
            >
              Buy Now
            </Button>
          </Box>

          {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductDetail;
