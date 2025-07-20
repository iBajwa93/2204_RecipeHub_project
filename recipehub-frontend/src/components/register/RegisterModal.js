import React from 'react';
import { useState } from 'react'
import './RegisterModal.css';
import Google from '../../assets/icons/google.png'
import chefIcon from '../../assets/images/chef.png'
import { MdError } from "react-icons/md";

const RegisterModal = ({ isOpen, onClose }) => {
    const [error, setError] = useState('');


    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      setError(''); // clear any previous error
      alert('Registered successfully!');
      onClose();
    } else {
      setError(data.message || 'Something went wrong.');
    }
  } catch (err) {
    console.error(err);
    setError('Server error. Please try again later.');
  }
};

   if (!isOpen) return null;

  return (
    <div className="register-modal-overlay" onClick={onClose}>
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        {error && (
          <div className="error-icon-container">
            <h2 className="error-icon"><MdError /></h2>
          </div>
        )}
        <div className="register-form-wrapper">
            <img className="register-chef-icon" height="40" width="40" src={chefIcon}/>
            
            <h1 className="register-form-title"><span className="bold">Join</span> us today,<br/>
                and grow your <span className="bold">Career</span>
            </h1>
            
            <div className="register-form-input-container">

                <div className="input-row">
                    <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <br/>
                    <input onChange={handleChange} name="fullName" className="input-field" type="text" />
                    </div>
                    <div className="input-group">
                    <label className="input-label">Username</label>
                    <br/>
                    <input onChange={handleChange} name="username" className="input-field" type="text"  />
                    </div>
                </div>

                <div className="input-group-full-width">
                    <label className="input-label">Email Address</label>
                    <br/>
                    <input onChange={handleChange} name="email" className="input-field-ea" type="text"  />
                </div>

                <div className="input-row">
                    <div className="input-group">
                    <label className="input-label">Password</label>
                    <br/>
                    <input onChange={handleChange} name="password" className="input-field" type="password" />
                    </div>
                    <div className="input-group">
                    <label className="input-label">Confirm Password</label>
                    <br/>
                    <input onChange={handleChange} name="confirmPassword" className="input-field" type="password" />
                    </div>
                </div>

            </div>
            <div className="register-checkbox">
                <input type="checkbox" id="terms" />
                <label className="terms-text" htmlFor="terms">I agree to the <span className="terms-link">Terms & Conditions</span></label>
            </div>
            <div className="submit-button-wrapper">
                <button onClick={handleSubmit} className="submit-button">Register</button>
                <img className="google-icon" src={Google} alt="Google"/>
                
            </div>
          
             
            
        </div>
      </div>
      
    </div>
  );
};

export default RegisterModal;
