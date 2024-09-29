import Course from "../Components/Course";
import CourseDetails from "../Components/CourseDetails";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import RequireUserAuth from "../Components/auth/RequireUserAuth";
import SubscriptionModal from "../Components/SubscriptionModal";
// import Logout from "../Components/auth/Logout";
function Courses() {
    return (
      <div>
        <Header />
        <Course />
        <CourseDetails />
        <SubscriptionModal />
        <Footer />
      </div>
    );
  }
  
  export default Courses;


  
