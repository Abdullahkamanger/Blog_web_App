import { Navigate } from "react-router-dom";
import { useBlogs } from "../../context/BlogContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useBlogs();

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but wrong role → redirect to home
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
