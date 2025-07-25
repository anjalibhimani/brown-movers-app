'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

export default function AvailabilityManager() {
  const [date, setDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState('');

  async function fetchAvailability() {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/movers/${user.id}/availability`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailability(response.data);
      } catch (err) {
        setError('Failed to fetch availability.');
      }
    };

  useEffect(() => {
    fetchAvailability();
  }, []);

  async function handleAddSlot() {
    try {
      const token = localStorage.getItem('token');
      const start_time = new Date(date);
      start_time.setHours(9, 0, 0, 0); 
      const end_time = new Date(date);
      end_time.setHours(17, 0, 0, 0); 

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/user/availability`,
        { start_time: start_time.toISOString(), end_time: end_time.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAvailability(); 
    } catch (err) {
      setError('Failed to add slot. Please try again.');
    }
  };

  async function handleDeleteSlot(slotID) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/user/availability/${slotId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchAvailability(); // Refresh list
    } catch (err) {
        setError('Failed to delete slot.');
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Manage Your Availability</h3>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col md:flex-row gap-8">
        <div>
          <Calendar onChange={setDate} value={date} />
          <button
            onClick={handleAddSlot}
            className="mt-4 w-full bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
          >
            Add 9am-5pm Slot for Selected Date
          </button>
        </div>
        <div>
          <h4 className="font-bold mb-2">Your Current Slots:</h4>
          <ul className="space-y-2">
            {availability.map((slot) => (
              <li key={slot.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>
                  {format(new Date(slot.start_time), 'PPP p')} - {format(new Date(slot.end_time), 'p')}
                </span>
                <button onClick={() => handleDeleteSlot(slot.id)} className="text-red-500 hover:text-red-700">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
