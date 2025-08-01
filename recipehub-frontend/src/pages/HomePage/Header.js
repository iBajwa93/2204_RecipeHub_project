import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import React from 'react';
import './Header.css';
import { IoSearchOutline } from "react-icons/io5";
import { Twirl as Hamburger } from 'hamburger-react';
import Navigation from '../../components/nav/Navigation';
import SuccessModal from '../../components/success/SuccessModal';

const Header = ({isOpen, onClose}) => {
  const [isNavOpen, setIsNavOpen] = useState();
  const [loggedInUser, setLoggedInUser] = useState('');
  const [isProChef, setIsProChef] = useState(false);
  const toggleNav = () => setIsNavOpen(prev => !prev);
  const [headerSection, setHeaderSection] = useState("home");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("")


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
        setIsProChef(user.isProChef || false);
      } catch (err) {
        console.error('Failed to parse user info from localStorage or user isnt logged in yet');
      }
    }
  }, []);

  const applyToProChef = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to apply.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/prochefapps/apply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
         setModalMessage("Your application will be reviewed by our team shortly.");
         setShowSuccessModal(true);
      } else if (data.message === "You already have a pending application."){
         setModalMessage("You already have a pending application.");
         setShowSuccessModal(true);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <header className="homepage-header">
      <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            
            navigate('/')
          }}
          message={modalMessage}
        />
      <Navigation
        isOpen={isNavOpen}
        onClose={toggleNav}
        onSectionChange={setHeaderSection}
        currentSection={headerSection}
      />
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
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="search recipes..."
                  className="homepage-header-input"
                />
                <IoSearchOutline className="search-icon" onClick={handleSearch} size={40} />
              </div>
            </div>
          </>
        ) : headerSection === "about" ? (
          <div className="about-box">
            <h1 className="about-box-title">About us</h1>
            <p className="about-box-desc">
              At RecipeHub, we're all about real food, real people, and real passion. Whether you're a home cook with a secret family recipe or a pro chef sharing
              your creative edge, this is your space to shine. We built RecipeHub to bring food lovers and creators together—from every kitchen, culture, and corner of the world.
              <br />
              <br />
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
              {/* Only show Apply button if user is logged in and NOT already a Pro Chef */}
              {loggedInUser && !isProChef && (
                <button className="careers-apply-btn" onClick={applyToProChef}>
                  Apply
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
