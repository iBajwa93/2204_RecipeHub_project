
import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import React from 'react';
import './Header.css';
import search from '../../assets/icons/search.png'
import { IoSearchOutline } from "react-icons/io5";
import { Twirl as Hamburger } from 'hamburger-react'
import Navigation from '../../components/nav/Navigation'


const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState();
  const [loggedInUser, setLoggedInUser] = useState('');
  const toggleNav = () => setIsNavOpen(prev => !prev);
  const [headerSection, setHeaderSection] = useState("home"); // "home", "about", or "careers"



  useEffect(() => {
      const userInfo = localStorage.getItem('info');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          setLoggedInUser(user.fullName || '');
        } catch (err) {
          console.error('Failed to parse user info from localStorage or user isnt logged in yet');
        }
      }
    }, []);
  

    
  return (
    <header className="homepage-header">
        
      <Navigation isOpen={isNavOpen} onClose={toggleNav} onSectionChange={setHeaderSection} currentSection={headerSection} />
        <div className="homepage-header-hamburger-container">
          <div className="homepage-header-hamburger-wrapper">
            <Hamburger
              toggled={isNavOpen}
              toggle={setIsNavOpen}
              className="homepage-header-hamburger"
              distance="sm"
              color="#FFFFFF"
              rounded
              size={30}
            />
          </div>
        </div>

        <div className="homepage-header-bg">
          {headerSection === "home" ? (
            <>
              <div className="homepage-header-text-wrapper">
                <h1 className="homepage-header-text">
                  {loggedInUser ? (
                    <>
                      Welcome back, <br />
                      <span className="homepage-header-text-underline">{loggedInUser}</span>
                    </>
                  ) : (
                    <>
                      Your hub for <span className="homepage-header-text-underline">amazing</span><br />
                      recipes
                    </>
                  )}
                </h1>
              </div>
              <div className="homepage-header-input-container">
                <div className="homepage-header-input-wrapper">
                  <input type="text" placeholder="search recipes..." className="homepage-header-input" />
                  <IoSearchOutline className="search-icon" size={40} />
                </div>
              </div>
            </>
          ) : headerSection === "about" ? (
            <div className="about-box">
              <h1 className="about-box-title">About us</h1>
              <p className="about-box-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin neque velit, tempus et justo id, 
elementum venenatis elit. Phasellus vulputate, sapien eu consequat ullamcorper, turpis massa 
hendrerit nunc, ac dictum
<br/>
<br/>
 ipsum velit ut nisi. Nunc cursus mi ut euismod cursus. Maecenas ut tellus 
ultricies, interdum dui tincidunt,</p>
            </div>
          ) : headerSection === "careers" ? (
            <div className="careers-box">
              <h1 className="careers-box-title">Careers @ RecipeHub</h1>
              <p className="careers-box-desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin neque velit, tempus et justo id, 
              elementum venenatis elit. Phasellus vulputate, sapien eu consequat ullamcorper, turpis massa 
              hendrerit nunc, ac dictum
              <br/>
              <br/>
              ipsum velit ut nisi. Nunc cursus mi ut euismod cursus. Maecenas ut tellus 
              ultricies, interdum dui tincidunt,</p>
              <div className="careers-apply-btn-wrapper">
                <button className="careers-apply-btn">
                    Apply
                </button>
              </div>
            </div>
            
          ) : null}
        </div>

    </header>
  );
};

export default Header;
