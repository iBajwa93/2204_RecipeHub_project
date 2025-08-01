import React, { useState, useEffect } from "react";
import "./Navigation.css";
import chefIcon from "../../assets/images/chef.png";
import RegisterModal from "../register/RegisterModal";
import LoginModal from "../login/LoginModal";
import CreateModal from '../create/CreateModal'
import pfp from '../../assets/images/pfp.png';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ isOpen, onClose, onSectionChange, currentSection }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [isProChef, setIsProChef] = useState(false);
  
  const navigate = useNavigate();

  // 🔹 Load user info from localStorage
  const loadUserInfo = () => {
    const userInfo = localStorage.getItem('info');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setLoggedInUser(user.fullName || '');
        setIsProChef(!!user.isProChef);
        setProfileImage(user.profileImage || null);
        console.log(profileImage);
        console.log("TIHSSSS");
      } catch (err) {
        console.error('Failed to parse user info from localStorage', err);
      }
    } else {
      setLoggedInUser('');
      setIsProChef(false);
      setProfileImage(null);
    }
  };

  // Run on mount
  useEffect(() => {
    loadUserInfo();

    // 🔹 Update if localStorage changes (like after login)
    window.addEventListener('storage', loadUserInfo);
    return () => window.removeEventListener('storage', loadUserInfo);
  }, []);

  // Compute the correct image src
  const getProfileImageSrc = () => {
    if (!profileImage) return pfp; // fallback local pfp

    // If it's already a valid URL or local build path
    if (
      profileImage.startsWith("http") || 
      profileImage.startsWith("blob") || 
      profileImage.startsWith("data:") ||
      profileImage.includes("static")
    ) {
      return profileImage;
    }

    // Otherwise, assume it's a relative path from the backend
    return `${process.env.REACT_APP_BACKEND_URL}${profileImage.startsWith("/") ? "" : "/"}${profileImage}`;
  };

  return (
    <>
      <nav className={`nav ${isOpen ? "open" : ""}`}>
        <div className="nav-overlay" onClick={onClose} />
        <div className="nav-content">
          
          <div className="nav-header">
            {!loggedInUser && (<img src={chefIcon} alt="Chef Icon" className="nav-logo" />)}
            <span className="nav-title">
              {loggedInUser && (
                <img src={getProfileImageSrc()} alt="PFP" width="100px" className="userpfp" />
              )}
              <br />
              {loggedInUser ? (
                <>
                  Welcome, {loggedInUser}
                  <br />
                  <span className="chef-label">
                    {isProChef ? 'Pro Chef' : 'Amateur Chef'}
                  </span>
                </>
              ) : (
                'RecipeHub'
              )}
            </span>

            {loggedInUser && (
              <div className="nav-auth-section">
                <button
                  className="nav-logout-btn"
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('info');
                    setLoggedInUser('');
                    window.location.href = '/';
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <ul className="nav-links primary-links">
            <li className={`nav-item ${currentSection === "home" ? "active" : ""}`}>
              <a href="#" onClick={(e) => { e.preventDefault(); onSectionChange("home"); onClose(); }}>
                Home
              </a>
            </li>
            <li className={`nav-item ${currentSection === "about" ? "active" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  onSectionChange("about");
                }}
              >
                About
              </a>
            </li>
            <li className={`nav-item ${currentSection === "recipes" ? "active" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  onSectionChange("recipes");
                  navigate("/#recipes");

                  setTimeout(() => {
                    const el = document.getElementById("explore-section");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 50);
                }}
              >
                Recipes
              </a>
            </li>
            <li className={`nav-item ${currentSection === "create" ? "active" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const userInfo = localStorage.getItem('info');
                  onClose();
                  if (userInfo) {
                    setShowCreate(true);
                    onSectionChange("create");
                  } else {
                    setShowLogin(true);
                  }
                }}
              >
                Create
              </a>
            </li>
          </ul>

          <div className="nav-portal-wrapper">
            <a
              href="#"
              className="nav-portal-btn"
              onClick={(e) => {
                e.preventDefault();
                const userInfo = localStorage.getItem('info');
                if (userInfo) {
                  navigate('/portal');
                } else {
                  setShowLogin(true);
                }
              }}
            >
              Portal
            </a>
          </div>

          <ul className="nav-links secondary-links">
            {!isProChef && (
              <li className={`nav-item ${currentSection === "careers" ? "active" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    onSectionChange("careers");
                  }}
                >
                  Careers
                </a>
              </li>
            )}
            <li className={`nav-item ${currentSection === "chefs" ? "active" : ""}`}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  navigate("/chefs");
                  onSectionChange("chefs");
                }}
              >
                Chefs
              </a>
            </li>
          </ul>

          {!loggedInUser && (
            <div className="nav-auth-section">
              <button className="nav-auth-btn" onClick={() => setShowLogin(true)}>
                Login
              </button>
              <button className="nav-auth-btn" onClick={() => setShowRegister(true)}>
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <CreateModal
        isOpen={showCreate}
        onClose={() => {
          setShowCreate(false);
          navigate('/');
        }}
      />
    </>
  );
};

export default Navigation;
