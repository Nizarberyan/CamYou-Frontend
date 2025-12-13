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

import MaintenancePage from "./pages/admin/MaintenancePage";
import ReportsPage from "./pages/admin/ReportsPage";
import TripDetailsPage from "./pages/driver/TripDetailsPage";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { ProfilePage } from "./pages/common/ProfilePage";

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
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/driver/trips/:id" element={<TripDetailsPage />} />
          <Route path="/admin/trips/:id" element={<TripDetailsPage />} />
          {/* <Route path="/admin/trucks" element={<TrucksPage />} /> */}
          {/* <Route path="/admin/trailers" element={<TrailersPage />} /> */}
          {/* <Route path="/admin/tires" element={<TiresPage />} /> */}
          <Route path="/admin/maintenance" element={<MaintenancePage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
