import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { FaUsers, FaHome, FaEnvelope, FaPhone, FaSignOutAlt, FaChartBar, FaCog, FaTrash } from 'react-icons/fa';
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
      navigate('/login');
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
      <Col md={3} className="mb-4">
        <Card className="text-center h-100 border-0 shadow-sm">
          <Card.Body>
            <FaUsers size={40} className="text-primary mb-3" />
            <h3 className="mb-1">{contacts.length}</h3>
            <p className="text-muted">Total Contacts</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3} className="mb-4">
        <Card className="text-center h-100 border-0 shadow-sm">
          <Card.Body>
            <FaHome size={40} className="text-success mb-3" />
            <h3 className="mb-1">24</h3>
            <p className="text-muted">Properties</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3} className="mb-4">
        <Card className="text-center h-100 border-0 shadow-sm">
          <Card.Body>
            <FaEnvelope size={40} className="text-warning mb-3" />
            <h3 className="mb-1">12</h3>
            <p className="text-muted">New Messages</p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3} className="mb-4">
        <Card className="text-center h-100 border-0 shadow-sm">
          <Card.Body>
            <FaChartBar size={40} className="text-info mb-3" />
            <h3 className="mb-1">₹2.5M</h3>
            <p className="text-muted">Total Revenue</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderContacts = () => (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h5 className="mb-0">Contact Management</h5>
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
                    <Button variant="outline-primary" size="sm" className="me-2">
                      View
                    </Button>
                    <Button variant="outline-secondary" size="sm" className="me-2">
                      Reply
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
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Property Management</h5>
            <Button variant="primary">
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
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h5 className="mb-0">Admin Settings</h5>
      </Card.Header>
      <Card.Body>
        {adminData && (
          <Row>
            <Col md={6}>
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
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Top Navigation */}
      <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
        <Container fluid>
          <Navbar.Brand className="fw-bold text-primary">
            🏠 Estate Admin Dashboard
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-secondary" className="border-0">
                Admin Profile
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <FaCog className="me-2" />
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="py-4">
        <Row>
          {/* Sidebar */}
          <Col md={2} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'overview'}
                      onClick={() => setActiveTab('overview')}
                      className="text-start"
                    >
                      <FaChartBar className="me-2" />
                      Overview
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'contacts'}
                      onClick={() => setActiveTab('contacts')}
                      className="text-start"
                    >
                      <FaUsers className="me-2" />
                      Contacts ({contacts.length})
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'properties'}
                      onClick={() => setActiveTab('properties')}
                      className="text-start"
                    >
                      <FaHome className="me-2" />
                      Properties
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'settings'}
                      onClick={() => setActiveTab('settings')}
                      className="text-start"
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
          <Col md={10}>
            <div className="mb-4">
              <h2 className="mb-1">Welcome to Admin Dashboard</h2>
              <p className="text-muted">Manage your real estate business efficiently</p>
            </div>

            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'contacts' && renderContacts()}
            {activeTab === 'properties' && renderProperties()}
            {activeTab === 'settings' && renderSettings()}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
