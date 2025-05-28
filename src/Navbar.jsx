import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {role === 'Admin' ? 'Admin Panel' : 'User Dashboard'}
        </Typography>

        {role === 'Admin' ? (
          <>
            <Button color="inherit" onClick={() => navigate('/admin')}>Products</Button>
            <Button color="inherit" onClick={() => navigate('/admin/orders')}>Orders</Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/user')}>Products</Button>
            <Button color="inherit" onClick={() => navigate('/user/orders')}>My Orders</Button>
          </>
        )}

        <Box ml={2}>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
