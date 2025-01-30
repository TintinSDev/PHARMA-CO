import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PatientForm from "./components/PatientForm";
import CollectionForm from "./components/CollectionForm";
import OverdueList from "./components/OverdueList";
import PatientList from "./components/PatientList";
import Navbar from "./pages/Navbar";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient-form" element={<PatientForm />} />
        <Route path="/collection-form" element={<CollectionForm />} />
        <Route path="/overdue-list" element={<OverdueList />} />
        <Route path="/patient-list" element={<PatientList />} />
      </Routes>
    </Router>
  );
}

export default App;
