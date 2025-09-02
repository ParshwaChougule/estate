// import React, { useState } from "react";
// import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
// import { useRouteLoaderData } from "react-router-dom";




// const ContactUs = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
 
//   const validate = () => {
//     let tempErrors = {};
//     if (!formData.name.trim()) tempErrors.name = "Name is required";
//     if (!formData.email) {
//       tempErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       tempErrors.email = "Email is invalid";
//     }
//     if (!formData.message.trim()) tempErrors.message = "Message is required";

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       console.log("Form Data:", formData);
//       setSubmitted(true);
//       setFormData({ name: "", email: "", message: "" });
//       setErrors({});
//     }
//   };

  


//   return (
//   <div 
//     style={{
//           position: "relative",
//           backgroundImage: `url("https://www.maramani.com/cdn/shop/collections/Pers-1_3d08d602-6611-4f2d-894a-ca784fcbe2c3.jpg?v=1714128418&width=2048")`, 
//           backgroundSize: "cover",
//           backgroundColor: "rgba(0, 0, 0, 0.6)",
//           backgroundPosition: "center",
//           height: "88vh",
//           color: "white",
//         }}
//   >
//     <Container className="" >
//       <Row className="justify-content-center ">
//         <Col md={6} className=" m-5 p-5">
//           <h2 className="mb-4 text-center">Contact Us</h2>

//           {submitted && (
//             <Alert variant="success">Your message has been sent successfully!</Alert>
//           )}

//           <Form onSubmit={handleSubmit} noValidate>
            
//             <Form.Group className="mb-3" controlId="formName">
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter your name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 isInvalid={!!errors.name}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.name}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formEmail">
//               <Form.Label>Email</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter your email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 isInvalid={!!errors.email}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.email}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formMessage">
//               <Form.Label>Message</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={4}
//                 placeholder="Enter your message"
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 isInvalid={!!errors.message}
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.message}
//               </Form.Control.Feedback>
//             </Form.Group>

//             <div className="d-grid">
//               <Button variant="dark" type="submit" className="bg-success" >
//                 Send Message
//               </Button>
//             </div>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   </div>
//   );
// };

// export default ContactUs;





import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { ref, push } from "firebase/database";
import { database } from "../firebase"; 

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        // store data in Firebase Realtime DB under "admin/contacts"
        await push(ref(database, "admin/contacts"), {
          ...formData,
          timestamp: new Date().toISOString(),
          status: 'new'
        });

        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  return (
    <div 
      style={{
        position: "relative",
        backgroundImage: `url("https://www.maramani.com/cdn/shop/collections/Pers-1_3d08d602-6611-4f2d-894a-ca784fcbe2c3.jpg?v=1714128418&width=2048")`, 
        backgroundSize: "cover",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backgroundPosition: "center",
        height: "88vh",
        color: "white",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={6} className="m-5 p-5">
            <h2 className="mb-4 text-center">Contact Us</h2>

            {submitted && (
              <Alert variant="success">Your message has been sent successfully!</Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMessage">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter your message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  isInvalid={!!errors.message}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.message}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid">
                <Button variant="dark" type="submit" className="bg-success">
                  Send Message
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
