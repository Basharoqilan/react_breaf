import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";

function Register() {
  useEffect(() => {
    // Create a new <link> element for Bootstrap
    const bootstrapLink = document.createElement("link");
    bootstrapLink.rel = "stylesheet";
    bootstrapLink.href =
      "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";

    // Append the Bootstrap <link> tag to the <head> of the document
    document.head.appendChild(bootstrapLink);

    // Clean up function to remove Bootstrap styles when the component is unmounted
    return () => {
      document.head.removeChild(bootstrapLink);
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // Watch the password field value
  const password = watch("password");

  const onSubmit = async (data) => {
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        return user;
      })
      .then((user) => {
        setDoc(doc(db, "users", user.uid), {
          userid: user.uid,
          email: user.email,
          name: data.name,    // Save the user's name
          phone: data.phone,  // Save the user's phone number
          role: "user",
        });
      })
      .then(() => {
        // Redirect to login after signup
        navigate("/login");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <>
      <Card style={{ width : "35%" , marginLeft : "32%" , marginTop : "5%" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <Form.Group>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control
                id="name"
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters long",
                  },
                })}
                isInvalid={!!errors.name}
              />
              {errors.name && (
                <Form.Control.Feedback type="invalid">
                  {errors.name.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Phone Field */}
            <Form.Group>
              <Form.Label htmlFor="phone">Phone</Form.Label>
              <Form.Control
                id="phone"
                type="tel"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be 10 digits",
                  },
                })}
                isInvalid={!!errors.phone}
              />
              {errors.phone && (
                <Form.Control.Feedback type="invalid">
                  {errors.phone.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Email Field */}
            <Form.Group>
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Enter a valid email address",
                  },
                })}
                isInvalid={!!errors.email}
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Password Field */}
            <Form.Group>
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                isInvalid={!!errors.password}
              />
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Confirm Password Field */}
            <Form.Group>
              <Form.Label htmlFor="password-confirm">Confirm Password</Form.Label>
              <Form.Control
                id="password-confirm"
                type="password"
                {...register("passwordConfirm", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                isInvalid={!!errors.passwordConfirm}
              />
              {errors.passwordConfirm && (
                <Form.Control.Feedback type="invalid">
                  {errors.passwordConfirm.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Button className="w-100 mt-3" type="submit">
              Sign Up
            </Button>
          </Form>
          <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
        </Card.Body>
        
      </Card>

     
    </>
  );
}

export default Register;
