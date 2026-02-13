import React from "react";

// Reusable micro-component for individual stat cards
const StatCard = ({ title, value, isAlert = false }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
      {title}
    </h3>
    <p
      className={`text-3xl font-bold mt-2 ${isAlert ? "text-black" : "text-green-700"}`}
    >
      {value}
    </p>
  </div>
);

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
