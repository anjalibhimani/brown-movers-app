'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isWithinInterval } from 'date-fns';

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
  const params = useParams();

  // extract id from URL
  const { id } = useParams();

  // effect hook, fetches the specific mover's details, runs when id in URL changes 
  useEffect(() => {
    if (id) {
      async function fetchMover() {
        try {
          setLoading(true);
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/movers/${id}`);
          setMover(response.data);
        } catch (err) {
          setError('Failed to fetch mover details.');
        } finally {
          setLoading(false);
        }
      };
      fetchMover();
    }
  }, [id]);

  function tileClassName({ date, view }) {
    if (view === 'month' && mover?.availabilities) {
      const isAvailable = mover.availabilities.some(slot => 
        isWithinInterval(date, {
          start: new Date(slot.start_time),
          end: new Date(slot.end_time)
        })
      );
      if (isAvailable) {
        return 'bg-green-300';
      }
    }
    return null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!mover) return <div>Mover not found.</div>

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
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
      <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Availability</h3>
           <Calendar
              value={new Date()}
              tileClassName={tileClassName}
              className="w-full border rounded-lg"
            />
          <ul className="mt-4 space-y-2">
            {mover.availabilities.map(slot => (
              <li key={slot.id} className="bg-gray-100 p-3 rounded-md">
                {format(new Date(slot.start_time), 'EEEE, MMMM d, yyyy')} from {format(new Date(slot.start_time), 'p')} to {format(new Date(slot.end_time), 'p')}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
