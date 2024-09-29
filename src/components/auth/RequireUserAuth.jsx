import { AuthContext } from "../../utils/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useContext } from "react";

const RequireAdminAuth = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser && currentUser.role == "user" ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};
export default RequireAdminAuth;
