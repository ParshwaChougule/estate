import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Image } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaEye, FaUpload, FaTimes } from 'react-icons/fa';
import { database, storage } from '../firebase';
import { ref, push, onValue, remove, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    images: [],
    type: 'commercial', // commercial, residential, plots, luxury
    listingType: 'buy', // buy or rent
    status: 'available'
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    // Fetch properties from Firebase
    const propertiesRef = ref(database, 'properties');
    const unsubscribe = onValue(propertiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const propertiesData = snapshot.val();
        const propertiesArray = Object.keys(propertiesData).map(key => ({
          id: key,
          ...propertiesData[key]
        }));
        setProperties(propertiesArray);
      } else {
        setProperties([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const uploadImages = async (files) => {
    const uploadPromises = files.map(async (file, index) => {
      const fileName = `properties/${Date.now()}_${index}_${file.name}`;
      const imageRef = storageRef(storage, fileName);
      
      try {
        const snapshot = await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  const removeImagePreview = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setImagePreview(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadingImages(true);

    try {
      let imageUrls = formData.images || [];

      // Upload new images if selected
      if (selectedFiles.length > 0) {
        const uploadedUrls = await uploadImages(selectedFiles);
        imageUrls = [...imageUrls, ...uploadedUrls];
      }

      const propertyData = {
        ...formData,
        images: imageUrls,
        createdAt: editingProperty ? (formData.createdAt || new Date().toISOString()) : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingProperty) {
        // Update existing property
        const propertyRef = ref(database, `properties/${editingProperty.id}`);
        await update(propertyRef, propertyData);
        setAlert({ show: true, message: 'Property updated successfully!', type: 'success' });
      } else {
        // Add new property with title-based ID
        const titleBasedId = formData.title.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') + '-' + Date.now();
        
        const propertyRef = ref(database, `properties/${titleBasedId}`);
        await update(propertyRef, propertyData);
        setAlert({ show: true, message: 'Property added successfully!', type: 'success' });
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving property:', error);
      console.error('Error details:', error.message);
      setAlert({ show: true, message: `Error saving property: ${error.message}`, type: 'danger' });
    }
    setLoading(false);
    setUploadingImages(false);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      price: property.price,
      location: property.location,
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      area: property.area,
      description: property.description || '',
      images: property.images || [],
      type: property.type,
      listingType: property.listingType || 'buy',
      status: property.status,
      createdAt: property.createdAt
    });
    setImagePreview(property.images || []);
    setShowModal(true);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const propertyRef = ref(database, `properties/${propertyId}`);
        await remove(propertyRef);
        setAlert({ show: true, message: 'Property deleted successfully!', type: 'success' });
      } catch (error) {
        console.error('Error deleting property:', error);
        setAlert({ show: true, message: 'Error deleting property!', type: 'danger' });
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProperty(null);
    setSelectedFiles([]);
    setImagePreview([]);
    setFormData({
      title: '',
      price: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      description: '',
      images: [],
      type: 'commercial',
      listingType: 'buy',
      status: 'available'
    });
  };

  const removeExistingImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreview(newPreviews);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'commercial': return 'primary';
      case 'residential': return 'success';
      case 'plots': return 'warning';
      case 'luxury': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'sold': return 'danger';
      case 'rented': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div>
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="mb-0">All Properties ({properties.length})</h6>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" />
          Add Property
        </Button>
      </div>

      <Table responsive hover>
        <thead className="bg-light">
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Price</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>
                <strong>{property.title}</strong>
                <br />
                <small className="text-muted">
                  {property.type === 'plots' 
                    ? `${property.area} sq ft` 
                    : `${property.bedrooms} BHK • ${property.area} sq ft`
                  }
                </small>
              </td>
              <td>
                <Badge bg={getTypeColor(property.type)}>
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </Badge>
              </td>
              <td>₹{property.price}</td>
              <td>{property.location}</td>
              <td>
                <Badge bg={getStatusColor(property.status)}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </Badge>
              </td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(property)}>
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(property.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
          {properties.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted py-4">
                No properties found. Add your first property!
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add/Edit Property Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProperty ? 'Edit Property' : 'Add New Property'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Property Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter property title"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Property Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="plots">Plots</option>
                    <option value="luxury">Luxury</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Listing Type</Form.Label>
                  <Form.Select
                    name="listingType"
                    value={formData.listingType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="buy">For Sale (Buy)</option>
                    <option value="rent">For Rent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="sold">Sold Out</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 50 Lakh"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter location"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              {formData.type !== 'plots' && (
                <>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        placeholder="e.g., 3"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Control
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        placeholder="e.g., 2"
                      />
                    </Form.Group>
                  </Col>
                </>
              )}
              <Col md={formData.type === 'plots' ? 12 : 4}>
                <Form.Group className="mb-3">
                  <Form.Label>Area (sq ft)</Form.Label>
                  <Form.Control
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g., 1200"
                  />
                </Form.Group>
              </Col>
            </Row>


            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter property description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Property Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="mb-3"
              />
              <Form.Text className="text-muted">
                Select multiple images for your property
              </Form.Text>

              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="mt-3">
                  <h6>Image Preview:</h6>
                  <Row>
                    {imagePreview.map((preview, index) => (
                      <Col key={index} md={3} className="mb-2">
                        <div className="position-relative">
                          <Image
                            src={preview}
                            thumbnail
                            style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0"
                            onClick={() => removeImagePreview(index)}
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {uploadingImages && (
                <div className="text-center mt-2">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Uploading images...
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingProperty ? 'Update Property' : 'Add Property')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PropertyManagement;
