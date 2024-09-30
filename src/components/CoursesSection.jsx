import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase"; 
import CourseDetails from "./CourseDetails"; // Import the CourseDetails component
import SubscriptionModal from "./SubscriptionModal"; // Import SubscriptionModal
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase auth import
import { useContext } from "react";
import { AuthContext } from "../utils/context/AuthContext";
// Course Card Component
const CourseCard = ({
  imgSrc,
  course_name,
  teacher,
  price,
  duration,
  onDetailsClick,
  onSubscriptionClick,
}) => {
  const { currentUser, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={imgSrc || "https://via.placeholder.com/300"} // Fallback image if imgSrc is empty
          alt={course_name}
          style={styles.image}
        />
      </div>

      <div style={styles.cardContent}>
        <h3 style={styles.courseName}>Course name: {course_name}</h3>
        <p style={styles.teacher}>Teacher: {teacher}</p>
        <p style={styles.duration}>Duration: {duration}</p>
        <h4 style={styles.price}>Cost: {price || 0} $</h4>

        <div style={styles.buttonContainer}>
          <button
            className="course-button"
            onClick={onDetailsClick}
            style={{ marginRight: "5px", marginTop: "15px" }}
          >
            Details
          </button>
          <button
            className="course-button"
            style={{ marginTop: "15px" }}
            onClick={() => {
              if (!currentUser) {
                navigate("/login");
              }
              onSubscriptionClick();
            }}
          >
            Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

// Courses Section Component
const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); // State to track the selected course
  const [isSubscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [selectedUser, setSelectedUser] = useState(null); // Track the logged-in user
  const navigate = useNavigate();

  // Fetch courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const courseList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            course_image:
              data.course_image || "https://via.placeholder.com/300", // Match property names
            course_name: data.course_name,
            course_teacher: data.course_teacher,
            total_cost: data.total_cost,
            course_duration: data.course_duration,
            course_description: data.course_description, // Ensure description is fetched
          };
        });

        setCourses(courseList);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // Set login state to true if user is logged in
        setSelectedUser(user); // Set the logged-in user
      } else {
        setIsLoggedIn(false); // User is not logged in
      }
    });
  }, []);

  // Handle the "Subscription" button click
  const handleSubscriptionClick = (course) => {
    if (isLoggedIn) {
      setSelectedCourse(course); // Set the selected course to show in the modal
      setSubscriptionModalOpen(true); // Open the subscription modal
    } else {
      // Redirect to login page if not logged in
      navigate("/login", {
        state: { message: "Please log in to subscribe to a course." },
      });
    }
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSubscriptionModalOpen(false); // Close the modal
    setSelectedCourse(null); // Reset selected course
  };

  // Navigate to the courses page when "Show More" is clicked
  const handleShowMore = () => {
    navigate("/UserCourses");
  };

  return (
    <div style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>Our Featured Courses</h2>

        <div style={styles.grid}>
          {courses.length === 0 ? (
            <p style={styles.noCourses}>No courses available</p>
          ) : (
            courses.slice(0, 3).map((course) => (
              <div style={styles.gridItem} key={course.id}>
                <CourseCard
                  imgSrc={course.course_image}
                  course_name={course.course_name}
                  teacher={course.course_teacher}
                  price={course.total_cost}
                  duration={course.course_duration}
                  onDetailsClick={() => setSelectedCourse(course)} // Pass the course details to the modal
                  onSubscriptionClick={() => handleSubscriptionClick(course)} // Handle subscription click
                />
              </div>
            ))
          )}
        </div>

        <div style={styles.showMoreContainer}>
          <button className="course-button" onClick={handleShowMore}>
            Show More
          </button>
        </div>

        {/* Render CourseDetails modal if a course is selected */}
        {selectedCourse && !isSubscriptionModalOpen && (
          <CourseDetails course={selectedCourse} onClose={handleCloseModal} />
        )}

        {/* Render SubscriptionModal only if the user is logged in and modal is open */}
        {isSubscriptionModalOpen && selectedUser && (
          <SubscriptionModal
            course={selectedCourse}
            user={selectedUser}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};


// Styling
const styles = {
  section: {
    padding: "40px 0",
    backgroundColor: "#f7f7f7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100vw",
    minHeight: "100vh",
  },
  container: {
    maxWidth: "1200px",
    width: "100%",
    padding: "0 20px",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "bold",
    color: "#475fa9",
    marginBottom: "40px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  gridItem: {
    width: "calc(33.333% - 20px)",
  },
  card: {
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "white",
  },
  imageContainer: {
    height: "200px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardContent: {
    padding: "20px",
    textAlign: "left",
  },
  courseName: {
    color: "black",
  },
  teacher: {
    color: "black",
     marginTop : "5px",
  },
  duration: {
    color: "black",
    marginTop : "5px",

  },
  price: {
    marginTop : "5px",

  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",

  },
  showMoreContainer: {
    marginTop: "40px",
    textAlign: "center",
  },
  showMoreButton: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "12px 30px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  noCourses: {
    fontSize: "18px",
    color: "black",
  },
};

export default CoursesSection;
