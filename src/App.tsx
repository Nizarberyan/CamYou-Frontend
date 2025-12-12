import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { loadUser } from "./features/auth/authSlice";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import DriverDashboard from "./pages/driver/DriverDashboard";
import "./index.css";

import { RootLayout } from "./layouts/RootLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import TripDetailsPage from "./pages/driver/TripDetailsPage";

// ... existing imports

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/trips/:id" element={<TripDetailsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
