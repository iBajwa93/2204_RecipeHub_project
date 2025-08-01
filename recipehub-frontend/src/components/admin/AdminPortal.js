import React, { useEffect, useState } from "react";
import "./AdminPortal.css";
import dummyThumbnail from "../../assets/images/dummy2.png";
import dummyAvatar from "../../assets/images/pfp.png";
import chefIcon from "../../assets/icons/minichef.png";
import axios from "axios";

const AdminPortal = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Newer");
  const [allUsers, setAllUsers] = useState([]);
  const token = localStorage.getItem("token"); // Ensure this exists
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [stats, setStats] = useState({
    dailyVisits: 0,
    monthlyVisits: 0,
    proChefs: 0,
    amateurChefs: 0,
  });
  const [adminInfo, setAdminInfo] = useState({
    email: "",
    username: "",
    password: "",
    profileImage: "",
  });

  const handleAdminUpdate = async () => {
    try {
      const body = {
        email: adminInfo.email,
        username: adminInfo.username,
      };

      if (adminInfo.password.trim() !== "") {
        body.password = adminInfo.password;
      }

      const res = await fetch("http://localhost:5000/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        setAdminInfo((prev) => ({ ...prev, password: "" }));
      } else {
        alert("Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Something went wrong.");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://localhost:5000/api/user/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setAdminInfo((prev) => ({ ...prev, profileImage: data.imageUrl }));
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error("Error uploading avatar:", err);
      alert("Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("info");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/recipe");
        const data = await res.json();
        if (res.ok) {
          setRecipes(data);
        } else {
          console.error("Failed to fetch recipes");
        }
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setAllUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchAdminStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          console.error("Failed to fetch stats");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    const fetchAdminInfo = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setAdminInfo({
            email: data.email,
            username: data.username,
            password: "",
            profileImage: data.profileImage || "", // ✅ populate avatar
          });
        }
      } catch (err) {
        console.error("Error fetching admin info:", err);
      }
    };

    fetchAdminInfo();
    fetchAdminStats();
    fetchAllRecipes();
    fetchAllUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      // const res = await fetch(`http://localhost:5000/api/recipe/${id}`, {
      //   method: "DELETE",
      // });
      // if (res.ok) {
      //   setRecipes((prev) => prev.filter((r) => r._id !== id));
      // } else {
      //   alert("Delete failed");
      // }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting recipe");
    }
  };

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-portal-wrapper">
      {/* LEFT COLUMN */}
      <div className="left-column">
        {/* Admin Profile */}
        <div className="admin-profile">
          {/* <img src={dummyAvatar} alt="Admin" className="admin-avatar-large" /> */}
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-upload"
            onChange={handleAvatarUpload}
          />

          <img
            src={adminInfo.profileImage || dummyAvatar}
            alt="Admin"
            className="admin-avatar-large"
            onClick={() => document.getElementById("avatar-upload").click()}
          />

          <div className="admin-meta">
            <div className="admin-header">
              <h2 className="admin-name">Harman Tiwana</h2>
              <p className="admin-role">
                {" "}
                <img src={chefIcon} />
                Admin
              </p>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>

            <div className="admin-details">
              <label>Email</label>
              <input
                value={adminInfo.email}
                onChange={(e) =>
                  setAdminInfo((prev) => ({ ...prev, email: e.target.value }))
                }
              />

              <label>Username</label>
              <input
                value={adminInfo.username}
                onChange={(e) =>
                  setAdminInfo((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={adminInfo.password}
                onChange={(e) =>
                  setAdminInfo((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />

              <button className="save-btn" onClick={handleAdminUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* User Search */}
        <section className="admin-box">
          <h3>User Search</h3>
          <div className="filter-btns">
            {["Newer", "Older", "Top"].map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {allUsers
            .filter((user) => !user.isBanned)
            .filter((user) =>
              (user.fullName || "")
                .toLowerCase()
                .includes(userSearchQuery.toLowerCase())
            )
            .map((user) => (
              <div className="user-row" key={user._id}>
                <span>
                  <strong>{user.fullName}</strong> — Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
                <button
                  className="ban-btn"
                  onClick={async () => {
                    try {
                      await fetch(
                        `http://localhost:5000/api/user/${user._id}/ban`,
                        {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      setAllUsers((prev) =>
                        prev.map((u) =>
                          u._id === user._id ? { ...u, isBanned: true } : u
                        )
                      );
                    } catch (err) {
                      console.error("Error banning user:", err);
                    }
                  }}
                >
                  Ban
                </button>
              </div>
            ))}

          <input
            className="admin-input"
            placeholder="Search user"
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
        </section>
      </div>

      {/* RIGHT COLUMN */}
      <div className="right-column">
        {/* Suspended Users */}
        <section className="admin-box">
          <h3>Suspended Users</h3>
          {allUsers
            .filter((user) => user.isBanned)
            .filter((user) =>
              (user.fullName || "")
                .toLowerCase()
                .includes(userSearchQuery.toLowerCase())
            )
            .map((user) => (
              <div className="suspended-user" key={user._id}>
                <p>
                  <strong>{user.fullName}</strong> — Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <button
                  className="unban-btn"
                  onClick={async () => {
                    try {
                      await fetch(
                        `http://localhost:5000/api/user/${user._id}/unban`,
                        {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      setAllUsers((prev) =>
                        prev.map((u) =>
                          u._id === user._id ? { ...u, isBanned: false } : u
                        )
                      );
                    } catch (err) {
                      console.error("Error unbanning user:", err);
                    }
                  }}
                >
                  Unban
                </button>
              </div>
            ))}

          <input className="admin-input" placeholder="Search suspended user" />
        </section>

        {/* Site Analytics */}
        <section className="admin-box">
          <h3>Site Analytics</h3>
          <div className="analytics-grid">
            <div>
              <strong>{stats.dailyVisits}</strong>
              <br />
              Daily visits
            </div>
            <div>
              <strong>{stats.monthlyVisits}</strong>
              <br />
              Monthly visits
            </div>
            <div>
              <strong>{stats.proChefs}</strong>
              <br />
              Pro chefs
            </div>
            <div>
              <strong>{stats.amateurChefs}</strong>
              <br />
              Amateur chefs
            </div>
          </div>
        </section>

        {/* All Recipes */}
        {/* <section className="admin-box">
          <h3>All Recipes</h3>
          <input
            className="admin-input"
            placeholder="Search recipe titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="admin-recipe-list">
            {filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="admin-recipe-card">
                <img
                  src={recipe.thumbnail || dummyThumbnail}
                  alt={recipe.title}
                  className="admin-recipe-thumb"
                />
                <div className="admin-recipe-info">
                  <h4>{recipe.title}</h4>
                  <p>{recipe.description}</p>
                  <p>
                    <strong>By:</strong> {recipe.owner?.username || "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default AdminPortal;
