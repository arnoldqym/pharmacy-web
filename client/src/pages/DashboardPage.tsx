import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { AppDispatch } from "../redux/store";
//components
import DashboardLayout from "../layouts/DashboardLayout";
import { Outlet } from "react-router-dom";

function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  //const dispatch = useDispatch<any>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <DashboardLayout onLogout={handleLogout} title="Dashboard">
      <Outlet />
    </DashboardLayout>
  );
}

export default DashboardPage;
