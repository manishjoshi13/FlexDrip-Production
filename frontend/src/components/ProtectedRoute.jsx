import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";


const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-black">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    if (role === 'seller') return <Navigate to="/" replace />;
    if (role === 'buyer') return <Navigate to="/seller" replace />;
  }

  return children;
};
export default ProtectedRoute;