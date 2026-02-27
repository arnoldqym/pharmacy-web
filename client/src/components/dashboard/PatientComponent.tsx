import React, { useEffect, useState } from "react";
import SpecificPatientDetails from "./microcomponent/SpecificPatientDetails"; // Adjust path if needed

function PatientComponent() {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const fetchAllPatientsApi = `${apiUrl}/patients`;
  const searchPatientsApi = `${apiUrl}/patients/search`;

  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all patients on mount
  useEffect(() => {
    fetchAllPatients();
  }, []);

  // Debounced Search Effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchPatients();
      } else {
        setSearchResults([]);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchAllPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(fetchAllPatientsApi, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setPatients(data.data); // Laravel pagination wraps data inside 'data'
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async () => {
    try {
      const res = await fetch(`${searchPatientsApi}?q=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      setSearchResults(data); // Search controller returns array directly
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Determine which list to show
  const displayList = searchQuery.length >= 2 ? searchResults : patients;

  // Callback to update the local list after a successful edit without refreshing the whole page
  const handlePatientUpdated = (updatedPatient) => {
    setPatients(
      patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)),
    );
    setSelectedPatient(updatedPatient);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar / Patient List */}
      <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col h-1/2 md:h-full">
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Patients</h2>
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {loading && (
            <p className="p-4 text-gray-500 text-center">Loading patients...</p>
          )}
          {!loading && displayList.length === 0 && (
            <p className="p-4 text-gray-500 text-center">No patients found.</p>
          )}

          <ul className="space-y-1">
            {displayList.map((patient) => (
              <li key={patient.id}>
                <button
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    selectedPatient?.id === patient.id
                      ? "bg-blue-50 border-blue-500 border-l-4"
                      : "hover:bg-gray-100 border-transparent border-l-4"
                  }`}
                >
                  <div className="font-semibold text-gray-800">
                    {patient.name}
                  </div>
                  <div className="text-sm text-gray-500">{patient.phone}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content / Patient Details */}
      <div className="w-full md:w-2/3 h-1/2 md:h-full overflow-y-auto bg-gray-50">
        {selectedPatient ? (
          <SpecificPatientDetails
            patient={selectedPatient}
            apiUrl={apiUrl}
            onUpdateSuccess={handlePatientUpdated}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 flex-col">
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <p className="text-xl">Select a patient to view or edit details</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientComponent;
