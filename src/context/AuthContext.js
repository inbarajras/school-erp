import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Login function
  const login = (username, password) => {
    // This would normally validate against an API
    // For demo purposes, we'll use hardcoded credentials
    if (username === 'admin' && password === '123456') {
      setUser({ id: 1, username: 'admin', name: 'Admin User' });
      setRole('admin');
      return true;
    } else if (username === 'teacher' && password === '123456') {
      setUser({ id: 2, username: 'teacher', name: 'Teacher User' });
      setRole('teacher');
      return true;
    } else if (username === 'student' && password === '123456') {
      setUser({ id: 3, username: 'student', name: 'Student User' });
      setRole('student');
      return true;
    } else if (username === 'parent' && password === '123456') {
      setUser({ id: 4, username: 'parent', name: 'Parent User' });
      setRole('parent');
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setRole(null);
  };

  // Check if user has permission for a certain action
  const hasPermission = (requiredRole) => {
    if (!role) return false;
    
    // Admin has all permissions
    if (role === 'admin') return true;
    
    // For other roles, check if they match the required role
    return role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};