import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { AppDispatch } from "../redux/store";
//components
import DashboardLayout from "../layouts/DashboardLayout";
import { Outlet } from "react-router-dom";
// import StatsComponent from "../components/dashboard/StatsComponent";
// import InventoryComponent from "../components/dashboard/InventoryComponent";

function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  //const dispatch = useDispatch<any>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <DashboardLayout onLogout={handleLogout} title="Dashboard">
      {/* Everything placed inside DashboardLayout here becomes the {children} 
        prop and is rendered in the main gray area.
      */}

      {/* <StatsComponent />
      <InventoryComponent /> */}
      <Outlet />

      {/* Placeholder for future components */}
    </DashboardLayout>
  );
}

export default DashboardPage;
