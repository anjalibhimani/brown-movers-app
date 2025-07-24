// renders additional mover fields 

/**
 * Component that renders additional form fields for user who wants to be a mover 
 *
 * @param {object} props.formData - current state of the form data
 * @param {function(React.ChangeEvent<HTMLInputElement>): void} props.handleChange - generic change handler for inputs
 * @param {function(React.ChangeEvent<HTMLInputElement>): void} props.handleServiceChange - specific handler for checkboxes
 * @param {function(React.ChangeEvent<HTMLInputElement>): void} props.handleFileChange - specific handler for file upload
 * 
 * @returns {JSX.Element} - fragment with mover fields
 */

export default function ServiceProviderFields({ formData, handleChange, handleServiceChange, handleFileChange }) {
  // list of available services
  const services = ["Moving", "Packing", "Furniture Assembly", "Storage"];
  
  return (
    <div className="p-4 border border-gray-200 rounded-md space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Service Provider Details</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700">Services Offered:</label>
        <div className="mt-2 space-y-2">
          {/* map over services array to create a checkbox for each */}
          {services.map(service => (
            <div key={service}>
              <input
                type="checkbox"
                id={service}
                name="servicesOffered"
                value={service}
                // Check the box if the service is in the formData's servicesOffered array.
                checked={formData.servicesOffered.includes(service)}
                onChange={handleServiceChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={service} className="ml-2 block text-sm text-gray-900">{service}</label>
          </div>
        ))}
      </div>
    <div>
    <div>
      <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">Hourly Rate ($):</label>
      <input type="number" id="hourlyRate" name="hourlyRate" step="0.01" min="0" value={formData.hourlyRate} onChange={handleChange} required={formData.isServiceProvider} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
        <label htmlFor="thirtyMinRate" className="block text-sm font-medium text-gray-700">30-Minute Rate ($):</label>
        <input type="number" id="thirtyMinRate" name="thirtyMinRate" step="0.01" min="0" value={formData.thirtyMinRate} onChange={handleChange} required={formData.isServiceProvider} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
    </div>
    <div>
        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture:</label>
        <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
    </div>
  </div>
  );
}
