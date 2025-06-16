import React from "react";
import "./Body.css";
import dummy1 from "../../assets/images/dummy.png";
import dummy2 from "../../assets/images/dummy2.png";
import star from "../../assets/icons/star.png";
import italian from "../../assets/images/italian.png";
import indian from "../../assets/images/indian.png";
import mexican from "../../assets/images/mexican.png";
import StarRating from "../../components/ratings/StarRating";

const Body = () => {
  return (
    <div className="homepage-body">
      <div className="body-container">
        <div className="featured-container">
          <div className="featured-title-wrapper">
            <h1 className="featured-title">Featured Videos</h1>
          </div>
          <div className="featured-videos-container">
            <div className="featured-videos-item">
              <img
                className="featured-videos-item-img"
                src={dummy1}
                width="464px"
                height="232px"
              />
              <h1 className="featured-videos-item-title">
                Lorem ipsum dolor sit amet
              </h1>
              <h2 className="featured-videos-item-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing
              </h2>
              <div className="featured-videos-item-btnstar-container">
                <button className="featured-videos-item-btn">View</button>
                <StarRating recipeId="684f9d8e762ceeea5d73edc0" />
              </div>
            </div>

            <div className="featured-videos-item">
              <img
                className="featured-videos-item-img"
                src={dummy1}
                width="464px"
                height="232px"
              />
              <h1 className="featured-videos-item-title">
                Lorem ipsum dolor sit amet
              </h1>
              <h2 className="featured-videos-item-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </h2>
              <div className="featured-videos-item-btnstar-container">
                <button className="featured-videos-item-btn">View</button>
                <StarRating recipeId="684f9d8e762ceeea5d73edc0" />
              </div>
            </div>

            <div className="featured-videos-item">
              <img
                className="featured-videos-item-img"
                src={dummy1}
                width="464px"
                height="232px"
              />
              <h1 className="featured-videos-item-title">
                Lorem ipsum dolor sit amet
              </h1>
              <h2 className="featured-videos-item-description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
              </h2>
              <div className="featured-videos-item-btnstar-container">
                <button className="featured-videos-item-btn">View</button>
                <StarRating recipeId="684f9d8e762ceeea5d73edc0" />
              </div>
            </div>
          </div>
        </div>

        <div className="browse-container">
          <div className="browse-title-wrapper">
            <h1 className="browse-title-text">Browse by Category</h1>
          </div>
          <div className="browse-category-container">
            <div className="browse-category-item-container">
              <img className="category-img" src={italian} />
              <h1 className="browse-category-item-title">Italian</h1>
              <p className="browse-category-item-description">
                Lorem ipsum dolor sit amet
              </p>
            </div>
            <div className="browse-category-item-container">
              <img className="category-img" src={mexican} />
              <h1 className="browse-category-item-title">Mexican</h1>
              <p className="browse-category-item-description">
                Lorem ipsum dolor sit amet
              </p>
            </div>
            <div className="browse-category-item-container">
              <img className="category-img" src={indian} />
              <h1 className="browse-category-item-title">Indian</h1>
              <p className="browse-category-item-description">
                Lorem ipsum dolor sit amet
              </p>
            </div>
          </div>
          <div className="explore-container">
            <div className="explore-item-wrapper">
              <div className="explore-title-wrapper">
                <h1 className="explore-title-text">Explore</h1>
              </div>
              <div className="explore-item-video-container">
                <div className="explore-item-video-wrapper">
                  <img className="explore-item-video-tn" src={dummy2} />
                  <h1 className="explore-item-video-title">
                    Best Crepe | Recipe
                  </h1>
                  <h2 className="explore-item-video-author">Dan H.</h2>
                  <p className="explore-item-stats">1942 views | 10 minutes</p>
                </div>
                <div className="explore-item-video-wrapper">
                  <img className="explore-item-video-tn" src={dummy2} />
                  <h1 className="explore-item-video-title">Linguine Pasta</h1>
                  <h2 className="explore-item-video-author">Dan H.</h2>
                  <p className="explore-item-stats">15 views | 35 minutes</p>
                </div>
                <div className="explore-item-video-wrapper">
                  <img className="explore-item-video-tn" src={dummy2} />
                  <h1 className="explore-item-video-title">
                    Creamy Butter Chicken
                  </h1>
                  <h2 className="explore-item-video-author">Dan H.</h2>
                  <p className="explore-item-stats">988 views | 20 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
