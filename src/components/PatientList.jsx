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
import { motion } from "framer-motion";
import trashBin from "/trah.png"; // Use an actual trash bin image or SVG

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [deletedPatients, setDeletedPatients] = useState([]);
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
      setDeletedPatients((prev) => [...prev, id]); // Trigger animation

      setTimeout(async () => {
        await axios.delete(`https://pharmartcoh.onrender.com/patients/${id}`);
        fetchPatients();
        setDeletedPatients((prev) => prev.filter((pid) => pid !== id)); // Remove animation
      }, 2000);
    }
  };

  const totalPages = Math.ceil(totalPatients / limit);

  return (
    <div className="patient-list">
      <h2>Patients</h2>
      <ul className="grid-container">
        {patients.map((patient) => (
          <li key={patient.id} style={{ position: "relative" }}>
            {patient.id} {patient.first_name} {patient.middle_name} {patient.last_name} 
            <Link to={`/edit-patient/${patient.id}` }>✏ Edit</Link>
            <button onClick={() => deletePatient(patient.id)} className="delete-button">🗑 Delete</button>

            {/* Trash bin animation when patient is deleted */}
            {deletedPatients.includes(patient.id) && (
              <>
                {Array.from({ length: 7 }).map((_, index) => (
                  <motion.img
                    key={index}
                    src={trashBin}
                    alt="Trash Bin"
                    initial={{
                      y: -100,
                      x: Math.random() * 100 - 50, // Random horizontal position
                      rotate: Math.random() * 360, // Random rotation
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{
                      y: 400, // Falls down
                      x: Math.random() * 100 - 50, // Random drift
                      rotate: Math.random() * 720, // Extra spin
                      opacity: 0,
                      scale: 0.5, // Shrinks
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeIn",
                      delay: index * 0.2, // Staggered effect
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "40px",
                      height: "40px",
                    }}
                  />
                ))}
              </>
            )}
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
