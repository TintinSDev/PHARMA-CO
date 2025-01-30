import { useState, useEffect } from "react";
import axios from "axios";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5174/patients");
      setPatients(response.data);
      setLoading(false); // Stop loading once data is fetched
    } catch  {
      setError("Failed to fetch patients. Please try again later.");
      setLoading(false); // Stop loading on error
    }
  };

  if (loading) {
    return <p>Loading patients...</p>; // Show loading text while fetching data
  }

  if (error) {
    return <p>{error}</p>; // Show error message if fetch fails
  }

  return (
    <div className="patient-list">
      <h2>Patients</h2>
      <ul className="patient-list-ul">
        {patients.map((p) => (
          <li key={p[0]}>
            {p[1]} {p[2]} {p[3]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientList;

