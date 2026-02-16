import React from "react";

function InventoryComponent() {
  const ApiUrl = import.meta.env.VITE_API_URL;
  const InventoryEndpoint = `${ApiUrl}/inventory`;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <p className="text-black">InventoryComponent</p>
    </div>
  );
}

export default InventoryComponent;
