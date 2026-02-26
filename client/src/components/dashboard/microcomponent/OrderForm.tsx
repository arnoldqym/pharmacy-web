import React, { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";

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

// Patient types for search
interface Patient {
  id: number;
  name: string;
  phone: string;
  // add other fields if needed
}

type PatientSearchResponse = Patient[];

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
  const Api_url =
    (import.meta.env.VITE_BASE_API_URL as string) ||
    "http://localhost:8000/api";

  // Patient state
  const [patientMode, setPatientMode] = useState<"existing" | "new">("new");
  const [patientId, setPatientId] = useState<number | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>(
    [],
  );
  const [loadingPatients, setLoadingPatients] = useState(false);
  const patientSearchTimeout = useRef<number | undefined>(undefined);

  // Drug selection state
  const [selectedDrugId, setSelectedDrugId] = useState<number | null>(null);
  const [selectedBatchNo, setSelectedBatchNo] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState("");

  const searchTimeout = useRef<number | undefined>(undefined);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSearchResults({ type: "none", data: [] });
      setSelectedDrugId(null);
      setSelectedBatchNo(null);
      setQuantity(1);
      setNotes("");
      // Reset patient fields
      setPatientMode("new");
      setPatientId(null);
      setPatientName("");
      setPatientPhone("");
      setPatientSearchTerm("");
      setPatientSearchResults([]);
    }
  }, [isOpen]);

  // Debounced drug search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults({ type: "none", data: [] });
      return;
    }

    if (searchTimeout.current !== undefined) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = window.setTimeout(() => {
      performSearch();
    }, 300);

    return () => {
      if (searchTimeout.current !== undefined) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  // Debounced patient search
  useEffect(() => {
    if (patientSearchTerm.length < 2) {
      setPatientSearchResults([]);
      return;
    }

    if (patientSearchTimeout.current !== undefined) {
      clearTimeout(patientSearchTimeout.current);
    }

    patientSearchTimeout.current = window.setTimeout(() => {
      searchPatients();
    }, 300);

    return () => {
      if (patientSearchTimeout.current !== undefined) {
        clearTimeout(patientSearchTimeout.current);
      }
    };
  }, [patientSearchTerm]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get<SearchResponse>(
        `${Api_url}/specific-drug`,
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

  const searchPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await axios.get<PatientSearchResponse>(
        `${Api_url}/patients/search`,
        {
          params: { query: patientSearchTerm },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setPatientSearchResults(response.data);
    } catch (error) {
      console.error("Patient search error:", error);
      setPatientSearchResults([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleSelectBatch = (drugId: number, batchNo: string) => {
    setSelectedDrugId(drugId);
    setSelectedBatchNo(batchNo);
  };

  const handleSelectPatient = (patient: Patient) => {
    setPatientId(patient.id);
    setPatientName(patient.name); // for display only
    setPatientPhone(patient.phone); // for display only
    setPatientSearchTerm(""); // clear search
    setPatientSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate patient info
    if (patientMode === "existing" && !patientId) {
      alert("Please select an existing patient.");
      return;
    }
    if (patientMode === "new") {
      if (!patientName.trim()) {
        alert("Please enter patient name.");
        return;
      }
      if (!patientPhone.trim()) {
        alert("Please enter patient phone.");
        return;
      }
    }

    // Validate drug selection
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
      // Build payload according to controller expectations
      const payload: any = {
        items: [
          { drug_id: selectedDrugId, batch_no: selectedBatchNo, quantity },
        ],
      };
      if (notes) payload.notes = notes;

      if (patientMode === "existing") {
        payload.patient_id = patientId;
      } else {
        payload.patient_name = patientName.trim();
        payload.patient_phone = patientPhone.trim();
      }

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

  // Helper to render search results (drugs/batches) – unchanged
  const renderResults = () => {
    if (loading)
      return <div className="text-center py-4 text-gray-600">Searching...</div>;

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
        <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
          {drugs.map((drug) => (
            <div key={drug.id} className="border rounded-lg p-3 shadow-sm">
              <div className="font-semibold text-gray-800">
                {drug.brand_name} ({drug.generic_name}) – {drug.strength}
              </div>
              <div className="ml-2 mt-2 space-y-1">
                {drug.batches.map((batch) => (
                  <label
                    key={batch.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                      selectedDrugId === drug.id &&
                      selectedBatchNo === batch.batch_no
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-400"
                        : "hover:bg-gray-100 text-gray-700"
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
                      className="mr-2 accent-yellow-600"
                    />
                    <span className="flex flex-wrap items-center gap-x-2">
                      <span>Batch: {batch.batch_no}</span>
                      <span>
                        | Exp:{" "}
                        {new Date(batch.expiry_date).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center">
                        | Stock:
                        <span
                          className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            batch.quantity > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {batch.quantity}
                        </span>
                      </span>
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
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {batches.map((batch) => (
            <label
              key={batch.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedDrugId === batch.drug?.id &&
                selectedBatchNo === batch.batch_no
                  ? "bg-yellow-100 text-yellow-800 border-yellow-400"
                  : "hover:bg-gray-100 text-gray-700 border-gray-200"
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
                className="mr-2 accent-yellow-600"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  {batch.drug?.brand_name} ({batch.drug?.generic_name})
                </div>
                <div className="text-sm text-gray-600 flex flex-wrap items-center gap-x-2">
                  <span>Batch: {batch.batch_no}</span>
                  <span>
                    | Exp: {new Date(batch.expiry_date).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center">
                    | Stock:
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        batch.quantity > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {batch.quantity}
                    </span>
                  </span>
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white">
          <h3 className="text-xl font-semibold text-gray-800">
            Create New Order
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Patient Section */}
          <div className="mb-6 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center space-x-4 mb-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="patientMode"
                  value="new"
                  checked={patientMode === "new"}
                  onChange={() => {
                    setPatientMode("new");
                    setPatientId(null);
                  }}
                  className="mr-1 accent-green-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  New Patient
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="patientMode"
                  value="existing"
                  checked={patientMode === "existing"}
                  onChange={() => {
                    setPatientMode("existing");
                    setPatientName("");
                    setPatientPhone("");
                  }}
                  className="mr-1 accent-green-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Existing Patient
                </span>
              </label>
            </div>

            {patientMode === "new" ? (
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="patientName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-800"
                    required={patientMode === "new"}
                  />
                </div>
                <div>
                  <label
                    htmlFor="patientPhone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Patient Phone *
                  </label>
                  <input
                    type="tel"
                    id="patientPhone"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-800"
                    required={patientMode === "new"}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="patientSearch"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search Existing Patient
                </label>
                <input
                  type="text"
                  id="patientSearch"
                  value={patientSearchTerm}
                  onChange={(e) => setPatientSearchTerm(e.target.value)}
                  placeholder="Type name or phone..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-800"
                />
                {loadingPatients && (
                  <div className="text-sm text-gray-500 mt-1">Searching...</div>
                )}
                {patientSearchResults?.length > 0 && (
                  <ul className="mt-2 border rounded-lg divide-y max-h-40 overflow-y-auto bg-white shadow-lg relative z-100">
                    {patientSearchResults.map((patient) => (
                      <li
                        key={patient.id}
                        onClick={() => handleSelectPatient(patient)}
                        className="p-2 hover:bg-green-50 cursor-pointer text-sm text-gray-800"
                      >
                        {patient.name} - {patient.phone}
                      </li>
                    ))}
                  </ul>
                )}
                {patientId && (
                  <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-lg text-sm">
                    Selected: {patientName} - {patientPhone}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drug search section (unchanged) */}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-shadow text-gray-800"
            />
          </div>

          {/* Search results (drugs/batches) */}
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-800"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-gray-800"
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 mt-6 sticky bottom-0 bg-white py-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !selectedDrugId ||
                !selectedBatchNo ||
                submitting ||
                (patientMode === "existing" && !patientId) ||
                (patientMode === "new" && (!patientName || !patientPhone))
              }
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
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
