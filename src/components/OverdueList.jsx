import { useState, useEffect } from "react";
import axios from "axios";

function OverdueList() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const response = await axios.get("http://localhost:8000/overdue");
    setCollections(response.data);
  };

  return (
    <div>
      <h2>Overdue Collections</h2>
      <ul>
        {collections.map((c) => (
          <li key={c[0]}>Patient ID: {c[1]}, Overdue Date: {c[6]}</li>
        ))}
      </ul>
    </div>
  );
}

export default OverdueList;
