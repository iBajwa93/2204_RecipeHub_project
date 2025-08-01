import React from "react";

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
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          maxWidth: "400px",
          textAlign: "center",
          boxShadow: "0 0 10px rgba(0,0,0,0.25)",
          userSelect: "none",
        }}
      >
        <h2>You have been banned</h2>
        <p>Your account has been suspended. Please contact support if you believe this is a mistake.</p>
      </div>
    </div>
  );
};

export default BannedModal;
