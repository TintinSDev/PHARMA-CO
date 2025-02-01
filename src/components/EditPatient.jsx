import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState({ first_name: "", middle_name: "", last_name: "" });

  useEffect(() => {
    axios.get(`http://localhost:5174/patients/${id}`)
      .then(response => setPatient(response.data))
      .catch(error => console.error("Error fetching patient data:", error));
  }, [id]);

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:5174/patients/${id}`, patient);
    navigate("/patients");
  };

  return (
    <div>
      <h2>Edit Patient</h2>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input type="text" name="first_name" value={patient.first_name} onChange={handleChange} />
        <label>Middle Name:</label>
        <input type="text" name="middle_name" value={patient.middle_name} onChange={handleChange} />
        <label>Last Name:</label>
        <input type="text" name="last_name" value={patient.last_name} onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditPatient;