// fetches and displays grid with all registered movers

"use client";
import { useEffect, useState } from "react";
import MoverCard from "./MoverCard";

/**
 * component that fetches and displays grid with all movers, loading and error states taken into account 
 *
 * @returns {JSX.Element} - list of all mover cards
 */

export default function MoversList() {
  // states to store array of mover objects fetched from API, loading status, and errors from API
  const [movers, setMovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // effect hook once components mount to fetch list of movers from the backend  
  useEffect(() => {
    fetch("/api/auth/movers")
      // parse JSON response, set movers state to data from call
      .then((res) => res.json())
      .then(setMovers)
      // if error, then send message, once done loading change laoding state
      .catch((err) => setError("Failed to load movers."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading movers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Available Movers</h2>
      {/* if movers array empty, tell user no movers avilable, else display the grid with them all*/}
      {movers.length === 0 ? (
        <p>There are no movers available at the moment.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {movers.map((mover) => (
            <MoverCard key={mover.id} mover={mover} />
          ))}
        </div>
      )}
    </div>
  );
}
