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
      <div className="border border-gray-200 rounded-lg p-4 cursor-pointer bg-white shadow-sm hover:shadow-lg transition-shadow text-center">
      {/* if file/pic exists, then render the pic else just have a placeholder*/}
        {mover.profile_picture ? (
          <img
            src={`/api/auth/uploads/${mover.profile_picture}`}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover mb-2 mx-auto"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 mb-2 mx-auto" />
        )}
        {/* show mover's full name and grad year */}
        <div className="font-semibold text-lg">
          {mover.first_name} {mover.last_name}
        </div>
        <div className="text-gray-600">Class of {mover.graduation_year}</div>
      </div>
    </Link>
  );
}
