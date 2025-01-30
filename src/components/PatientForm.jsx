import { useState } from "react";
import axios from "axios";

function PatientForm() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patientId, setPatientId] = useState(null);  // To store the patient ID after submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5173/patients", {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
      });
      setPatientId(response.data.id); // Assuming the backend returns the patient ID
      // Clear the form fields after submission
      setFirstName("");
      setMiddleName("");
      setLastName("");
    } catch (err) {
      console.error("Error adding patient:", err);
    }
  };

  return (
    <div>
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label>Middle Name:</label>
        <input
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
        />

        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <button type="submit">Add Patient</button>
      </form>

      {patientId && (
        <div>
          <h3>Patient added successfully!</h3>
          <p>Patient ID: {patientId}</p>
        </div>
      )}
    </div>
  );
}

export default PatientForm;
