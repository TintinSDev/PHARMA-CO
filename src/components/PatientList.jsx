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
    } catch (error) {
      setError("Failed to fetch patients. Please try again later.");
    } finally {
      setLoading(false); // Ensure loading stops regardless of success or error
    }
  };

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="patient-list">
      <h2>Patients</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            {patient.first_name} {patient.middle_name} {patient.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientList;
