'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import LoginForm from './components/LoginForm';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (loginData) => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, loginData);

      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/dashboard');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        setError('No response from server. Please check your internet connection or try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login to Your Account</h2>
      <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
      <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
}
