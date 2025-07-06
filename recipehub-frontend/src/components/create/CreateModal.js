import React from 'react';
import './CreateModal.css';
import chefIcon from '../../assets/images/chef.png';
import cloudIcon from '../../assets/icons/cloud.png';

const CreateModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-header">
          <h2 className="create-title">Upload</h2>
        </div>
        <div className="create-form-container">
          <div className="create-form-item">
            <h1 className="create-form-item-field-title">Title</h1>
            <input type="name" className="create-form-item-input"/>
          </div>
          <div className="create-form-item">
            <h1 className="create-form-item-field-prep">Prep Time</h1>
            <input type="name" className="create-form-item-input"/>
          </div>
          <div className="create-form-item">
            <h1 className="create-form-item-field-desc">Description</h1>
            <span className="desc-form-spacer"></span>
            <input type="name" className="create-form-item-input"/>

            <h1 className="create-form-item-field-ingred">Ingredients</h1>
            <input type="name" className="create-form-item-input"/>
          </div>
          <div className="create-form-item">
            <div
              className="create-form-item drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                console.log('Dropped file:', file); // Handle the file as needed
              }}
            >
              <img className="cloudIcon" src={cloudIcon} />
              <p className="create-form-item-field-drag">Drag & Drop video file here</p>
              </div>
          </div>
          <div className="create-form-item">
            <h1 className="create-form-item-field-categ">Category</h1>
          </div>
          <div className="create-form-item">Item 6</div>
        </div>
       
      </div>
    </div>
  );
};

export default CreateModal;
