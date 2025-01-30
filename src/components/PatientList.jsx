import { useState, useEffect } from "react";
import axios from "axios";

function PatientList() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const response = await axios.get("http://localhost:5173patients");
    setPatients(response.data);
  };

  return (
    <div className="patient-list">
      <h2>Patient List</h2>
      <ul>
        {patients.map((p) => (
          <li key={p[0]}>{p[1]} {p[2]} {p[3]}</li>
        ))}
      </ul>
    </div>
  );
}

export default PatientList;
