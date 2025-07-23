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
    <form onSubmit={handleSubmit}>
      {/* email and password input fields for user, with types to ensure emails and passwords are being entered */}
      <div>
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
      </div>
      {/* display potential login error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* disable submit button while system processing the login request */}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging In...' : 'Login'}
      </button>
    </form>
  );
}
