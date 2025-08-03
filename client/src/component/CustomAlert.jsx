import React, { useEffect } from "react";

const CustomAlert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto close in 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  const colorMap = {
    success: "bg-green-600 border-green-400 text-white",
    error: "bg-red-600 border-red-400 text-white",
    info: "bg-blue-600 border-blue-400 text-white",
    warning: "bg-yellow-600 border-yellow-400 text-black",
  };

  return (
    <div className={`fixed top-5 right-5 z-[9999] shadow-lg px-4 py-3 rounded-md border ${colorMap[type] || colorMap.info}`}>
      {message}
    </div>
  );
};

export default CustomAlert;