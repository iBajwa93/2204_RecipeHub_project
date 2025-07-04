import React from 'react';
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-wrapper">
        <p className="text-sm">&copy; {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
