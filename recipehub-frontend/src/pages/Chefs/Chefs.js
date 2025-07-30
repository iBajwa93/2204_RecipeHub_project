import React, { useEffect, useState } from "react";
import "./Chefs.css"; // optional, for styling
import { useNavigate } from "react-router-dom";
import pfp from '../../assets/images/pfp.png';
import star from '../../assets/icons/star.png'
import Footer from '../HomePage/Footer';

const Chefs = () => {


  return (
    <div className="chefs-container">
      <div className="chefs-top-performers-container">
        <h1 className="chefs-top-performers-title">Top 3 Performers</h1>
        <div className="chefs-top-performers-wrapper">
            <div className="chefs-top-performer-item">
                <img className="chefs-pfp" width="95px" src={pfp} />
                <h1 className="chefs-top-performer-name">Parrot P.</h1>
                <div className="chefs-top-performer-rating">
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                </div>
            </div>
            <div className="chefs-top-performer-item">
                <img className="chefs-pfp" width="95px" src={pfp} />
                <h1 className="chefs-top-performer-name">Parrot P.</h1>
                <div className="chefs-top-performer-rating">
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                </div>
            </div>
            <div className="chefs-top-performer-item">
                <img className="chefs-pfp" width="95px" src={pfp} />
                <h1 className="chefs-top-performer-name">Parrot P.</h1>
                <div className="chefs-top-performer-rating">
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                    <img className="chefs-star" width="25px" src={star} />
                </div>
            </div>
        </div>
      </div>
      <div className="chefs-divider-wrapper">
        <div className="chefs-divider"></div>
      </div>
      
      <div className="chefs-all-container">
        <h1 className="chefs-all-title">Chef's</h1>
        <div className="chefs-all-wrapper">
            <div className="chefs-item">
                <img className="chefs-pfp" width="75px" src={pfp} />
                <h1 className="chefs-performer-name">Parrot P.</h1>
            </div>
            <div className="chefs-item">
                <img className="chefs-pfp" width="75px" src={pfp} />
                <h1 className="chefs-performer-name">Alexandre The.</h1>
            </div>
            <div className="chefs-item">
                <img className="chefs-pfp" width="75px" src={pfp} />
                <h1 className="chefs-performer-name">Jarred Jot</h1>
            </div>
            <div className="chefs-item">
                <img className="chefs-pfp" width="75px" src={pfp} />
                <h1 className="chefs-performer-name">Jarred Jot</h1>
            </div>
            <div className="chefs-item">
                <img className="chefs-pfp" width="75px" src={pfp} />
                <h1 className="chefs-performer-name">Jarred Jot</h1>
            </div>
            
        </div>
      </div>
      <div className="chefs-divider-wrapper">
        <div className="chefs-divider"></div>
      </div>
      <div className="chefs-view-profile">

      </div>
      <Footer />
    </div>
  );
};

export default Chefs;
