import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
} from "react-bootstrap";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

function ControlPanel() {
  const [properties, setProperties] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Commercial");

  // Fetch properties from Firestore
  const fetchProperties = async () => {
    const querySnapshot = await getDocs(collection(db, "properties"));
    setProperties(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Add new property
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === "") return;

    await addDoc(collection(db, "properties"), {
      title,
      category,
      createdAt: new Date(),
    });

    setTitle("");
    setCategory("Commercial");
    fetchProperties();
  };

  // Delete property
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "properties", id));
    fetchProperties();
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={4}>
          <Card className="p-3 shadow-sm">
            <h4>Add Property</h4>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Property Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter property name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Commercial</option>
                  <option>Residential</option>
                  <option>Plots</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Add Property
              </Button>
            </Form>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="p-3 shadow-sm">
            <h4>Properties List</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop, index) => (
                  <tr key={prop.id}>
                    <td>{index + 1}</td>
                    <td>{prop.title}</td>
                    <td>{prop.category}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(prop.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ControlPanel;
