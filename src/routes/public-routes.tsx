import { LoaderCircle } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/store/auth-store";

import LogoDark from "@/assets/logo-dark-finantche.png";

export const PublicRoute = () => {
  const { session, isLoadingAuth } = useAuthStore();

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
    <div className="flex w-full h-full bg-[url('./assets/background-image.png')] bg-cover items-center justify-evenly">
      <Outlet />
      <div className="flex flex-col gap-2 items-center">
        <img src={LogoDark} alt="Logo" width={350} />
        <span className="text-gray-400 text-sm flex text-center">
          Controle seus gastos mensais e <br /> tenha uma visão clara de suas
          finanças.
        </span>
      </div>
    </div>
  );
};
