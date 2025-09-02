import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { FaTimes, FaUserShield } from 'react-icons/fa';
import { database, auth } from "../firebase";
import { ref, get } from "firebase/database";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AdminLoginModal({ show, onHide }) {
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setLoading(true);
      try {
        // Check if admin exists in Firebase database with this phone number and password
        const adminRef = ref(database, 'admin');
        const snapshot = await get(adminRef);
        
        if (snapshot.exists()) {
          const adminData = snapshot.val();
          
          // Check if phone number and password match (convert types for comparison)
          if (adminData.phone.toString() === phoneNumber && adminData.password.toString() === password) {
            // Sign in with Firebase Auth using a dummy email for Storage permissions
            const dummyEmail = `admin@${phoneNumber}.com`;
            try {
              await signInWithEmailAndPassword(auth, dummyEmail, password);
            } catch (authError) {
              // If user doesn't exist, create them first
              if (authError.code === 'auth/user-not-found') {
                await createUserWithEmailAndPassword(auth, dummyEmail, password);
              }
            }
            
            setShowAlert("success");
            // Set authentication state
            login(adminData);
            // Close modal and redirect to admin dashboard after successful login
            setTimeout(() => {
              onHide();
              navigate('/admin-dashboard');
              setShowAlert("");
              setPhoneNumber("");
              setPassword("");
            }, 1000);
          } else {
            setShowAlert("error");
          }
        } else {
          setShowAlert("error");
        }
      } catch (error) {
        setShowAlert("error");
        console.error(error.message);
      }
      setLoading(false);
    }

    setValidated(true);
  };

  return (
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
          <FaUserShield className="text-warning mb-3" size={50} />
          <h3 className="fw-bold text-warning">🔐 Admin Login</h3>
          <p className="text-muted">Please enter your admin credentials</p>
        </div>

        {showAlert === "success" && (
          <Alert variant="success" className="text-center mb-3">
            ✅ Login Successful!
          </Alert>
        )}
        {showAlert === "error" && (
          <Alert variant="danger" className="text-center mb-3">
            ❌ Invalid mobile number or password!
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicPhone">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              required
              type="tel"
              placeholder="Enter mobile number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid mobile number.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Password must be at least 6 characters.
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid">
            <Button 
              variant="warning" 
              type="submit" 
              disabled={loading}
              className="admin-login-btn"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login as Admin'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>

      <style>{`
        .admin-login-btn {
          background: linear-gradient(135deg, #ffc107 0%, #ff8f00 100%);
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
          color: #000;
        }

        .admin-login-btn:hover {
          background: linear-gradient(135deg, #ff8f00 0%, #ffc107 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
          color: #000;
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
  );
}

export default AdminLoginModal;
