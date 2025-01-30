import { useState } from "react";
import axios from "axios";

function CollectionForm() {
  const [patientId, setPatientId] = useState("");
  const [regimenId, setRegimenId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [collectionDate, setCollectionDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5173/collections", {
      patient_id: patientId,
      regimen_id: regimenId,
      quantity: parseInt(quantity),
      collection_date: collectionDate,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Patient ID:</label>
      <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
      <label>Regimen:</label>
      <input type="text" value={regimenId} onChange={(e) => setRegimenId(e.target.value)} />
      <label>Quantity:</label>
      <input type="number" max="180" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <label>Collection Date:</label>
      <input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default CollectionForm;