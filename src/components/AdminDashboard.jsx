import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Pagination } from 'react-bootstrap';
import { 
  FaHome, FaBuilding, FaUsers, FaUserCircle, FaSignOutAlt, 
  FaPlusCircle, FaUserFriends, FaClock 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import PropertyManagement from './PropertyManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [contacts, setContacts] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(5);
  const [contactsCurrentPage, setContactsCurrentPage] = useState(1);
  const [contactsPerPage] = useState(5);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch admin data
        const adminRef = ref(database, 'admin');
        onValue(adminRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setAdminData(data);
          }
        });

        // Fetch contacts
        const contactsRef = ref(database, 'contacts');
        onValue(contactsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const contactsList = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            setContacts(contactsList);
          }
        });

        // Fetch properties
        const propertiesRef = ref(database, 'properties');
        onValue(propertiesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const propertiesList = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            setProperties(propertiesList);
          }
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Pagination logic for properties
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  // Pagination logic for contacts
  const indexOfLastContact = contactsCurrentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);
  const totalContactsPages = Math.ceil(contacts.length / contactsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleContactsPageChange = (pageNumber) => {
    setContactsCurrentPage(pageNumber);
  };

  const renderOverview = () => (
    <div className="overview-content">
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Properties</h6>
                  <h3 className="mb-0">{properties.length}</h3>
                </div>
                <FaBuilding size={32} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Contacts</h6>
                  <h3 className="mb-0">{contacts.length}</h3>
                </div>
                <FaUsers size={32} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-3">
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Avg. Time to Sell</h6>
                  <h3 className="mb-0">45 days</h3>
                </div>
                <FaClock size={32} className="text-info" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Properties</h5>
                <small className="text-muted">
                  Showing {indexOfFirstProperty + 1}-{Math.min(indexOfLastProperty, properties.length)} of {properties.length} properties
                </small>
              </div>
            </Card.Header>
            <Card.Body>
              {currentProperties.map((property) => (
                <div key={property.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                  <div>
                    <h6 className="mb-1">{property.title}</h6>
                    <small className="text-muted">{property.location}</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">${property.price?.toLocaleString()}</div>
                    <small className="text-muted">{property.type}</small>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <Pagination.Item
                          key={pageNumber}
                          active={pageNumber === currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Item>
                      );
                    })}
                    
                    <Pagination.Next 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Contacts</h5>
                <small className="text-muted">
                  {contacts.length > 5 ? `${contacts.length} total` : ''}
                </small>
              </div>
            </Card.Header>
            <Card.Body>
              {contacts.slice(0, 5).map((contact) => (
                <div key={contact.id} className="d-flex align-items-center py-2 border-bottom">
                  <FaUserCircle size={32} className="text-muted me-3" />
                  <div>
                    <h6 className="mb-0">{contact.name}</h6>
                    <small className="text-muted">{contact.email}</small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderContacts = () => (
    <div className="contacts-content">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">All Contacts</h5>
            <div className="d-flex align-items-center gap-3">
              <small className="text-muted">
                Showing {indexOfFirstContact + 1}-{Math.min(indexOfLastContact, contacts.length)} of {contacts.length} contacts
              </small>
              <Button variant="primary" size="sm">
                <FaPlusCircle className="me-1" /> Add Contact
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.message?.substring(0, 50)}...</td>
                    <td>{new Date(contact.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Contacts Pagination */}
          {totalContactsPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First 
                  onClick={() => handleContactsPageChange(1)}
                  disabled={contactsCurrentPage === 1}
                />
                <Pagination.Prev 
                  onClick={() => handleContactsPageChange(contactsCurrentPage - 1)}
                  disabled={contactsCurrentPage === 1}
                />
                
                {[...Array(totalContactsPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === contactsCurrentPage}
                      onClick={() => handleContactsPageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                })}
                
                <Pagination.Next 
                  onClick={() => handleContactsPageChange(contactsCurrentPage + 1)}
                  disabled={contactsCurrentPage === totalContactsPages}
                />
                <Pagination.Last 
                  onClick={() => handleContactsPageChange(totalContactsPages)}
                  disabled={contactsCurrentPage === totalContactsPages}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={2} className="sidebar-col">
            <div className="sidebar">
              <div className="sidebar-header">
                <h6 className="text-primary fw-bold mb-0">
                  <FaBuilding className="me-2" />
                  Dashboard
                </h6>
              </div>
              
              <div className="sidebar-menu">
                <Nav className="flex-column">
                  <Nav.Link 
                    className={`sidebar-item mb-2 ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <div className="d-flex align-items-center">
                      <div className="sidebar-icon">
                        <FaHome />
                      </div>
                      <span className="ms-3">Overview</span>
                    </div>
                  </Nav.Link>
                  
                  <Nav.Link 
                    className={`sidebar-item mb-2 ${activeTab === 'properties' ? 'active' : ''}`}
                    onClick={() => setActiveTab('properties')}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="sidebar-icon">
                          <FaBuilding />
                        </div>
                        <span className="ms-3">Properties</span>
                      </div>
                      <span className="badge bg-primary rounded-pill">{properties.length}</span>
                    </div>
                  </Nav.Link>
                  
                  <Nav.Link 
                    className={`sidebar-item mb-2 ${activeTab === 'contacts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('contacts')}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="sidebar-icon">
                          <FaUserFriends />
                        </div>
                        <span className="ms-3">Leads & Contacts</span>
                      </div>
                      <span className="badge bg-success rounded-pill">{contacts.length}</span>
                    </div>
                  </Nav.Link>
                  
                </Nav>
              </div>
              
              <div className="sidebar-footer p-3 mt-auto">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-2">
                      <FaUserCircle size={36} style={{ color: '#4a90e2' }} />
                    </div>
                    <div>
                      <div className="text-dark small">{adminData?.name || 'Admin'}</div>
                      <div className="text-muted small">Administrator</div>
                    </div>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-muted p-0"
                    onClick={handleLogout}
                    title="Sign out"
                  >
                    <FaSignOutAlt />
                  </Button>
                </div>
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col md={10} className="main-content">
            <div className="content-wrapper">
              {/* Page Header */}
              <div className="content-header mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="mb-1 fw-bold text-dark">
                      {activeTab === 'overview' && 'Dashboard Overview'}
                      {activeTab === 'properties' && 'Property Management'}
                      {activeTab === 'contacts' && 'Leads & Contacts'}
                    </h2>
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                          <a href="#" className="text-muted text-decoration-none">
                            <FaHome className="me-1" size={14} /> Home
                          </a>
                        </li>
                        <li className="breadcrumb-item active text-primary">
                          {activeTab === 'overview' && 'Dashboard'}
                          {activeTab === 'properties' && 'Properties'}
                          {activeTab === 'contacts' && 'Leads'}
                        </li>
                      </ol>
                    </nav>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="primary" size="sm" className="d-flex align-items-center">
                      <FaPlusCircle className="me-1" size={14} /> Add New
                    </Button>
                    <Button variant="outline-danger" size="sm" className="d-flex align-items-center" onClick={handleLogout}>
                      <FaSignOutAlt className="me-1" size={14} /> Logout
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <section className="content">
                <div className="container-fluid">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading Dashboard...</p>
                    </div>
                  ) : (
                    <div className="dashboard-content">
                      {activeTab === 'overview' && renderOverview()}
                      {activeTab === 'contacts' && renderContacts()}
                      {activeTab === 'properties' && <PropertyManagement />}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
