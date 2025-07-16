import SuccessModal from '../success/SuccessModal'
import React, { useState } from 'react';
import './CreateModal.css';
import chefIcon from '../../assets/images/chef.png';
import cloudIcon from '../../assets/icons/cloud.png';
import { MdError } from "react-icons/md";


const CreateModal = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const [error, setError] = useState();
  const [showSuccess, setShowSuccess] = useState(false);


  const categories = [
    "Indian",
    "Middle Eastern",
    "Mediterranean",
    "Asian",
    "Italian",
    "Mexican",
    "Caribbean",
    "American",
    "French",
    "African",
    "European"
  ];

  const handleSubmit = async () => {
    
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('info'));
    const userId = userInfo?.id;
    const username = userInfo?.username;
    if (!title || !prepTime || !description || !ingredients || !selectedCategory || !videoFile) {
    console.error('❌ Please fill out all fields and upload a video before submitting.');
    setError(true);
    return;
  }
   
    // Build FormData because of file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('prepTime', prepTime);
    formData.append('description', description);
    formData.append('ingredients', ingredients);
    formData.append('category', selectedCategory);
    formData.append('creatorID', userId);
    formData.append('creatorUsername', username);
    formData.append('creator', userId);
    if (videoFile) formData.append('video', videoFile);

    try {
      const response = await fetch('http://localhost:5000/api/recipe', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
        // Don't set content-type header; browser sets it automatically for FormData
      });

      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }

      const data = await response.json();
      console.log('Recipe created:', data);
      // Optionally reset form or close modal here:
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting recipe:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-modal-overlay" onClick={onClose}>
      
      <div className="create-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-header">
          <h2 className="create-title">Upload</h2>
          {error && (
                    <div className="error-icon-container">
                      <h2 className="error-icon"><MdError /><span className="error-icon-msg">Please fill out all fields and upload a video before submitting.</span></h2>
                    
                    </div>
                  )}
        </div>
        <div className="create-form-container">
          <div className="create-form-item">
            <h1 className="create-form-item-field-title">Title</h1>
            <input
              type="text"
              className="create-form-item-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="create-form-item">
            <h1 className="create-form-item-field-prep">Prep Time</h1>
            <input
              type="text"
              className="create-form-item-input"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
          </div>
          <div className="create-form-item">
            <h1 className="create-form-item-field-desc">Description</h1>
            <span className="desc-form-spacer"></span>
            <input
              type="text"
              className="create-form-item-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <h1 className="create-form-item-field-ingred">Ingredients</h1>
            <input
              type="text"
              className="create-form-item-input"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>
          <div className="create-form-item">
            <div
              className="create-form-item drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                setVideoFile(file);
                console.log('Dropped file:', file);
              }}
            >
              <img className="cloudIcon" src={cloudIcon} alt="Cloud icon" />
              <p className="create-form-item-field-drag">Drag & Drop video file here</p>
              {videoFile && <p className="selected-file">Selected file: {videoFile.name}</p>}
            </div>
          </div>
          <div className="create-form-item">
            <h1 className="create-form-item-field-categ">Category</h1>
            <div className="category-scroll-container">
              <div className="category-buttons-wrapper">
                {categories.map((cat, index) => (
                  <button
                    key={index}
                    className={`category-button ${selectedCategory === cat ? "selected" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="create-form-item">
            <button
              className="create-form-item-create-btn"
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
        </div>
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false);
            onClose(); // close the CreateModal after dismissing success
          }}
          message="Your recipe has successfully been uploaded"
        />
      </div>
      
    </div>
    
  );
};

export default CreateModal;