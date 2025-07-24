// provides form with email and password fields for logging in

'use client';
import { useState } from 'react';

/**
 * form component for when user logs in 
 *
 * @param {function({email: string, password: string}): void} props.onLogin - callback function to run when form is submitted
 * @param {string} props.error - an error message to put on the form
 * @param {boolean} props.loading - flag indicating if the form is currently submitting or not
 *
 * @returns {JSX.Element} - rendered login form
 */

export default function LoginForm({ onLogin, error, loading }) {
  // states for the email and password user input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   /**
   * deals with the submission of the login form by the user
   *
   * @param {React.FormEvent<HTMLFormElement>} e - the form submission event when submitted by user 
   */
  
  function handleSubmit(e) {
    // block browser's default reloading, and call the onLogin prop function 
    e.preventDefault();
    onLogin({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* email and password input fields for user, with types to ensure emails and passwords are being entered */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email:
        </label>
        <input
          type="email" 
          id="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password:
        </label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {/* display potential login error message */}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
      >
        {loading ? 'Logging In...' : 'Login'}
      </button>
    </form>
  );
}
