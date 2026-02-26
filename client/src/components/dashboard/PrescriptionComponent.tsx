import React, { useState, useEffect } from "react";

function PrescriptionComponent() {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;

  // States
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Initial Load: Fetch All Prescriptions
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/all-prescriptions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setPrescriptions(data.data || []);
      setSelectedPatient(null);
    } catch (err) {
      console.error("Error fetching all prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Debounced Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        searchPatients();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchPatients = async () => {
    try {
      const res = await fetch(`${apiUrl}/patients/search?q=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // 3. Fetch Specific Patient Prescriptions
  const handlePatientSelect = async (patient) => {
    setLoading(true);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedPatient(patient);

    try {
      const res = await fetch(
        `${apiUrl}/patient-prescription?patientId=${patient.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        },
      );
      const data = await res.json();
      // Adjust based on actual response structure
      setPrescriptions(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching patient prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper to summarize items
  const getItemsSummary = (items) => {
    if (!items || items.length === 0) return "—";
    return `${items.length} item(s)`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 font-sans">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {selectedPatient
            ? `Prescriptions for ${selectedPatient.name}`
            : "All Prescriptions"}
        </h1>

        {/* Search Bar Container */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search patients by name or phone..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Debounced Search Results Dropdown */}
          {searchResults.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {searchResults.map((patient) => (
                <li
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-none transition-colors"
                >
                  <p className="font-medium text-gray-700">{patient.name}</p>
                  <p className="text-xs text-gray-500">
                    Phone: {patient.phone}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {/* Action Bar */}
      {selectedPatient && (
        <button
          onClick={fetchAll}
          className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
        >
          ← Back to All Prescriptions
        </button>
      )}

      {/* Prescription Table */}
      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions.length > 0 ? (
                prescriptions.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.patient?.name || "—"}
                      {item.patient?.phone && (
                        <span className="block text-xs text-gray-400">
                          {item.patient.phone}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getItemsSummary(item.items)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      KSh {parseFloat(item.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {item.notes || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No prescriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PrescriptionComponent;
