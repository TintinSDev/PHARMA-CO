// import { useState, useEffect } from "react";
// import axios from "axios";

// function CollectionList() {
//   const [collections, setCollections] = useState([]);

//   useEffect(() => {
//     fetchCollections();
//   }, []);

//   const fetchCollections = async () => {
//     const response = await axios.get("http://localhost:5174/collectionlist");
//     setCollections(response.data);
//   };

//   return (
//     <div className="collection-list">
//       <h2>Collections</h2>
//       <ul>
//         {collections.map((c) => (
//           <li key={c.id}>
//             <p>Patient: {c.patient_name}</p>
//             <p>Regimen: {c.regimen}</p>
//             <p>Next Collection Date: {c.next_collection_date}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default CollectionList;

// PAGINATION FUNCTIONALITY

// import { useState, useEffect } from "react";
// import axios from "axios";

// function CollectionList() {
//   const [collections, setCollections] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalCollections, setTotalCollections] = useState(0);
//   const limit = 2; // Number of collections per page

//   useEffect(() => {
//     fetchCollections();
//   }, [currentPage]);

//   const fetchCollections = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5174/collectionlist?page=${currentPage}&limit=${limit}`);
//       setCollections(response.data.collections);
//       setTotalCollections(response.data.total);
//     } catch (error) {
//       console.error("Failed to fetch collections:", error);
//     }
//   };

//   const totalPages = Math.ceil(totalCollections / limit);

//   return (
//     <div className="collection-list">
//       <h2>Collections</h2>
//       <ul className="grid-container">
//         {collections.map((c) => (
//           <li key={c.id}>
//             <p>Patient: {c.patient_name}</p>
//             <p>Regimen: {c.regimen}</p>
//             <p>Next Collection Date: {c.next_collection_date}</p>
//           </li>
//         ))}
//       </ul>

//       {/* Pagination Controls */}
//       <div className="pagination">
//         <button 
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
//           disabled={currentPage === 0}
//         >
//           Prev
//         </button>
//         <span> Page {currentPage + 1} of {totalPages} </span>
//         <button 
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
//           disabled={currentPage === totalPages - 1}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// export default CollectionList;

// SEARCH FUNCTIONALITY

// import { useState, useEffect } from "react";
// import axios from "axios";

// function CollectionList() {
//   const [collections, setCollections] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchCollections();
//   }, [search]); // Fetch when search query changes

//   const fetchCollections = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `http://localhost:5174/collectionlist?page=0&limit=5&search=${search}`
//       );
//       setCollections(response.data);
//     } catch (err) {
//       setError("Failed to fetch collections. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearch(e.target.value); // Update the search term
//   };

//   if (loading) return <p>Loading collections...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="collection-list">
//       <h2>Collections</h2>
//       <input
//         type="text"
//         placeholder="Search by patient name"
//         value={search}
//         onChange={handleSearchChange}
//       />
//       <ul>
//         {collections.map((c) => (
//           <li key={c.id}>
//             <p>Patient: {c.patient_name}</p>
//             <p>Regimen: {c.regimen}</p>
//             <p>Next Collection Date: {c.next_collection_date}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default CollectionList;


// BOTH PAGINATION AND SEARCH FUNCTIONALITY

import { useState, useEffect } from "react";
import axios from "axios";

function CollectionList() {
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState(""); // Search query state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCollections, setTotalCollections] = useState(0);
  const limit = 5; // Number of collections per page

  useEffect(() => {
    fetchCollections();
  }, [currentPage, search]); // Fetch when page or search changes

  const fetchCollections = async () => {
    try {

      const response = await axios.get(
        //`https://pharmartcoh.onrender.com/collectionlist?page=${currentPage}&limit=${limit}&search=${search}`
        `http://localhost:5174/collectionlist?page=${currentPage}&limit=${limit}&search=${search}`
      );
      setCollections(response.data.collections);
      setTotalCollections(response.data.total);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };

  const totalPages = Math.ceil(totalCollections / limit);

  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update search term
    setCurrentPage(0); // Reset to page 1 when search changes
  };

  return (
    <div className="collection-list">
      <h2>Collections</h2>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by patient name"
        value={search}
        onChange={handleSearchChange}
      />

      {/* Collection List */}
      <ul className="grid-container">
        {collections.map((c) => (
          <li key={c.id}>
            <p>Patient: {c.patient_name}</p>
            <p>Regimen: {c.regimen}</p>
            <p>Next Collection Date: {c.next_collection_date}</p>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Prev
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default CollectionList;
