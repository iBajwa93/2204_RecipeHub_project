import React, { useEffect, useState, forwardRef } from "react";
import "./Body.css";
import dummy1 from "../../assets/images/dummy.png";
import dummy2 from "../../assets/images/dummy2.png";
import star from "../../assets/icons/star.png";
import italian from "../../assets/images/italian.png";
import indian from "../../assets/images/indian.png";
import mexican from "../../assets/images/mexican.png";
import american from "../../assets/images/american.png";
import asian from "../../assets/images/asian.png";
import european from "../../assets/images/european.png";
import mediterranean from "../../assets/images/mediterranean.png";
import african from "../../assets/images/african.png";
import middleeastern from "../../assets/images/middleeastern.png";
import caribbean from "../../assets/images/caribbean.png";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const categoryImages = {
    Indian: indian,
    "Middle Eastern": middleeastern,
    Mediterranean: mediterranean,
    Asian: asian,
    Italian: italian,
    Mexican: mexican,
    Caribbean: caribbean, // since you don’t have an import for Caribbean, use a dummy or add import
    American: american,
    African: african,
    European: european,
  };
  const categories = [
    "Indian", //
    "Middle Eastern", //
    "Mediterranean", //
    "Asian", //
    "Italian", //
    "Mexican", //
    "Caribbean", //
    "American", //
    "African", //
    "European", //
  ];

  const handleRecipeClick = async (recipeId) => {
  try {
    // Increment views in the backend
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe/${recipeId}/view`, {
      method: "PATCH",
    });

    // Navigate to recipe detail
    navigate(`/recipe/${recipeId}`);
  } catch (err) {
    console.error("Failed to increment views:", err);
    navigate(`/recipe/${recipeId}`); // fallback navigation
  }
};

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe`);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const top3Recipes = [...recipes]
    .filter((recipe) => (recipe.averageRating || 0) >= 3)
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

  return (
    <div className="homepage-body">
      <div className="body-container">
        <div className="featured-container">
          <div className="featured-title-wrapper">
            <h1 className="featured-title">Featured Videos</h1>
          </div>
          <div className="featured-videos-container">
            {top3Recipes.length === 0 && (
              <p className="featured-error">No featured recipes yet.</p>
            )}

            {top3Recipes.map((recipe) => (
              <div className="featured-videos-item" key={recipe._id}>
                <img
                  className="featured-videos-item-img"
                  src={`${process.env.REACT_APP_BACKEND_URL}${
                    recipe.thumbnailUrl || "/fallback.jpg"
                  }`}
                  alt={recipe.title}
                  width="464px"
                  height="232px"
                />
                <h1 className="featured-videos-item-title">{recipe.title}</h1>
                <h2 className="featured-videos-item-description">
                  {recipe.description || "No description available"}
                </h2>
                <div className="featured-videos-item-btnstar-container">
                  <button
                    className="featured-videos-item-btn"
                    onClick={() => handleRecipeClick(recipe._id)}
                  >
                    View
                  </button>

                  <div className="featured-videos-item-star-container">
                    {renderStars(recipe.averageRating || recipe.avgRating || 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                  onClick={() => setSelectedCategory(cuisine)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    width="100"
                    height="100"
                    className="category-img"
                    src={imageSrc}
                    alt={cuisine}
                  />
                  <h1 className="browse-category-item-title">{cuisine}</h1>
                  <p className="browse-category-item-description">
                    Explore {cuisine} Cuisine
                  </p>
                </div>
              );
            })}
          </div>
          <div className="explore-container" id="explore-section">
            <div className="explore-item-wrapper">
              <div className="explore-title-wrapper">
                <h1 className="explore-title-text">
                  Explore {selectedCategory ? `(${selectedCategory})` : ""}
                </h1>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    style={{
                      marginTop: "10px",
                      backgroundColor: "#363131",
                      border: "1px solid #ccc",
                      padding: "6px 12px",
                      cursor: "pointer",
                      borderRadius: "4px",
                      color: 'white',
                      fontFamily: 'HindLight',
                      width: '10%',
                      margin: '0',
                      marginLeft: '20px',
                      textAlign: 'center'
                    }}
                  >
                    Clear Filter
                  </button>
                )}
                              </div>
              <div className="explore-item-video-container">
               
                {recipes
                  .filter((recipe) =>
                    selectedCategory ? recipe.category === selectedCategory : true
                  )
                  .map((recipe) => (
                    <div className="explore-item-video-wrapper" key={recipe._id}>
                      <img
                        onClick={() => handleRecipeClick(recipe._id)}
                        className="explore-item-video-tn"
                        src={`${process.env.REACT_APP_BACKEND_URL}${
                          recipe.thumbnailUrl || "/fallback.jpg"
                        }`}
                      />
                      <h1 className="explore-item-video-title">{recipe.title}</h1>
                      <h2 className="explore-item-video-author">
                        {recipe.creatorUsername || "Anonymous"}
                      </h2>
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