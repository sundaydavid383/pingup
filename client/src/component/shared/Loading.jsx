// Loading.jsx
import React from "react";
import "./loading.css"; // keep your styles

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="google-loader mb-4">
        <span className="dot dot1"></span>
        <span className="dot dot2"></span>
        <span className="dot dot3"></span>
        <span className="dot dot4"></span>
      </div>
      <p className="text-white text-sm font-medium">{text}</p>
    </div>
  );
};

export default Loading;
