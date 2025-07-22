export default function MoverDetailModal({ mover, onClose }) {
  return (
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
      onClick={onClose}
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
          onClick={onClose}
          style={{ position: "absolute", top: 12, right: 12, fontSize: 18, background: "none", border: "none", cursor: "pointer" }}
        >
          ×
        </button>
        {mover.profile_picture && (
          <img
            src={`/api/auth/uploads/${mover.profile_picture}`}
            alt="Profile"
            style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }}
          />
        )}
        <h3 style={{ margin: "12px 0 4px" }}>
          {mover.first_name} {mover.last_name}
        </h3>
        <div>Class of {mover.graduation_year}</div>
        <div style={{ margin: "8px 0" }}>
          <b>Email:</b> {mover.email}
        </div>
        {mover.phone_number && (
          <div style={{ margin: "8px 0" }}>
            <b>Phone:</b> {mover.phone_number}
          </div>
        )}
        <div style={{ margin: "8px 0" }}>
          <b>Hourly Rate:</b> ${mover.hourly_rate}
        </div>
        <div style={{ margin: "8px 0" }}>
          <b>30-Minute Rate:</b> ${mover.thirty_min_rate}
        </div>
        {mover.services_offered && mover.services_offered.length > 0 && (
          <div style={{ margin: "8px 0" }}>
            <b>Services:</b> {mover.services_offered.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}
