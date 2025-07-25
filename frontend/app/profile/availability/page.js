'use client';

import AvailabilityManager from './components/AvailabilityManager';
import Link from 'next/link';

export default function ManageAvailabilityPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Your Availability</h1>
          <Link href="/dashboard" legacyBehavior>
            <a className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors">
              Back to Dashboard
            </a>
          </Link>
        </div>
        <p className="mb-6 text-gray-600">Select a date on the calendar, choose a start and end time, and click "Add Slot" to add it to your schedule.</p>
        <AvailabilityManager />
      </div>
    </div>
  );
}
