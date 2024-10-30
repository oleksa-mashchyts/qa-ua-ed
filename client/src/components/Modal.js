import React from 'react';
import './Modal.css'; // Стилі для модального вікна
import CustomButton from '../components/CustomButton';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <CustomButton 
          onClick={onClose} 
          variant="outlined" 
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          &times;
        </CustomButton>
        {children}
      </div>
    </div>
  );
};

export default Modal;
