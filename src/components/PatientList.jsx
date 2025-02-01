// import { useState, useEffect } from "react";
// import axios from "axios";

// function PatientList() {
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     try {
//       const response = await axios.get("http://localhost:5174/patients");
//       setPatients(response.data);
//     } catch (error) {
//       setError("Failed to fetch patients. Please try again later.");
//     } finally {
//       setLoading(false); // Ensure loading stops regardless of success or error
//     }
//   };

//   if (loading) return <p>Loading patients...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="patient-list">
//       <h2>Patients</h2>
//       <ul>
//         {patients.map((patient) => (
//           <li key={patient.id}>
//             {patient.first_name} {patient.middle_name} {patient.last_name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default PatientList;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const limit = 10; // Number of patients per page

  useEffect(() => {
    fetchPatients();
  }, [currentPage]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`https://pharmartcoh.onrender.com/patients?page=${currentPage}&limit=${limit}`);
      //const response = await axios.get(`http://localhost:5174/patients?page=${currentPage}&limit=${limit}`);
      setPatients(response.data.patients);
      setTotalPatients(response.data.total);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  };

  const deletePatient = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      await axios.delete(`https://pharmartcoh.onrender.com/patients/${id}`);
      fetchPatients();
    }
  };

  const totalPages = Math.ceil(totalPatients / limit);

  return (
    <div className="patient-list">
      <h2>Patients</h2>
      <ul className="grid-container">
        {patients.map((patient) => (
          <li key={patient.id}>
            {patient.id} {patient.first_name} {patient.middle_name} {patient.last_name} 
            <Link to={`/edit-patient/${patient.id}` }>✏ Edit</Link>
            <button onClick={() => deletePatient(patient.id)} className="delete-button">🗑 Delete</button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0}>Prev</button>
        <span> Page {currentPage + 1} of {totalPages} </span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>Next</button>
      </div>
    </div>
  );
}



export default PatientList;
