'use client';
import { useState, useEffect } from 'react';
import ServiceProviderFields from '../../../signup/components/ServiceProviderFields';

export default function UpdateForm({ onSubmit, error, loading, initialData }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    graduationYear: '',
    isServiceProvider: false,
    servicesOffered: [],
    hourlyRate: 0.0,
    thirtyMinRate: 0.0,
    phoneNumber: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.first_name || '',
        lastName: initialData.last_name || '',
        email: initialData.email || '',
        graduationYear: initialData.graduation_year || '',
        isServiceProvider: initialData.is_service_provider || false,
        servicesOffered: initialData.services_offered || [],
        hourlyRate: initialData.hourly_rate || 0.0,
        thirtyMinRate: initialData.thirty_min_rate || 0.0,
        phoneNumber: initialData.phone_number || '',
      });
    }
  }, [initialData]);

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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if(Array.isArray(value)) {
        value.forEach(v => data.append(key,v))
      } else {
        data.append(key, value);
      }
    });
    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }
    onSubmit(data);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
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
        <input type="checkbox" id="isServiceProvider" name="isServiceProvider" checked={formData.isServiceProvider} onChange={handleChange} />
        <label htmlFor="isServiceProvider">I want to be a service provider (mover/packer)</label>
      </div>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Profile'}</button>
    </form>
  );
}
