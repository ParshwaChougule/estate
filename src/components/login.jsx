import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { database, auth } from "../firebase";
import { ref, get } from "firebase/database";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setLoading(true);
      try {
        // Check if admin exists in Firebase database with this phone number and password
        const adminRef = ref(database, 'admin');
        const snapshot = await get(adminRef);
        
        if (snapshot.exists()) {
          const adminData = snapshot.val();
          
          // Check if phone number and password match (convert types for comparison)
          if (adminData.phone.toString() === phoneNumber && adminData.password.toString() === password) {
            // Sign in with Firebase Auth using a dummy email for Storage permissions
            const dummyEmail = `admin@${phoneNumber}.com`;
            try {
              await signInWithEmailAndPassword(auth, dummyEmail, password);
            } catch (authError) {
              // If user doesn't exist, create them first
              if (authError.code === 'auth/user-not-found') {
                await createUserWithEmailAndPassword(auth, dummyEmail, password);
              }
            }
            
            setShowAlert("success");
            // Set authentication state
            login(adminData);
            // Redirect to admin dashboard after successful login
            setTimeout(() => {
              navigate('/admin-dashboard');
            }, 1000);
          } else {
            setShowAlert("error");
          }
        } else {
          setShowAlert("error");
        }
      } catch (error) {
        setShowAlert("error");
        console.error(error.message);
      }
      setLoading(false);
    }

    setValidated(true);
  };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center " 
        style={{
          position: "relative",
          backgroundImage: `url("https://24acres.in/wp-content/uploads/2023/07/luxury-home.jpg")`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          
        }}
    >
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="shadow-lg border-0 p-5 rounded-5">
            <h3 className="text-center mb-4">🔐 Login</h3>

            {showAlert === "success" && (
              <Alert variant="success" className="text-center">
                ✅ Login Successful!
              </Alert>
            )}
            {showAlert === "error" && (
              <Alert variant="danger" className="text-center">
                ❌ Invalid mobile number or password!
              </Alert>
            )}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicPhone">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  required
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid mobile number.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Password must be at least 6 characters.
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </Form>

            
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
