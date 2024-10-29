// components/CustomModal.js
import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomModal = ({ open, onClose, title, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'primary.main',
          position: 'relative',
        }}
      >
        {/* Хрестик для закриття модального вікна */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Заголовок модального вікна */}
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}

        {/* Вміст модального вікна */}
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
