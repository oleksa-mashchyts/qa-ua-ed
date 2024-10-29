// components/CustomModal.js
import React from 'react';
import { Modal, Box, Typography, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomModal = ({ open, onClose, title, children, ...props }) => {
  const theme = useTheme(); // Отримуємо поточну тему

  // Вибір кольору залежно від теми
  const backgroundColor = theme.palette.mode === 'dark' ? '#393939' : 'background.paper';

  return (
    <Modal open={open} onClose={onClose} {...props}>
      <Box
        sx={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: backgroundColor, // Динамічний фон для темної/світлої теми
          color: 'text.primary',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          /*border: '2px solid',
          borderColor: 'primary.main',*/
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}

        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
