'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

/**
 * renders profile page for mover, dynamic route param 'id' from URl to get correct data for mover 
 *
 * @returns {JSX.Element} - rendered page for details about specified mover
 */

export default function MoverDetailPage() {
  // states to store profile object of mover, track loading, and error message
  const [mover, setMover] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // extract id from URL
  const { id } = useParams();

  // effect hook, fetches the specific mover's details, runs when id in URL changes 
  useEffect(() => {
    if (id) {
      fetch(`/api/auth/movers/${id}`)
        .then((res) => {
          // if issue, then throw an error, else parse the JSON response
          if (!res.ok) {
            throw new Error('Mover not found');
          }
          return res.json();
        })
        // store data in move state, store error message if exists, and stop loading if done
        .then(setMover)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!mover) return <div>Mover not found.</div>

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* if mover has uploaded a pic, then render the file */}
      {mover.profile_picture && (
        <img
          src={`/api/auth/uploads/${mover.profile_picture}`}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
      )}
      {/* display detailed info for specified mover */}
      <h1 className="text-3xl font-bold mb-1">{mover.first_name} {mover.last_name}</h1>
      <p className="text-lg text-gray-600">Class of {mover.graduation_year}</p>
      <div className="mt-6 space-y-2">
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
