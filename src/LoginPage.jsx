import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

    try {
      const res = await axios.post('http://localhost:5131/api/auth/login', form, {
        withCredentials: true // Important for session cookies
      });

      setSuccess(res.data);
      setForm({ email: '', password: '' });

      // Store user info in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(res.data));

      // Redirect based on role
      const { role } = res.data;
      if (role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError(err.response.data);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h5" mb={3}>
          Login
        </Typography>

        {success && <Alert severity="success">Login successful. Welcome, {success.name}!</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
            type="email"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
            type="password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2" mt={2}>
          Don't have an account?{' '}
          <Link component="button" onClick={handleRegisterClick}>
            Register
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;

