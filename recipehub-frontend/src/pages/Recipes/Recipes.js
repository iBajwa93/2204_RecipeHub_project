import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Recipes.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/recipe"); // adjust endpoint
        const allRecipes = res.data;

        const filtered = allRecipes.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery)
        );

        if (filtered.length === 1) {
          // Redirect directly if exactly one match
          navigate(`/recipe/${filtered[0]._id}`);
        } else {
          setRecipes(filtered);
        }
      } catch (err) {
        console.error(err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchQuery, navigate]);

  if (loading) return <p>Loading...</p>;

  if (recipes.length === 0) {
    return <p>No recipes found for "{searchQuery}".</p>;
  }

  // Show list if multiple or zero matches (zero handled above)
  return (
    <div className="recipes-container">
      {recipes.map((recipe) => (
        <div
          key={recipe._id}
          className="recipe-card"
          onClick={() => navigate(`/recipe/${recipe._id}`)}
          style={{ cursor: "pointer" }}
        >
          <h3 className="recipe-title">{recipe.title}</h3>
          <p className="recipe-creator">By {recipe.creatorUsername}</p>
        </div>
      ))}
    </div>
  );
};

export default Recipes;
