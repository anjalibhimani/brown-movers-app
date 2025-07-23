'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function MoverDetailPage() {
  const [mover, setMover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`/api/auth/movers/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Mover not found');
          }
          return res.json();
        })
        .then(setMover)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!mover) return <div>Mover not found.</div>

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: 'auto' }}>
      {mover.profile_picture && (
        <img
          src={`/api/auth/uploads/${mover.profile_picture}`}
          alt="Profile"
          style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }}
        />
      )}
      <h1 style={{ margin: '0 0 8px' }}>{mover.first_name} {mover.last_name}</h1>
      <p>Class of {mover.graduation_year}</p>
      <div style={{ marginTop: 24 }}>
        <p><strong>Email:</strong> {mover.email}</p>
        {mover.phone_number && <p><strong>Phone:</strong> {mover.phone_number}</p>}
        <p><strong>Hourly Rate:</strong> ${mover.hourly_rate}</p>
        <p><strong>30-Minute Rate:</strong> ${mover.thirty_min_rate}</p>
        {mover.services_offered && mover.services_offered.length > 0 && (
          <p><strong>Services:</strong> {mover.services_offered.join(', ')}</p>
        )}
      </div>
    </div>
  );
}
