import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import OrderForm from "./microcomponent/OrderForm";
import type { Order, CreateOrderPayload } from "../../types/index.dt";

const OrdersComponent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  // Track which order rows are expanded (by order id)
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  const Api_url =
    (import.meta.env.VITE_BASE_API_URL as string) ||
    "http://localhost:8000/api";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (): Promise<void> => {
    try {
      const response = await axios.get<Order[]>(`${Api_url}/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message || "Failed to fetch orders.");
      setLoading(false);
    }
  };

  const handleCreateOrder = async (): Promise<void> => {
    try {
      const payload: CreateOrderPayload = {
        items: [{ drug_id: 2, batch_no: "B2201A", quantity: 5 }],
        notes: "Dispensing test order for Jane Doe",
      };

      const response = await axios.post<{ message: string; order: Order }>(
        `${Api_url}/orders`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        },
      );

      alert(response.data.message);
      fetchOrders();
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error(
        axiosError.response?.data?.message || "Error creating order",
      );
    }
  };

  const handleOrderCreated = () => {
    fetchOrders();
  };

  const handleNewOrder = () => {
    setIsOrderFormOpen(true);
  };

  // Toggle expanded state for an order
  const toggleExpand = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pharmacy Orders</h2>
        <button
          onClick={handleNewOrder}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          New order
        </button>

        <OrderForm
          isOpen={isOrderFormOpen}
          onClose={() => setIsOrderFormOpen(false)}
          onOrderCreated={handleOrderCreated}
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-8">
                {/* Expand/collapse icon column */}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Order #
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Patient
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Items
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                {/* Main order row */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="focus:outline-none"
                    >
                      {expandedOrders.has(order.id) ? (
                        <span className="text-gray-600">▼</span>
                      ) : (
                        <span className="text-gray-600">▶</span>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">
                    {order.order_number}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-800">
                    ${parseFloat(order.total_amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {order.patient?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.items?.length || 0} item(s)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {order.notes || "-"}
                  </td>
                </tr>

                {/* Expanded row with items */}
                {expandedOrders.has(order.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={8} className="px-4 py-3">
                      <div className="text-sm text-gray-700">
                        <h4 className="font-semibold mb-2">Order Items</h4>
                        {order.items && order.items.length > 0 ? (
                          <table className="min-w-full table-auto text-xs">
                            <thead>
                              <tr className="border-b border-gray-300">
                                <th className="text-left py-1">Drug</th>
                                <th className="text-left py-1">Batch</th>
                                <th className="text-left py-1">Qty</th>
                                <th className="text-left py-1">Unit Price</th>
                                <th className="text-left py-1">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item) => (
                                <tr
                                  key={item.id}
                                  className="border-b border-gray-200"
                                >
                                  <td className="py-1">
                                    {item.drug?.brand_name || "Unknown"} (
                                    {item.drug?.strength})
                                  </td>
                                  <td className="py-1">
                                    {item.batch_no || "N/A"}
                                  </td>
                                  <td className="py-1">{item.quantity}</td>
                                  <td className="py-1">
                                    ${parseFloat(item.unit_price).toFixed(2)}
                                  </td>
                                  <td className="py-1">
                                    ${parseFloat(item.subtotal).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500">
                            No items for this order.
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersComponent;
