import React, { useEffect, useState, useCallback, useMemo } from "react";
import SpecificPatientDetails from "./microcomponent/SpecificPatientDetails";

function PatientComponent() {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const fetchAllPatientsApi = `${apiUrl}/patients`;
  const searchPatientsApi = `${apiUrl}/patients/search`;

  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
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
        // API returns paginated data with a 'data' field containing the patient array
        setPatients(data.data || []);
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
      setSearchResults(data); // search returns array directly
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  // After a successful update, refresh the patient in the list and keep selection
  const handlePatientUpdate = (updatedPatient) => {
    // Update in patients list
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)),
    );
    // Update in search results if present
    setSearchResults((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)),
    );
    // Update selected patient
    setSelectedPatient(updatedPatient);
  };

  // Determine which list to display
  const displayedPatients = useMemo(() => {
    if (searchQuery.trim().length >= 2) return searchResults;
    return patients;
  }, [patients, searchResults, searchQuery]);

  return (
    <div className="patient-dashboard">
      <div className="patient-list-panel">
        <h2>Patients</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchLoading && <span className="spinner" />}
        </div>
        <div className="patient-list">
          {loading && <div className="loading">Loading patients...</div>}
          {!loading && displayedPatients.length === 0 && (
            <div className="no-results">No patients found</div>
          )}
          {displayedPatients.map((patient) => (
            <div
              key={patient.id}
              className={`patient-item ${
                selectedPatient?.id === patient.id ? "selected" : ""
              }`}
              onClick={() => handlePatientClick(patient)}
            >
              <div className="patient-name">{patient.name}</div>
              <div className="patient-phone">{patient.phone}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="patient-detail-panel">
        {selectedPatient ? (
          <SpecificPatientDetails
            patient={selectedPatient}
            onUpdate={handlePatientUpdate}
          />
        ) : (
          <div className="placeholder">
            Select a patient to view / edit details
          </div>
        )}
      </div>

      <style>{`
        .patient-dashboard {
          display: flex;
          flex-direction: row;
          height: 100%;
          min-height: 80vh;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }

        .patient-list-panel {
          width: 30%;
          background: #f9fafc;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          padding: 1rem;
        }

        .patient-detail-panel {
          width: 70%;
          background: white;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .search-box {
          margin: 1rem 0;
          position: relative;
        }

        .search-box input {
          width: 100%;
          padding: 0.6rem 2rem 0.6rem 0.8rem;
          border: 1px solid #ccc;
          border-radius: 20px;
          font-size: 0.9rem;
          outline: none;
          transition: border 0.2s;
        }

        .search-box input:focus {
          border-color: #2c7da0;
        }

        .spinner {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          border: 2px solid #ccc;
          border-top-color: #2c7da0;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: translateY(-50%) rotate(360deg); }
        }

        .patient-list {
          flex: 1;
          overflow-y: auto;
        }

        .patient-item {
          padding: 0.8rem;
          margin-bottom: 0.4rem;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: background 0.2s, box-shadow 0.2s;
        }

        .patient-item:hover {
          background: #eef6fb;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .patient-item.selected {
          background: #d4e6f1;
          border-left: 4px solid #2c7da0;
        }

        .patient-name {
          font-weight: 600;
          color: #1e2f4e;
        }

        .patient-phone {
          font-size: 0.85rem;
          color: #5f6b7a;
          margin-top: 0.2rem;
        }

        .placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #8a9aa8;
          font-style: italic;
        }

        .loading, .no-results {
          text-align: center;
          color: #5f6b7a;
          padding: 2rem 0;
        }

        /* Responsive: stack on small screens */
        @media (max-width: 768px) {
          .patient-dashboard {
            flex-direction: column;
          }
          .patient-list-panel,
          .patient-detail-panel {
            width: 100%;
            border-right: none;
          }
          .patient-list-panel {
            border-bottom: 1px solid #e0e0e0;
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
}

export default PatientComponent;
