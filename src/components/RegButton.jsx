import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegButton = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleRegisterClick = () => {
    navigate('/register'); // Navigate to the register page
  };

  return (
    <button className="fill first" onClick={handleRegisterClick}>
      Register
    </button>
  );
};

export default RegButton;
