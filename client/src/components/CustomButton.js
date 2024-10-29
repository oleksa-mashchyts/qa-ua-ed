import React from 'react';
import { Button } from '@mui/material';

const CustomButton = ({ children, color = 'primary', onClick, ...props }) => {
  return (
    <Button
      variant="outlined"
      color={color}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
