import { useState, useEffect } from "react";
import axios from "axios";
import PatientForm from "./components/PatientForm";
import CollectionForm from "./components/CollectionForm";
import OverdueList from "./components/OverdueList";

function App() {
  return (
    <div>
      <h1>ARV Collection Tracking</h1>
      <PatientForm />
      <CollectionForm />
      <OverdueList />
    </div>
  );
}

export default App;
