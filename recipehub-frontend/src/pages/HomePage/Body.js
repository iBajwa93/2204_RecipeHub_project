import React, { useEffect, useState } from 'react';
import './Body.css';
import dummy1 from '../../assets/images/dummy.png';
import dummy2 from '../../assets/images/dummy2.png';
import star from '../../assets/icons/star.png';
import italian from '../../assets/images/italian.png';
import indian from '../../assets/images/indian.png';
import mexican from '../../assets/images/mexican.png';
import american from '../../assets/images/american.png';
import asian from '../../assets/images/asian.png';
import european from '../../assets/images/european.png';
import mediterranean from '../../assets/images/mediterranean.png';
import african from '../../assets/images/african.png';
import middleeastern from '../../assets/images/middleeastern.png';
import caribbean from '../../assets/images/caribbean.png';

const Body = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fadeTrigger, setFadeTrigger] = useState(0); // 🆕 added

  const categoryImages = {
    "Indian": indian,
    "Middle Eastern": middleeastern,
    "Mediterranean": mediterranean,
    "Asian": asian,
    "Italian": italian,
    "Mexican": mexican,
    "Caribbean": caribbean,
    "American": american,
    "African": african,
    "European": european,
  };

  const categories = Object.keys(categoryImages);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/recipe");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const top3Recipes = [...recipes]
    .filter(recipe => (recipe.averageRating || 0) >= 3)
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 3);

  const renderStars = (rating) => {
    const rounded = Math.round(rating) || 0;
    const stars = [];
    for (let i = 0; i < rounded; i++) {
      stars.push(
        <img
          key={i}
          className="featured-videos-item-star"
          src={star}
          width="35px"
          height="35px"
          alt={`${i + 1} star`}
        />
      );
    }
    return stars;
  };

  const filteredRecipes = selectedCategory
    ? recipes.filter(recipe => recipe.category === selectedCategory)
    : recipes;

  return (
    <div className="homepage-body">
      <div className="body-container">
        {/* Featured Section */}
        <div className="featured-container">
          <div className="featured-title-wrapper">
            <h1 className="featured-title">Featured Videos</h1>
          </div>
          <div className="featured-videos-container">
            {top3Recipes.length === 0 && <p className="featured-error">No featured recipes yet.</p>}

            {top3Recipes.map((recipe) => (
              <div className="featured-videos-item" key={recipe._id}>
                <img
                  className="featured-videos-item-img"
                  src={`http://localhost:5000${recipe.thumbnailUrl || '/fallback.jpg'}`}
                  alt={recipe.title}
                  width="464px"
                  height="232px"
                />
                <h1 className="featured-videos-item-title">{recipe.title}</h1>
                <h2 className="featured-videos-item-description">
                  {recipe.description || "No description available"}
                </h2>
                <div className="featured-videos-item-btnstar-container">
                  <button className="featured-videos-item-btn">View</button>
                  <div className="featured-videos-item-star-container">
                    {renderStars(recipe.averageRating || recipe.avgRating || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browse by Category Section */}
        <div className="browse-container">
          <div className="browse-title-wrapper">
            <h1 className="browse-title-text">Browse by Category</h1>
          </div>
          <div className="browse-category-container">
            {categories.map((cuisine, index) => {
              const imageSrc = categoryImages[cuisine] || dummy2;
              return (
                <div
                  className="browse-category-item-container"
                  key={index}
                  onClick={() => {
                    setSelectedCategory(cuisine);
                    setFadeTrigger(prev => prev + 1); // 🆕 triggers fade
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img width="100" height="100" className="category-img" src={imageSrc} alt={cuisine} />
                  <h1 className="browse-category-item-title">{cuisine}</h1>
                  <p className="browse-category-item-description">Explore {cuisine} Cuisine</p>
                </div>
              );
            })}
          </div>

          {/* Explore Section */}
          <div className="explore-container">
            <div className="explore-item-wrapper">
              <div className="explore-title-wrapper">
                <h1 className="explore-title-text">
                  Explore {selectedCategory ? `(${selectedCategory})` : ""}
                </h1>
                {selectedCategory && (
                  <button
                    className="clear-category-btn"
                    onClick={() => {
                      setSelectedCategory(null);
                      setFadeTrigger(prev => prev + 1); // 🆕 also trigger fade
                    }}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="explore-item-video-container">
                {filteredRecipes.map((recipe) => (
                  <div
                    className="explore-item-video-wrapper fade-in" // 🆕 fade-in class
                    key={`${recipe._id}-${fadeTrigger}`} // 🆕 force re-render
                  >
                    <img
                      className="explore-item-video-tn"
                      src={`http://localhost:5000${recipe.thumbnailUrl || '/fallback.jpg'}`}
                      alt={recipe.title}
                    />
                    <h1 className="explore-item-video-title">{recipe.title}</h1>
                    <h2 className="explore-item-video-author">{recipe.creatorUsername || "Anonymous"}</h2>
                    <p className="explore-item-stats">
                      {recipe.views || 0} views | {recipe.prepTime}
                    </p>
                    <p className="explore-item-ingred">
                      <span className="explore-item-ingred-bold">Ingredients: </span>
                      {recipe.ingredients || "No ingredients listed"}
                    </p>
                  </div>
                ))}
                {filteredRecipes.length === 0 && (
                  <p className="explore-empty-text">No recipes found for this category.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
