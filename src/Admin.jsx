import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
  Container,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import axios from 'axios';

const initialForm = {
  name: '',
  category: '',
  price: '',
  stock: '',
  description: ''
};

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5131/api/products');
    const allProducts = res.data.products;
    setProducts(allProducts);
    setFilteredProducts(allProducts);

    const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
    setCategories(uniqueCategories);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const handleOpen = (product = null) => {
    if (product) {
      setForm(product);
      setEditId(product.id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`http://localhost:5131/api/admin/products/${editId}`, form);
    } else {
      await axios.post('http://localhost:5131/api/admin/products', form);
    }
    handleClose();
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5131/api/admin/products/${id}`);
    fetchProducts();
  };

  return (
    <>
      <Navbar role="Admin" />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Product Management
          </Typography>
          <Button color="inherit" onClick={() => handleOpen()}>Add Product</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Box display="flex" gap={2} mb={3}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Filter by Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat, idx) => (
                <MenuItem key={idx} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Search by Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Box>

        <Grid container spacing={3}>
          {filteredProducts.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{product.category}</Typography>
                  <Typography variant="subtitle1" color="primary">₹{product.price}</Typography>
                  <Typography variant="body2">Stock: {product.stock}</Typography>
                  <Typography variant="body2" mt={1}>{product.description}</Typography>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button variant="outlined" onClick={() => handleOpen(product)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(product.id)}>Delete</Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Name" name="name" value={form.name} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Category" name="category" value={form.category} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Price" name="price" type="number" value={form.price} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
          <TextField fullWidth margin="dense" label="Description" name="description" multiline rows={3} value={form.description} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editId ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Admin;
