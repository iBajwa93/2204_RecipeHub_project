import React, { useEffect, useState } from 'react';
import './Portal.css';
import pfp from '../../assets/images/pfp.png'
import dummy2 from '../../assets/images/dummy2.png'


const Portal = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('info');
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);
      } catch (err) {
        console.error('Invalid user data');
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="portal-container">
        <h2 className="portal-logout-message">Logging out</h2>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <div className="portal-profile-container">
        <div className="portal-profile-sec1-wrapper">
            <img src={pfp} width="200px" height="200px" className="portal-pfp-image"/>
        </div>
        <div className="portal-profile-sec2-wrapper">
            <h1 className="portal-profile-sec2-fullName">{user.fullName}</h1>
            <h2 className="portal-profile-sec2-icon">{user.isProChef ? 'Pro Chef' : 'Amateur Chef'}</h2>
            <button
                className="portal-logout-btn"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('info');
                  setUser('');
                  window.location.href = '/'; // redirect to home
                }}
              >
                Logout
              </button>
              <h1 className="portal-profile-sec-3-editProfile">Edit Profile</h1>
        </div>
      </div>
    
      <div className="portal-body-container">
        <div className="portal-body-grid-item">
            <h1 className="top-recipe-title">Your Top Recipe</h1>
            <div className="top-recipe-image-wrapper">
                <img className="top-recipe-image" width="332px" height="166px" src={dummy2}/>
            </div>
            
            <h2 className="top-recipe-name">Lorem ipsum dolor</h2>
            <p className="top-recipe-desc">Lorem ipsum dolor sit amet, consectetur adipiscing 
elit dolor ipsum</p>
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
                    <h1 className="analytic-grid-item-stat">0</h1>
                    <h2 className="analytic-grid-item-statType">Recipes</h2>
                </div>
                <div className="portal-body-analytic-grid-item4">
                    <h1 className="analytic-grid-item-stat">0</h1>
                    <h2 className="analytic-grid-item-statType">Avg Rating</h2>
                </div>
            </div>
        </div>
        <div className="portal-body-grid-item">
            <h1 className="portal-body-recipes-title">Manage Recipes</h1>
            <div className="portal-body-recipes-filters-container">
                <button className="filter-newer">Newer</button>
                <button className="filter-older">Older</button>
                <button className="filter-top">Top</button>
            </div>
            <div className="portal-body-recipes-list-container">
                <div className="portal-body-recipes-item">
                    <h1 className="portal-body-recipes-item-title">Lorem ipsum  </h1>
                    <p className="portal-body-recipes-item-desc">Lorem ipsum dolor sit amet, consectetur</p>
                </div>
                <div className="portal-body-recipes-item">
                    <h1 className="portal-body-recipes-item-title">Lorem ipsum  </h1>
                    <p className="portal-body-recipes-item-desc">Lorem ipsum dolor sit amet, consectetur</p>
                </div>
                <div className="portal-body-recipes-item">
                    <h1 className="portal-body-recipes-item-title">Lorem ipsum  </h1>
                    <p className="portal-body-recipes-item-desc">Lorem ipsum dolor sit amet, consectetur</p>
                </div>
            </div>
        </div>
        <div className="portal-body-grid-item">
            <h1 className="portal-body-revenue-title">Revenue</h1>
            <div className="portal-body-revenue-stats-container">
                <h1 className="portal-body-current-month-revenue">$0.00<br/><span className="currentMonth">Current month</span></h1>
                <h1 className="portal-body-total-revenue">$0.00<br/><span className="totalRevenue">Total revenue</span></h1>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Portal;
