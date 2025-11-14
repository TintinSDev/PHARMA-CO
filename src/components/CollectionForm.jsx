import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Confetti from "react-confetti";

function CollectionForm() {
  const { id } = useParams();
  const location = useLocation();

  // Patient data passed from PatientList
  const patient = location.state?.patient;

  const [patientId, setPatientId] = useState(id || "");
  const [patientName, setPatientName] = useState("");

  const [regimen, setRegimen] = useState("");
  const [quantity, setQuantity] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [nextCollectionDate, setNextCollectionDate] = useState("");
  const [submittedCollection, setSubmittedCollection] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load patient name when page opens
  useEffect(() => {
    if (patient) {
      setPatientName(
        `${patient.first_name} ${patient.middle_name} ${patient.last_name}`
      );
    }
  }, [patient]);

  // Auto-generate next collection date
  const handleCollectionDateChange = (e) => {
    const selectedDate = e.target.value;
    setCollectionDate(selectedDate);

    if (selectedDate) {
      const nextDate = new Date(selectedDate);
      nextDate.setMonth(nextDate.getMonth() + 3);
      setNextCollectionDate(nextDate.toISOString().split("T")[0]);
    } else {
      setNextCollectionDate("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://pharmartcoh.onrender.com/collections", {
           //const response = await axios.post("http://localhost:8000/collections", {
        patient_id: patientId,
        regimen,
        quantity: parseInt(quantity),
        collection_date: collectionDate,
        next_collection_date: nextCollectionDate,
      });

      setSubmittedCollection({
        patientName: response.data.patient_name,
        regimen: response.data.regimen,
        nextCollectionDate: response.data.next_collection_date,
      });

      // Reset form
      setRegimen("");
      setQuantity("");
      setCollectionDate("");
      setNextCollectionDate("");

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 9000);

      alert("Collection added successfully!");
    } catch (err) {
      console.error("Error adding collection:", err);
      alert("Failed to add collection. Please try again.");
    }
  };

  return (
    <div>
      <h2>Collection Form</h2>

      <form onSubmit={handleSubmit}>
        <label>Patient ID:</label>
        <input type="text" value={patientId} readOnly />

        {/* SHOW PATIENT FULL NAME */}
        {patientName && (
          <p>
            <strong>Patient Name:</strong> {patientName}
          </p>
        )}

        <label>Regimen:</label>
        <input type="text" value={regimen} onChange={(e) => setRegimen(e.target.value)} required />

        <label>Quantity:</label>
        <input type="number" max="180" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />

        <label>Collection Date:</label>
        <input type="date" value={collectionDate} onChange={handleCollectionDateChange} required />

        <label>Next Collection Date (Auto):</label>
        <input type="date" value={nextCollectionDate} readOnly />

        <button type="submit">Submit</button>
      </form>

      {submittedCollection && (
        <div style={{ color: "green", marginTop: "1rem" }}>
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
