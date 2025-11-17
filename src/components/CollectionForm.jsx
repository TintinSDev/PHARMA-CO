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
      //     const response = await axios.post("http://localhost:8000/collections", {
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
const haartRegimens = {
  firstLine: [
    {
      name: "TDF 300mg + 3TC 300mg + DTG 50mg (TLD)",
      type: "Adult",
      description: "Preferred first-line regimen for most adults and adolescents."
    },
    {
      name: "TAF 25mg + 3TC 300mg + DTG 50mg (TAFLD)",
      type: "Adult",
      description: "Tenofovir alafenamide-based regimen with improved renal safety."
    },
    {
      name: "ABC 600mg + 3TC 300mg + DTG 50mg (ABC/3TC/DTG)",
      type: "Adult",
      description: "First-line alternative for patients who cannot take TDF."
    },
    {
      name: "ABC 120mg + 3TC 60mg + DTG 10mg (ABC/3TC/DTG)",
      type: "Pediatric",
      description: "WHO-recommended pediatric DTG-based first-line regimen."
    },

    // --- Pediatric Syrups ---
    {
      name: "ABC 20mg/mL + 3TC 10mg/mL Oral Solution",
      type: "Pediatric Syrup",
      description: "Pediatric ABC/3TC syrup for infants and young children."
    },
    {
      name: "LPV/r 80mg/20mg per mL Oral Solution",
      type: "Pediatric Syrup",
      description: "Protease inhibitor pediatric solution for children who cannot swallow tablets."
    }
  ],

  secondLine: [
    {
      name: "AZT 300mg + 3TC 150mg + DTG 50mg",
      type: "Adult",
      description: "Switch option for patients failing TDF-based first-line treatment."
    },
    {
      name: "AZT 300mg + 3TC 300mg + NVP 200mg",
      type: "Adult",
      description: "Legacy second-line regimen; used where DTG unavailable."
    },
    {
      name: "AZT 60mg + 3TC 30mg + LPV/r Pediatric",
      type: "Pediatric",
      description: "Protease-inhibitor based second-line regimen for children."
    },

    // --- Pediatric Syrups for Second-Line ---
    {
      name: "AZT 10mg/mL Syrup + 3TC 10mg/mL Syrup",
      type: "Pediatric Syrup",
      description: "AZT/3TC pediatric liquid formulation for second-line therapy."
    }
  ],

  supportiveMedications: [
    {
      name: "Cotrimoxazole (Septrin) 240mg/5mL Pediatric Suspension",
      type: "Prophylaxis",
      description: "Used for PCP, toxoplasmosis and bacterial infection prophylaxis in children."
    },
    {
      name: "Cotrimoxazole (Septrin) 960mg Tablet",
      type: "Prophylaxis",
      description: "Daily prophylaxis for adults with low CD4 counts or WHO stage 3–4."
    },
    {
      name: "Fluconazole 50mg/5mL Oral Suspension",
      type: "Prophylaxis / Treatment",
      description: "For cryptococcal, candidiasis prophylaxis or treatment in susceptible patients."
    },
    {
      name: "Fluconazole 200mg Tablet",
      type: "Prophylaxis / Treatment",
      description: "For cryptococcal disease secondary prophylaxis and candidiasis."
    }
  ]
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

<select value={regimen} onChange={(e) => setRegimen(e.target.value)} required>
  <option value="">Select a regimen</option>

  <optgroup label="First-Line HAART Regimens">
    {haartRegimens.firstLine.map((item, i) => (
      <option key={`first-${i}`} value={item.name}>
        {item.name} — {item.type}
      </option>
    ))}
  </optgroup>

  <optgroup label="Second-Line HAART Regimens">
    {haartRegimens.secondLine.map((item, i) => (
      <option key={`second-${i}`} value={item.name}>
        {item.name} — {item.type}
      </option>
    ))}
  </optgroup>

  <optgroup label="Supportive Medications (Septrin & Fluconazole)">
    {haartRegimens.supportiveMedications.map((item, i) => (
      <option key={`supp-${i}`} value={item.name}>
        {item.name} — {item.type}
      </option>
    ))}
  </optgroup>
</select>


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
