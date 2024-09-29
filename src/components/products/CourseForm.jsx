import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react"; // Import icons

const CourseForm = ({ isOpen, onClose, onSubmit, course }) => {
  const [formData, setFormData] = useState({
    course_name: "",
    course_description: "",
    total_cost: 0,
    course_teacher: "",
    course_image: "",
    course_duration: "",
  });

  useEffect(() => {
    if (course) {
      setFormData(course); // Populate form for editing
    } else {
      setFormData({
        course_name: "",
        course_description: "",
        total_cost: 0,
        course_teacher: "",
        course_image: "",
        course_duration: "",
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass form data to parent
    onClose(); // Close the form
  };

  if (!isOpen) return null; // Don't render if the form is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {course ? "Edit Course" : "Add Course"}
          </h2>
          <X onClick={onClose} className="cursor-pointer hover:text-red-500" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1">Course Name</label>
            <input
              type="text"
              name="course_name"
              value={formData.course_name}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 rounded w-full p-2 text-white"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Course Description</label>
            <textarea
              name="course_description"
              value={formData.course_description}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 rounded w-full p-2 text-white"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Total Cost</label>
            <input
              type="number"
              name="total_cost"
              value={formData.total_cost}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 rounded w-full p-2 text-white"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Course Teacher</label>
            <input
              type="text"
              name="course_teacher"
              value={formData.course_teacher}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 rounded w-full p-2 text-white"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Course Image URL</label>
            <input
              type="text"
              name="course_image"
              value={formData.course_image}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 rounded w-full p-2 text-white"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Course Duration</label>
            <input
              type="text"
              name="course_duration"
              value={formData.course_duration}
              onChange={handleChange}
              required
              className="bg-gray-800 border border-gray-700 rounded w-full p-2 text-white"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Check
              onClick={handleSubmit}
              className="cursor-pointer text-green-500"
            />
            <X onClick={onClose} className="cursor-pointer text-red-500" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
