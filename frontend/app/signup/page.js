// deals with logic for user sign-up page like API call

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SignUpForm from './components/SignUpForm';

/**
 * main page component for user to register, deals with API request, sign-up state, etc 
 *
 * @returns {JSX.Element} - rendered sign-up page for user
 */

export default function SignUpPage() {
  // states to store error messages, loading status
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // hook to route to correct page once signed up properly
  const router = useRouter();

  /**
   * deals with sign-up form submission by sending suer's submitted data to backend API
   *
   * @param {FormData} formData - user's registration data
   * @returns {Promise<void>} 
   */
  
  async function handleSignUp(formData){

    // clear old errors start loading state
    setError('');
    setLoading(true);

    // try to make POST request to register endpoint using axios with formData as body
    try {
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, formData);

      // if succesful tell user and take the to login page, else if errors then set error state accordingly 
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
      // once loading done, change back to false
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
        {/* render SignUpForm component, pass handler and states as props
        */}
        <SignUpForm onSubmit={handleSignUp} error={error} loading={loading} />
      </div>
    </div>
  );
}
