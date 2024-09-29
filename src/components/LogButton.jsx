import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogButton = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleRegisterClick = () => {
    navigate('/login'); // Navigate to the register page
  };

  return (
    <button className="fill first" onClick={handleRegisterClick}>
      login
    </button>
  );
};

export default LogButton;
