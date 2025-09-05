import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Carousel, Badge } from "react-bootstrap";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaArrowLeft } from "react-icons/fa";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useFavorites } from "../contexts/FavoritesContext";

function PropertyDetail() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Static luxury properties (same as in Luxury component)
  const staticProperties = [
    {
      id: "luxury-1",
      title: "Luxury Villa in Palm Jumeirah",
      location: "Palm Jumeirah, Dubai",
      price: "15,000,000",
      bedrooms: "5",
      bathrooms: "6",
      area: "8500",
      type: "luxury",
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
      ]
    },
    {
      id: "luxury-2",
      title: "Penthouse in Burj Khalifa",
      location: "Downtown Dubai",
      price: "25,000,000",
      bedrooms: "4",
      bathrooms: "5",
      area: "6000",
      type: "luxury",
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
      ]
    },
    {
      id: "luxury-3",
      title: "Waterfront Mansion",
      location: "Dubai Marina",
      price: "18,500,000",
      bedrooms: "6",
      bathrooms: "7",
      area: "9200",
      type: "luxury",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2053&q=80"
      ]
    }
  ];

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'sold': return 'danger';
      case 'rented': return 'warning';
      default: return 'secondary';
    }
  };

  // Helper function to get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'sold': return 'Sold Out';
      case 'rented': return 'Rented';
      default: return 'Available';
    }
  };

  useEffect(() => {
    // First check if it's a static luxury property
    const staticProperty = staticProperties.find(p => p.id === propertyId);
    if (staticProperty) {
      setProperty(staticProperty);
      setLoading(false);
      return;
    }

    // If not found in static properties, check Firebase
    const propertiesRef = ref(database, 'properties');
    const unsubscribe = onValue(propertiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const propertiesData = snapshot.val();
        const foundProperty = Object.keys(propertiesData)
          .map(key => ({
            id: key,
            ...propertiesData[key]
          }))
          .find(p => p.id === propertyId);
        
        setProperty(foundProperty || null);
      } else {
        setProperty(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [propertyId]);

  if (loading) {
    return (
      <Container className="my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container className="my-5">
        <div className="text-center py-5">
          <h3>Property not found</h3>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go Back Home
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <Button 
            variant="outline-primary" 
            onClick={() => navigate('/')}
            className="mb-3"
          >
            <FaArrowLeft className="me-2" />
            Back to Properties
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="property-detail-card">
            <Carousel interval={4000} indicators={true} controls={true}>
              {property.images && property.images.length > 0 ? property.images.map((image, index) => (
                <Carousel.Item key={index}>
                  <div className="detail-carousel-image-container">
                    <img
                      className="d-block w-100"
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                    />
                  </div>
                </Carousel.Item>
              )) : (
                <Carousel.Item>
                  <div className="detail-carousel-image-container">
                    <div className="no-image-placeholder">
                      <i className="fas fa-image fa-3x text-muted"></i>
                      <p className="text-muted mt-2">No Image Available</p>
                    </div>
                  </div>
                </Carousel.Item>
              )}
            </Carousel>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="property-info-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="property-detail-title">{property.title}</h2>
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn p-0 border-0 bg-transparent"
                    onClick={() => toggleFavorite(property.id)}
                    style={{
                      color: isFavorite(property.id) ? '#dc3545' : '#6c757d',
                      fontSize: '1.5rem',
                      transition: 'color 0.3s ease, transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    title={isFavorite(property.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <FaHeart />
                  </button>
                  {property.status && (
                    <Badge bg={getStatusColor(property.status)} className="status-badge">
                      {getStatusText(property.status)}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="location-info mb-3">
                <FaMapMarkerAlt className="me-2 text-primary" />
                <span className="text-muted">{property.location}</span>
              </div>

              <div className="price-info mb-4">
                <h3 className="price-tag">₹{property.price}</h3>
              </div>

              <div className="property-features-detail mb-4">
                <h5 className="mb-3">Property Features</h5>
                <Row>
                  {property.type !== 'plots' && (
                    <>
                      <Col xs={6} className="mb-3">
                        <div className="feature-item">
                          <FaBed className="feature-icon" />
                          <div>
                            <strong>{property.bedrooms}</strong>
                            <div className="text-muted small">Bedrooms</div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={6} className="mb-3">
                        <div className="feature-item">
                          <FaBath className="feature-icon" />
                          <div>
                            <strong>{property.bathrooms}</strong>
                            <div className="text-muted small">Bathrooms</div>
                          </div>
                        </div>
                      </Col>
                    </>
                  )}
                  <Col xs={property.type === 'plots' ? 12 : 6} className="mb-3">
                    <div className="feature-item">
                      <FaRulerCombined className="feature-icon" />
                      <div>
                        <strong>{property.area}</strong>
                        <div className="text-muted small">Sq Ft</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div className="contact-section">
                <h5 className="mb-3">Contact Information</h5>
                <div className="d-grid gap-2">
                  <Button className="contact-agent-btn">
                    <i className="fas fa-phone me-2"></i>
                    Contact Agent
                  </Button>
                  <Button 
                    as="a" 
                    href={`https://wa.me/919011041008?text=I'm interested in ${property.title} located at ${property.location}`}
                    target="_blank"
                    className="whatsapp-contact-btn"
                  >
                    <i className="fab fa-whatsapp me-2"></i>
                    WhatsApp
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`
        .property-detail-card {
          border: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border-radius: 15px;
          overflow: hidden;
        }

        .property-info-card {
          border: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border-radius: 15px;
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .detail-carousel-image-container {
          height: 500px;
          overflow: hidden;
          position: relative;
          background-color: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-carousel-image-container img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }

        .property-detail-title {
          color: #2c3e50;
          font-weight: 700;
          margin-bottom: 0;
        }

        .location-info {
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }

        .price-tag {
          color: #28a745;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 0;
        }

        .property-features-detail {
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feature-icon {
          color: #007bff;
          font-size: 1.5rem;
        }

        .contact-section {
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 20px;
        }

        .contact-agent-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 25px;
          padding: 12px 20px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .contact-agent-btn:hover {
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          color: white;
        }

        .whatsapp-contact-btn {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          border: none;
          border-radius: 25px;
          padding: 12px 20px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          text-decoration: none !important;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        }

        .whatsapp-contact-btn:hover {
          background: linear-gradient(135deg, #128c7e 0%, #25d366 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
          color: white !important;
          text-decoration: none !important;
        }

        .status-badge {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .no-image-placeholder {
          text-align: center;
          padding: 60px 20px;
        }
      `}</style>
    </Container>
  );
}

export default PropertyDetail;
