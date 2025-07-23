import Link from 'next/link';

export default function MoverCard({ mover }) {
  return (
    <Link href={`/movers/${mover.id}`} passHref>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 16,
          cursor: "pointer",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          textAlign: "center",
          textDecoration: 'none',
          color: 'inherit'
        }}
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
    </Link>
  );
}
