"use client";
import { useEffect, useState } from "react";
import MoverCard from "./MoverCard";
import MoverDetailModal from "./MoverDetailModal";

export default function MoversList() {
  const [movers, setMovers] = useState([]);
  const [selectedMover, setSelectedMover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/auth/movers")
      .then((res) => res.json())
      .then(setMovers)
      .catch((err) => setError("Failed to load movers."))
      .finally(() => setLoading(false));
  }, []);

  const handleCardClick = (id) => {
    fetch(`/api/auth/movers/${id}`)
      .then((res) => res.json())
      .then(setSelectedMover)
      .catch(() => setError("Failed to load mover details."));
  };

  const closeModal = () => setSelectedMover(null);

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
          <MoverCard key={mover.id} mover={mover} onClick={() => handleCardClick(mover.id)} />
        ))}
      </div>
      {selectedMover && (
        <MoverDetailModal mover={selectedMover} onClose={closeModal} />
      )}
    </div>
  );
}
