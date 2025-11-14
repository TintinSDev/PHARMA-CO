import { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import trashBin from "/trah.png";


function PatientList() {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [deletedPatients, setDeletedPatients] = useState([]);
  const limit = 12; // Number of patients per page
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

   useEffect(() => {
  const delayDebounce = setTimeout(() => {
    setCurrentPage(0); // reset to first page when searching
    fetchPatients();
  }, 400); // wait 400ms after user stops typing

  return () => clearTimeout(delayDebounce);
}, [search]);
useEffect(() => {
  fetchPatients();
}, [currentPage]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`https://pharmartcoh.onrender.com/patients/patients?page=${currentPage}&limit=${limit}&search=${search}`);
      //const response = await axios.get(`http://localhost:8000/patients/patients?page=${currentPage}&limit=${limit}&search=${search}`);
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
          try {
        await axios.delete(`https://pharmartcoh.onrender.com/patients/${id}`);
       // await axios.delete(`http://localhost:8000/patients/${id}`);
        fetchPatients();
        } catch (error) {
      console.error("Error deleting patient:", error);
    } finally {
              setDeletedPatients((prev) => prev.filter((pid) => pid !== id)); // Remove animation
          }
          }, 2000);
    }
  };
const goToCollectionForm = (patient) => {
    navigate(`/collection-form/${patient.id}`, { state: { patient } });
  };
  const totalPages = Math.ceil(totalPatients / limit);

  return (
    <div className="patient-list">
      <h2>Patients</h2>
   <div className="search-container">
  <input
    type="text"
    className="search-input"
    placeholder="Search patients..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
   </div>
      <ul className="grid-container">
  {patients.map((patient, idx) => (
    <li key={patient.id} style={{ position: "relative" }}>
      {currentPage * limit + idx + 1}. {patient.first_name} {patient.middle_name} {patient.last_name}
        {/*<Link to={`/edit-patient/${patient.id}`} className="edit-button">✏ Edit</Link>*/}
        <button
  className="edit-button"
  onClick={() => navigate(`/edit-patient/${patient.id}`)}
>
  ✏ Edit
</button>

      <button onClick={() => deletePatient(patient.id)} className="delete-button">🗑 Delete</button>
        <button onClick={() => goToCollectionForm(patient)} className="fill-button">💊 Fill</button>

      {deletedPatients.includes(patient.id) && (
        <>
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.img
              key={index}
              src={trashBin}
              alt="Trash Bin"
              initial={{ y: -100, x: Math.random() * 100 - 50, rotate: Math.random() * 360, opacity: 1, scale: 1 }}
              animate={{ y: 400, x: Math.random() * 100 - 50, rotate: Math.random() * 720, opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.5, ease: "easeIn", delay: index * 0.2 }}
              style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", width: "40px", height: "40px" }}
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
