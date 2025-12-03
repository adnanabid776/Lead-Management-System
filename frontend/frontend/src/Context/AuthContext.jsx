// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState, useRef } from "react";
import { fetchMe } from "../api/auth";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
export { AuthContext };

function parseToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasLoadedUser = useRef(false);

  useEffect(() => {
    if (hasLoadedUser.current) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      hasLoadedUser.current = true;
      setLoading(false);
      return;
    }
    
    const loadUser = async () => {
      setLoading(true);
      hasLoadedUser.current = true;
      try {
        // First try to get user from token
        const payload = parseToken(token);
        if (payload) {
          setUser({
            _id: payload.id || payload._id,
            email: payload.email,
            role: payload.role,
            name: payload.name,
            token: token
          });
        }
        
        // Then verify with backend
        const res = await fetchMe();
        const userData = res.data;
        setUser({
          _id: userData.id || userData._id,
          email: userData.email,
          role: userData.role,
          name: userData.name,
          token: token
        });
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser({
      _id: userData.id || userData._id,
      email: userData.email,
      role: userData.role,
      name: userData.name,
      token: token
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
