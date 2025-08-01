
import { useState, useEffect} from 'react';
import { useLocation, useNavigate } from "react-router-dom";
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
  const [headerSection, setHeaderSection] = useState("home");

  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/recipes?search=${encodeURIComponent(query.trim())}`);
      }
    };


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
                  <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="search recipes..." className="homepage-header-input" />
                  <IoSearchOutline className="search-icon"  onClick={handleSearch} size={40} />
                </div>
              </div>
            </>
          ) : headerSection === "about" ? (
            <div className="about-box">
              <h1 className="about-box-title">About us</h1>
              <p className="about-box-desc">
                  At RecipeHub, we're all about real food, real people, and real passion. Whether you're a home cook with a secret family recipe or a pro chef sharing 
                  your creative edge, this is your space to shine. We built RecipeHub to bring food lovers and creators together—from every kitchen, culture, and corner of the world.
                <br/>
                <br/>
                  It's not just about posting recipes—it's about storytelling, connecting through flavor, and growing a community where anyone can inspire or be inspired. Our mission?
                  To make 
                  cooking more fun, more accessible, and way more personal. So whether you're here to learn, share, or just explore, welcome to the hub.
                </p>
            </div>
          ) : headerSection === "careers" ? (
            <div className="careers-box">
              <h1 className="careers-box-title">Careers @ RecipeHub</h1>
              <p className="careers-box-desc">
                Love cooking? Passionate about sharing your creations with the world? Join RecipeHub and take the next step. Whether you're just starting or already mastering your craft, becoming a Pro Chef is your chance to grow, inspire, and stand out.

                Apply today to share your passion, gain followers, and boost your culinary career.
                </p>
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
