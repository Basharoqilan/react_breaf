import HeroSection from "../Components/HeroSection";
import CoursesSection from "../Components/CoursesSection";
import AboutSection from "../Components/AboutSection";
import LearnerOutcomes from "../Components/LearnerOutcomes";
import Footer from "../components/Footer";
import Header from "../components/Header";
// import HeaderLogged from "../Components/HeaderLogged";
// import Logout from "../Components/auth/Logout"
function Home() {
  return (
    <div>
      <Header />
      <HeroSection />
      <CoursesSection />
      <AboutSection />
      <LearnerOutcomes />
      <Footer />
    </div>
  );
}

export default Home;

