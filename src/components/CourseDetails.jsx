import React from 'react';
import './CourseDetails.css'; // Make sure to import the stylesheet where the modal styles are present.

const CourseDetails = ({ course, onClose }) => {
  if (!course) return null; // If no course is selected, don't show the modal

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose} style={{ color :"white", marginRight : "15px" , marginTop : "5px"}}>X</button>
        <img src={course.course_image} alt={course.course_name} />
        <h2>{course.course_name}</h2>
        <p><strong>Teacher:</strong> {course.course_teacher}</p>
        <p><strong>Duration:</strong> {course.course_duration}</p>
        <p><strong>Cost:</strong> {course.total_cost}</p>
        <p><strong>Description:</strong> {course.course_description}</p>
      </div>
    </div>
  );
};

export default CourseDetails;


