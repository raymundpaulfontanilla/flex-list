import { Container, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be atleast 6 characters";
    }

    if (formData.password_confirmation !== formData.password) {
      newErrors.password_confirmation = "Password do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setErrors({});

    try {
      const response = await fetch("http://flex-list-api.local/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const validationErrors = {};
          Object.keys(data.errors).forEach((key) => {
            validationErrors[key] = data.errors[key][0];
          });
          setErrors(validationErrors);
          throw new Error("Validation Failed");
        }
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMessage(
        data.message || "Registration sucessfull! You can now login"
      );

      setFormData({
        name: "",
        username: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      setErrorMessage(
        error.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="p-4 p-md-5 shadow-lg rounded-3 bg-white">
            <h2 className="text-center mb-4">Register</h2>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg">
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
