import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the context
const AuthContext = createContext();

// 2. Custom hook to use context easily
export const useAuth = () => useContext(AuthContext);

// 3. Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => { 
    console.log(user, token);
    if (user) {
      console.log("👤 User loaded from localStorage:", user);
    } else {
      console.log("👤 No user found in localStorage");
    }
    if (token) {
      console.log("🔑 Token loaded from localStorage:", token);
    } else {
      console.log("🔑 No token found in localStorage");
    }
  }, [user, token]);
  // Save user + token in localStorage when changed
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    
  }, [user, token]);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, modalOpen, setModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
};