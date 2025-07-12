import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${import.meta.env.VITE_API_URL}/points`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setUser({ token, points: res.data.points });
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      setUser({ token: res.data.token, points: 0 });
      return res.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const signup = async (username, email, password1, password2) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, { username, email, password1, password2 });
console.log(`${import.meta.env.VITE_API_URL}/signup`);      
      localStorage.setItem('token', res.data.token);
      setUser({ token: res.data.token, points: 0 });
      return res.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};