import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import Navbar from "./NavBar";
import Cookies from 'js-cookie';

function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const validationErrors = validate();
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    fetch('http://localhost:9000/user/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email.trim(),
        password: form.password
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        Cookies.set("token", data.token, { expires: 7 }); 
        window.location.href = "/";
      } else {
        console.error("Login failed:", data.error || "Unknown error");
        alert("Login failed: " + (data.error || "Unknown error")); 
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      alert("An error occurred while logging in.");
    });
  }
};
;
  return (
    <> 
    <Navbar/>
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-4">Sign In</h3>

      {showAlert && (
        <Alert variant="danger">
          Please fix the highlighted errors and try again.
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={form.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            name="password"
            value={form.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Sign In
        </Button>
      </Form>
    </Container>
      </>
  );

}

export default Signin;
