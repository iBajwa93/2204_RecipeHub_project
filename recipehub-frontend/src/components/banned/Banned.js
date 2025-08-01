import React from "react";
import miniChef from '../../assets/icons/minichef.png';

const BannedModal = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0,0,0,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: 'HindLight',
        letterSpacing: '1px',
        zIndex: 9999,
      }}
    >
       
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          maxWidth: "400px",
          fontFamily: 'HindLight',
          textAlign: "center",
          letterSpacing: '1px',
          boxShadow: "0 0 10px rgba(0,0,0,0.25)",
          userSelect: "none",
        }}
      >
         <img src={miniChef}/>
        <h2>You have been banned</h2>
        <p>Your account has been suspended. Please contact support if you believe this is a mistake.</p>
      </div>
    </div>
  );
};

export default BannedModal;
