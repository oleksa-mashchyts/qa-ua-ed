import React from 'react';
import './Modal.css'; // Стилі для модального вікна

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Не показувати, якщо модальне вікно закрите

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
