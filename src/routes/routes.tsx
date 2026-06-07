import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Login } from "@/screens/login";
import { Dashboard } from "@/screens/dashboard";
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
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
