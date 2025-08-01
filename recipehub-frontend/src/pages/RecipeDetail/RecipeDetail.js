import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./RecipeDetail.css";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const currentUser = localStorage.getItem("username") || "guest";

  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/recipe/${id}`);
        const data = await res.json();
        setRecipe(data);
        setReviews(data.reviews || []);
        console.log("✅ Loaded reviews from backend:", data.reviews);
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/recipe/${id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (!response.ok) throw new Error("Failed to post comment");

      const data = await response.json();
      console.log("✅ Review response:", data); // ✅ Debug log

      
      setReviews(data.reviews || []);
      setComment("");
      setRating(5); 
    } catch (error) {
      console.error("❌ Failed to submit comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/recipe/${id}/review/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Unauthorized or deletion failed");
      }

      const updated = await res.json();
      setReviews(updated.reviews);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (!recipe) return <div className="portal-container">Loading...</div>;

  return (
    <div className="recipeDetail-container">
      <div className="recipeDetail-body-recipes-title-backbtn-container">
        <h1 className="recipeDetail-body-recipes-title">{recipe.title}</h1>
        <button onClick={() => navigate(-1)}
        className="back-btn">Back</button>
      </div>
      <video
        controls
        style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
      >
        <source src={`http://localhost:5000${recipe.videoUrl}`} type="video/mp4" />
      
      </video>

      <p className="recipeDetail-body-recipes-item-desc">{recipe.description}</p>
      <p className="recipeDetail-body-recipes-item-desc-details">
        <strong  className="boldStrong">Prep Time:</strong> {recipe.prepTime}
      </p>
      <p className="recipeDetail-body-recipes-item-desc-details">
        <strong className="boldStrong">Ingredients:</strong> {recipe.ingredients}
      </p>

      <div className="recipeDetail-body-recipes-item" style={{ marginTop: "30px" }}>
        <textarea
          className="comment-input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="1.5"
          placeholder="add comment..."
          style={{
            width: "100%",
            padding: "10px",
            fontFamily: "HindRegular",
            fontSize: "14px",
            borderRadius: "2px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
        <br />
        <label className="rating-scale">
          Rating:{" "}
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "2px",
              border: 'none',
              fontFamily: 'hindlight'
            }}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <br />
        <div className="recipeDetail-actions" style={{ marginTop: "15px" }}>
          <button
            onClick={handleSubmit}
            disabled={!localStorage.getItem("token")}
            style={{
              backgroundColor: localStorage.getItem("token") ? "#363131" : "#ccc",
              color: "#fff",
              padding: "10px 20px",
              border: "none",
              cursor: localStorage.getItem("token") ? "pointer" : "not-allowed",
              borderRadius: "4px",
            }}
            title={
              localStorage.getItem("token")
                ? "Submit your comment"
                : "You must be logged in to comment"
            }
          >
            Submit
          </button>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        
        {reviews.length === 0 ? (
          <p className="recipeDetail-body-recipes-item-desc">No comments yet.</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="recipeDetail-body-recipes-item"
              style={{
                backgroundColor: "#FAF8F8",
                padding: "15px",
                borderRadius: "3px",
                marginBottom: "15px",
              }}
            >
              <h3
                className="recipeDetail-body-recipes-item-title"
                style={{ marginBottom: "5px" }}
              >
                {rev.user?.username || "Anonymous"} – ⭐ {rev.rating}
              </h3>
              <h2
                className="recipeDetail-body-recipes-user-title"
                style={{
                  color: rev.user?.isProChef ? "#D7352D" : "#3DBA58",
                  marginBottom: "5px",
                }}
              >
                {rev.user?.proChef ? "Pro" : "Amateur Chef"}
              </h2>
              <p className="recipeDetail-body-recipes-item-desc">
                {rev.comment || "No comment found"}
              </p>
              {rev.user?.username === currentUser && (
                <div className="delete-review-btn-wrapper">
                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="recipeDetail-logout-btn"
                    style={{ marginTop: "10px", width: '30%', fontFamily: 'HindLight' }}
                    >
                    Delete Comment
                  </button>
                </div>
                
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
