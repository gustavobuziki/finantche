import { useAuthStore } from "@/store/auth-store";
import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const { session, isLoadingAuth } = useAuthStore();

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <LoaderCircle className="animate-spin" size={48} color="#4B5563" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
