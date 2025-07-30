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

    useEffect(() => {
        const fetchChefs = async () => {
            try {
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
            } catch (error) {
                console.error("Failed to fetch chefs:", error);
            }
        };

        fetchChefs();
    }, []);

    return (
        <div className="chefs-container">
            <div className="chefs-top-performers-container">
                <h1 className="chefs-top-performers-title">Top 3 Performers</h1>
                <div className="chefs-top-performers-wrapper">
                    {topPerformers.map((chef, index) => (
                        <div className="chefs-top-performer-item" key={index}>
                            <img
                                onClick={() => setSelectedChef(chef)}
                                className="chefs-pfp"
                                width="95px"
                                src={chef.profilePicture || pfp}
                                style={{ cursor: "pointer" }}
                            />
                            <h1 className="chefs-top-performer-name">{chef.fullName}</h1>
                            <div className="chefs-top-performer-rating">
                                {[...Array(Math.round(chef.avgRating))].map((_, i) => (
                                    <img key={i} className="chefs-star" width="25px" src={star} />
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
                                    onClick={() => setSelectedChef(chef)}
                                    style={{ cursor: "pointer" }}
                                />
                                <h1 className="chefs-performer-name">{chef.fullName}</h1>
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
