import React, { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import './navbar.css';
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore imports

function ProfileOut(props) {
  const [userName, setUserName] = useState("User's Name");

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("auth"));
  const userId = userData?.proactiveRefresh?.user?.uid;
  console.log("User ID from localStorage:", userId); // Debugging log

  useEffect(() => {
    const db = getFirestore();

    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDocRef = doc(db, "users", userId); // Assuming your collection is 'users'
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("User data from Firestore:", userData); // Debugging log
            setUserName(userData.name); // Set the username from Firestore data
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      } else {
        console.log("No userId found in localStorage.");
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <Navbar id="navigation" className="main-header d-flex align-items-center myNav">
      <Container className="d-flex align-items-center justify-content-between">
      <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
  <img src="src/assets/img/logo/logo.png" alt="Logo" />
</Navbar.Brand>
        
        <Nav className="d-flex align-items-center gap-4">
          <Nav.Link as={Link} to="/" className="d-flex align-items-center" style={{ fontSize: '15px' , color : "white" }}>
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/Courses" className="d-flex align-items-center" style={{ fontSize: '15px' , color : "white" }}>
            Courses
          </Nav.Link>

          {/* Profile Dropdown */}
          <Dropdown className="profile-out">
            <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="profile-toggle">
              {userName}  {/* Show username from Firestore */}
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-info p-0 rounded-top">
              <Dropdown.Item 
                href="user_profile" 
                className='item pt-3 rounded-top d-flex justify-content-between align-items-center'
                style={{ backgroundColor : "#5274ff", color: "white" }}
              >
                Profile 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                </svg>
              </Dropdown.Item>
              <Dropdown.Item 
                href="#/logout" 
                className='item pb-3 d-flex justify-content-between align-items-center'
                style={{ backgroundColor : "#5274ff", color: "white" }}
                onClick={props.fin}
              >
                Log out 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </Nav>
      </Container>
    </Navbar>
  );
}

export default ProfileOut;
