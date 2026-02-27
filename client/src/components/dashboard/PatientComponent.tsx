import React, { useEffect } from "react";

function PatientComponent() {
  const apiUrl = import.meta.env.VITE_BASE_API_URL;
  const fetchAllPatientsApi = `${apiUrl}/patients`;
  const searchPatientsApi = `${apiUrl}/patients/search`;
  const updatePatientInformationApi = `${apiUrl}/patient-update`;

  const [patients, setPatients] = React.useState([]);

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
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  console.log("Patients:", patients);

  return <div>PatientComponent</div>;
}

export default PatientComponent;
