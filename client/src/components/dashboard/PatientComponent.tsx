import React, { useEffect, useState, useMemo } from "react";
import SpecificPatientDetails from "./microcomponent/SpecificPatientDetails";
import type { Patient } from "../../types/index.dt"; // adjust path if needed

function PatientComponent() {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const fetchAllPatientsApi = `${apiUrl}/patients`;
  const searchPatientsApi = `${apiUrl}/patients/search`;

  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch all patients on mount
  useEffect(() => {
    const fetchAllPatients = async () => {
      setLoading(true);
      try {
        const response = await fetch(fetchAllPatientsApi, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        // Assuming API returns { data: Patient[] }
        setPatients((data.data as Patient[]) || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPatients();
  }, [fetchAllPatientsApi]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const performSearch = async () => {
    setSearchLoading(true);
    try {
      const response = await fetch(
        `${searchPatientsApi}?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      // Assuming search returns an array of Patient directly
      setSearchResults(data as Patient[]);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handlePatientUpdate = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)),
    );
    setSearchResults((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)),
    );
    setSelectedPatient(updatedPatient);
  };

  const displayedPatients = useMemo(() => {
    if (searchQuery.trim().length >= 2) return searchResults;
    return patients;
  }, [patients, searchResults, searchQuery]);

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[80vh] border border-gray-200 rounded-lg overflow-hidden bg-white font-sans">
      {/* Left Panel: Patient List */}
      <div className="w-full md:w-[30%] bg-[#f9fafc] border-b md:border-b-0 md:border-r border-gray-200 flex flex-col p-4 max-h-[400px] md:max-h-full">
        <h2 className="text-xl font-bold text-[#1e2f4e] mb-4">Patients</h2>

        {/* Search Box */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#2c7da0] transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-[#2c7da0] rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Patient Items Container */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {loading && (
            <div className="text-center py-8 text-slate-500">
              Loading patients...
            </div>
          )}
          {!loading && displayedPatients.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No patients found
            </div>
          )}

          {displayedPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => handlePatientClick(patient)}
              className={`p-3 rounded-lg cursor-pointer transition-all shadow-sm border-l-4 ${
                selectedPatient?.id === patient.id
                  ? "bg-[#d4e6f1] border-[#2c7da0]"
                  : "bg-white border-transparent hover:bg-[#eef6fb] hover:shadow-md"
              }`}
            >
              <div className="font-semibold text-[#1e2f4e] truncate">
                {patient.name}
              </div>
              <div className="text-xs text-slate-500 mt-1">{patient.phone}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Detail View */}
      <div className="w-full md:w-[70%] bg-white p-6 overflow-y-auto">
        {selectedPatient ? (
          <SpecificPatientDetails
            patient={selectedPatient}
            onUpdate={handlePatientUpdate}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 italic">
            Select a patient to view / edit details
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientComponent;
