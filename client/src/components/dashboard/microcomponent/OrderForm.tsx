import React, { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { Api_url } from "../config"; // adjust to your API base URL

// Types based on your backend responses
interface Drug {
  id: number;
  brand_name: string;
  generic_name: string;
  strength: string;
  batches: Batch[];
}

interface Batch {
  id: number;
  batch_no: string;
  expiry_date: string;
  quantity: number;
  cost_price: string;
  drug?: Drug; // when batch is fetched directly
}

interface SearchResponse {
  meta: { search_term: string };
  results: {
    type: "drugs" | "batches" | "none";
    data: Drug[] | Batch[];
  };
}

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: () => void; // callback to refresh orders
}

const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResponse["results"]>(
    { type: "none", data: [] },
  );
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Selection state
  const [selectedDrugId, setSelectedDrugId] = useState<number | null>(null);
  const [selectedBatchNo, setSelectedBatchNo] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState("");

  const searchTimeout = useRef<NodeJS.Timeout>();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSearchResults({ type: "none", data: [] });
      setSelectedDrugId(null);
      setSelectedBatchNo(null);
      setQuantity(1);
      setNotes("");
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults({ type: "none", data: [] });
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get<SearchResponse>(
        `${Api_url}/drugs/fetch-specific`,
        {
          params: { query: searchTerm },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ type: "none", data: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBatch = (drugId: number, batchNo: string) => {
    setSelectedDrugId(drugId);
    setSelectedBatchNo(batchNo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrugId || !selectedBatchNo) {
      alert("Please select a batch first.");
      return;
    }
    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        items: [
          { drug_id: selectedDrugId, batch_no: selectedBatchNo, quantity },
        ],
        notes: notes || undefined,
      };

      await axios.post(`${Api_url}/orders`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });

      onOrderCreated(); // refresh list
      onClose(); // close modal
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      alert(axiosError.response?.data?.message || "Error creating order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Helper to render search results
  const renderResults = () => {
    if (loading) return <div className="text-center py-4">Searching...</div>;

    if (searchResults.type === "none") {
      return (
        <div className="text-gray-500 py-4">
          Type at least 2 characters to search.
        </div>
      );
    }

    if (searchResults.type === "drugs") {
      const drugs = searchResults.data as Drug[];
      return (
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {drugs.map((drug) => (
            <div key={drug.id} className="border rounded p-3">
              <div className="font-semibold">
                {drug.brand_name} ({drug.generic_name}) – {drug.strength}
              </div>
              <div className="ml-2 mt-2 space-y-1">
                {drug.batches.map((batch) => (
                  <label
                    key={batch.id}
                    className={`flex items-center p-2 rounded cursor-pointer ${
                      selectedDrugId === drug.id &&
                      selectedBatchNo === batch.batch_no
                        ? "bg-blue-100 border-blue-400"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="batch"
                      value={`${drug.id}:${batch.batch_no}`}
                      checked={
                        selectedDrugId === drug.id &&
                        selectedBatchNo === batch.batch_no
                      }
                      onChange={() =>
                        handleSelectBatch(drug.id, batch.batch_no)
                      }
                      className="mr-2"
                    />
                    <span>
                      Batch: {batch.batch_no} | Exp:{" "}
                      {new Date(batch.expiry_date).toLocaleDateString()} |
                      Stock: {batch.quantity}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (searchResults.type === "batches") {
      const batches = searchResults.data as Batch[];
      return (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {batches.map((batch) => (
            <label
              key={batch.id}
              className={`flex items-center p-3 border rounded cursor-pointer ${
                selectedDrugId === batch.drug?.id &&
                selectedBatchNo === batch.batch_no
                  ? "bg-blue-100 border-blue-400"
                  : "hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                name="batch"
                value={`${batch.drug?.id}:${batch.batch_no}`}
                checked={
                  selectedDrugId === batch.drug?.id &&
                  selectedBatchNo === batch.batch_no
                }
                onChange={() =>
                  handleSelectBatch(batch.drug!.id, batch.batch_no)
                }
                className="mr-2"
              />
              <div>
                <div className="font-medium">
                  {batch.drug?.brand_name} ({batch.drug?.generic_name})
                </div>
                <div className="text-sm text-gray-600">
                  Batch: {batch.batch_no} | Exp:{" "}
                  {new Date(batch.expiry_date).toLocaleDateString()} | Stock:{" "}
                  {batch.quantity}
                </div>
              </div>
            </label>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold">Create New Order</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Search input */}
          <div className="mb-4">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Drug or Batch
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type drug name or batch number..."
              className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          {/* Search results */}
          <div className="mb-4">{renderResults()}</div>

          {/* Order details (visible only when a batch is selected) */}
          {selectedDrugId && selectedBatchNo && (
            <div className="border-t pt-4 space-y-4">
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedDrugId || !selectedBatchNo || submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
