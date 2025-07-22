'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SignUpForm from './components/SignUpForm';

export default function SignUpPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (formData) => {
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        graduationYear: parseInt(formData.graduationYear),
        password: formData.password,
        isServiceProvider: formData.isServiceProvider,
        servicesOffered: formData.isServiceProvider ? formData.servicesOffered : [],
        hourlyRate: formData.isServiceProvider ? parseFloat(formData.hourlyRate) : 0.0,
        thirtyMinRate: formData.isServiceProvider ? parseFloat(formData.thirtyMinRate) : 0.0,
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, payload);

      if (response.status === 201) {
        alert('Registration successful! Please log in.');
        router.push('/login');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || 'Registration failed. Please try again.');
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
      <h2>Create Your Brown Moving Account</h2>
      <SignUpForm onSubmit={handleSignUp} error={error} loading={loading} />
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}
