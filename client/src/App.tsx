import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components & Pages
import AuthComponent from "./components/AuthComponent";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import Overview from "./pages/Overview";
import Inventory from "./pages/Inventory";
import "./App.css";

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Auth Page */}
        {/* If user is already logged in, redirect them immediately to dashboard */}
        <Route
          path="/auth"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <AuthComponent />
          }
        />

        {/* 3. Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>

        {/* 4. Catch-all (404) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
