import { useState } from "react";
import axios from "axios";
import Confetti from "react-confetti";

function PatientForm() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patientId, setPatientId] = useState(null);  // To store the patient ID after submission
  const [showConfetti, setShowConfetti] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("https://pharmartcoh.onrender.com/patients", {
      //  const response = await axios.post("http://localhost:5174/patients", {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
      });

      setPatientId(response.data.id); // Assuming the backend returns the patient ID
      // Clear the form fields after submission
      setFirstName("");
      setMiddleName("");
      setLastName("");
      // Show confetti after submission
       setShowConfetti(true);
       setTimeout(() => setShowConfetti(false), 8000); // Hide confetti after 8 seconds
 

       // Show success alert
    alert("Patient added successfully!");
    console.log("Patient added successfully!");
    } catch (err) {
      console.error("Error adding patient:", err);
       // Show error alert
    alert("Failed to add patient. Please try again.");
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
        <div style={{ color: "green", marginTop: "1rem", bold: true}}>
          <h3>Patient added successfully!</h3>
          <p>Patient ID: {patientId}</p>
          <strong style={{ color: "red"}}>Please remember this ID for future reference.</strong>
          <p>Thank you.</p>
        </div>
      )}
      {showConfetti && <Confetti />}
    </div>
  );
}

export default PatientForm;
// import { useState } from "react";
// import axios from "axios";

// function PatientForm() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//   });
//   const [patientId, setPatientId] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5173/patients", formData);
//       setPatientId(response.data.id);
//       // Clear the form fields after submission
//       setFormData({ firstName: "", middleName: "", lastName: "" });
//     } catch (err) {
//       console.error("Error adding patient:", err);
//     }
//   };

//   return (
//     <div>
//       <h2>Add New Patient</h2>
//       <form onSubmit={handleSubmit}>
//         <label>First Name:</label>
//         <input
//           type="text"
//           name="firstName"
//           value={formData.firstName}
//           onChange={handleInputChange}
//           required
//         />

//         <label>Middle Name:</label>
//         <input
//           type="text"
//           name="middleName"
//           value={formData.middleName}
//           onChange={handleInputChange}
//         />

//         <label>Last Name:</label>
//         <input
//           type="text"
//           name="lastName"
//           value={formData.lastName}
//           onChange={handleInputChange}
//           required
//         />

//         <button type="submit">Add Patient</button>
//       </form>

//       {patientId && (
//         <div>
//           <h3>Patient added successfully!</h3>
//           <p>Patient ID: {patientId}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PatientForm;
