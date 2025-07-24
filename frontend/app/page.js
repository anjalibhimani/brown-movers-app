// deals with the logic for the user sign-up page, like making API call

'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * renders home page that users sees when URL opened
 *
 * @returns {JSX.Element} The home page component.
 */

export default function HomePage() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 24
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Welcome to Brown Movers</h1>
      <p style={{ marginTop: 8, fontSize: '1.25rem', color: '#666' }}>
        Your one-stop solution for moving and packing services at Brown University.
      </p>
      <div style={{ marginTop: 32 }}>
        {/* link to ogin page */}
        <Link href="/login" legacyBehavior>
          <a style={{
            margin: 8,
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 600
          }}>
            Login
          </a>
        </Link>
        {/* link to sign-up page */}
        <Link href="/signup" legacyBehavior>
          <a style={{
            margin: 8,
            padding: '12px 24px',
            background: '#10b981',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 8,
            fontWeight: 600
          }}>
            Sign Up
          </a>
        </Link>
      </div>
    </main>
  );
}
