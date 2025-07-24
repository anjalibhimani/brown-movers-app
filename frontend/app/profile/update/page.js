'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import UpdateForm from './components/UpdateForm';

export default function UpdateProfilePage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUserData(response.data);
      })
      .catch(err => {
        setError('Failed to fetch user data.');
        router.push('/login');
      });
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleUpdate = async (formData) => {
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/user/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/dashboard');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || 'Update failed. Please try again.');
      } else if (err.request) {
        setError('No response from server. Please check your internet connection or try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (!userData) {
    return<div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Update Your Profile</h2>
        <UpdateForm
          onSubmit={handleUpdate}
          error={error}
          loading={loading}
          initialData={userData}
        />
      </div>
    </div>
  );
}
