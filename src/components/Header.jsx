import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import Logout from "../components/auth/Logout"
import logo from "./logo.png"
const Header = () => {
  // Check login state from localStorage when the component mounts
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Holds user data

  // Check localStorage for user info on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user"); // Get 'user' from localStorage
    if (userData) {
      setUser(JSON.parse(userData)); // Parse user info
      setIsLoggedIn(true); // Set login state to true
    } else {
      setUser(null); // Clear user data
      setIsLoggedIn(false); // Set login state to false
    }
  }, []);

  // Function to log the user in (for demonstration)
  const handleLogin = () => {
    const userData = {
      name: "John Doe",
      email: "johndoe@example.com",
    };
    localStorage.setItem("user", JSON.stringify(userData)); // Store user data in localStorage
    setUser(userData); // Update state with user data
    setIsLoggedIn(true); // Set login state to true
  };

  // Function to log the user out
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data from localStorage
    setUser(null); // Clear user data
    setIsLoggedIn(false); // Set login state to false
  };

  // Handle opening of the mobile menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing of the mobile menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(180deg, #B06AB3 0%, #4568DC 100%)", // Gradient background
        boxShadow: "none",
        padding: "10px 0",
        width: '100vw',
      }}
    >
      <Container>
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: 40, marginRight: "10px" }}
            />
          </IconButton>

          {/* Desktop Menu */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <Button component={Link} to="/" color="inherit" sx={navButtonStyle}>
              Home
            </Button>
            <Button
              component={Link}
              to="/UserCourses"
              color="inherit"
              sx={navButtonStyle}
            >
              Courses
            </Button>

          
        <Logout>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/register"
                sx={{
                  backgroundColor: "#F68928", // Orange button
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#E0761E",
                  },
                  ml: 2,
                  fontWeight: "bold",
                  borderRadius: "8px",
                  padding: "5px 20px",
                  height: "48px", // Ensures height matches with Log In button
                }}
              >
                register
              </Button>
            

           
             
              
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                to="/login"
                onClick={handleLogin} // Simulate login on click
                sx={{
                  backgroundColor: "#F68928", // Orange button
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#E0761E",
                  },
                  ml: 2,
                  fontWeight: "bold",
                  borderRadius: "8px",
                  padding: "5px 20px",
                  height: "50px", // Ensures height matches with Log In button
                }}
              >
                Log In
              </Button>
              </Logout>

          </nav>

          {/* Mobile Menu */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{ display: { xs: "block", lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

// Custom styles for navigation buttons
const navButtonStyle = {
  color: "#fff", // Keep the text white
  fontSize: "16px",
  fontWeight: "bold",
  textTransform: "capitalize",
  "&:hover": {
    color: "#fff", // Keep text color white on hover
  },
};

export default Header;