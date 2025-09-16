import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(undefined);



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      
      const storedUser = sessionStorage.getItem('cattle-classifier-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem('cattle-classifier-user');
    } finally {
        setLoading(false);
    }
  }, []);

  
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log in');
        
      }

      
      setUser(data);
      sessionStorage.setItem('cattle-classifier-user', JSON.stringify(data));
      window.location.hash = '/dashboard';

    } catch (error) {
      console.error('Login Error:', error);
      alert(error.message); 
       throw error; 
    }
  };

  
  const signup = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }
      
      
      setUser(data);
      sessionStorage.setItem('cattle-classifier-user', JSON.stringify(data));
      window.location.hash = '/dashboard';

    } catch (error) {
      console.error('Signup Error:', error);
      alert(error.message); 
       throw error; 
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('cattle-classifier-user');
    window.location.hash = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};