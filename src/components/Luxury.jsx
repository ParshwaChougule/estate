import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Carousel, Badge } from "react-bootstrap";
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useFavorites } from "../contexts/FavoritesContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import PropertyDetailModal from "./PropertyDetailModal";

function Luxury({ statusFilter = 'all', searchFilters = {} }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPropertyDetail, setShowPropertyDetail] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { favorites, showFavoritesOnly, toggleFavorite, isFavorite } = useFavorites();
  const navigate = useNavigate();

  // Helper function to parse price string and convert to number for comparison
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const numericValue = parseFloat(priceString.replace(/[^\d.]/g, ''));
    return numericValue;
  };

  // Helper function to check if price falls within selected range
  const isPriceInRange = (price, range) => {
    if (!range) return true;
    const numericPrice = parsePrice(price);
    
    switch(range) {
      case 'Below 100k':
        return numericPrice < 100000;
      case '100k - 500k':
        return numericPrice >= 100000 && numericPrice <= 500000;
      case '500k - 1M':
        return numericPrice >= 500000 && numericPrice <= 1000000;
      case '1M - 5M':
        return numericPrice >= 1000000 && numericPrice <= 5000000;
      case 'Above 5M':
        return numericPrice > 5000000;
      default:
        return true;
    }
  };

  // Helper function to check bedroom count
  const isBedroomMatch = (propertyBedrooms, selectedBedrooms) => {
    if (!selectedBedrooms) return true;
    const propBedrooms = parseInt(propertyBedrooms) || 0;
    
    if (selectedBedrooms === '5+') {
      return propBedrooms >= 5;
    }
    return propBedrooms === parseInt(selectedBedrooms);
  };

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
    // Fetch luxury properties from Firebase
    const propertiesRef = ref(database, 'properties');
    const unsubscribe = onValue(propertiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const propertiesData = snapshot.val();
        const luxuryProperties = Object.keys(propertiesData)
          .map(key => ({
            id: key,
            ...propertiesData[key]
          }))
          .filter(property => property.type === 'luxury');
        setProperties(luxuryProperties);
      } else {
        setProperties([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Use only Firebase properties
  const allProperties = properties;

  // Filter properties based on status and search filters
  const filteredProperties = allProperties.filter(property => {
    // Status filter (only apply to Firebase properties)
    const statusMatch = !property.status || statusFilter === 'all' || property.status === statusFilter;
    
    // Location filter
    const locationMatch = !searchFilters.location || 
      property.location?.toLowerCase().includes(searchFilters.location.toLowerCase());
    
    // Price range filter
    const priceMatch = isPriceInRange(property.price, searchFilters.priceRange);
    
    // Bedroom filter
    const bedroomMatch = isBedroomMatch(property.bedrooms, searchFilters.bedrooms);
    
    // Favorites filter
    const favoritesMatch = !showFavoritesOnly || isFavorite(property.id);
    
    return statusMatch && locationMatch && priceMatch && bedroomMatch && favoritesMatch;
  });

  // Show only first 3 properties initially, or all if showAll is true
  const displayProperties = showAll ? filteredProperties : filteredProperties.slice(0, 3);

  return (
    <Container className="my-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="fw-bold section-title">Luxury</h2>
        </Col>
        <Col className="text-end">
          {filteredProperties.length > 3 && (
            <Button 
              variant="dark" 
              onClick={() => navigate('/luxury-properties')}
            >
              View More ({filteredProperties.length - 3} more)
            </Button>
          )}
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
          {displayProperties.length > 0 ? (
            displayProperties.map(property => (
          <Col key={property.id} xs={12} sm={6} md={4} className="mb-4">
            <Card className="h-100 shadow-sm property-card">
              <Carousel interval={3000} indicators={false}>
                {property.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <div 
                      style={{ 
                        height: '250px', 
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <img
                        className="d-block w-100"
                        src={image}
                        alt={`Property view ${index + 1}`}
                        style={{ objectFit: 'cover', height: '100%' }}
                      />
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
              
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="property-title mb-0">{property.title}</Card.Title>
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
                    <Badge bg={getStatusColor(property.status || 'available')} className="status-badge">
                      {getStatusText(property.status || 'available')}
                    </Badge>
                  </div>
                </div>
                <Card.Text className="text-muted location">
                  <FaMapMarkerAlt className="me-1" /> {property.location}
                </Card.Text>
                <Card.Text className="price-tag fw-bold">₹{property.price}</Card.Text>
                
                <div className="property-features mb-3">
                  <Row className="text-center">
                    <Col xs={4}>
                      <div><FaBed /></div>
                      <div>{property.bedrooms || property.beds} Bed{(property.bedrooms || property.beds) !== 1 ? 's' : ''}</div>
                    </Col>
                    <Col xs={4}>
                      <div><FaBath /></div>
                      <div>{property.bathrooms || property.baths} Bath{(property.bathrooms || property.baths) !== 1 ? 's' : ''}</div>
                    </Col>
                    <Col xs={4}>
                      <div><FaRulerCombined /></div>
                      <div>{property.area} Sq Ft</div>
                    </Col>
                  </Row>
                </div>
                
                <div className="d-flex gap-2 mt-auto">
                  <Button 
                    className="flex-fill view-more-btn"
                    onClick={() => {
                      setSelectedProperty(property);
                      setShowPropertyDetail(true);
                    }}
                  >
                    <i className="fas fa-eye me-2"></i>
                    View More
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
              </Card.Body>
            </Card>
          </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <p className="text-muted">
                {searchFilters.location || searchFilters.priceRange || searchFilters.bedrooms 
                  ? `No luxury properties found matching your search criteria.`
                  : `No luxury properties available at the moment.`
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
        
        .property-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          line-height: 1.3;
          height: 50px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .location {
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
        
        .property-features .row {
          margin: 0;
        }
        
        .property-features .col-xs-4 {
          padding: 0 8px;
          text-align: center;
        }
        
        .property-features .col-xs-4 div:first-child {
          color: #6c757d;
          margin-bottom: 4px;
          font-size: 1.1rem;
        }
        
        .property-features .col-xs-4 div:last-child {
          font-size: 0.85rem;
          color: #495057;
          font-weight: 500;
        }
        
        .section-title {
          border-left: 4px solid #007bff;
          padding-left: 12px;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .view-more-btn {
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
        .view-more-btn:hover {
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
    </Container>
  );
}

export default Luxury;