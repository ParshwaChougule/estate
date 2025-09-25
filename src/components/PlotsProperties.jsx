import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Carousel, Badge } from "react-bootstrap";
import { FaRulerCombined, FaMapMarkerAlt, FaHeart, FaArrowLeft, FaShare } from "react-icons/fa";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useFavorites } from "../contexts/FavoritesContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import PropertyDetailModal from "./PropertyDetailModal";

function PlotsProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { showFavoritesOnly, toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

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

  // Function to share property details on WhatsApp
  const shareProperty = (property) => {
    const propertyDetails = `
🏗️ *${property.title}*

📍 *Location:* ${property.location}
💰 *Price:* ₹${property.price}
📐 *Area:* ${property.area} Sq Ft
📊 *Status:* ${getStatusText(property.status || 'available')}

${property.description ? `📝 *Description:* ${property.description}` : ''}

${property.images && property.images.length > 0 ? `🖼️ *Images:* ${property.images.length} photo(s) available` : ''}

🔗 Check out this amazing plot!
    `.trim();

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(propertyDetails)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const propertiesRef = ref(database, 'properties');
    const unsubscribe = onValue(propertiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const propertiesData = snapshot.val();
        const plotProperties = Object.keys(propertiesData)
          .map(key => ({
            id: key,
            ...propertiesData[key]
          }))
          .filter(property => property.type === 'plots');
        setProperties(plotProperties);
      } else {
        setProperties([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter properties based on favorites if needed
  const filteredProperties = properties.filter(property => {
    const favoritesMatch = !showFavoritesOnly || isFavorite(property.id);
    return favoritesMatch;
  });

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
            Back to Home
          </Button>
          <h1 className="fw-bold section-title">All Plots</h1>
          <p className="text-muted">Browse through our complete collection of plots and land</p>
        </Col>
      </Row>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Row>
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <Col key={property.id} xs={12} sm={6} lg={4} className="mb-4">
                <Card className="h-100 property-card border-0 shadow-lg">
                  <div className="position-relative overflow-hidden">
                    <Carousel interval={4000} indicators={true} controls={true} className="property-carousel">
                      {property.images && property.images.length > 0 ? property.images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <div className="carousel-image-container">
                            <img
                              className="d-block w-100"
                              src={image}
                              alt={`${property.title} - Image ${index + 1}`}
                            />
                          </div>
                        </Carousel.Item>
                      )) : (
                        <Carousel.Item>
                          <div className="carousel-image-container">
                            <div className="no-image-placeholder">
                              <i className="fas fa-image fa-3x text-muted"></i>
                              <p className="text-muted mt-2">No Image Available</p>
                            </div>
                          </div>
                        </Carousel.Item>
                      )}
                    </Carousel>
                    <div className="property-badge">
                      <span className="badge bg-warning text-dark fw-bold">PLOT</span>
                    </div>
                  </div>
                  
                  <Card.Body className="d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="property-title mb-0 fw-bold">{property.title}</Card.Title>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn p-0 border-0 bg-transparent"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const result = await toggleFavorite(property.id);
                            if (!result) {
                              setShowLoginModal(true);
                            }
                          }}
                          style={{
                            color: isFavorite(property.id) ? '#dc3545' : '#6c757d',
                            fontSize: '1.2rem',
                            transition: 'color 0.3s ease, transform 0.2s ease',
                            cursor: 'pointer',
                            zIndex: 10
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          title={isFavorite(property.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <FaHeart />
                        </button>
                        <button
                          className="btn p-0 border-0 bg-transparent"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            shareProperty(property);
                          }}
                          style={{
                            color: '#25d366',
                            fontSize: '1.2rem',
                            transition: 'color 0.3s ease, transform 0.2s ease',
                            cursor: 'pointer',
                            zIndex: 10
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                          title="Share on WhatsApp"
                        >
                          <FaShare />
                        </button>
                        <Badge bg={getStatusColor(property.status || 'available')} className="status-badge">
                          {getStatusText(property.status || 'available')}
                        </Badge>
                      </div>
                    </div>
                    <Card.Text className="location-text mb-2">
                      <FaMapMarkerAlt className="me-2 text-danger" /> 
                      <span className="text-muted">{property.location}</span>
                    </Card.Text>
                    <Card.Text className="price-tag mb-3">₹{property.price}</Card.Text>
                    
                    <div className="property-features mb-4">
                      <div className="feature-item">
                        <div className="feature-icon">
                          <FaRulerCombined className="text-primary" />
                        </div>
                        <div className="feature-text">
                          <span className="feature-value">{property.area}</span>
                          <span className="feature-label">Sq Ft</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="d-flex gap-2 mt-auto">
                        <Button 
                          className="flex-fill view-details-btn"
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowPropertyDetail(true);
                          }}
                        >
                          <i className="fas fa-eye me-2"></i>
                          View Details
                        </Button>
                        <Button 
                          as="a" 
                          href={`https://wa.me/919011041008?text=I'm interested in ${property.title} located at ${property.location}`}
                          target="_blank"
                          className="flex-fill whatsapp-contact-btn"
                        >
                          <i className="fab fa-whatsapp me-2"></i>
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <p className="text-muted">
                {showFavoritesOnly 
                  ? `No plots found in your favorites.`
                  : `No plots available at the moment.`
                }
              </p>
            </Col>
          )}
        </Row>
      )}
      
      <style>{`
        .property-card {
          border-radius: 12px !important;
          border: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.3s ease;
          overflow: hidden;
          background: white;
        }
        .property-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
        
        .property-card .carousel {
          border-radius: 12px 12px 0 0;
          overflow: hidden;
        }
        
        .carousel-image-container {
          min-height: 200px;
          overflow: hidden;
          position: relative;
          background-color: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .carousel-image-container img {
          width: 100%;
          height: auto;
          object-fit: contain;
        }
        
        .no-image-placeholder {
          text-align: center;
          padding: 40px 20px;
        }
        
        .property-carousel .carousel-indicators {
          bottom: 10px;
          margin-bottom: 0;
        }
        
        .property-carousel .carousel-indicators button {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin: 0 3px;
          background-color: rgba(255, 255, 255, 0.7);
          border: none;
        }
        
        .property-carousel .carousel-indicators .active {
          background-color: white;
        }
        
        .property-carousel .carousel-control-prev,
        .property-carousel .carousel-control-next {
          width: 40px;
          height: 40px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .property-card:hover .carousel-control-prev,
        .property-card:hover .carousel-control-next {
          opacity: 1;
        }
        
        .property-carousel .carousel-control-prev {
          left: 10px;
        }
        
        .property-carousel .carousel-control-next {
          right: 10px;
        }
        
        .property-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        
        .location-text {
          color: #6c757d;
          font-size: 0.9rem;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
        }
        
        .price-tag {
          color: #28a745;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        
        .property-features {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 15px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .feature-icon {
          font-size: 1.2rem;
        }
        
        .feature-text {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .feature-value {
          font-weight: 600;
          color: #2c3e50;
        }
        
        .feature-label {
          font-size: 0.85rem;
          color: #6c757d;
        }
        
        .section-title {
          border-left: 4px solid #007bff;
          padding-left: 12px;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .view-details-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 25px;
          padding: 12px 20px;
          font-weight: 600;
          font-size: 0.85rem;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .view-details-btn:hover {
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
          font-size: 0.85rem;
          color: white;
          transition: all 0.3s ease;
          text-decoration: none !important;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .whatsapp-contact-btn:hover {
          background: linear-gradient(135deg, #128c7e 0%, #25d366 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
          color: white !important;
          text-decoration: none !important;
        }
        
        .card-body {
          padding: 20px;
        }
        
        .status-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          border-radius: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        
        .property-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 2;
        }
        
        .property-title {
          flex: 1;
          margin-right: 10px;
        }
      `}</style>

      {/* Login Modal */}
      <LoginModal 
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      />

      {/* Property Detail Modal */}
      <PropertyDetailModal 
        show={showPropertyDetail}
        onHide={() => setShowPropertyDetail(false)}
        property={selectedProperty}
      />
    </Container>
  );
}

export default PlotsProperties;
