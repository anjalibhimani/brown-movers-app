"use client";
import { useEffect, useState } from "react";
import MoverCard from "./MoverCard";

export default function MoversList() {
  const [movers, setMovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/auth/movers")
      .then((res) => res.json())
      .then(setMovers)
      .catch((err) => setError("Failed to load movers."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading movers...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Available Movers</h2>
      {movers.length === 0 ? (
        // If it is, display a helpful message to the user.
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
