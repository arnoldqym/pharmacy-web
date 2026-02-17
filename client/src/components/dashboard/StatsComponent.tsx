import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { StatCard } from "./microcomponent/StartCard";

// --- Sub-component for the Count-up Animation ---
const AnimatedNumber = ({
  value,
  duration = 1000,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMiliseconds = duration;
    let incrementTime =
      totalMiliseconds / end > 10 ? totalMiliseconds / end : 10;

    let timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

function StatsComponent() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const ApiUrl = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    fetch(`${ApiUrl}/overview`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setStats(result.stats);
      })
      .catch((err) => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  // Mock data for charts (Ideally, your backend should provide this trend data)
  const chartData = [
    { name: "Mon", stock: 400 },
    { name: "Tue", stock: 300 },
    { name: "Wed", stock: 500 },
    { name: "Thu", stock: 280 },
    { name: "Fri", stock: 590 },
    { name: "Sat", stock: 320 },
    { name: "Sun", stock: 410 },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="space-y-8 p-2">
      {/* 1. Header with Pulse Effect for Last Update */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Inventory Insights
          </h2>
          <p className="text-sm text-slate-500">
            Real-time status of your pharmaceutical stock
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-semibold text-indigo-700 uppercase">
            Updated {stats?.last_update}
          </span>
        </div>
      </div>

      {/* 2. Top Row: Animated Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Drugs"
          value={<AnimatedNumber value={stats?.total_drugs || 0} />}
        />
        <StatCard
          title="Low Stock Alerts"
          value={<AnimatedNumber value={stats?.low_stock_alerts || 0} />}
          isAlert={stats?.low_stock_alerts > 0}
        />
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Most Stocked
          </p>
          <p className="text-lg font-bold text-slate-800 truncate">
            {stats?.most_stocked?.split("(")[0]}
          </p>
          <p className="text-indigo-600 font-mono text-sm">
            {stats?.most_stocked?.match(/\(([^)]+)\)/)?.[0] || ""}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Least Stocked
          </p>
          <p className="text-lg font-bold text-slate-800 truncate">
            {stats?.least_stocked?.split("(")[0]}
          </p>
          <p className="text-rose-600 font-mono text-sm">
            {stats?.least_stocked?.match(/\(([^)]+)\)/)?.[0] || ""}
          </p>
        </div>
      </div>

      {/* 3. Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Stock Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-tight">
            Stock Movement Trend
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#74a876"
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="stock"
                  stroke="#74a876"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#184219" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Stock Comparison */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-tight">
            Top Stock Distribution
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#74a876"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "12px", border: "none" }}
                />
                <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#184219" : "#74a876"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Expiry Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            Critical Expirations
          </h3>
          <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded">
            Next 90 Days
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Drug Name</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats?.nearing_expiry.map((item: ExpiryItem, idx: number) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                    {item.drug_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                    {item.expiry}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        item.days_left < 30
                          ? "bg-rose-100 text-rose-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {Math.floor(item.days_left)} Days Remaining
                    </span>
                  </td>
                </tr>
              ))}
              {!stats?.nearing_expiry.length && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-slate-400 italic"
                  >
                    No batches nearing expiry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StatsComponent;
