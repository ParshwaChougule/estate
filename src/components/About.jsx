// AboutPage.js
import React from "react";
import { Container, Row, Col,Card,} from "react-bootstrap";
import { FaHandshake, FaUsersCog, FaHome } from "react-icons/fa";
import { FaHandRock } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { IoDiamondOutline } from "react-icons/io5";
import { IoMegaphoneOutline } from "react-icons/io5";
import { TbTargetArrow } from "react-icons/tb";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";


 

function AboutPage() {
  return (
    <div>
      {/* Hero Section with Background */}
      <div
        style={{
          position: "relative",
          backgroundImage: `url("https://www.propertyfinder.ae/property/1ced709e650668a706de38517882aadf/416/272/MODE/606e34/14991224-13700o.webp?ctr=ae")`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "80vh",
          color: "white",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        />

        {/* Content */}
        <Container
          className="d-flex flex-column justify-content-center align-items-center h-100 text-center"
          style={{ position: "relative", zIndex: 2 }}
        >
          {/* <h1 className="mb-3" style={{ fontFamily: "serif", fontWeight: "600" }}>
            About
          </h1> */}
          <p
            style={{
              fontSize: "1.5rem",
              maxWidth: "800px",
              lineHeight: "1.6",
            }}
            className="fs-1"
          >
            Paragon Properties offers the best of Dubai, known for luxurious Real Estate.
          </p>
        </Container>
      </div>

      {/* Extra Content Section Start */}
      <Container className="my-5">
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <img
              src="https://www.paragonproperties.ae/_next/image?url=https://cdn.sanity.io/images/i2bmxk8e/production/519e0ef62b6c088b7c71ada2727c0343087fa51c-2480x1920.jpg?q=75&fit=clip&auto=format&w=4480&q=80&dpl=dpl_88uzUpMmjW9VJGssgTFJ7zdU8JJA"
              alt="About Paragon"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6}>
            <h2 className="mx-5">Who We Are</h2>
            <p className="mx-5">
              We specialize in premium real estate solutions across Dubai. Our team ensures
              clients receive unmatched expertise, commitment, and quality services.
            </p>
            <p className="mx-5">
              From luxury villas to high-end apartments, Paragon Properties is your trusted
              partner for finding the perfect property.
            </p>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="mx-5">Why Choose Paragon Properties?</h2>
            <p className="mx-5">
              We offer a bespoke approach catering to your preferences, budget, and goals.
               Our knowledge of the UAE real estate market lets us provide informed guidance 
               so you can make decisions aligned with your aspirations.
            </p>
            <p className="mx-5">
              For property sellers, we offer customized solutions designed to
               maximize the value of your asset. Our understanding of the market
                and extensive network enables us to more effectively market your property.
            </p>
            <p className="mx-5">
              We are dedicated to making your property experience hassle-free and rewarding.
            </p>
          </Col>
          <Col md={6} className="mt-5">
            <img
              src="https://static.wixstatic.com/media/2387b9_646fa6b4514149578c0661324a5833ff~mv2.jpg/v1/fill/w_285,h_190,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/More%20info_%20https___www_rarchitecture_com_au_parkdale_house_balwyn_edited.jpg"
              alt="About Paragon"
              className="img-fluid rounded shadow"
              style={
                {
                  height: '500px'
                }
              }
            />
          </Col>
        </Row>
      </Container>
       {/* Extra Content Section End */}

        {/* Video Section Start */}
       <Container className="mt-5 pt-5 ">
        <h1 className="fs-1">Paragon is your trusted partner in UAE <br /> real estate.</h1>
        <Row className="justify-content-center">
          <Col md={12} lg={8}>
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Body className="p-0">
                <div className="ratio ratio-16x9">
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/zJPVKeSkYvM?si=yOVUbk2nGQztZjFI" 
                  title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerpolicy="strict-origin-when-cross-origin" allowfullscreen className="rounded-3">
            
                  </iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Video Scetion End */}

      {/* Exclusively Section Start */}
      <div className="mt-5" style={{ backgroundColor: "#333", color: "white", padding: "80px 20px" }}>
        <Container className="mt-5 py-5" >
          {/* Heading */}
          <Row className="mb-5">
            <Col md={12} className="text-center">
              <h2 className="fw-bold mb-3">
                Why List Exclusively with Paragon Properties?
              </h2>
              <p className="lead">
                When it comes to selling your property, listing exclusively with
                Paragon Properties offers numerous advantages that streamline the
                process and maximize your results:
              </p>
            </Col>
          </Row>

          {/* Features */}
          <Row className="text-center">
            <Col md={4} className="mb-4">
              <FaHandshake size={40} className="mb-3 text-primary" />
              <h5 className="fw-bold">Trust</h5>
              <p>
                Trust is fundamental in any sales transaction. Paragon Properties
                has built its reputation on trust, ensuring that every client
                relationship is founded on integrity and long-term commitment.
              </p>
            </Col>

            <Col md={4} className="mb-4">
              <FaUsersCog size={40} className="mb-3 text-success" />
              <h5 className="fw-bold">Relationship Management</h5>
              <p>
                By listing exclusively with us, you benefit from streamlined
                communication and a single point of contact for all marketing
                activities. This simplifies coordination and ensures efficient
                updates and interactions.
              </p>
            </Col>

            <Col md={4} className="mb-4">
              <FaHome size={40} className="mb-3 text-warning" />
              <h5 className="fw-bold">
                Property Relationship Management & Due Diligence
              </h5>
              <p>
                Our dedicated brokers conduct thorough due diligence to qualify
                potential buyers, ensuring professionalism and granting access
                only to the most qualified individuals.
              </p>
            </Col>
          </Row>

          {/* Second Row Start */}
          <Row className="text-center mb-4">
          <Col md={4} className="mb-4">
           <FaHandRock size={40} className="mb-3"/>
            <h5 className="fw-bold">Power of the Brand</h5>
            <p>
              With Paragon Properties, your listing gains the backing of a
              well-known and reputable real estate firm, enhancing its presence
              and attracting more inquiries from buyers and tenants.
            </p>
          </Col>

          <Col md={4} className="mb-4">
            <IoIosGlobe size={40} className="mb-3 text-primary"/>
            <h5 className="fw-bold">Online Exposure</h5>
            <p>
              Partnering with us provides global exposure through our established
              online presence and leading property website, ensuring your
              property stands out without dilution.
            </p>
          </Col>

          <Col md={4} className="mb-4">
            <IoDiamondOutline size={40} className="mb-3 text-light"/>
            <h5 className="fw-bold">Elite Clientele</h5>
            <p>
              Gain access to our VIP high-net-worth individual list, ensuring
              your property is presented to discerning buyers who value luxury
              and exclusivity.
            </p>
          </Col>
        </Row>
          {/* Second Row End */}

        {/* Third Row Start */}
            <Row className="text-center mb-4">
          <Col md={4} className="mb-4">
            <IoMegaphoneOutline size={40} className="mb-3 text-info"/>
            <h5 className="fw-bold">Comprehensive Marketing</h5>
            <p>
              We dedicate full attention to showcasing your property with premium
              listings, social media campaigns, video tours, press coverage, and
              targeted email marketing.
            </p>
          </Col>

          <Col md={4} className="mb-4">
            <TbTargetArrow size={40} className="mb-3 text-danger"/>
            <h5 className="fw-bold">Expert Advisory</h5>
            <p>
              Receive valuable insights from your dedicated broker on market
              trends, buyer interest, and transactional activity to make
              informed decisions.
            </p>
          </Col>
        </Row>
        {/* Third Row End */}

            <Row className="text-center mt-5">
          <Col md={6}>
            <p className="fst-italic">
              When you list exclusively with Paragon Properties, your property
              becomes our top priority. Contact our Private Client Advisory team
              today to initiate the process. We’re committed to delivering
              exceptional results tailored to your needs.
            </p>
          </Col>
        </Row>
        </Container>
      </div>
      {/* Exclusively Section End */}
      
      {/* LEadership Section Start */}
      <div className="mt-5 py-5"> 
        <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img
              src="https://www.paragonproperties.ae/_next/image?url=https://cdn.sanity.io/images/i2bmxk8e/production/3888bcf07af1c96698728085e7ba71e1a81836db-2480x2032.jpg?q=75&fit=clip&auto=format&w=4480&q=80&dpl=dpl_88uzUpMmjW9VJGssgTFJ7zdU8JJA"
              alt="About Paragon"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6}>
            <h2 className="mx-5">Leadership</h2>
            <p className="mx-5">
              At Paragon Properties, we are driven by a shared vision to redefine the real estate landscape in the UAE.
               Our journey began with a simple yet profound realization: the industry could be better, and we had the
                passion and expertise to make it happen.

            </p>
            <p className="mx-5">
              As seasoned real estate agents with over a decade of experience in Dubai, Angelo Kazantzas and Dean 
              Charter, our co-founders, had witnessed firsthand the triumphs and tribulations of the market. 
              But they also saw an opportunity to create something new, something that would stand out from the crowd. 
              They envisioned a company that would prioritize ethics, transparency, and customer satisfaction above all 
              else.

            </p>
            <p className="mx-5">
              With unwavering determination, Angelo and Dean took the leap and co-founded Paragon Properties.
               Their mission was clear: to build a business that would not only succeed but also make a positive 
               impact on the community. Today, we are proud to say that our agency has grown rapidly,
               with branches in Dubai and Ras Al Khaimah, and a reputation for excellence that precedes us.
            </p>
            <p className="mx-5">
              Our story is one of perseverance, innovation, and a relentless pursuit of excellence. 
              We believe that real estate is not just about buying and selling properties; it's about 
              building relationships, creating opportunities, and making a difference in people's lives. 
              At Paragon Properties, we are committed to upholding the highest standards of integrity, 
              professionalism, and customer service.
            </p>
            <p className="mx-5"> 
              As we continue to grow and evolve, our core values remain unchanged. We are dedicated to providing personalized attention, expert guidance, and unparalleled results to our clients. We strive to be the go-to agency for those seeking a trusted partner in the UAE's dynamic real estate market.
            </p>
          </Col>
        </Row>
        
      </Container>
      </div>
      {/* Leadership Section End */}
      

      {/* Footer Section Start */}
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
      {/* Footer Section End */}
    </div>

  );
}

export default AboutPage;
