import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/auth-store";

import LogoDark from "@/assets/logo-dark-finantche.png";
import { useIsMobile } from "@/hooks/use-mobile";

export const PublicRoute = () => {
  const { session, isLoadingAuth } = useAuthStore();
  const isMobile = useIsMobile();

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <LoaderCircle className="animate-spin" size={48} color="#4B5563" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full h-full bg-[url('./assets/background-image.png')] bg-cover flex flex-col items-center justify-center gap-8 pt-28 pb-8 px-4 overflow-y-auto lg:flex-row-reverse lg:justify-evenly">
      <img src={LogoDark} alt="Logo" width={isMobile ? 250 : 350} />
      <Outlet />
    </div>
  );
};
