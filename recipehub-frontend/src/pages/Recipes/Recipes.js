// Recipes.js
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import miniChef from '../../assets/icons/minichef.png';
import axios from "axios";
import "./Recipes.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/recipe");
        const allRecipes = res.data;

        const filtered = allRecipes.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery)
        );

        setRecipes(filtered);
      } catch (err) {
        console.error(err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchQuery]);

  if (loading) return <p>Loading...</p>;

  return (
    
    <div className="recipes-container">
      
      <div className="recipes-search-container">
        {recipes.length > 0 ? (
                recipes.map((recipe) => (
                <Link to={`/recipe/${recipe._id}`} key={recipe._id} className="recipe-card-link">
                    <div className="recipe-card">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    <p className="recipe-creator">By {recipe.creatorUsername}</p>
                    </div>
                </Link>
                ))
            ) : (
                <div>
                    <img className="no-recipes-found" src={miniChef}/>
                    <p className="no-recipes-found">No recipes found for "{searchQuery}".</p>
                </div>
                
            )}
      </div>
      
    </div>
  );
};

export default Recipes;
