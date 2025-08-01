import React, { useState } from 'react';
import './LoginModal.css';
import Google from '../../assets/icons/google.png';
import chefIcon from '../../assets/images/chef.png';
import { MdError } from "react-icons/md";

const LoginModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        // Optional: Save token to localStorage
        localStorage.setItem('token', data.token);
        // Save user data to storage until logout.
        localStorage.setItem('info', JSON.stringify(data.user));
        window.location.href = '/'; // redirect to home
        onClose();
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        {error !== '' && (
          <div className="error-icon-container">
            <h2 className="error-icon"><MdError /></h2>
          
          </div>
        )}
        <div className="login-form-wrapper">
          <img src={chefIcon} height="40" width="40" />
          <h1 className="login-form-title">
            Welcome back, <span className="bold">Login</span> below
          </h1>

          <div className="login-form-input-container">
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input name="email" onChange={handleChange} className="input-field" type="text" />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input name="password" onChange={handleChange} className="input-field" type="password" />
            </div>
          </div>

          <div className="login-checkbox">
            <input type="checkbox" id="remember" />
            <label className="remember-text" htmlFor="remember">Remember Me</label>
          </div>

          <div className="login-button-wrapper">
            <button onClick={handleLogin} className="login-button">Login</button>
            <img className="google-icon" src={Google} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
