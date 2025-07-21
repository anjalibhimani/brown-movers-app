'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, [router]);
  return (
    <div>
      <h1>Redirecting to Login...</h1>
      <p>If you are not redirected, please click <a href="/login">here</a>.</p>
    </div>
  );
}