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
    <form onSubmit={handleSubmit} className="space-y-4">>
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name:</label>
        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name:</label>
        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Brown Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">Graduation Year:</label>
        <select id="graduationYear" name="graduationYear" value={formData.graduationYear} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option value="">Select Year</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div>
        <input type="checkbox" id="isServiceProvider" name="isServiceProvider" checked={formData.isServiceProvider} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
        <label htmlFor="isServiceProvider" className="ml-2 block text-sm text-gray-900">I want to be a service provider (mover/packer)</label>
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
        label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number (optional):</label>
        <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-300"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
