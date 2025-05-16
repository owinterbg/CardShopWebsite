import { Routes, Route } from 'react-router-dom';
import Home from '../components/Pages/Home';
import LoginPage from '../components/Pages/LoginPage';
import RegisterPage from '../components/Pages/RegisterPage';
import ProfilePage from '../components/Pages/ProfilePage';
import MainLayout from '../layouts/MainLayout';

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
          <MainLayout>
            <ProfilePage />
          </MainLayout>
        }
      />
    </Routes>
  );
}
