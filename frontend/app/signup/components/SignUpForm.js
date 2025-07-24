'use client';
import { useState } from 'react';
import ServiceProviderFields from './ServiceProviderFields';

/**
 * form component for new user singups
 *
 * @param {function(FormData): void} props.onSubmit - callback function when form submitted
 * @param {string} props.error - error message for form
 * @param {boolean} props.loading - flag indicating if form submitting 
 * @returns {JSX.Element} - rendered sign-up form.
 */

export default function SignUpForm({ onSubmit, error, loading }) {

  // state to deal with input fields in the form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    graduationYear: '',
    password: '',
    confirmPassword: '',
    isServiceProvider: false,
    servicesOffered: [],
    hourlyRate: 0.0,
    thirtyMinRate: 0.0,
    phoneNumber: '', 
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [formError, setFormError] = useState('');

  /**
   * generic handler for text inputs, selects, checkbox of if over or not
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - input change event
   */
  
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    // update fields in state
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // if the user unchecks box, clear fields for mover info
    if (name === 'isServiceProvider' && !checked) {
      setFormData(prev => ({
        ...prev,
        servicesOffered: [],
        hourlyRate: 0.0,
        thirtyMinRate: 0.0,
      }));
    }
  };

  /**
   * deals with changes in service type checkboxes
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - checkbox change event
   */
  
  function handleServiceChange(e) {
    const { value, checked } = e.target;
    // add/remove service from list based on if box checked or not
    setFormData(prev => {
      const currentServices = prev.servicesOffered;
      if (checked) {
        return { ...prev, servicesOffered: [...currentServices, value] };
      } else {
        return { ...prev, servicesOffered: currentServices.filter(service => service !== value) };
      }
    });
  };

  /**
   * deals with file input changes in event for the profile picture
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - file input change event
   */
  
  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  /**
   * deals with submission of form, creates FormData object and calls on onsubmit function 
   *
   * @param {React.FormEvent<HTMLFormElement>} e - form submission event
   */

  function handleSubmit(e) {
    // prevent auto broswer reloading 
    e.preventDefault();
    setFormError('');

    // confirm password 
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match.'); 
      return; // Stop the submission
    }
    
    const data = new FormData();

    // loop through every key in formData but skip past confirm password 
    for (const key in formData) {
      if (key !== 'confirmPassword') {
        const value = formData[key];
        // if arra like services offered then append individual vals
        if (Array.isArray(value)) {
          value.forEach(v => data.append(key, v));
        } else {
          data.append(key, value);
        }
      }
    }

    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }
    onSubmit(data);
  };

  // generate options for the grad year dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <form onSubmit={handleSubmit}>
      {/* display all the basic sign up field */}
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="email">Brown Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="graduationYear">Graduation Year:</label>
        <select id="graduationYear" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required>
          <option value="">Select Year</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      {/* Add the Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
      </div>
      <div>
        <input type="checkbox" id="isServiceProvider" name="isServiceProvider" checked={formData.isServiceProvider} onChange={handleChange} />
        <label htmlFor="isServiceProvider">I want to be a service provider (mover/packer)</label>
      </div>
      {/* if check boxes for being a mover, then ask for additonal form data*/}
      {formData.isServiceProvider && (
        <ServiceProviderFields 
          formData={formData} 
          handleChange={handleChange} 
          handleServiceChange={handleServiceChange} 
          handleFileChange={handleFileChange}
        />
      )}
      <div>
        <label htmlFor="phoneNumber">Phone Number (optional):</label>
        <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
      </div>
       {/* display API errors, even local errors of password issues, and submit button for user */}
      {formError && <p style={{ color: 'red' }}>{formError}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Sign Up'}</button>
    </form>
  );
}
