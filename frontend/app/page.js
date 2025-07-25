// deals with the logic for the user sign-up page, like making API call

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * renders home page that users sees when URL opened
 *
 * @returns {JSX.Element} The home page component.
 */

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-5xl font-bold text-gray-800">Welcome to Brown Movers</h1>
      <p className="mt-2 text-xl text-gray-600">
        Your one-stop solution for moving and packing services at Brown University.
      </p>
      <div className="mt-8">
        {/* link to login page */}
        <Link href="/login" legacyBehavior>
          <a className="m-2 py-3 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors">
            Login
          </a>
        </Link>
        {/* link to sign-up page */}
        <Link href="/signup" legacyBehavior>
          <a className="m-2 py-3 px-6 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
            Sign Up
          </a>
        </Link>
      </div>
    </main>
  );
}
