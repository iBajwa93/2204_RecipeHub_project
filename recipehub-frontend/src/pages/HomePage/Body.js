import React from 'react';
import './Body.css';
import dummy1 from '../../assets/images/dummy.png'
import star from '../../assets/icons/star.png'
import italian from '../../assets/images/italian.png'
import indian from '../../assets/images/indian.png'
import mexican from '../../assets/images/mexican.png'

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
                        <img className="featured-videos-item-img" src={dummy1} width="464px" height="232px" />
                        <h1 className="featured-videos-item-title">Lorem ipsum dolor sit amet</h1>
                        <h2 className="featured-videos-item-description">Lorem ipsum dolor sit amet, consectetur adipiscing</h2>
                        <div className="featured-videos-item-btnstar-container">
                           <button className="featured-videos-item-btn">View</button> 
                           <div className="featured-videos-item-star-container">
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                           </div>
                           
                        </div>
                    </div>

                    <div className="featured-videos-item">
                        <img className="featured-videos-item-img" src={dummy1} width="464px" height="232px" />
                        <h1 className="featured-videos-item-title">Lorem ipsum dolor sit amet</h1>
                        <h2 className="featured-videos-item-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
                        <div className="featured-videos-item-btnstar-container">
                           <button className="featured-videos-item-btn">View</button> 
                            <div className="featured-videos-item-star-container">
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                           </div>
                        </div>
                    </div>

                    <div className="featured-videos-item">
                        <img className="featured-videos-item-img" src={dummy1} width="464px" height="232px" />
                        <h1 className="featured-videos-item-title">Lorem ipsum dolor sit amet</h1>
                        <h2 className="featured-videos-item-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2>
                        <div className="featured-videos-item-btnstar-container">
                           <button className="featured-videos-item-btn">View</button> 
                            <div className="featured-videos-item-star-container">
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                                <img className="featured-videos-item-star" src={star} width="35px" height="35px" />
                           </div>
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
                        <h1 className="browse-category-item-title">
                            Italian
                        </h1>
                        <p className="browse-category-item-description">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div className="browse-category-item-container">
                        <img className="category-img" src={mexican} />
                        <h1 className="browse-category-item-title">
                            Mexican
                        </h1>
                        <p className="browse-category-item-description">Lorem ipsum dolor sit amet</p>
                    </div>
                    <div className="browse-category-item-container">
                        <img className="category-img" src={indian} />
                        <h1 className="browse-category-item-title">
                            Indian
                        </h1>
                        <p className="browse-category-item-description">Lorem ipsum dolor sit amet</p>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  );
};

export default Body;
