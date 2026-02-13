import React from "react";
import { StatCard } from "./microcomponent/StartCard";

function StatsComponent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Prescriptions" value="1,248" />
      <StatCard title="Pending Orders" value="56" />
      <StatCard title="Inventory Items" value="4,092" />
      {/* Using an alert style for low stock to draw attention */}
      <StatCard title="Low Stock Alerts" value="12" isAlert={true} />
    </div>
  );
}

export default StatsComponent;
