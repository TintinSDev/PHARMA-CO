import { useState, useEffect } from "react";
import axios from "axios";

function CollectionList() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const response = await axios.get("http://localhost:5174/collectionlist");
    setCollections(response.data);
  };

  return (
    <div className="collection-list">
      <h2>Collections</h2>
      <ul>
        {collections.map((c) => (
          <li key={c.id}>
            <p>Patient: {c.patient_name}</p>
            <p>Regimen: {c.regimen}</p>
            <p>Next Collection Date: {c.next_collection_date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CollectionList;
