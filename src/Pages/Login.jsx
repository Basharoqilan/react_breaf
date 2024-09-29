import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../utils/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { useEffect } from "react";

function Login() {
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
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const onSubmit = (data) => {
    console.log(data);

    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setError("");
        return user;
        // ...
      })
      .then(async (user) => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data().role, user);

        dispatch({
          type: "LOGIN",
          payload: {
            ...user,
            name: docSnap.data().name,
            role: docSnap.data().role,
          },
        });

        if (docSnap.data().role == "user") {
          navigate("/");
        } else if (docSnap.data().role == "admin") {
          navigate("/OverviewPage");
        }
      })
      .catch((error) => {
        setError(error.code);
        console.log(error);
      });
  };

  // const onSubmit = (data) => {
  //   console.log(data);

  //   signInWithEmailAndPassword(auth, data.email, data.password)
  //     .then(async (userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       setError("");

  //       // Fetch the user's role from Firestore
  //       const docRef = doc(db, "users", user.uid);
  //       const docSnap = await getDoc(docRef); // Get the document

  //       if (docSnap.exists()) {
  //         // If the document exists, retrieve the role
  //         const role = docSnap.data().role;
  //         console.log("User role:", role); // Use the role as needed
  //       } else {
  //         console.log("No such document!");
  //       }
  //     })
  //     .catch((error) => {
  //       setError(error.code);
  //       console.log(error);
  //     });
  // };

  return (
    <>
      <Card style={{ width : "35%" , marginLeft : "32%" , marginTop : "10%" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}{" "}
          {/* Show error if login fails */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            {" "}
            {/* Handle form submission with react-hook-form */}
            <Form.Group>
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })} // Register the input with validation rules
                isInvalid={!!errors.email} // Show validation error
              />
              {errors.email && (
                <Form.Text className="text-danger">
                  {errors.email.message}
                </Form.Text>
              )}{" "}
              {/* Display error message */}
            </Form.Group>
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
                isInvalid={!!errors.password} // Show validation error
              />
              {errors.password && (
                <Form.Text className="text-danger">
                  {errors.password.message}
                </Form.Text>
              )}{" "}
              {/* Display error message */}
            </Form.Group>
            <Button className="w-100 mt-3" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/ForgetPassword">Forgot Password?</Link>
            <div className="w-100 text-center mt-2">
        Need an account? <Link to="/register">Sign Up</Link>
      </div>
          </div>
        </Card.Body>
      </Card>
     
    </>
  );
}

export default Login;
