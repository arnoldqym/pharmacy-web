import React, { useState, useEffect, useCallback } from "react";

// Types (you can keep them in a separate file)
interface Drug {
  id: number;
  brand_name: string | null;
  generic_name: string;
  ndc: string;
  location: string | null;
  min_stock_level: number;
  total_stock: number;
  uom: string;
  // ... other fields if needed
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

  // --- Loading skeletons ---
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(perPage)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-4 pt-3 border-t flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>Error loading inventory: {error}</p>
        <button
          onClick={fetchInventory}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // --- Main render ---
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Current Inventory
      </h2>

      {/* Search & Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by brand, generic, or NDC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Low stock toggle */}
        <label className="flex items-center gap-2 whitespace-nowrap">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => {
              setLowStockOnly(e.target.checked);
              setCurrentPage(1);
            }}
            className="rounded"
          />
          <span>Low stock only</span>
        </label>

        {/* Per page selector */}
        <select
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded-lg py-2 px-3"
        >
          <option value="15">15 per page</option>
          <option value="30">30 per page</option>
          <option value="50">50 per page</option>
        </select>

        {/* Export CSV button */}
        <button
          onClick={exportToCSV}
          disabled={inventory.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>
      </div>

      {/* Inventory Grid */}
      {inventory.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No matching inventory items found.</p>
          {(searchTerm || lowStockOnly) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setLowStockOnly(false);
              }}
              className="mt-4 text-blue-600 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {inventory.map((drug) => {
              const isLowStock = drug.total_stock <= drug.min_stock_level;
              return (
                <div
                  key={drug.id}
                  className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col"
                >
                  <div className="flex-grow">
                    <h3
                      className="font-bold text-lg text-gray-800 truncate"
                      title={drug.brand_name || drug.generic_name}
                    >
                      {drug.brand_name || drug.generic_name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {drug.generic_name}
                    </p>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-semibold">NDC:</span> {drug.ndc}
                      </p>
                      <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {drug.location || "Unassigned"}
                      </p>
                      <p>
                        <span className="font-semibold">Min Level:</span>{" "}
                        {drug.min_stock_level}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      Active Stock:
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        isLowStock ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {drug.total_stock ?? 0}{" "}
                      <span className="text-xs font-normal text-gray-500">
                        {drug.uom}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-gray-600">
              Showing {inventory.length} of {totalItems} items
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InventoryComponent;
