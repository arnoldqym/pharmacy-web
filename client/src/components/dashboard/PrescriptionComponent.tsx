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
      //console.log("Fetched prescriptions:", data);
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
    }, 500); // 500ms delay

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
      // If it's also paginated, use data.data; if it's a plain array, just use data
      setPrescriptions(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching patient prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
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
            placeholder="Search patients..."
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
                  <p className="text-xs text-gray-500">ID: {patient.id}</p>
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

      {/* Prescription List/Grid */}
      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prescriptions.length > 0 ? (
            prescriptions.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded">
                    {item.date}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-900">
                  {item.medicationName}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{item.dosage}</p>
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Instructions
                  </p>
                  <p className="text-sm text-gray-700 italic">
                    "{item.instructions}"
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              No prescriptions found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PrescriptionComponent;
