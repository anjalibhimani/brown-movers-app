import Link from 'next/link';

export default function Dashboard() {
    return (
      <div>
        <h1>Welcome to your Dashboard!</h1>
        <p>You are logged in.</p>
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
      </div>
    );
  }
