import React, { useEffect, useState } from "react";
import "./Chefs.css";
import { useNavigate } from "react-router-dom";
import pfp from '../../assets/images/pfp.png';
import star from '../../assets/icons/star.png';
import Footer from '../HomePage/Footer';
import { IoClose } from "react-icons/io5"; // X icon

const Chefs = () => {
    const [allChefs, setAllChefs] = useState([]);
    const [topPerformers, setTopPerformers] = useState([]);
    const [regularChefs, setRegularChefs] = useState([]);
    const [selectedChef, setSelectedChef] = useState(null);
    const [followedChefs, setFollowedChefs] = useState(new Set());

    const token = localStorage.getItem("token");

    // Fetch who the logged-in user is following + chefs data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all chefs
                const response = await fetch("http://localhost:5000/api/users");
                const data = await response.json();
                setAllChefs(data);

                const top = [...data]
                    .filter((chef) => chef.avgRating >= 4)
                    .sort((a, b) => b.avgRating - a.avgRating)
                    .slice(0, 3);

                const regular = data.filter(
                    (chef) => chef.avgRating < 4 || !top.includes(chef)
                );

                setTopPerformers(top);
                setRegularChefs(regular);

                // Fetch following list of logged-in user
                if (token) {
                    const resFollowing = await fetch("http://localhost:5000/api/users/me/following", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (resFollowing.ok) {
                        const followingData = await resFollowing.json();
                        setFollowedChefs(new Set(followingData.following.map(id => id.toString())));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch chefs or following:", error);
            }
        };

        fetchData();
    }, [token]);

    const handleChefClick = async (chef) => {
        try {
            const res = await fetch(`http://localhost:5000/api/users/${chef._id}/increment-visit`, {
                method: "PATCH",
            });
            if (!res.ok) {
                console.error("Failed to increment daily visits");
            } else {
                const data = await res.json();
                console.log(data);
            }
        } catch (err) {
            console.error("Error incrementing daily visits:", err);
        }

        setSelectedChef(chef);
    };

    // Toggle follow/unfollow
    const toggleFollow = async (chefId) => {
        if (!token) {
            alert("Please log in to follow chefs.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/users/${chefId}/follow`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();

                setFollowedChefs(prev => {
                    const newSet = new Set(prev);
                    if (data.following) {
                        newSet.add(chefId);
                    } else {
                        newSet.delete(chefId);
                    }
                    return newSet;
                });
            } else {
                console.error("Failed to toggle follow");
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    return (
        <div className="chefs-container">
            <div className="chefs-top-performers-container">
                <h1 className="chefs-top-performers-title">Top 3 Performers</h1>
                <div className="chefs-top-performers-wrapper">
                    {topPerformers.map((chef, index) => (
                        <div className="chefs-top-performer-item" key={index}>
                            <img
                                onClick={() => handleChefClick(chef)}
                                className="chefs-pfp"
                                width="95px"
                                src={chef.profilePicture || pfp}
                                style={{ cursor: "pointer" }}
                                alt={`${chef.fullName}'s profile`}
                            />
                            <h1 className="chefs-top-performer-name">{chef.fullName}</h1>
                            <div className={`chefs-rank-badge ${chef.isProChef ? 'pro' : 'amateur'}`}>
                                {chef.isProChef ? 'Pro Chef' : 'Amateur Chef'}
                            </div>
                            <div className="chefs-top-performer-rating">
                                {[...Array(Math.round(chef.avgRating))].map((_, i) => (
                                    <img key={i} className="chefs-star" width="25px" src={star} alt="star" />
                                ))}
                            </div>
                       
                        </div>
                    ))}
                </div>
            </div>

            <div className="chefs-divider-wrapper">
                <div className="chefs-divider"></div>
            </div>

            <div className="chefs-all-container">
                <h1 className="chefs-all-title">Chef's</h1>

                {!selectedChef ? (
                    <div className="chefs-all-wrapper">
                        {regularChefs.map((chef, index) => (
                            <div className="chefs-item" key={index}>
                                <img
                                    className="chefs-pfp"
                                    width="75px"
                                    src={chef.profilePicture || pfp}
                                    onClick={() => handleChefClick(chef)}
                                    style={{ cursor: "pointer" }}
                                    alt={`${chef.fullName}'s profile`}
                                />
                                <h1 className="chefs-performer-name">{chef.fullName}</h1>
                                <div className={`chefs-rank-badge ${chef.isProChef ? 'pro' : 'amateur'}`}>
                                    {chef.isProChef ? 'Pro Chef' : 'Amateur Chef'}
                                </div>
                               
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="chefs-detail-view">
                        <div className="chefs-detail-header">
                            <h2 className="chefs-detail-name">{selectedChef.fullName}</h2>
                            <div className="chefs-detail-stats-container">
                                <h2 className="chefs-detail-stats">
                                    {selectedChef.avgRating?.toFixed(1) || "N/A"} Rating |{" "}
                                    {selectedChef.recipes?.length > 0
                                        ? `${selectedChef.recipes[selectedChef.recipes.length - 1].title} recipe${selectedChef.recipes.length > 1 ? "s" : ""}`
                                        : "No recipes yet"}
                                </h2>
                                <div className="follow-btn-wrapper">
                                    <button
                                        className="follow-btn"
                                        onClick={() => toggleFollow(selectedChef._id)}
                                    >
                                        {followedChefs.has(selectedChef._id) ? "Unfollow" : "Follow"}
                                    </button>
                                </div>
                            </div>
                            <div className="x-icon-wrapper">
                                <IoClose
                                    className="x-icon"
                                    size={25}
                                    onClick={() => setSelectedChef(null)}
                                    style={{ cursor: "pointer", textAlign: 'center' }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="chefs-divider-wrapper">
                <div className="chefs-divider"></div>
            </div>

            <div className="chefs-view-profile"></div>
            <Footer />
        </div>
    );
};

export default Chefs;
