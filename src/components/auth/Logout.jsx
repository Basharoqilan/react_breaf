import { useContext } from "react";
import { AuthContext } from "../../utils/context/AuthContext";
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";


const Logout = ({ children }) => {
  const { currentUser, dispatch } = useContext(AuthContext);
  console.log(currentUser); // This should log the user object if logged in


  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });

    // Ensure you are removing the correct key that was set in localStorage
    localStorage.removeItem("user"); // Make sure 'user' is used as per AuthContext
  };

  return currentUser ? (
    <>
    <Button
    variant="contained"
    color="primary"
    component={Link}
    to="/User_Profile" // Link to the profile page when logged in
    sx={{
      backgroundColor: "#F68928", // Orange button
      color: "#fff",
      width : "50%",
      "&:hover": {
        backgroundColor: "#E0761E",
      },
      ml: 2,
      fontWeight: "bold",
      borderRadius: "8px",
      padding: "5px 20px",
      height: "48px", // Ensures height matches with Log In button
    }}
  >
    {currentUser.name}
      </Button>
  <Button 
  variant="outlined"
  color="primary"
  onClick={logout} // Log out the user
  sx={{
    backgroundColor: "#F68928", // Orange button
    color: "#fff",
    width : "50%",
    "&:hover": {
      backgroundColor: "#E0761E",
    },
    ml: 2,
    fontWeight: "bold",
    borderRadius: "8px",
    padding: "5px 20px",
    height: "48px", // Ensures height matches with Log In button
  }}
>
  Log Out
</Button>
</>
  ) : (
    children
  );
};

export default Logout;
