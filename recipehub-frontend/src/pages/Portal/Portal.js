import React, { useEffect, useState } from "react";
import "./Portal.css";
import pfp from "../../assets/images/pfp.png";
import dummy2 from "../../assets/images/dummy2.png";
import search from "../../assets/icons/search.png";
import SuccessModal from "../../components/success/SuccessModal";
import { MdError } from "react-icons/md";
import chefIcon from "../../assets/icons/minichef.png";
import Footer from "../HomePage/Footer";
import { jwtDecode } from "jwt-decode";
import AdminPortal from "../../components/admin/AdminPortal";

const Portal = () => {
  const [userAvgRating, setUserAvgRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [topRecipe, setTopRecipe] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("newer");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = React.useRef();

  const filteredRecipes = userRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (filterType === "newer") {
      return new Date(b.createdAt) - new Date(a.createdAt); // latest first
    } else if (filterType === "older") {
      return new Date(a.createdAt) - new Date(b.createdAt); // oldest first
    } else if (filterType === "top") {
      return b.avgRating - a.avgRating; // highest rated first
    }
    return 0;
  });

  const totalRecipes = userRecipes.length;

  const avgRating =
    totalRecipes > 0
      ? (
          userRecipes.reduce((acc, r) => acc + (r.avgRating || 0), 0) /
          totalRecipes
        ).toFixed(1)
      : 0;

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("avatar", selectedImage);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/user/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        const updatedUser = { ...user, profileImage: data.imageUrl };
        localStorage.setItem("info", JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert("Profile picture updated!");
      } else {
        alert("Image upload failed.");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Something went wrong.");
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      handleImageUpload(); // auto-upload
    }
  };

  useEffect(() => {
  const fetchTopRecipeAndRecipes = async () => {
    if (!user || !user.id) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/recipe/user/${user.id}`
      );
      const data = await res.json();

      if (res.ok) {
        // sort by highest rating to get top recipe
        const sorted = [...data].sort((a, b) => b.averageRating - a.averageRating);
        setTopRecipe(sorted[0] || null);
        setUserRecipes(data);

        // ✅ Calculate average rating for this user
        const ratedRecipes = data.filter((r) => r.averageRating && r.averageRating > 0);
        const avg =
          ratedRecipes.length > 0
            ? (
                ratedRecipes.reduce((sum, r) => sum + r.averageRating, 0) /
                ratedRecipes.length
              ).toFixed(1)
            : 0;

        // ✅ Save to state for Analytics panel
        setUserAvgRating(avg);

        // ✅ Update in DB
        await fetch(`http://localhost:5000/api/users/${user.id}/avgRating`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avgRating: avg }),
        });
      } else {
        setTopRecipe(null);
        setUserRecipes([]);
      }
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setTopRecipe(null);
      setUserRecipes([]);
    }
  };

  fetchTopRecipeAndRecipes();
}, [user]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("info");
    setError("");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.isAdmin || false); // ✅ Sets admin flag
      } catch (err) {
        console.error("JWT decode failed", err);
      }
    }

    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
        setEmail(parsedUser.email || "");
        setUsername(parsedUser.username || "");
        setPreviewImage(parsedUser.profileImage || null);
      } catch (err) {
        console.error("Invalid user data");
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="portal-container">
        <img src={chefIcon} />
        <h2 className="portal-logout-message">Logging out</h2>
      </div>
    );
  }

  if (isAdmin) {
    return <AdminPortal />;
  }

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/recipe/${recipeId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUserRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      } else {
        alert("Failed to delete recipe");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="portal-container">
      <div className="portal-profile-container">
        <div className="portal-profile-sec1-wrapper">
          <img
            src={previewImage || user.profileImage || pfp}
            width="200px"
            height="200px"
            className="portal-pfp-image"
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: "pointer" }}
            alt="Profile"
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageSelect}
          />
        </div>
        <div className="portal-profile-sec2-wrapper">
          <h1 className="portal-profile-sec2-fullName">{user.fullName}</h1>
          <h2 className="portal-profile-sec2-icon">
            {user.isProChef ? "Pro Chef" : "Amateur Chef"}
          </h2>
          <div className="portal-logout-btn-wrapper">
            <button
              className="portal-logout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("info");
                setUser("");
                window.location.href = "/"; // redirect to home
              }}
            >
              Logout
            </button>
            <h1
              className="portal-profile-sec-3-editProfile"
              onClick={() => setIsEditing((prev) => !prev)}
            >
              {isEditing ? "Top Recipe" : "Edit Profile"}
            </h1>
          </div>
        </div>
      </div>

      <div className="portal-body-container">
        <div className="portal-body-grid-item">
          {isEditing ? (
            <>
              {showSuccessModal && (
                <SuccessModal
                  message="Password updated successfully!"
                  isOpen={showSuccessModal}
                  onClose={() => setShowSuccessModal(false)}
                />
              )}
              <div className="edit-profile-form">
                <div className="edit-profile-form-input-wrapper">
                  <label className="edit-profile-form-label">Email</label>
                  <br />
                  <input
                    value={email}
                    disabled
                    className="edit-form-item-input"
                  />
                </div>

                <div className="edit-profile-form-input-wrapper">
                  <label className="edit-profile-form-label">Username</label>
                  <br />
                  <input
                    value={username}
                    disabled
                    className="edit-form-item-input"
                  />
                </div>

                <div className="edit-profile-form-input-wrapper">
                  <label className="edit-profile-form-label">
                    New Password
                  </label>
                  <br />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="edit-form-item-input"
                  />
                </div>

                <button
                  className="portal-body-recipes-item-delete-btn"
                  onClick={async () => {
                    if (!password) {
                      setError("Password cant be left blank...");

                      return;
                    }

                    try {
                      const response = await fetch(
                        `http://localhost:5000/api/users/${user.id}`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ password }),
                        }
                      );

                      const data = await response.json();

                      if (response.ok) {
                        setShowSuccessModal(true);
                        setPassword("");
                      } else {
                        setError("Server error");
                        alert(`Failed to update password: ${data.message}`);
                      }
                    } catch (err) {
                      console.error("Error updating password:", err);
                      alert("An error occurred. Please try again.");
                      setError("Server error");
                    }
                  }}
                >
                  Save
                </button>
                {error !== "" && (
                  <h2 className="error-icon">
                    <MdError />
                  </h2>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="top-recipe-title">Your Top Recipe</h1>

              {topRecipe ? (
                <>
                  <div className="top-recipe-image-wrapper">
                    <img
                      className="top-recipe-image"
                      width="332px"
                      height="166px"
                      src={topRecipe.thumbnail || dummy2}
                      alt={topRecipe.title}
                    />
                  </div>
                  <h2 className="top-recipe-name">{topRecipe.title}</h2>
                  <p className="top-recipe-desc">{topRecipe.description}</p>
                </>
              ) : (
                <p className="top-recipe-desc-err">No recipes to show</p>
              )}
            </>
          )}
        </div>
        <div className="portal-body-grid-item">
          <h1 className="portal-body-analytic-title">Analytics</h1>
          <div className="portal-body-analytic-grid">
            <div className="portal-body-analytic-grid-item1">
              <h1 className="analytic-grid-item-stat">0</h1>
              <h2 className="analytic-grid-item-statType">Daily Visits</h2>
            </div>
            <div className="portal-body-analytic-grid-item2">
              <h1 className="analytic-grid-item-stat">0</h1>
              <h2 className="analytic-grid-item-statType">Followers</h2>
            </div>
            <div className="portal-body-analytic-grid-item3">
              <h1 className="analytic-grid-item-stat">{totalRecipes}</h1>
              <h2 className="analytic-grid-item-statType">Recipes</h2>
            </div>
            <div className="portal-body-analytic-grid-item4">
              <h1 className="analytic-grid-item-stat">{userAvgRating}</h1>
              <h2 className="analytic-grid-item-statType">Avg Rating</h2>
            </div>
          </div>
        </div>
        <div className="portal-body-grid-item">
          <h1 className="portal-body-recipes-title">Manage Recipes</h1>
          <div className="portal-body-recipes-filters-container">
            <button
              className={`filter-newer ${
                filterType === "newer" ? "active-filter" : ""
              }`}
              onClick={() => setFilterType("newer")}
            >
              Newer
            </button>
            <button
              className={`filter-older ${
                filterType === "older" ? "active-filter" : ""
              }`}
              onClick={() => setFilterType("older")}
            >
              Older
            </button>
            <button
              className={`filter-top ${
                filterType === "top" ? "active-filter" : ""
              }`}
              onClick={() => setFilterType("top")}
            >
              Top
            </button>
          </div>
          <div className="portal-body-recipes-list-container">
            {filteredRecipes.length === 0 ? (
              <p className="no-recipes-msg">No matching recipes found.</p>
            ) : (
              sortedRecipes.map((recipe) => (
                <div key={recipe._id} className="portal-body-recipes-item">
                  <h1 className="portal-body-recipes-item-title">
                    {recipe.title}
                  </h1>
                  <p className="portal-body-recipes-item-desc">
                    {recipe.description}
                  </p>
                  <div className="portal-body-recipes-item-delete-btn-wrapper">
                    <button
                      className="portal-body-recipes-item-delete-btn"
                      onClick={() => handleDeleteRecipe(recipe._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="portal-body-recipes-list-search-btn-wrapper">
            <input
              type="text"
              className="filter-user-search"
              placeholder="search recipe"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="portal-body-grid-item">
          <h1 className="portal-body-revenue-title">Revenue</h1>
          <div className="portal-body-revenue-stats-container">
            <h1 className="portal-body-current-month-revenue">
              $0.00
              <br />
              <span className="currentMonth">Current month</span>
            </h1>
            <h1 className="portal-body-total-revenue">
              $0.00
              <br />
              <span className="totalRevenue">Total revenue</span>
            </h1>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Portal;
