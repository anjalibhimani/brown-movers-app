/**
 * main page component for user login, handles login state, API reqs, and loginForm component called 
 *
 * @returns {JSX.Element} - the rendered login page
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import LoginForm from './components/LoginForm';

export default function LoginPage() {
  // states for error messages and for the loading state of the page too
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Next.js router 
  const router = useRouter();


  /**
   * handles login form submission
   * @param {Object} loginData - user's login credentials so email and password from form on the app
   * @returns {Promise<void>}
   **/
  
  async function handleLogin(loginData) {
    // initially remove all old errors showing/stored and show loading state 
    setError('');
    setLoading(true);

    // try to let the user login into their claimed 'existing' account
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, loginData);

      const { access_token, user } = response.data;

      // extract token and user data from response
      localStorage.setItem('token', access_token);

      // store the authentication data in the browser's localStorage and send the using to the next page of the dashboard view
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/dashboard');

      // catch errors that occur when the user tries to login
    } catch (err) {
      // server error could not login the user
      if (err.response) {
        setError(err.response.data.msg || 'Login failed. Please check your credentials.');
      // there is a network error no request/response was sent to/from the server
      } else if (err.request) {
        setError('No response from server. Please check your internet connection or try again later.');
      // catch all other errors that could occur 
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      
      // once catch and try done, stop the loading state it is finished 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login to Your Account</h2>
      {/* calls on the handleLogin function when login form submitted, pass down the error and loading states */}
      <LoginForm onLogin={handleLogin} error={error} loading={loading} />

      {/* option to click on singup to take user to sign up page if they don't have an account */}
      <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
}
