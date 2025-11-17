import { useState, useEffect } from "react";
import axios from "axios";
function CollectionList() {
  const [collections, setCollections] = useState([]);
  const [search, setSearch] = useState(""); // Search term
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCollections, setTotalCollections] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 8; // Items per page

  // Fetch collections from backend
  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
          `https://pharmartcoh.onrender.com/collections/collections?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(search)}`
        //`http://localhost:8000/collections/collections?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(search)}`
      );

      if (response.data && Array.isArray(response.data.collections)) {
        setCollections(response.data.collections);
        setTotalCollections(response.data.total || 0);
      } else {
        setCollections([]);
        setTotalCollections(0);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch collections.");
      setCollections([]);
      setTotalCollections(0);
    } finally {
      setLoading(false);
    }
  };

  // Live search with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(0); // Reset to first page on new search
      fetchCollections();
    }, 400); // 400ms delay after typing

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Fetch when page changes
  useEffect(() => {
    fetchCollections();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCollections / limit);

  return (
    <div className="collection-list">
      <h2>Collections</h2>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading / Error */}
      {loading && <p>Loading collections...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && collections.length === 0 && (
        <p>No collections found for "{search}"</p>
      )}

      {/* Collection List */}
     <ul className="grid-container-c">
  {collections.map((c) => (
    <li key={c.id}>
      <p><strong>Patient:</strong><br />{c.patient_name}</p>

      <p className="regimen-text">
        <strong>Regimen:</strong><br />
        {c.regimen}
      </p>

      <p>
        <strong>Next Pickup:</strong><br />
        {c.next_collection_date}
      </p>
    </li>
  ))}
</ul>


      {/* Pagination */}
      {totalCollections > limit && (
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default CollectionList;
