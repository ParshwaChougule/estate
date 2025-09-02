import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col } from 'react-bootstrap';
import { FaUser, FaUserShield, FaTimes } from 'react-icons/fa';
import LoginModal from './LoginModal';
import AdminLoginModal from './AdminLoginModal';

function LoginSelectionModal({ show, onHide }) {
  const [showUserLoginModal, setShowUserLoginModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  const handleUserLogin = () => {
    onHide(); // Close selection modal
    setShowUserLoginModal(true); // Open user login modal
  };

  const handleAdminLogin = () => {
    onHide(); // Close selection modal
    setShowAdminLoginModal(true); // Open admin login modal
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="md">
        <Modal.Header className="border-0 pb-0">
          <Button
            variant="link"
            className="ms-auto p-0 text-dark"
            onClick={onHide}
            style={{ fontSize: '1.5rem', textDecoration: 'none' }}
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        
        <Modal.Body className="px-4 pb-4">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-primary">Choose Login Type</h3>
            <p className="text-muted">Select how you'd like to access Paragon Properties</p>
          </div>

          <Row className="g-3">
            <Col md={6}>
              <Card 
                className="h-100 login-option-card" 
                onClick={handleUserLogin}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              >
                <Card.Body className="text-center p-4">
                  <FaUser className="text-primary mb-3" size={40} />
                  <h5 className="fw-bold text-primary">User Login</h5>
                  <p className="text-muted small mb-0">
                    Browse properties, save favorites, and contact agents
                  </p>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card 
                className="h-100 login-option-card" 
                onClick={handleAdminLogin}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              >
                <Card.Body className="text-center p-4">
                  <FaUserShield className="text-warning mb-3" size={40} />
                  <h5 className="fw-bold text-warning">Admin Login</h5>
                  <p className="text-muted small mb-0">
                    Manage properties, users, and system settings
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>

        <style>{`
          .login-option-card {
            border: 2px solid #e9ecef;
            border-radius: 12px;
            transition: all 0.3s ease;
          }

          .login-option-card:hover {
            border-color: #007bff;
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 123, 255, 0.15);
          }

          .modal-content {
            border-radius: 15px;
            border: none;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }

          .modal-header {
            padding: 1rem 1.5rem 0;
          }

          .modal-body {
            padding: 1rem 1.5rem 2rem;
          }
        `}</style>
      </Modal>

      {/* User Login Modal */}
      <LoginModal 
        show={showUserLoginModal} 
        onHide={() => setShowUserLoginModal(false)} 
      />
      
      {/* Admin Login Modal */}
      <AdminLoginModal 
        show={showAdminLoginModal} 
        onHide={() => setShowAdminLoginModal(false)} 
      />
    </>
  );
}

export default LoginSelectionModal;
