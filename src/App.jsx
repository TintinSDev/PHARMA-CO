import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PatientForm from "./components/PatientForm";
import CollectionForm from "./components/CollectionForm";
import CollectionList from "./components/CollectionList";
import PatientList from "./components/PatientList";
import Navbar from "./pages/Navbar";
import EditPatient from "./components/EditPatient";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient-form" element={<PatientForm />} />
        <Route path="/collection-form/:id" element={<CollectionForm />} />
        <Route path="/collection-list" element={ <CollectionList />} />
        <Route path="/patient-list" element={<PatientList />} />
        <Route path="/edit-patient/:id" element={<EditPatient />} />
      </Routes>
    </Router>
  );
}

export default App;
