import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Portal/Portal.css"; // ✅ Using existing styles

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState([]);
  const currentUser = localStorage.getItem("username") || "guest";

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

      // 🔄 Update reviews in frontend
      setReviews(data.reviews);
      setComment(""); // clear input
      setRating(5); // reset rating to default
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
    <div className="portal-container">
      <h1 className="portal-body-recipes-title">{recipe.title}</h1>

      <video
        controls
        src={`http://localhost:5000/uploads/${recipe.videoUrl}`}
        style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
      />

      <p className="portal-body-recipes-item-desc">{recipe.description}</p>
      <p className="portal-body-recipes-item-desc">
        <strong>Prep Time:</strong> {recipe.prepTime}
      </p>
      <p className="portal-body-recipes-item-desc">
        <strong>Ingredients:</strong> {recipe.ingredients}
      </p>

      <div className="portal-body-recipes-item" style={{ marginTop: "30px" }}>
        <h2 className="portal-body-recipes-title">Leave a Review</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          style={{
            width: "100%",
            padding: "10px",
            fontFamily: "HindRegular",
            fontSize: "14px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
        <br />
        <label>
          Rating:{" "}
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{
              marginLeft: "10px",
              padding: "5px",
              borderRadius: "5px",
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
        <div className="portal-actions" style={{ marginTop: "15px" }}>
          <button onClick={handleSubmit}>Submit Comment</button>
        </div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2 className="portal-body-recipes-title">Comments</h2>
        {reviews.length === 0 ? (
          <p className="portal-body-recipes-item-desc">No comments yet.</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="portal-body-recipes-item"
              style={{
                backgroundColor: "#f7f7f7",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "15px",
              }}
            >
              <h3
                className="portal-body-recipes-item-title"
                style={{ marginBottom: "5px" }}
              >
                {rev.user?.username || "Anonymous"} – ⭐ {rev.rating}
              </h3>
              <p className="portal-body-recipes-item-desc">
                {rev.comment || "No comment found"}
              </p>
              {rev.user?.username === currentUser && (
                <button
                  onClick={() => handleDelete(rev._id)}
                  className="portal-logout-btn"
                  style={{ marginTop: "10px", width: "auto" }}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
