// renders summary card for a mover

import Link from 'next/link';

/**
 * reusable UI component that to display sumamry info for a mover, card is a link to take user to more info page 
 *
 * @param {object} props.mover - mover object with details like the id, name, profile pic, etc 
 * @returns {JSX.Element} - linkable card for the mover's profile 
 */

export default function MoverCard({ mover }) {
  return (
    // reference link to page based on the mover's id
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
      {/* if file/pic exists, then render the pic else just have a placeholder*/}
        {mover.profile_picture ? (
          <img
            src={`/api/auth/uploads/${mover.profile_picture}`}
            alt="Profile"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 8 }}
          />
        ) : (
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#eee", margin: "0 auto 8px" }} />
        )}
        {/* show mover's full name and grad year */}
        <div style={{ fontWeight: 600, fontSize: 18 }}>
          {mover.first_name} {mover.last_name}
        </div>
        <div>Class of {mover.graduation_year}</div>
      </div>
    </Link>
  );
}
