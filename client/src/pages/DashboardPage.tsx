import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
function DashboardPage() {
  const dispatch = useDispatch<any>();

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <div>
      DashboardPage <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DashboardPage;
