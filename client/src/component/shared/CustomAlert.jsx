import React, { useEffect } from "react";

const CustomAlert = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const duration = type === "success" ? 9000 : 6000; 
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [type, onClose]);

  const bgColor = {
    success: "var(--success)",
    error: "var(--error)",
    info: "var(--info)",
    warning: "var(--warning)",
  };

  const textColor = {
    success: "var(--white)",
    error: "var(--white)",
    info: "var(--white)",
    warning: "#000",
  };

  return (
    <div
      className="fixed top-5 right-5 z-[9999] shadow-lg px-4 py-3 rounded-md border flex items-center justify-between gap-4 min-w-[280px]"
      style={{
        backgroundColor: bgColor[type] || "var(--info)",
        color: textColor[type] || "var(--white)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <span>{message}</span>
      <button onClick={onClose} className="btn">
        ✖
      </button>
    </div>
  );
};

export default CustomAlert;