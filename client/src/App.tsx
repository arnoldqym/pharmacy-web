import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components & Pages
//login
import AuthComponent from "./components/AuthComponent";
//home page
import LandingPage from "./pages/LandingPage";

//dashboard
import DashboardPage from "./pages/DashboardPage";
import StatsComponent from "./components/dashboard/StatsComponent";
import InventoryComponent from "./components/dashboard/InventoryComponent";

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
          {/* Nested routes for dashboard sections can be added here in the future */}
          {/* Default route: matches /dashboard */}
          <Route index element={<Navigate to="stats" replace />} />

          {/* Nested routes: match /dashboard/... */}
          <Route path="stats" element={<StatsComponent />} />
          <Route path="inventory" element={<InventoryComponent />} />
          {/* Uncomment when ready: */}
          {/* <Route path="prescription" element={<PrescriptionComponent />} /> */}
          {/* <Route path="orders" element={<OrdersComponent />} /> */}
        </Route>

        {/* 4. Catch-all (404) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
