import React, { useState } from "react";

const StarRating = ({ recipeId }) => {
  const [rating, setRating] = useState(0);

  const submitReview = async (star) => {
    const token =
      localStorage.getItem("token") || "yourFallbackTokenForTesting";

    try {
      const res = await fetch(
        `http://localhost:5000/api/recipes/${recipeId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating: star, comment: "" }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data.message);
        alert("Failed to submit rating.");
        return;
      }

      alert(data.message || "Rating submitted!");
    } catch (err) {
      console.error("Network or code error:", err);
      alert("Network error submitting rating.");
    }
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            color: star <= rating ? "orange" : "gray",
            fontSize: "24px",
          }}
          onClick={() => {
            setRating(star); // optional visual state
            submitReview(star); // pass the correct rating directly
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
