import { useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";

function CollectionForm() {
  const [patientId, setPatientId] = useState("");
  const [regimen, setRegimen] = useState(""); // Regimen as string
  const [quantity, setQuantity] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [nextCollectionDate, setNextCollectionDate] = useState("");
  const [submittedCollection, setSubmittedCollection] = useState(null); // To store submitted collection data
  const [showConfetti, setShowConfetti] = useState(false)

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
    try {
       //const response = await axios.post("https://pharmartcoh.onrender.com/collections", {
         const response = await axios.post("http://localhost:8000/collections", {
        patient_id: patientId,
        regimen: regimen,
        quantity: parseInt(quantity),
        collection_date: collectionDate,
        next_collection_date: nextCollectionDate,
      });

      // Set the returned data to display on successful submission
      setSubmittedCollection({
        patientName: response.data.patient_name,
        regimen: response.data.regimen,
        nextCollectionDate: response.data.next_collection_date,
      });
      
      // Clear the form
      setPatientId("");
      setRegimen("");
      setQuantity("");
      setCollectionDate("");
      setNextCollectionDate("");

      // Show confetti after successful submission
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 9000); // Hide confetti after 5 seconds

      // Show success alert
      alert("Collection added successfully!");

    } catch (err) {
      console.error("Error adding collection:", err);

      // Show error alert
      alert("Failed to add collection. Please try again.");
    }
  };

  return (
    <div>
      <h2>Collection Form</h2>
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
          onChange={(e) => setRegimen(e.target.value)}
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

      {submittedCollection && (
        <div style={{ color: "green", marginTop: "1rem", bold: true }}>
          <h3>Collection Added Successfully!</h3>
          <p>Patient Name: {submittedCollection.patientName}</p>
          <p>Regimen: {submittedCollection.regimen}</p>
          <p>Next Collection Date: {submittedCollection.nextCollectionDate}</p>
        </div>
      )}
      {showConfetti && <Confetti />}
    </div>
  );
}

export default CollectionForm;