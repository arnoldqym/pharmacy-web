import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
function DashboardLayout() {
  const dispatch = useDispatch<any>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <div>
      DashboardLayout
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DashboardLayout;
