import React, { useState, useEffect } from "react";

function InventoryComponent() {
  const ApiUrl = import.meta.env.VITE_BASE_API_URL;
  const InventoryEndpoint = `${ApiUrl}/inventory`;

  // State management for our data, loading status, and potential errors
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define the async fetch function
    const fetchInventory = async () => {
      console.log("Fetching inventory data from:", InventoryEndpoint);
      try {
        const response = await fetch(InventoryEndpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // Our controller nests the array inside a 'data' property
        setInventory(result.data || []);
      } catch (err: any) {
        console.error("Failed to fetch inventory:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Execute the fetch
    fetchInventory();
  }, [InventoryEndpoint]); // Dependency array ensures this runs when the endpoint is ready

  // 1. Render Loading State
  if (isLoading) {
    return <div className="text-gray-500 p-4">Loading inventory data...</div>;
  }

  // 2. Render Error State
  if (error) {
    return (
      <div className="text-red-500 p-4">Error loading inventory: {error}</div>
    );
  }

  // 3. Render Data
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Current Inventory
      </h2>

      {/* Grid container keeping your original layout structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {inventory.map((drug) => {
          // Determine if stock is low to conditionally style the text
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

              {/* Footer of the card showing total stock */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Active Stock:
                </span>
                <span
                  className={`text-lg font-bold ${isLowStock ? "text-red-600" : "text-green-600"}`}
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

      {/* Empty State Fallback */}
      {inventory.length === 0 && (
        <p className="text-gray-500 italic">No inventory records found.</p>
      )}
    </div>
  );
}

export default InventoryComponent;
