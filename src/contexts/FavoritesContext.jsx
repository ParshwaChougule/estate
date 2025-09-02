import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserAuth } from './UserAuthContext';
import { database } from '../firebase';
import { ref, set, get, onValue } from 'firebase/database';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useUserAuth();
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load user-specific favorites from Firebase on component mount or user change
  useEffect(() => {
    if (isAuthenticated() && currentUser) {
      const userFavoritesRef = ref(database, `userFavorites/${currentUser.id}`);
      
      // Set up real-time listener for user's favorites
      const unsubscribe = onValue(userFavoritesRef, (snapshot) => {
        if (snapshot.exists()) {
          const favoritesData = snapshot.val();
          // Convert object keys to array of property IDs
          const favoritesArray = Object.keys(favoritesData);
          setFavorites(favoritesArray);
        } else {
          setFavorites([]);
        }
      });

      // Cleanup listener on unmount or user change
      return () => unsubscribe();
    } else {
      setFavorites([]);
      setShowFavoritesOnly(false);
    }
  }, [currentUser, isAuthenticated]);

  const addToFavorites = async (propertyId) => {
    if (!isAuthenticated() || !currentUser) return;
    
    try {
      const userFavoritesRef = ref(database, `userFavorites/${currentUser.id}/${propertyId}`);
      await set(userFavoritesRef, {
        propertyId: propertyId,
        addedAt: new Date().toISOString()
      });
      // State will be updated automatically through the onValue listener
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (propertyId) => {
    if (!isAuthenticated() || !currentUser) return;
    
    try {
      const userFavoritesRef = ref(database, `userFavorites/${currentUser.id}/${propertyId}`);
      await set(userFavoritesRef, null); // Remove the property from favorites
      // State will be updated automatically through the onValue listener
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const toggleFavorite = async (propertyId) => {
    if (!isAuthenticated()) {
      return false; // Don't allow favorites if not authenticated
    }
    
    try {
      if (favorites.includes(propertyId)) {
        await removeFromFavorites(propertyId);
      } else {
        await addToFavorites(propertyId);
      }
      return true;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  };

  const isFavorite = (propertyId) => {
    if (!isAuthenticated()) {
      return false;
    }
    return favorites.includes(propertyId);
  };

  const toggleShowFavoritesOnly = () => {
    if (!isAuthenticated()) {
      return false; // Don't allow favorites filtering if not authenticated
    }
    setShowFavoritesOnly(prev => !prev);
    return true;
  };

  const value = {
    favorites,
    showFavoritesOnly,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    toggleShowFavoritesOnly,
    isAuthenticated,
    setShowFavoritesOnly
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
