import React, { useEffect, useState } from 'react';
import './Body.css';
import dummy1 from '../../assets/images/dummy.png'
import dummy2 from '../../assets/images/dummy2.png'
import star from '../../assets/icons/star.png'
import italian from '../../assets/images/italian.png'
import indian from '../../assets/images/indian.png'
import mexican from '../../assets/images/mexican.png'



const Body = () => {
const [recipes, setRecipes] = useState([]);
useEffect(() => {
  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:5000/recipe");
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  fetchRecipes();
}, []);

  return (
    <div className="homepage-body">
        <div className="body-container">
            <div className="featured-container">
                <div className="featured-title-wrapper">
                    <h1 className="featured-title">Featured Videos</h1>
                </div>
                <div className="featured-videos-container">
                    
                    <div className="featured-videos-item">
                        <img className="featured-videos-item-img" src={dummy1} width="464px" height="232px" />
                        <h1 className="featured-videos-item-title">Lorem ipsum dolor sit amet</h1>
                        <h2 className="featured-videos-item-description">Lorem ipsum dolor sit amet, consectetur adipiscing</h2>
                        <div className="featured-videos-item-btnstar-container">
                           <button className="featured-videos-item-btn">View</button> 
                           <div className="featured-videos-item-star-container">
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                           </div>
                           
                        </div>
                    </div>

                    <div className="featured-videos-item">
                        <img className="featured-videos-item-img" src={dummy1} width="464px" height="232px" />
                        <h1 className="featured-videos-item-title">Lorem ipsum dolor sit amet</h1>
                        <h2 className="featured-videos-item-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
                        <div className="featured-videos-item-btnstar-container">
                           <button className="featured-videos-item-btn">View</button> 
                            <div className="featured-videos-item-star-container">
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                           </div>
                        </div>
                    </div>

                    <div className="featured-videos-item">
                        <img className="featured-videos-item-img" src={dummy1} width="464px" height="232px" />
                        <h1 className="featured-videos-item-title">Lorem ipsum dolor sit amet</h1>
                        <h2 className="featured-videos-item-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
                        <div className="featured-videos-item-btnstar-container">
                           <button className="featured-videos-item-btn">View</button> 
                            <div className="featured-videos-item-star-container">
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                           </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="browse-container">
                <div className="browse-title-wrapper">
                    <h1 className="browse-title-text">Browse by Category</h1>
                </div>
                <div className="browse-category-container">
                    <div className="browse-category-item-container">
                        <img className="category-img" src={italian} />
                        <h1 className="browse-category-item-title">
                            Italian
                        </h1>
                        <p className="browse-category-item-description">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div className="browse-category-item-container">
                        <img className="category-img" src={mexican} />
                        <h1 className="browse-category-item-title">
                            Mexican
                        </h1>
                        <p className="browse-category-item-description">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div className="browse-category-item-container">
                        <img className="category-img" src={indian} />
                        <h1 className="browse-category-item-title">
                            Indian
                        </h1>
                        <p className="browse-category-item-description">Lorem ipsum dolor sit amet</p>
                    </div>
                </div>
                <div className="explore-container">
                    <div className="explore-item-wrapper">
                        <div className="explore-title-wrapper">
                            <h1 className="explore-title-text">
                                Explore
                            </h1>
                        </div>
                        <div className="explore-item-video-container">
                            {recipes.map((recipe) => (
                                <div className="explore-item-video-wrapper" key={recipe._id}>
                                <video className="explore-item-video-tn" controls>
                                    <source src={`http://localhost:5000/uploads/${recipe.videoUrl}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <h1 className="explore-item-video-title">{recipe.title}</h1>
                                <h2 className="explore-item-video-author">{recipe.creator || "Anonymous"}</h2>
                                <p className="explore-item-stats">
                                    {recipe.views || 0} views | {recipe.prepTime}
                                </p>
                                <p className="explore-item-ingred">
                                    <span className="explore-item-ingred-bold">Ingredients: </span>
                                    {recipe.ingredients || " no ingredients listed"}
                                </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                </div>
            </div>
            
        </div>
    </div>
  );
};

export default Body;
