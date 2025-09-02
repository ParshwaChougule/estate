import React from 'react';
import { Modal, Carousel, Badge, Button } from 'react-bootstrap';
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaTimes } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';

function PropertyDetailModal({ show, onHide, property }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!property) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'sold': return 'danger';
      case 'rented': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'sold': return 'Sold Out';
      case 'rented': return 'Rented';
      default: return 'Unknown';
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(property.id);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="border-0 pb-0">
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center gap-3">
            <h4 className="mb-0 fw-bold">{property.title}</h4>
            <Badge bg={getStatusColor(property.status || 'available')}>
              {getStatusText(property.status || 'available')}
            </Badge>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn p-0 border-0 bg-transparent"
              onClick={handleFavoriteClick}
              style={{
                color: isFavorite(property.id) ? '#dc3545' : '#6c757d',
                fontSize: '1.5rem',
                transition: 'color 0.3s ease, transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              title={isFavorite(property.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FaHeart />
            </button>
            <Button variant="outline-secondary" onClick={onHide} className="p-2">
              <FaTimes />
            </Button>
          </div>
        </div>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        {/* Image Carousel */}
        <div className="mb-4">
          <Carousel interval={4000} indicators={true} controls={true} className="property-detail-carousel">
            {property.images && property.images.length > 0 ? property.images.map((image, index) => (
              <Carousel.Item key={index}>
                <div className="carousel-image-container">
                  <img
                    className="d-block w-100"
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    style={{ height: '400px', objectFit: 'cover', borderRadius: '12px' }}
                  />
                </div>
              </Carousel.Item>
            )) : (
              <Carousel.Item>
                <div className="carousel-image-container d-flex align-items-center justify-content-center bg-light" style={{ height: '400px', borderRadius: '12px' }}>
                  <div className="text-center">
                    <i className="fas fa-image fa-3x text-muted"></i>
                    <p className="text-muted mt-2">No Image Available</p>
                  </div>
                </div>
              </Carousel.Item>
            )}
          </Carousel>
        </div>

        {/* Property Details */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="mb-3">
              <h5 className="text-primary fw-bold mb-2">₹{property.price}</h5>
              <p className="text-muted mb-2">
                <FaMapMarkerAlt className="me-2" />
                {property.location}
              </p>
            </div>

            {/* Property Features */}
            <div className="property-features-detail mb-4">
              <h6 className="fw-bold mb-3">Property Features</h6>
              <div className="row text-center">
                {property.type !== 'plots' && (
                  <>
                    <div className="col-4">
                      <div className="feature-item p-3 bg-light rounded">
                        <FaBed className="text-primary mb-2" style={{ fontSize: '1.5rem' }} />
                        <div className="fw-bold">{property.bedrooms}</div>
                        <div className="text-muted small">Bedroom{property.bedrooms !== '1' ? 's' : ''}</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="feature-item p-3 bg-light rounded">
                        <FaBath className="text-primary mb-2" style={{ fontSize: '1.5rem' }} />
                        <div className="fw-bold">{property.bathrooms}</div>
                        <div className="text-muted small">Bathroom{property.bathrooms !== '1' ? 's' : ''}</div>
                      </div>
                    </div>
                  </>
                )}
                <div className={`col-${property.type === 'plots' ? '12' : '4'}`}>
                  <div className="feature-item p-3 bg-light rounded">
                    <FaRulerCombined className="text-primary mb-2" style={{ fontSize: '1.5rem' }} />
                    <div className="fw-bold">{property.area}</div>
                    <div className="text-muted small">Sq Ft</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Description */}
            {property.description && (
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Description</h6>
                <p className="text-muted">{property.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-3 mt-4">
          <Button 
            as="a" 
            href={`https://wa.me/919876543210?text=I'm interested in ${property.title} located at ${property.location}`}
            target="_blank"
            className="flex-fill whatsapp-contact-btn"
            style={{
              background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
              border: 'none',
              borderRadius: '25px',
              padding: '12px 20px',
              fontWeight: '600',
              fontSize: '0.9rem',
              color: 'white',
              textDecoration: 'none'
            }}
          >
            <i className="fab fa-whatsapp me-2"></i>
            Contact via WhatsApp
          </Button>
          <Button 
            variant="outline-primary" 
            onClick={onHide}
            className="px-4"
            style={{ borderRadius: '25px' }}
          >
            Close
          </Button>
        </div>
      </Modal.Body>

      <style>{`
        .property-detail-carousel .carousel-indicators {
          bottom: 10px;
          margin-bottom: 0;
        }
        
        .property-detail-carousel .carousel-indicators button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin: 0 4px;
          background-color: rgba(255, 255, 255, 0.7);
          border: none;
        }
        
        .property-detail-carousel .carousel-indicators .active {
          background-color: white;
        }
        
        .property-detail-carousel .carousel-control-prev,
        .property-detail-carousel .carousel-control-next {
          width: 50px;
          height: 50px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .property-detail-carousel .carousel-control-prev {
          left: 15px;
        }
        
        .property-detail-carousel .carousel-control-next {
          right: 15px;
        }
        
        .feature-item {
          transition: transform 0.2s ease;
        }
        
        .feature-item:hover {
          transform: translateY(-2px);
        }
        
        .whatsapp-contact-btn:hover {
          background: linear-gradient(135deg, #128c7e 0%, #25d366 100%) !important;
          transform: translateY(-2px);
          color: white !important;
          text-decoration: none !important;
        }
      `}</style>
    </Modal>
  );
}

export default PropertyDetailModal;
