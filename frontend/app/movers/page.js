"use client";
import { useEffect, useState } from "react";

export default function MoversPage() {
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
          <div
            key={mover.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
              cursor: "pointer",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              textAlign: "center",
            }}
            onClick={() => handleCardClick(mover.id)}
          >
            {mover.profile_picture ? (
              <img
                src={`/api/auth/uploads/${mover.profile_picture}`}
                alt="Profile"
                style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 8 }}
              />
            ) : (
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#eee", margin: "0 auto 8px" }} />
            )}
            <div style={{ fontWeight: 600, fontSize: 18 }}>
              {mover.first_name} {mover.last_name}
            </div>
            <div>Class of {mover.graduation_year}</div>
          </div>
        ))}
      </div>
      {selectedMover && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              minWidth: 320,
              maxWidth: 400,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{ position: "absolute", top: 12, right: 12, fontSize: 18, background: "none", border: "none", cursor: "pointer" }}
            >
              ×
            </button>
            {selectedMover.profile_picture && (
              <img
                src={`/api/auth/uploads/${selectedMover.profile_picture}`}
                alt="Profile"
                style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }}
              />
            )}
            <h3 style={{ margin: "12px 0 4px" }}>
              {selectedMover.first_name} {selectedMover.last_name}
            </h3>
            <div>Class of {selectedMover.graduation_year}</div>
            <div style={{ margin: "8px 0" }}>
              <b>Email:</b> {selectedMover.email}
            </div>
            {selectedMover.phone_number && (
              <div style={{ margin: "8px 0" }}>
                <b>Phone:</b> {selectedMover.phone_number}
              </div>
            )}
            <div style={{ margin: "8px 0" }}>
              <b>Hourly Rate:</b> ${selectedMover.hourly_rate}
            </div>
            <div style={{ margin: "8px 0" }}>
              <b>30-Minute Rate:</b> ${selectedMover.thirty_min_rate}
            </div>
            {selectedMover.services_offered && selectedMover.services_offered.length > 0 && (
              <div style={{ margin: "8px 0" }}>
                <b>Services:</b> {selectedMover.services_offered.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
