import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore"; // Firestore imports
import { db } from "../../firebase"; // Firebase config
import Header from "../../components/common/Header";
import SalesTrendChart from "../../components/products/SalesTrendChart";
import CourseForm from "../../components/products/CourseForm"; // Import CourseForm
import { Plus, Edit, Trash2 } from "lucide-react"; // Importing Plus, Edit, and Trash icons

const ProductsPage = () => {
  const [courses, setCourses] = useState([]); // State to hold courses data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [isFormOpen, setFormOpen] = useState(false); // State for form visibility
  const [editCourse, setEditCourse] = useState(null); // State for the course being edited

  // Function to fetch courses from Firestore
  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses")); // Fetch the 'courses' collection
      const coursesData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Get document ID
        ...doc.data(), // Spread the document data
      }));
      setCourses(coursesData); // Update state with fetched data
      setLoading(false); // Turn off loading once data is fetched
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    setEditCourse(null); // Reset edit state when adding a course
    setFormOpen(true); // Open the form to add a new course
  };

  const handleEditCourse = (course) => {
    setEditCourse(course); // Set the course to edit
    setFormOpen(true); // Open the form to edit
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteDoc(doc(db, "courses", id)); // Delete the course from Firestore
        fetchCourses(); // Refresh the course list
      } catch (error) {
        console.error("Error deleting course: ", error);
      }
    }
  };

  const handleSubmit = async (courseData) => {
    if (editCourse) {
      // Update existing course
      const courseRef = doc(db, "courses", editCourse.id);
      await updateDoc(courseRef, courseData);
    } else {
      // Add new course
      await addDoc(collection(db, "courses"), courseData);
    }
    setFormOpen(false); // Close the form after submission
    fetchCourses(); // Refresh the course list
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Courses" />
      <div className="flex items-center justify-between max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <div
          onClick={handleAddCourse}
          className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition duration-200"
        >
          <Plus className="text-green-500" />
        </div>
      </div>
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="relative">
              <SalesTrendChart course={course} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <div
                  onClick={() => handleEditCourse(course)}
                  className="cursor-pointer text-blue-500 hover:text-blue-400"
                >
                  <Edit />
                </div>
                <div
                  onClick={() => handleDeleteCourse(course.id)}
                  className="cursor-pointer text-red-500 hover:text-red-400"
                >
                  <Trash2 />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <CourseForm
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit} // Pass the submit handler for adding/updating courses
        course={editCourse} // Pass the course to edit
      />
    </div>
  );
};

export default ProductsPage;
