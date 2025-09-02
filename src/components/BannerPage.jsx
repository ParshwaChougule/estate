
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Dropdown } from "react-bootstrap";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const BannerPage = ({ onFilterChange, onSearchFiltersChange }) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('');

  const handleSearch = () => {
    onSearchFiltersChange({
      location: searchLocation,
      priceRange: selectedPriceRange,
      bedrooms: selectedBedrooms
    });
  };

  const handlePriceRangeSelect = (range) => {
    setSelectedPriceRange(range);
  };

  const handleBedroomsSelect = (bedrooms) => {
    setSelectedBedrooms(bedrooms);
  };
  return (
    <div
      className="search-banner d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('https://www.paragonproperties.ae/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fi2bmxk8e%2Fproduction%2F656b67b7c1d132a4661fe6fb5445480898bb5b42-1500x1992.jpg%3Fq%3D75%26fit%3Dclip%26auto%3Dformat&w=768&q=75&dpl=dpl_88uzUpMmjW9VJGssgTFJ7zdU8JJA')",
        backgroundSize: "cover",
        backgroundattachment: "fixed",
        backgroundPosition: "center",
        height: "70vh",
      }}
    >
      
      <Container className="text-center">
        {/* Toggle Buttons */}
        <div className="mb-4">
          <Button 
            variant="outline-light" 
            className="mx-2 rounded-pill"
            onClick={() => onFilterChange('available')}
          >
            BUY
          </Button>
          <Button 
            variant="outline-light" 
            className="mx-2 rounded-pill"
            onClick={() => onFilterChange('rented')}
          >
            RENT
          </Button>
          {/* <Button variant="outline-light" className="mx-2 rounded-pill">LUXURY</Button>
          <Button variant="outline-light" className="mx-2 rounded-pill">OFF-PLAN</Button> */}
        </div>

        {/* Active Filters Indicator */}
        {(searchLocation || selectedPriceRange || selectedBedrooms) && (
          <div className="mb-3">
            <small className="text-light">
              Active filters: 
              {searchLocation && <span className="badge bg-light text-dark ms-2">{searchLocation}</span>}
              {selectedPriceRange && <span className="badge bg-light text-dark ms-2">{selectedPriceRange}</span>}
              {selectedBedrooms && <span className="badge bg-light text-dark ms-2">{selectedBedrooms} Bedrooms</span>}
            </small>
          </div>
        )}
        
        {/* Search Bar */}
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <InputGroup className="shadow-lg">
              {/* Location Input */}
              <InputGroup.Text className="bg-white">
                <FaMapMarkerAlt />  
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search location"
                className="border-end-0"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />

              {/* Price Range Dropdown */}
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  className="border-start border-end rounded-0 py-3"
                >
                  {selectedPriceRange || 'Price Range'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item onClick={() => handlePriceRangeSelect('Below ₹10 lakh')}>Below ₹10 lakh</Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePriceRangeSelect('10 lakh - ₹20 lakh')}>₹10 lakh - ₹20 lakh</Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePriceRangeSelect('₹30 lakh - ₹50 lakh')}>₹30 lakh - ₹50 lakh</Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePriceRangeSelect('₹60 lakh - ₹80 lakh')}>₹60 lakh - ₹80 lakh</Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePriceRangeSelect('Above ₹80 lakh')}>Above ₹80 lakh</Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePriceRangeSelect('')}>Any Price</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Bedrooms Dropdown */}
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  className="border-start border-end rounded-0"
                >
                  {selectedBedrooms || 'Bedrooms'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleBedroomsSelect('1')}>1 Bedroom</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleBedroomsSelect('2')}>2 Bedrooms</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleBedroomsSelect('3')}>3 Bedrooms</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleBedroomsSelect('4')}>4 Bedrooms</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleBedroomsSelect('5+')}>5+ Bedrooms</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleBedroomsSelect('')}>Any Bedrooms</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Search Button */}
              <Button variant="dark" className="px-4 rounded-end" onClick={handleSearch}>
                <FaSearch className="me-2" /> Search
              </Button>
              
              {/* Clear Button */}
              <Button 
                variant="outline-secondary" 
                className="ms-2 text-white" 
                onClick={() => {
                  setSearchLocation('');
                  setSelectedPriceRange('');
                  setSelectedBedrooms('');
                  onSearchFiltersChange({
                    location: '',
                    priceRange: '',
                    bedrooms: ''
                  });
                }}
              >
                Clear
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BannerPage;