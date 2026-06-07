import { useAuthStore } from "@/store/auth-store";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { session, isLoadingAuth } = useAuthStore();

  if (isLoadingAuth) {
    return <p>Carregando...</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
