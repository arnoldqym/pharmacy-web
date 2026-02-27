import React, { useEffect } from "react";
import SpecificPatientDetails from "./microcomponent/SpecificPatientDetails";
function PatientComponent() {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const fetchAllPatientsApi = `${apiUrl}/patients`;
  const searchPatientsApi = `${apiUrl}/patients/search`;
  const updatePatientInformationApi = `${apiUrl}/patient-update`;

  const [patients, setPatients] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [selectedPatient, setSelectedPatient] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      const response = await fetch(fetchAllPatientsApi, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      setPatients(data.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  console.log("Patients:", patients);

  const searchPatients = async () => {
    try {
      const res = await fetch(`${searchPatientsApi}?q=${searchQuery}`, {
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

  return (
    <div>
      {" "}
      all list of Patient
      <SpecificPatientDetails />
    </div>
  );
}

export default PatientComponent;
