import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, addDoc } from "firebase/firestore"; // Firestore methods
import './profile_user_pop.css';

import Header from "../components/Header";
import Footer from "../components/Footer";

import Logout from "../Components/auth/Logout";

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [coursesData, setCoursesData] = useState([]);
    const [allCourses, setAllCourses] = useState([]); // State to hold all available courses
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newSubscription, setNewSubscription] = useState({
        courseID: '',
    });

    // Dynamically load User_Profile.css
    useEffect(() => {
        const userProfileLink = document.createElement("link");
        userProfileLink.rel = "stylesheet";
        userProfileLink.href = "../../public/User_Profile.css"; // Adjust the path to match your project structure

        document.head.appendChild(userProfileLink);

        // Cleanup to remove the CSS when the component is unmounted
        return () => {
            document.head.removeChild(userProfileLink);
        };
    }, []);

    // Fetch user data from Firestore
    useEffect(() => {
        const fetchUser = async () => {
            const storedData = localStorage.getItem('auth');
            const parsedData = JSON.parse(storedData);
            const userId = parsedData.uid;  // Properly extract the userID
    
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUser({
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                });
            } else {
                console.log("User does not exist.");
            }
        };
        fetchUser();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 5; // عدد الدورات التي سيتم عرضها لكل صفحة

    const startIndex = (currentPage - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const currentCourses = coursesData.slice(startIndex, endIndex);

    // Fetch user's subscribed courses
    useEffect(() => {
        const fetchCourses = async () => {
            const storedData = localStorage.getItem('auth');
            const parsedData = JSON.parse(storedData);
            const userID = parsedData.uid;  // Ensure you have userID

            const subscriptionsCol = collection(db, 'subscriptions');
            const q = query(
                subscriptionsCol, 
                where("userID", "==", userID), 
                where("status", "==", "accepted") // "accepted" should work as a single condition
            );

            try {
                const subscriptionSnapshot = await getDocs(q);
                const subscriptionList = subscriptionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (subscriptionList.length > 0) {
                    const courseIDs = subscriptionList.map(subscription => subscription.courseID);
                    const coursesCol = collection(db, 'courses');
                    const coursesPromises = courseIDs.map(courseID => getDoc(doc(coursesCol, courseID)));
                    const coursesSnapshots = await Promise.all(coursesPromises);
                    const coursesList = coursesSnapshots.map((snapshot, index) => ({
                        id: snapshot.id,
                        ...snapshot.data(),
                        endDate: subscriptionList[index].endDate
                    }));
                    setCoursesData(coursesList);
                } else {
                    console.log(`No accepted subscriptions found for userID = ${userID}.`);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    // Fetch all available courses for the select dropdown
    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const coursesSnapshot = await getDocs(collection(db, 'courses'));
                const coursesList = coursesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAllCourses(coursesList); // Save all courses to state
            } catch (error) {
                console.error("Error fetching all courses:", error);
            }
        };
        fetchAllCourses();
    }, []);

    // Handle input changes for the new subscription form
    const handleSubscriptionInputChange = (e) => {
        const { name, value } = e.target;
        setNewSubscription((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission for new subscription
    const handleCreateSubscription = async (e) => {
        e.preventDefault();
        const storedData = localStorage.getItem('auth');
        const parsedData = JSON.parse(storedData);
        const userID = parsedData.uid;  // Ensure userID is available
    
        try {
            await addDoc(collection(db, 'subscriptions'), {
                userID,
                courseID: newSubscription.courseID,
                status: 'pending',
            });
            console.log("New subscription created successfully");
            setIsPopupOpen(false); // Close the popup after successful creation
        } catch (error) {
            console.error("Error creating subscription:", error);
        }
    };

    // Handle form input changes for the user profile
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    // Handle form submission for profile update
    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedData = localStorage.getItem('auth');
        const parsedData = JSON.parse(storedData);
        const userId = parsedData.uid;  // Properly extract userID
    
        try {
            await updateDoc(doc(db, "users", userId), {
                name: user.name,
                email: user.email,
                phone: user.phone,
            });
            console.log("User updated successfully");
            alert("Your profile has been updated successfully!"); // Display success alert
        } catch (error) {
            console.error("Error updating user:", error);
            alert("There was an error updating your profile. Please try again."); // Display error alert
        }
    };

    return (
        <>
        <Header />
            <div className='content' style={{justifyContent: 'center' }}>
                <div className="profile-container">
                    <div className="profile-header">
                        <h1 style={{ color: '#000', textTransform: 'capitalize' }}>{user.name}</h1>
                    </div>
                    <div className="profile-content">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={user.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone:</label>
                                <input
                                    type="number"
                                    id="phone"
                                    name="phone"
                                    value={user.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group my_perent_a_b">
                                <button type="submit">Update Profile</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="profile-container profile-container2">
                    <h2>Courses</h2>
                    <button onClick={() => setIsPopupOpen(true)} style={{ borderRadius: '5px' ,width: '140px', height: "30px", fontSize: '16px' }}>Add Subscription</button>
                    <table className="status-table" style={{ color: "#000" }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Course Name</th>
                                <th>Cost</th>
                                <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCourses.map((course, index) => {
                                const currentDate = new Date();
                                let endDate = course.endDate; // Retrieve the endDate
                                let daysRemaining = null;

                                // Check if endDate is a Firestore Timestamp object
                                if (endDate && typeof endDate.toDate === 'function') {
                                    endDate = endDate.toDate(); // Convert Firestore Timestamp to JS Date
                                } else if (typeof endDate === 'string' || endDate instanceof Date) {
                                    // If endDate is already a Date or string, convert it to Date if necessary
                                    endDate = new Date(endDate);
                                } else {
                                    endDate = null; // If not valid, set to null
                                }

                                if (endDate) {
                                    const timeDiff = endDate.getTime() - currentDate.getTime();
                                    daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
                                }

                                let textColor = "#000";
                                if (daysRemaining !== null) {
                                    if (daysRemaining < 3) {
                                        textColor = "red";
                                    } else if (daysRemaining < 10) {
                                        textColor = "orange";
                                    }
                                }

                                return (
                                    <tr key={course.id}>
                                        <td>{index + 1}</td>
                                        <td>{course.course_name}</td>
                                        <td>{course.total_cost}</td>
                                        <td style={{ color: textColor }}>
                                            {daysRemaining !== null ? `${daysRemaining} days` : 'No end date'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="pagination" style={{ display: 5 >= coursesData.length ? 'none' : 'inline' }} > {/*  style={{display:: 5 > coursesData.length ? 'none' : 'inline' }} */}  
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => (endIndex < coursesData.length ? prev + 1 : prev))}
                            disabled={endIndex >= coursesData.length}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {isPopupOpen && (
                    <div className="popup">
                        <form onSubmit={handleCreateSubscription}>
                            <h3>Create New Subscription</h3>
                            <div className="form-group">
                                <label htmlFor="courseID">Course ID:</label>
                                <select
                                    style={{backgroundColor: 'rgb(216, 216, 216)'}}
                                    id="courseID"
                                    name="courseID"
                                    value={newSubscription.courseID}
                                    onChange={handleSubscriptionInputChange}
                                    required
                                >
                                    <option value="">Select a course</option>
                                    {allCourses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.course_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={() => setIsPopupOpen(false)}>Close</button>
                        </form>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Profile;
