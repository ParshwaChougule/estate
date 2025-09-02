import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import dubai from "../location/dubai.jpg"; 
import rak from "../location/rak.avif";    
import "./Locations.css"; 

const Locations = () => {
  const places = [
    {
      id: 1,
      name: "Dubai",
      img: dubai,
      description:
        "Paragon Properties offers the best of Dubai. Whether you’re in the market for a lavish apartment, a waterfront villa, or a stunning penthouse, Dubai’s property market has something to offer. With a thriving economy and favorable investment climate, purchasing property is a smart decision.",
    },
    {
      id: 2,
      name: "Ras Al-Khaimah",
      img: rak,
      description:
        "From serene beaches to luxury resorts, Ras Al-Khaimah is the hidden gem of the UAE. Offering affordable properties and stunning views, it's perfect for both living and investment opportunities.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#2f2f2f", padding: "60px 0" }}>
      <Container>
        <h2 className="text-white fw-bold mb-5">Explore Our Locations</h2>
        <Row>
          {places.map((place) => (
            <Col md={6} key={place.id} className="mb-4">
              <Card className="location-card">
                <Card.Img src={place.img} alt={place.name} className="card-img" />
                <div className="overlay">
                  <Card.Title className="title">{place.name}</Card.Title>
                  <Card.Text className="description">{place.description}</Card.Text>
                  <Button variant="light" size="sm">
                    See Location →
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Locations;
