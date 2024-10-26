// Home.js
import React from 'react';
import { Button, Typography, Box } from '@mui/material';

const Home = ({ openLoginModal, openRegisterModal }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '90vh',
      textAlign: 'center',
    }}
  >
    <Typography variant="h3" component="h1" gutterBottom>
      Ласкаво просимо!
    </Typography>
    <Typography variant="h6" component="p" gutterBottom>
      Приєднуйтеся до нашої платформи для доступу до курсів та управління.
    </Typography>
    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={openLoginModal}
        sx={{ mr: 1 }}
      >
        Вхід
      </Button>
      <Button variant="outlined" onClick={openRegisterModal}>
        Реєстрація
      </Button>
    </Box>
  </Box>
);

export default Home;
