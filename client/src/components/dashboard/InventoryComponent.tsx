import React, { useState, useEffect, useCallback } from "react";

// Types
interface Drug {
  id: number;
  brand_name: string | null;
  generic_name: string;
  ndc: string;
  location: string | null;
  min_stock_level: number;
  total_stock: number;
  uom: string;
}

interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface InventoryResponse {
  success: boolean;
  data: Drug[];
  pagination: PaginationMeta;
}

function InventoryComponent() {
  const ApiUrl = import.meta.env.VITE_BASE_API_URL;
  const InventoryEndpoint = `${ApiUrl}/inventory`;

  // Data states
  const [inventory, setInventory] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  // Debounced search term to avoid too many API calls
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // reset to first page when search changes
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch inventory data
  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(lowStockOnly && { low_stock: "1" }),
      });

      const response = await fetch(`${InventoryEndpoint}?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: InventoryResponse = await response.json();
      setInventory(result.data);
      setCurrentPage(result.pagination.current_page);
      setTotalPages(result.pagination.last_page);
      setTotalItems(result.pagination.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [InventoryEndpoint, currentPage, perPage, debouncedSearch, lowStockOnly]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Export current page as CSV
  const exportToCSV = () => {
    const headers = [
      "Brand Name",
      "Generic Name",
      "NDC",
      "Location",
      "Min Stock",
      "Total Stock",
      "UOM",
    ];
    const rows = inventory.map((drug) => [
      drug.brand_name || "",
      drug.generic_name || "",
      drug.ndc,
      drug.location || "",
      drug.min_stock_level,
      drug.total_stock ?? 0,
      drug.uom,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_export_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
  };

  // --- Loading Skeletons (Hybrid) ---
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <div className="h-20 bg-white rounded-xl shadow-sm animate-pulse"></div>

          {/* Mobile Skeleton (Cards) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={`mob-skel-${i}`}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse h-48 flex flex-col justify-between"
              >
                <div className="flex justify-between">
                  <div className="w-2/3">
                    <div className="h-5 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                  </div>
                  <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
                </div>
                <div className="h-12 bg-slate-50 rounded-lg w-full mt-4"></div>
              </div>
            ))}
          </div>

          {/* Desktop Skeleton (Table) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[...Array(5)].map((_, i) => (
                      <th key={`head-skel-${i}`} className="px-6 py-4">
                        <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...Array(perPage)].map((_, i) => (
                    <tr key={`row-skel-${i}`}>
                      <td className="px-6 py-4">
                        <div className="h-5 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-slate-100 rounded w-32 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-slate-100 rounded-full w-20 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-6 bg-slate-200 rounded w-12 ml-auto mb-2 animate-pulse"></div>
                        <div className="h-3 bg-slate-100 rounded w-16 ml-auto animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-red-100">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load inventory
          </h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchInventory}
            className="w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --- Main render ---
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Inventory
            </h2>
            <p className="text-sm md:text-base text-slate-500 mt-1">
              Manage stock levels, locations, and expiration.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-400">Total Items</p>
            <p className="text-2xl font-bold text-slate-700">{totalItems}</p>
          </div>
        </div>

        {/* Control Bar (Search & Filter) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-4 sticky top-4 z-10 backdrop-blur-xl bg-white/90">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search brand, generic, or NDC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border-slate-200 border rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="flex w-full lg:w-auto items-center gap-2 md:gap-3 flex-wrap sm:flex-nowrap">
            {/* Low stock toggle */}
            <label
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 rounded-lg border cursor-pointer transition-all select-none ${
                lowStockOnly
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(e) => {
                  setLowStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="hidden"
              />
              <svg
                className={`h-4 w-4 ${lowStockOnly ? "text-red-500" : "text-slate-400"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm font-medium whitespace-nowrap">
                Low Stock
              </span>
            </label>

            {/* Per page selector */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <option value="15">15 / page</option>
                <option value="30">30 / page</option>
                <option value="50">50 / page</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Export CSV button */}
            <button
              onClick={exportToCSV}
              disabled={inventory.length === 0}
              className="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        {inventory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <svg
                className="h-8 w-8 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              No results found
            </h3>
            <p className="text-slate-500 mt-1 max-w-sm text-center">
              We couldn't find any inventory matching your search.
            </p>
            {(searchTerm || lowStockOnly) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setLowStockOnly(false);
                }}
                className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="w-full">
            {/* --- MOBILE VIEW: CARDS (Hidden on md screens and up) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {inventory.map((drug) => {
                const isLowStock = drug.total_stock <= drug.min_stock_level;
                return (
                  <div
                    key={`mobile-${drug.id}`}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative overflow-hidden flex flex-col gap-3"
                  >
                    {/* Decorative left border for status */}
                    <div
                      className={`absolute top-0 left-0 h-full w-1 ${isLowStock ? "bg-red-500" : "bg-emerald-500"}`}
                    ></div>

                    {/* Header: Name & Status */}
                    <div className="flex justify-between items-start pl-2 gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-base truncate leading-tight">
                          {drug.brand_name || drug.generic_name}
                        </h3>
                        {drug.brand_name && (
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {drug.generic_name}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-100 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{" "}
                            Low
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                            OK
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta info: NDC & Location */}
                    <div className="pl-2 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className="flex flex-col">
                        <span className="font-medium text-[10px] uppercase tracking-wider text-slate-400">
                          NDC
                        </span>
                        <span className="font-mono font-medium text-slate-700">
                          {drug.ndc}
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-medium text-[10px] uppercase tracking-wider text-slate-400">
                          Location
                        </span>
                        <span className="font-medium text-slate-700">
                          {drug.location || "—"}
                        </span>
                      </div>
                    </div>

                    {/* Footer: Stock Levels */}
                    <div className="pl-2 flex items-end justify-between mt-1">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 mb-0.5">
                          Current Stock
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-2xl font-extrabold tracking-tight leading-none ${isLowStock ? "text-red-600" : "text-slate-800"}`}
                          >
                            {drug.total_stock ?? 0}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            {drug.uom}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">
                          Min Threshold
                        </span>
                        <p className="font-semibold text-slate-700 text-sm">
                          {drug.min_stock_level}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- DESKTOP VIEW: TABLE (Hidden on mobile screens) --- */}
            <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Drug Information
                      </th>
                      <th scope="col" className="px-6 py-4">
                        NDC
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 text-right">
                        Stock Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventory.map((drug) => {
                      const isLowStock =
                        drug.total_stock <= drug.min_stock_level;
                      return (
                        <tr
                          key={`desk-${drug.id}`}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-base">
                                {drug.brand_name || drug.generic_name}
                              </span>
                              {drug.brand_name && (
                                <span className="text-xs text-slate-500 mt-0.5">
                                  {drug.generic_name}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded text-xs font-medium border border-slate-200">
                              {drug.ndc}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-600 font-medium">
                              {drug.location || "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {isLowStock ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Adequate
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-col items-end">
                              <div className="flex items-baseline gap-1">
                                <span
                                  className={`text-lg font-extrabold tracking-tight ${isLowStock ? "text-red-600" : "text-slate-800"}`}
                                >
                                  {drug.total_stock ?? 0}
                                </span>
                                <span className="text-xs font-semibold text-slate-400 uppercase">
                                  {drug.uom}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400 mt-0.5">
                                Min: {drug.min_stock_level}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer / Pagination (Only shown if there's inventory) */}
        {inventory.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-900">
                {inventory.length}
              </span>{" "}
              results
            </p>

            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                aria-label="Previous Page"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="px-4 text-sm font-medium text-slate-700 border-x border-slate-100">
                <span className="text-indigo-600">{currentPage}</span>
                <span className="text-slate-400 mx-1">/</span>
                <span>{totalPages}</span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                aria-label="Next Page"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryComponent;
