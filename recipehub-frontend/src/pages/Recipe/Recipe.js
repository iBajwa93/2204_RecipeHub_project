import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Recipe.css';

const Recipe = () => {
  
  return (
    <div className="recipe-container">
      <div className="recipe-video-wrapper">
        
      </div>
      <h1 className="recipe-video-title">
        Lorem ipsum dolor
      </h1>
      <h3 className="recipe-video-info">
        264 views | 4.5 rating | 07/04/2025
      </h3>
      <p className="recipe-video-desc">
        Lorem ipsum dolor sit amet, consectetur adipiscing 
        elit
      </p>
      <div className="recipe-video-comment-wrapper">
        <input placeholder="add comment..." type="text" className="recipe-video-comment-input"/>
      </div>
     
      <div className="recipe-video-comment-wrapper">

      </div>
    
      <div className="recipe-comments-divider"></div>

      <div className="recipe-video-comments-container">
        <div className="recipe-video-comment-item">
          <h1 className="recipe-video-comment-item-author">Dan H.</h1>
          <h3 className="recipe-video-comment-item-author-rank">Pro Chef</h3>
          <h3 className="recipe-video-comment-item-date">7/8/2025</h3>
          <p className="recipe-video-comment-item-desc">Thanks for the recipe, I will be sure to try this out and let you know how delicious my family thinks
it is :)</p>
        </div>
        <div className="recipe-video-comment-item">
          <h1 className="recipe-video-comment-item-author">Dan H.</h1>
          <h3 className="recipe-video-comment-item-author-rank">Pro Chef</h3>
          <h3 className="recipe-video-comment-item-date">7/8/2025</h3>
          <p className="recipe-video-comment-item-desc">Thanks for the recipe, I will be sure to try this out and let you know how delicious my family thinks
it is :)</p>
        </div>
      </div>
      
    </div>
  );
};

export default Recipe;