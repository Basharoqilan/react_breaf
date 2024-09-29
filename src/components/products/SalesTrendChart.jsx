import { motion } from "framer-motion";

const CourseCard = ({ course }) => {
  return (
    <motion.div
      className="relative bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex flex-col items-center text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Course Image */}
      <motion.img
        src={course.course_image}
        alt={course.course_name}
        className="rounded-lg mb-4 w-full h-40 object-cover relative z-0"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 150 }}
      />

      {/* Course Name */}
      <h2 className="text-xl font-semibold mb-2">{course.course_name}</h2>

      {/* Course Teacher */}
      <h3 className="text-md mb-2 text-gray-300">
        Taught by: {course.course_teacher}
      </h3>

      {/* Course Description */}
      <p className="text-sm mb-4 text-gray-400 text-center">
        {course.course_description}
      </p>

      {/* Course Details */}
      <div className="flex justify-between w-full text-sm text-gray-400">
        <div>
          <strong>Cost:</strong> ${course.total_cost}
        </div>
        <div>
          <strong>Duration:</strong> {course.course_duration}
        </div>
      </div>

      {/* Hover Effect */}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-10 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
};

export default CourseCard;
