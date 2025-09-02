import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaHeart, FaUser } from 'react-icons/fa';

function LoginPromptModal({ show, onHide, onLoginClick }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="text-center p-4">
        <div className="mb-3">
          <FaHeart className="text-danger" style={{ fontSize: '3rem' }} />
        </div>
        <h5 className="mb-3">Login Required</h5>
        <p className="text-muted mb-4">
          Please login to add properties to your favorites list.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <Button 
            variant="primary" 
            onClick={onLoginClick}
            className="d-flex align-items-center gap-2"
          >
            <FaUser />
            Login
          </Button>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default LoginPromptModal;
