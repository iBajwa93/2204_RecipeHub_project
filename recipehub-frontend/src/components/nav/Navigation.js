import React, { useState } from 'react';
import './Navigation.css';
import chefIcon from '../../assets/images/chef.png';
import RegisterModal from '../register/RegisterModal';
import LoginModal from '../login/LoginModal'

const Navigation = ({ isOpen, onClose }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);


  const handleCareersClick = (e) => {
    e.preventDefault(); // prevent link navigation
    setShowRegister(true);
  };

  return (
    <>
      <nav className={`nav ${isOpen ? 'open' : ''}`}>
        <div className="nav-overlay" onClick={onClose} />
        <div className="nav-content">
          <div className="nav-header">
            <img src={chefIcon} alt="Chef Icon" className="nav-logo" />
            <span className="nav-title">RecipeHub</span>
          </div>

          <ul className="nav-links primary-links">
            <li className="nav-item active"><a href="/">Home</a></li>
            <li className="nav-item"><a href="/about">About</a></li>
            <li className="nav-item"><a href="/recipes">Recipes</a></li>
            <li className="nav-item"><a href="/create">Create</a></li>
          </ul>

          <div className="nav-portal-wrapper">
            <a href="#" className="nav-portal-btn" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>
                Portal
            </a>
          </div>

          <ul className="nav-links secondary-links">
            <li className="nav-item"><a href="/" onClick={handleCareersClick}>Careers</a></li>
            <li className="nav-item"><a href="/chefs">Chefs</a></li>
          </ul>
        </div>
      </nav>

      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

    </>
  );
};

export default Navigation;
