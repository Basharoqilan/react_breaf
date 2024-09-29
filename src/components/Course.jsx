import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // If using React Router for navigation
import './Courses.css'; 
import { db } from '../firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth
import CourseDetails from './CourseDetails'; 
import SubscriptionModal from './SubscriptionModal'; 

const CourseCard = ({ imgSrc, course_name, course_teacher, course_duration, cost, onDetailsClick, onSubscriptionClick }) => {
  return (
    <div className="course-card">
      <img className="course-image" src={imgSrc} alt={course_name} />
      <div className="course-content">
        <h3 className="course_name">Course name: {course_name}</h3>
        <h4 className="course-teacher" style={{ marginTop : "5px" }} >Teacher: {course_teacher}</h4>
        <h4 className="course-duration" style={{ marginTop : "5px" }}>Duration: {course_duration} days</h4>
        <h4 className="course-cost" style={{ marginTop : "5px" }}>Cost: {cost} $</h4>
        <div className="button-group" style={{ marginTop : "10px" }}>
          <button className="course-button" onClick={onDetailsClick}>Details</button>
          <button className="course-button" onClick={onSubscriptionClick}>Subscription</button>
        </div>
      </div>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCreditCard, setSelectedCreditCard] = useState(null);
  const [isSubscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in
  const navigate = useNavigate(); // Use this for redirection

  // Fetch courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const courseSnapshot = await getDocs(coursesCollection);
      const coursesList = courseSnapshot.docs.map(doc => doc.data());
      setCourses(coursesList);
    };

    fetchCourses();
  }, []);

  // Check if the user is logged in
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // User is logged in
      } else {
        setIsLoggedIn(false); // User is not logged in
      }
    });
  }, []);

  // Fetch user and credit card info (for demo purposes)
  useEffect(() => {
    const fetchUserAndCreditCard = async () => {
      const usersCollection = collection(db, 'users');
      const creditCardCollection = collection(db, 'credit_card');
      
      const userSnapshot = await getDocs(usersCollection);
      const creditCardSnapshot = await getDocs(creditCardCollection);
      
      const userList = userSnapshot.docs.map(doc => doc.data());
      const creditCardList = creditCardSnapshot.docs.map(doc => doc.data());
      
      setSelectedUser(userList[0]); // Assume the first user
      setSelectedCreditCard(creditCardList[0]); // Assume the first credit card
    };

    // Only fetch user/credit card data when the modal is about to open
    if (isSubscriptionModalOpen) {
      fetchUserAndCreditCard();
    }
  }, [isSubscriptionModalOpen]);

  const handleSubscriptionClick = (course) => {
    if (isLoggedIn) {
      setSelectedCourse(course); // Set the selected course
      setSubscriptionModalOpen(true); // Open the modal
    } else {
      navigate('/login'); // Redirect to the login page if not logged in
    }
  };

  const handleCloseSubscriptionModal = () => {
    setSubscriptionModalOpen(false); // Close the modal
    setSelectedCourse(null); // Reset selected course
  };

  return (
    <main>
      <section className="hero-section">
        <h1 className="hero-title">Our Courses</h1>
        <p className="hero-subtitle">
          <a href="/" className="hero-link">Home</a> | Courses
        </p>
      </section>

      <section className="courses-section">
        <div className="courses-grid">
          {courses.map((course, index) => (
            <CourseCard
              key={index}
              imgSrc={course.course_image}
              course_name={course.course_name}
              course_teacher={course.course_teacher}
              course_duration={course.course_duration}
              cost={course.total_cost}
              onDetailsClick={() => setSelectedCourse(course)}
              onSubscriptionClick={() => handleSubscriptionClick(course)}
            />
          ))}
        </div>
      </section>

      {/* Conditionally render only one modal at a time */}
      {selectedCourse && !isSubscriptionModalOpen && (
        <CourseDetails course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}

      {isSubscriptionModalOpen && selectedUser && selectedCreditCard && (
        <SubscriptionModal 
          course={selectedCourse} 
          user={selectedUser} 
          creditCard={selectedCreditCard} 
          onClose={handleCloseSubscriptionModal} 
        />
      )}
    </main>
  );
};

export default Courses;
