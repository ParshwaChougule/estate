import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';
import { useUserAuth } from '../contexts/UserAuthContext';
import LoginSelectionModal from './LoginSelectionModal';
import React, { useState } from 'react';  
function BasicExample() {
  const { favorites, isAuthenticated, showFavoritesOnly, toggleShowFavoritesOnly } = useFavorites();
  const { currentUser, logout } = useUserAuth();
  const [showLoginSelectionModal, setShowLoginSelectionModal] = useState(false);
  
  const menuData = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/ContactUs', name: 'Contact' }
  ];

  const handleLoginClick = () => {
    setShowLoginSelectionModal(true);
  };

  return (
    <div>
      <Navbar expand="lg" className="bg-dark px-4 sticky-top">
        <Container className="m-2">
          <NavLink to="/" className="text-decoration-none">
            <h2
              style={{ fontFamily: 'serif', fontWeight: '600' }}
              className="text-light"
            >
              Your
            </h2>
            <p
              style={{ fontSize: '9px', letterSpacing: '2px' }}
              className="text-light"
            >
              Logo
            </p>
          </NavLink>

          <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {menuData.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.name}
                  className="nav-link text-light"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? 'yellow' : 'white',
                  })}
                >
                  {item.name}
                </NavLink>
              ))}
              {!isAuthenticated() && (
                <button
                  className="nav-link text-light"
                  onClick={handleLoginClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontWeight: 'normal',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Login
                </button>
              )}
              {isAuthenticated() ? (
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-primary position-relative me-3"
                    onClick={toggleShowFavoritesOnly}
                    title={showFavoritesOnly ? 'Show All Properties' : `Show Favorites (${favorites.length})`}
                    style={{
                      border: 'none',
                      background: showFavoritesOnly ? '#007bff' : 'transparent',
                      fontSize: '1.2rem',
                      color: showFavoritesOnly ? 'white' : '#007bff',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px'
                    }}
                  >
                    <FaHeart />
                    {favorites.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                  <span className="text-primary me-2">Welcome, {currentUser?.name}!</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LoginSelectionModal 
        show={showLoginSelectionModal} 
        onHide={() => setShowLoginSelectionModal(false)} 
      />
    </div>
  );
}

export default BasicExample;
