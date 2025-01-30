import { useState } from "react";
import axios from "axios";

function CollectionForm() {
  const [patientId, setPatientId] = useState("");
  const [regimen, setRegimen] = useState(""); // Changed regimenId to regimen (string)
  const [quantity, setQuantity] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [nextCollectionDate, setNextCollectionDate] = useState("");

  // Function to calculate the next collection date
  const handleCollectionDateChange = (e) => {
    const selectedDate = e.target.value;
    setCollectionDate(selectedDate);

    if (selectedDate) {
      const nextDate = new Date(selectedDate);
      nextDate.setMonth(nextDate.getMonth() + 3); // Adds 3 months
      setNextCollectionDate(nextDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    } else {
      setNextCollectionDate(""); // Reset if no date is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5173/collections", {
      patient_id: patientId,
      regimen: regimen, // Send regimen string
      quantity: parseInt(quantity),
      collection_date: collectionDate,
      next_collection_date: nextCollectionDate,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter Patient ID (Unique Identifier):</label>
      <input
        type="text"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        required
      />

      <label>Enter Regimen (Treatment Plan):</label>
      <input
        type="text"
        value={regimen}
        onChange={(e) => setRegimen(e.target.value)} // Handle regimen input as a string
        required
      />

      <label>Enter Quantity (Number of Doses):</label>
      <input
        type="number"
        max="180"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />

      <label>Select Collection Date:</label>
      <input
        type="date"
        value={collectionDate}
        onChange={handleCollectionDateChange}
        required
      />

      <label>Next Collection Date (Auto-Generated):</label>
      <input type="date" value={nextCollectionDate} readOnly />

      <button type="submit">Submit</button>
    </form>
  );
}

export default CollectionForm;
