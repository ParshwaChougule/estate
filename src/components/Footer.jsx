import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#111", color: "#fff", padding: "50px 0" }}>
      <Container>
        <Row className="mb-5">
          {/* Logo & Social Media */}
          <Col md={3} className="mb-4">
            <h2 style={{ fontFamily: "serif", fontWeight: "600" }}>Paragon</h2>
            <p style={{ fontSize: "10px", letterSpacing: "2px" }}>PROPERTIES</p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" style={{ color: "#fff" }}><FaFacebookF size={20} /></a>
              <a href="#" style={{ color: "#fff" }}><FaInstagram size={20} /></a>
              <a href="#" style={{ color: "#fff" }}><FaLinkedinIn size={20} /></a>
              <a href="#" style={{ color: "#fff" }}><FaYoutube size={20} /></a>
            </div>
          </Col>

          {/* Properties */}
          <Col md={2} className="mb-4">
            <h5 className="mb-3">Properties</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Buy</a></li>
              <li><a href="#" className="text-white text-decoration-none">Rent</a></li>
              <li><a href="#" className="text-white text-decoration-none">Luxury</a></li>
              <li><a href="#" className="text-white text-decoration-none">Off-Plan</a></li>
            </ul>
          </Col>

          {/* Services */}
          <Col md={2} className="mb-4">
            <h5 className="mb-3">Services</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Buying in Dubai</a></li>
              <li><a href="#" className="text-white text-decoration-none">Renting in Dubai</a></li>
              <li><a href="#" className="text-white text-decoration-none">Cryptocurrency</a></li>
            </ul>
          </Col>

          {/* Company */}
          <Col md={2} className="mb-4">
            <h5 className="mb-3">Company</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">About Us</a></li>
              <li><a href="#" className="text-white text-decoration-none">Brokers</a></li>
              <li><a href="#" className="text-white text-decoration-none">Get in Touch</a></li>
              <li><a href="#" className="text-white text-decoration-none">List With Us</a></li>
              <li><a href="#" className="text-white text-decoration-none">Careers</a></li>
            </ul>
          </Col>

          {/* Head Office */}
          <Col md={3} className="mb-4">
            <h5 className="mb-3">Head Office</h5>
            <p>
              2nd Floor Emirates Sports Hotel <br />
              Dubai Sports City <br />
              Dubai, UAE
            </p>
          </Col>
        </Row>

        {/* Bottom Section */}
        <hr style={{ borderColor: "#444" }} />
        <Row className="pt-3 d-flex justify-content-between align-items-center">
          <Col md={6}>
            <p className="mb-0">© 2025 Paragon. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <a href="#" className="text-white text-decoration-none me-4">Privacy Policy</a>
            <a href="#" className="text-white text-decoration-none">Terms and Conditions</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
