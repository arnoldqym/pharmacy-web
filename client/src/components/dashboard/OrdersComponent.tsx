import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import type { Order, CreateOrderPayload } from "../../types/index.dt";

const OrdersComponent: React.FC = () => {
  // Use the interface to type the state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const Api_url =
    (import.meta.env.VITE_BASE_API_URL as string) ||
    "http://localhost:8000/api";

  useEffect(() => {
    fetchOrders();
  }, []);

  // route for fetching orders
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

  // Route for posting a new order (for testing purposes)
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

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pharmacy Orders</h2>
        <button
          onClick={() => handleCreateOrder()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          New Test Order
        </button>
      </div>

      <div>search bar.</div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
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
                  ${order.total_amount}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersComponent;
