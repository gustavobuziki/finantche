import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ConfirmAccount } from "@/screens/confirm-account";
import { Dashboard } from "@/screens/dashboard";
import { Login } from "@/screens/login";
import { Register } from "@/screens/register";

import { PrivateRoute } from "./private-routes";
import { PublicRoute } from "./public-routes";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm-account" element={<ConfirmAccount />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
