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
    </div>
  );
}
