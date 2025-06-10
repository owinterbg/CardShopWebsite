import { Routes, Route } from "react-router-dom";
import Home from "../components/Pages/Home";
import LoginPage from "../components/Pages/LoginPage";
import RegisterPage from "../components/Pages/RegisterPage";
import ProfilePage from "../components/Pages/ProfilePage";
import CompareImages from "../components/Pages/CompareImages"; // ✅ NEW
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "../components/Utility/PrivateRoute";
import SavedCenteringsList from "../components/Pages/SavedCenteringsList"; // ✅ NEW
import EditCentering from "../components/Pages/EditCentering";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/login"
        element={
          <MainLayout>
            <LoginPage />
          </MainLayout>
        }
      />
      <Route
        path="/register"
        element={
          <MainLayout>
            <RegisterPage />
          </MainLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/compare"
        element={
          <PrivateRoute>
            <MainLayout>
              <CompareImages />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <PrivateRoute>
            <MainLayout>
              <SavedCenteringsList />
            </MainLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <PrivateRoute>
            <MainLayout>
              <EditCentering />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
