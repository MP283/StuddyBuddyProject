import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Dashboard from "./pages/Dashboard";
import QuestionPapers from "./pages/QuestionPapers";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import Bookmarks from "./pages/Bookmarks";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";

import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

function AppRoutes() {
  const { pathname } = useLocation();

  // ✅ Hide ONLY Navbar on Auth pages
  const hideNavbar =
    pathname === "/auth" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/admin/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* AUTH */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        {/* STUDENT PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/question-papers"
          element={
            <ProtectedRoute>
              <QuestionPapers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ✅ Footer ALWAYS visible */}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}