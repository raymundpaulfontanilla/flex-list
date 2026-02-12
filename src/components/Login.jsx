import { Container, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [formdata, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formdata,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formdata.username.trim() || !formdata.password.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setErrors({});

    try {
      const response = await fetch("http://flex-list-api.local/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const validationErrors = {};
          Object.keys(data.errors).forEach((key) => {
            validationErrors[key] = data.errors[key][0];
          });
          setErrors(validationErrors);
          throw new Error("Validation failed");
        } else if (data.message) {
          throw new Error(data.message);
        } else {
          throw new Error("Login failed. Please try again.");
        }
      }

      if (response.ok) {
        const name = data.user.name;
        const apiToken = data.api_token;

        localStorage.setItem("api_token", apiToken);

        navigate("/", {
          state: {
            name: name,
          },
        });
      }
    } catch (error) {
      setErrorMessage(
        error.message || "Username or Password is incorrect. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setErrorMessage("");
    setErrors({});
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="p-4 p-md-5 shadow-lg rounded-3 bg-white">
            <h2 className="text-center mb-4">Login</h2>
            {errorMessage && (
              <Alert
                variant="danger"
                className="mb-4"
                dismissible
                onClose={clearMessages}
              >
                <p className="mb-0">{errorMessage}</p>
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  name="username"
                  value={formdata.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formdata.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="d-grid">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => navigate("/register")}
                  >
                    Register here
                  </Button>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
