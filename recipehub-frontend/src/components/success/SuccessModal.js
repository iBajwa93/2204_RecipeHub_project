import React from 'react';
import './SuccessModal.css';
import chefIcon from '../../assets/icons/minichef.png'

const SuccessModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
 
        <img src={chefIcon} />
        <p className="success-message">{message || "Your action was completed successfully."}</p>
        <button className="success-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
