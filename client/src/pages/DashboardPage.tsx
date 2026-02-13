import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { AppDispatch } from "../redux/store";
//components
import DashboardLayout from "../layouts/DashboardLayout";
import StatsComponent from "../components/dashboard/StatsComponent";

function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <DashboardLayout onLogout={handleLogout} title="Dashboard Overview">
      {/* Everything placed inside DashboardLayout here becomes the {children} 
        prop and is rendered in the main gray area.
      */}

      <StatsComponent />

      {/* Placeholder for future components */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-black mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500">
          Inventory and order updates will populate here...
        </p>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
