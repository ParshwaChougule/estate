import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { FaUsers, FaHome, FaEnvelope, FaPhone, FaSignOutAlt, FaChartBar, FaCog, FaTrash, FaTachometerAlt, FaBuilding, FaMoneyBillWave, FaEye, FaReply } from 'react-icons/fa';
import { database } from '../firebase';
import { ref, onValue, off, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropertyManagement from './PropertyManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [contacts, setContacts] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Fetch admin data from Firebase
    const adminRef = ref(database, 'admin');
    const contactsRef = ref(database, 'admin/contacts');

    const unsubscribeAdmin = onValue(adminRef, (snapshot) => {
      if (snapshot.exists()) {
        setAdminData(snapshot.val());
      }
      setLoading(false);
    });

    const unsubscribeContacts = onValue(contactsRef, (snapshot) => {
      if (snapshot.exists()) {
        const contactsData = snapshot.val();
        const contactsArray = Object.keys(contactsData).map(key => ({
          id: key,
          ...contactsData[key]
        }));
        setContacts(contactsArray);
      }
      setLoading(false);
    });

    return () => {
      off(adminRef);
      off(contactsRef);
    };
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      // Clear browser history and redirect to home page
      window.location.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const contactRef = ref(database, `admin/contacts/${contactId}`);
        await remove(contactRef);
        console.log('Contact deleted successfully');
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact. Please try again.');
      }
    }
  };

  const renderOverview = () => (
    <Row>
      <Col xs={6} md={3} className="mb-4">
        <Card className="text-center h-100 border-0 shadow-lg stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', transform: 'scale(1)', transition: 'all 0.3s ease' }}>
          <Card.Body className="p-4">
            <FaUsers size={50} className="text-white mb-3" />
            <h2 className="mb-1 text-white fw-bold">{contacts.length}</h2>
            <p className="text-white opacity-75 mb-0 fw-semibold">Total Contacts</p>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} md={3} className="mb-4">
        <Card className="text-center h-100 border-0 shadow-lg stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', transform: 'scale(1)', transition: 'all 0.3s ease' }}>
          <Card.Body className="p-4">
            <FaHome size={50} className="text-white mb-3" />
            <h2 className="mb-1 text-white fw-bold">24</h2>
            <p className="text-white opacity-75 mb-0 fw-semibold">Properties</p>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} md={3} className="mb-4">
        <Card className="text-center h-100 border-0 shadow-lg stat-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', transform: 'scale(1)', transition: 'all 0.3s ease' }}>
          <Card.Body className="p-4">
            <FaEnvelope size={50} className="text-white mb-3" />
            <h2 className="mb-1 text-white fw-bold">12</h2>
            <p className="text-white opacity-75 mb-0 fw-semibold">New Messages</p>
          </Card.Body>
        </Card>
      </Col>
      <Col xs={6} md={3} className="mb-4">
        <Card className="text-center h-100 border-0 shadow-lg stat-card" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', transform: 'scale(1)', transition: 'all 0.3s ease' }}>
          <Card.Body className="p-4">
            <FaMoneyBillWave size={50} className="text-white mb-3" />
            <h2 className="mb-1 text-white fw-bold">₹2.5M</h2>
            <p className="text-white opacity-75 mb-0 fw-semibold">Total Revenue</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderContacts = () => (
    <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
      <Card.Header className="border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <h5 className="mb-0 text-white fw-bold d-flex align-items-center">
          <FaEnvelope className="me-2" /> Contact Management
        </h5>
      </Card.Header>
      <Card.Body className="p-0">
        {contacts.length === 0 ? (
          <div className="text-center py-5">
            <FaEnvelope size={50} className="text-muted mb-3" />
            <h5 className="text-muted">No contacts yet</h5>
            <p className="text-muted">Contact submissions will appear here</p>
          </div>
        ) : (
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <strong>{contact.name || 'N/A'}</strong>
                  </td>
                  <td>{contact.email || 'N/A'}</td>
                  <td>
                    <span className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>
                      {contact.message || 'No message'}
                    </span>
                  </td>
                  <td>
                    <small className="text-muted">
                      {contact.timestamp ? new Date(contact.timestamp).toLocaleDateString() : 'N/A'}
                    </small>
                  </td>
                  <td>
                    <Badge bg={contact.status === 'new' ? 'primary' : 'success'}>
                      {contact.status === 'new' ? 'New' : 'Replied'}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2 rounded-pill">
                      <FaEye className="me-1" /> View
                    </Button>
                    <Button variant="outline-success" size="sm" className="me-2 rounded-pill">
                      <FaReply className="me-1" /> Reply
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                      title="Delete Contact"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );

  const renderProperties = () => (
    <Row>
      <Col md={12} className="mb-4">
        <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
          <Card.Header className="border-0 d-flex justify-content-between align-items-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <h5 className="mb-0 text-white fw-bold d-flex align-items-center">
              <FaHome className="me-2" /> Property Management
            </h5>
            <Button className="rounded-pill fw-semibold" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}>
              <FaHome className="me-2" />
              Add New Property
            </Button>
          </Card.Header>
          <Card.Body>
            <PropertyManagement />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderSettings = () => (
    <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
      <Card.Header className="border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <h5 className="mb-0 text-white fw-bold d-flex align-items-center">
          <FaCog className="me-2" /> Admin Settings
        </h5>
      </Card.Header>
      <Card.Body>
        {adminData && (
          <Row>
            <Col xs={12} md={6}>
              <h6>Admin Information</h6>
              <p><strong>Phone:</strong> {adminData.phone}</p>
              <p><strong>Password:</strong> ••••••</p>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <Navbar className="shadow-lg border-0" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
        <Container fluid className="px-2 px-md-4">
          <Navbar.Brand className="fw-bold d-flex align-items-center" style={{ color: '#2c3e50' }}>
            <FaBuilding className="me-2" size={28} style={{ color: '#667eea' }} />
            <span style={{ fontSize: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Paragon Properties Admin</span>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            {/* Desktop View */}
            <div className="d-none d-md-flex align-items-center">
              <span className="me-3 fw-semibold" style={{ color: '#2c3e50' }}>Welcome, Admin</span>
              <div className="d-flex align-items-center gap-2">
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    className="border-0 rounded-pill px-3 fw-semibold"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
                  >
                    <FaCog className="me-1" /> Profile
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                    <Dropdown.Item className="py-2">
                      <FaCog className="me-2" />
                      Settings
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button 
                  onClick={handleLogout} 
                  className="border-0 rounded-pill px-3 fw-semibold"
                  style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', color: 'white' }}
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </div>
            </div>
            
            {/* Mobile View */}
            <div className="d-flex d-md-none align-items-center w-100 justify-content-between">
              <span className="fw-semibold text-truncate" style={{ color: '#2c3e50', fontSize: '0.9rem' }}>Welcome, Admin</span>
              <div className="d-flex align-items-center gap-1">
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    className="border-0 rounded-pill px-2 py-1 fw-semibold"
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      color: 'white',
                      fontSize: '0.8rem'
                    }}
                  >
                    <FaCog className="me-1" /> Profile
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                    <Dropdown.Item className="py-2">
                      <FaCog className="me-2" />
                      Settings
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button 
                  onClick={handleLogout} 
                  className="border-0 rounded-pill px-2 py-1 fw-semibold"
                  style={{ 
                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', 
                    color: 'white',
                    fontSize: '0.8rem'
                  }}
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="py-4">
        <Row>
          {/* Sidebar */}
          <Col xs={12} md={2} className="mb-4">
            <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
              <Card.Body className="p-0">
                <div className="p-4 text-center border-bottom">
                  <FaTachometerAlt className="mb-2" size={35} style={{ color: '#667eea' }} />
                  <h6 className="mb-0 fw-bold" style={{ color: '#2c3e50' }}>Dashboard</h6>
                </div>
                <Nav variant="pills" className="flex-column p-3">
                  <Nav.Item className="mb-2">
                    <Nav.Link 
                      active={activeTab === 'overview'}
                      onClick={() => setActiveTab('overview')}
                      className="text-start rounded-3 py-3 sidebar-nav-link"
                      style={{
                        background: activeTab === 'overview' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'overview' ? 'white' : '#2c3e50',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        fontWeight: '600'
                      }}
                    >
                      <FaChartBar className="me-2" />
                      Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="mb-2">
                    <Nav.Link 
                      active={activeTab === 'contacts'}
                      onClick={() => setActiveTab('contacts')}
                      className="text-start rounded-3 py-3 sidebar-nav-link"
                      style={{
                        background: activeTab === 'contacts' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'contacts' ? 'white' : '#2c3e50',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        fontWeight: '600'
                      }}
                    >
                      <FaUsers className="me-2" />
                      Contacts ({contacts.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="mb-2">
                    <Nav.Link 
                      active={activeTab === 'properties'}
                      onClick={() => setActiveTab('properties')}
                      className="text-start rounded-3 py-3 sidebar-nav-link"
                      style={{
                        background: activeTab === 'properties' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'properties' ? 'white' : '#2c3e50',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        fontWeight: '600'
                      }}
                    >
                      <FaHome className="me-2" />
                      Properties
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="mb-2">
                    <Nav.Link 
                      active={activeTab === 'settings'}
                      onClick={() => setActiveTab('settings')}
                      className="text-start rounded-3 py-3 sidebar-nav-link"
                      style={{
                        background: activeTab === 'settings' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: activeTab === 'settings' ? 'white' : '#2c3e50',
                        border: 'none',
                        transition: 'all 0.3s ease',
                        fontWeight: '600'
                      }}
                    >
                      <FaCog className="me-2" />
                      Settings
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={12} md={10}>
            <div className="mb-4 p-4 rounded-4 shadow-lg" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-1 fw-bold" style={{ color: '#2c3e50' }}>Welcome to Paragon Properties</h2>
                  <p className="mb-0" style={{ color: '#6c757d' }}>Manage your real estate business efficiently</p>
                </div>
                <FaBuilding size={50} style={{ color: '#667eea', opacity: 0.7 }} />
              </div>
            </div>

            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'contacts' && renderContacts()}
            {activeTab === 'properties' && renderProperties()}
            {activeTab === 'settings' && renderSettings()}
          </Col>
        </Row>
      </Container>
      <style>{`
        .sidebar-nav-link:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          transform: translateX(5px);
        }
        
        .stat-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important;
        }
        
        .table-hover tbody tr:hover {
          background-color: rgba(102, 126, 234, 0.1) !important;
        }
        
        .rounded-pill:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
