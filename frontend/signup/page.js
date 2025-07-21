'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
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
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (name === 'isServiceProvider' && !checked) {
      setFormData(prev => ({
        ...prev,
        servicesOffered: [],
        hourlyRate: 0.0,
        thirtyMinRate: 0.0,
      }));
    }
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentServices = prev.servicesOffered;
      if (checked) {
        return { ...prev, servicesOffered: [...currentServices, value] };
      } else {
        return { ...prev, servicesOffered: currentServices.filter(service => service !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div>
      <h2>Create Your Brown Moving Account</h2>
      <form onSubmit={handleSubmit}>
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
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div>
          <input type="checkbox" id="isServiceProvider" name="isServiceProvider" checked={formData.isServiceProvider} onChange={handleChange} />
          <label htmlFor="isServiceProvider">I want to be a service provider (mover/packer)</label>
        </div>
        {formData.isServiceProvider && (
          <div>
            <h3>Service Provider Details</h3>
            <div>
              <label>Services Offered:</label>
              <div>
                <label>
                  <input type="checkbox" name="servicesOffered" value="Move Boxes" checked={formData.servicesOffered.includes('Move Boxes')} onChange={handleServiceChange} /> Move Boxes
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" name="servicesOffered" value="Help Pack" checked={formData.servicesOffered.includes('Help Pack')} onChange={handleServiceChange} /> Help Pack
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="hourlyRate">Hourly Rate ($):</label>
              <input type="number" id="hourlyRate" name="hourlyRate" step="0.01" min="0" value={formData.hourlyRate} onChange={handleChange} required={formData.isServiceProvider} />
            </div>
            <div>
              <label htmlFor="thirtyMinRate">30-Minute Rate ($):</label>
              <input type="number" id="thirtyMinRate" name="thirtyMinRate" step="0.01" min="0" value={formData.thirtyMinRate} onChange={handleChange} required={formData.isServiceProvider} />
            </div>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Sign Up'}</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}