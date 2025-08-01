import React, { useEffect, useState } from "react";
import "./AdminPortal.css";
import dummyThumbnail from "../../assets/images/dummy2.png";
import dummyAvatar from "../../assets/images/pfp.png";
import chefIcon from "../../assets/icons/minichef.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPortal = () => {
  const [proChefApps, setProChefApps] = useState([]);
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

  useEffect(() => {
    const fetchProChefApps = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/prochefapps`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setProChefApps(data);
        } else {
          console.error("Failed to fetch pro chef applications");
        }
      } catch (err) {
        console.error("Error fetching pro chef applications:", err);
      }
    };

    fetchProChefApps();
  }, []);

  const navigate = useNavigate();

  const handleAdminUpdate = async () => {
    try {
      const body = {
        email: adminInfo.email,
        username: adminInfo.username,
      };

      if (adminInfo.password.trim() !== "") {
        body.password = adminInfo.password;
      }

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
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

  const handleApprove = async (appId) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/prochefapps/${appId}/approve`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (res.ok) {
      alert("Application approved!");
      setProChefApps((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: "approved" } : app
        )
      );
    } else {
      alert(data.message || "Approval failed");
    }
  } catch (err) {
    console.error("Approval error:", err);
    alert("Something went wrong");
  }
};

const handleReject = async (appId) => {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/prochefapps/${appId}/reject`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (res.ok) {
      alert("Application rejected!");
      setProChefApps((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status: "rejected" } : app
        )
      );
    } else {
      alert(data.message || "Rejection failed");
    }
  } catch (err) {
    console.error("Rejection error:", err);
    alert("Something went wrong");
  }
};


  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/upload-avatar`, {
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
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipe`);
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
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
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
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/stats`, {
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
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
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
   
      <div className="left-column">
       
        <div className="admin-profile">
        
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-upload"
            onChange={handleAvatarUpload}
          />
          <button className="back-btn" onClick={() => navigate("/")}>
            Home
          </button>

          <img
            src={adminInfo.profileImage || dummyAvatar}
            alt="Admin"
            className="admin-avatar-large"
            onClick={() => document.getElementById("avatar-upload").click()}
          />

          <div className="admin-meta">
            <div className="admin-header">
              <h2 className="admin-name">{adminInfo.username || "Admin"}</h2>{" "}
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

      
        <section className="admin-box">
          <h3>User Search</h3>
          <div className="filter-btns">
            {["Newer", "Older"].map((filter) => (
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

          {[...allUsers]
            .filter((user) => !user.isBanned)
            .filter((user) => !user.isAdmin)
            .filter((user) =>
              (user.fullName || "")
                .toLowerCase()
                .includes(userSearchQuery.toLowerCase())
            )
            .sort((a, b) =>
              activeFilter === "Newer"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt)
            )
            .map((user) => (
              <div className="user-row" key={user._id}>
                <p>
                  <strong>{user.fullName}</strong> — Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <p
                  style={{
                    color: user.isProChef ? "#D7352D" : "#3DBA58",
                    fontFamily: "HindRegular",
                    marginTop: "4px",
                    marginBottom: "8px",
                  }}
                >
                  {user.isProChef ? "Pro Chef" : "Amateur Chef"}
                </p>
                <h3 className="user-avg-rating">Average Rating: {user.avgRating}</h3>
                
                <button
                  className="ban-btn"
                  onClick={async () => {
                    try {
                      const response = await fetch(
                        `${process.env.REACT_APP_BACKEND_URL}/api/admin/user/${user._id}/ban`,
                        {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      const data = await response.json();
                      console.log("Ban response:", data);

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

      <div className="right-column">
       
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
                      const response = await fetch(
                        `${process.env.REACT_APP_BACKEND_URL}/api/admin/user/${user._id}/unban`,
                        {
                          method: "PUT",
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      const data = await response.json();
                      console.log("Unban response:", data);
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
        <section className="admin-box">
          <h3>Pro Chef Applications</h3>
          <div className="applications-grid">
            {proChefApps.length === 0 ? (
              <p>No Pro Chef applications found.</p>
            ) : (
              proChefApps.map((app) => (
                <div key={app._id} className="application-card">
                  <p>
                    <strong>{app.user.fullName || app.user.username || "User"}</strong>
                  </p>
                  <p>Status: {app.status}</p>
                  <p>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</p>

                  {app.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="approve-btn"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(app._id)}
                        className="reject-btn"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPortal;