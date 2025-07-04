import React from 'react';
import './CreateModal.css';
import chefIcon from '../../assets/images/chef.png';

const CreateModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-header">
          <img src={chefIcon} height="40" width="40" />
          <h2 className="create-title">Share Your Recipe</h2>
        </div>

       
      </div>
    </div>
  );
};

export default CreateModal;
