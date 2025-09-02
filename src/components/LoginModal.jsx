import React, { useState } from 'react';
import { Modal, Button, Form, Tab, Tabs, Alert } from 'react-bootstrap';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaTimes } from 'react-icons/fa';
import { useUserAuth } from '../contexts/UserAuthContext';

function LoginModal({ show, onHide }) {
  const { register, login } = useUserAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      const result = await login(loginForm.email, loginForm.password);
      setMessage({ type: 'success', text: result.message });
      
      // Clear form
      setLoginForm({ email: '', password: '' });
      
      // Close modal after 1 second
      setTimeout(() => {
        onHide();
        setMessage({ type: '', text: '' });
      }, 1000);
      
    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage({ type: 'danger', text: 'Passwords do not match!' });
      return;
    }
    
    try {
      const result = await register(registerForm);
      setMessage({ type: 'success', text: result.message + ' You can now login.' });
      
      // Clear form
      setRegisterForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      
      // Switch to login tab after successful registration
      setTimeout(() => {
        setActiveTab('login');
        setMessage({ type: '', text: '' });
      }, 2000);
      
    } catch (error) {
      setMessage({ type: 'danger', text: error.message });
    }
  };

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
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
          <h3 className="fw-bold text-primary">Welcome to Paragon Properties</h3>
          <p className="text-muted">Please login or register to continue</p>
        </div>

        {message.text && (
          <Alert variant={message.type} className="mb-3">
            {message.text}
          </Alert>
        )}

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4 custom-tabs"
          justify
        >
          <Tab eventKey="login" title="Login">
            <Form onSubmit={handleLoginSubmit} className="mt-4">
              <Form.Group className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaEnvelope className="text-muted" />
                  </span>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className="border-start-0 ps-0"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaLock className="text-muted" />
                  </span>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className="border-start-0 ps-0"
                    required
                  />
                </div>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 login-btn mb-3"
                size="lg"
              >
                Login
              </Button>

              <div className="text-center">
                <small className="text-muted">
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 text-primary fw-bold"
                    onClick={() => setActiveTab('register')}
                  >
                    Register here
                  </Button>
                </small>
              </div>
            </Form>
          </Tab>

          <Tab eventKey="register" title="Register">
            <Form onSubmit={handleRegisterSubmit} className="mt-4">
              <Form.Group className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaUser className="text-muted" />
                  </span>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    className="border-start-0 ps-0"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaEnvelope className="text-muted" />
                  </span>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    className="border-start-0 ps-0"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaPhone className="text-muted" />
                  </span>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    className="border-start-0 ps-0"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaLock className="text-muted" />
                  </span>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    className="border-start-0 ps-0"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaLock className="text-muted" />
                  </span>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    className="border-start-0 ps-0"
                    required
                  />
                </div>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 register-btn mb-3"
                size="lg"
              >
                Register
              </Button>

              <div className="text-center">
                <small className="text-muted">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 text-primary fw-bold"
                    onClick={() => setActiveTab('login')}
                  >
                    Login here
                  </Button>
                </small>
              </div>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>

      <style>{`
        .custom-tabs .nav-link {
          color: #6c757d;
          font-weight: 600;
          border: none;
          border-bottom: 3px solid transparent;
          background: none;
          padding: 12px 20px;
          transition: all 0.3s ease;
        }

        .custom-tabs .nav-link:hover {
          color: #007bff;
          border-bottom-color: rgba(0, 123, 255, 0.3);
        }

        .custom-tabs .nav-link.active {
          color: #007bff;
          background: none;
          border-bottom-color: #007bff;
          font-weight: 700;
        }

        .input-group-text {
          border-radius: 8px 0 0 8px;
          width: 45px;
          justify-content: center;
        }

        .form-control {
          border-radius: 0 8px 8px 0;
          padding: 12px 15px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.15);
          border-color: #007bff;
        }

        .login-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .login-btn:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .register-btn {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border: none;
          border-radius: 8px;
          padding: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }

        .register-btn:hover {
          background: linear-gradient(135deg, #20c997 0%, #28a745 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
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

export default LoginModal;
