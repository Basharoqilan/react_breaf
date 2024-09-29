import { AuthContext } from "../../utils/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useContext } from "react";

const RequireAdminAuth = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  return currentUser ? <Navigate to="/" /> : children;
};
export default RequireAdminAuth;
