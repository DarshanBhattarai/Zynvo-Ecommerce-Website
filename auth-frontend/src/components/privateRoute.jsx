import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  // Redirect to login if no token exists
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected route if authenticated
  return element;
};

export default PrivateRoute;
