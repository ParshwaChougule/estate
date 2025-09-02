import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, set, get, child } from 'firebase/database';

const UserAuthContext = createContext();

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export const UserAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Load registered users and current user from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('registeredUsers');
    const savedCurrentUser = localStorage.getItem('currentUser');
    
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
    
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
  }, []);

  // Save registered users to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const register = async (userData) => {
    const { name, email, phone, password } = userData;
    
    try {
      // Check if user already exists in Firebase using name as key
      const userRef = ref(database, `users/${name}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        throw new Error('User with this name already exists');
      }

      // Create new user with name as unique ID
      const newUser = {
        name,
        email,
        phone,
        password, // In production, this should be hashed
        registeredAt: new Date().toISOString()
      };

      // Save to Firebase with name as the key
      await set(userRef, newUser);
      
      // Also update local state
      setRegisteredUsers(prev => [...prev, { id: name, ...newUser }]);
      
      return { success: true, message: 'Registration successful!' };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const login = async (email, password) => {
    try {
      // First check local registered users
      const localUser = registeredUsers.find(u => u.email === email && u.password === password);
      
      if (localUser) {
        // Set current user (without password for security)
        const userWithoutPassword = {
          id: localUser.id,
          name: localUser.name,
          email: localUser.email,
          phone: localUser.phone,
          registeredAt: localUser.registeredAt
        };

        setCurrentUser(userWithoutPassword);
        return { success: true, message: 'Login successful!', user: userWithoutPassword };
      }

      // If not found locally, check Firebase
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const users = snapshot.val();
        const firebaseUser = Object.values(users).find(u => u.email === email && u.password === password);
        
        if (firebaseUser) {
          // Set current user (without password for security)
          const userWithoutPassword = {
            id: firebaseUser.name, // Using name as ID
            name: firebaseUser.name,
            email: firebaseUser.email,
            phone: firebaseUser.phone,
            registeredAt: firebaseUser.registeredAt
          };

          setCurrentUser(userWithoutPassword);
          return { success: true, message: 'Login successful!', user: userWithoutPassword };
        }
      }
      
      throw new Error('Invalid email or password');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return currentUser !== null;
  };

  const value = {
    currentUser,
    registeredUsers,
    register,
    login,
    logout,
    isAuthenticated
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};
