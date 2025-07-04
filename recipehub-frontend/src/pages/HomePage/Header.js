
import { useState, useEffect } from 'react';
import React from 'react';
import './Header.css';
import search from '../../assets/icons/search.png'
import { IoSearchOutline } from "react-icons/io5";
import { Twirl as Hamburger } from 'hamburger-react'
import Navigation from '../../components/nav/Navigation'

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');
  const toggleNav = () => setIsNavOpen(prev => !prev);


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
        
      <Navigation isOpen={isNavOpen} onClose={toggleNav} />

        <div className="homepage-header-bg">
            <div className="homepage-header-hamburger-container">
                <div className="homepage-header-hamburger-wrapper">
                    <Hamburger toggled={isNavOpen}
                    toggle={setIsNavOpen} className="homepage-header-hamburger" distance='sm' color="#FFFFFF" rounded size={30}/>
                </div>
            </div>
            <div className="homepage-header-text-wrapper">
                <h1 className="homepage-header-text">
  {loggedInUser ? (
    <>
      Welcome back, <br/> <span className="homepage-header-text-underline">{loggedInUser}</span>
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
                    <input type="text" placeholder="search recipes..." className="homepage-header-input"/>
                    <IoSearchOutline className="search-icon" size={40} /> 
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;
