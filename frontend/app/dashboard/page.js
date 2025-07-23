# display welcome page for logged-in users with links to view all movers, upadete profile, etc

import Link from 'next/link';

/**
 * renders main dashboard page for user once logged in, and provides links to navigate to other pages in the web app
 *
 * @returns {JSX.Element} - the rendered dashboard component
 */

export default function Dashboard() {
    return (
      <div>
        <h1>Welcome to your Dashboard!</h1>
        <p>You are logged in.</p>
    
        {/* link that takes user to page to view all registered movers*/}
        <Link href="/movers" legacyBehavior>
          <a style={{
            display: 'inline-block',
            marginTop: 24,
            padding: '12px 32px',
            background: '#4f46e5',
            color: '#fff',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: 18,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            View Movers
          </a>
        </Link>
        
        {/* link that takes user to page where they can update their profile info */}
        <Link href="/profile/update" legacyBehavior>
          <a style={{
            display: 'inline-block',
            marginTop: 24,
            marginLeft: 16,
            padding: '12px 32px',
            background: '#f59e0b',
            color: '#fff',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: 18,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            Update Profile
          </a>
        </Link>
      </div>
    );
  }
