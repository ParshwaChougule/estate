
import React from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";

const PropertySection = () => {
  return (
    <Container className="my-5">
      <Row className="align-items-center">
        {/* Left Image */}
        <Col md={6}>
          <Image
            src="https://images.unsplash.com/photo-1640878423503-316007fea369?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA==" 
            alt="Property"
            fluid
            rounded
          />
        </Col>

        {/* Right Content */}
        <Col md={6}>
          <h1 className="mb-3 mx-5 ">Find Your Dream Property</h1>
          <p className="mx-5 ">
            Paragon Properties offers the best of Dubai real estate. Whether
            you’re in the market for a lavish apartment, a waterfront villa, or a
            stunning penthouse, Dubai’s property market has something to offer.
            With a thriving economy and investment climate, purchasing property
            is a smart decision.
          </p>
          <p className="mx-5 ">Let us help you find your dream home.</p>
             <Button variant="dark" className="mx-5">View More</Button>

        </Col>
      </Row>
    </Container>
  );
};

export default PropertySection;
