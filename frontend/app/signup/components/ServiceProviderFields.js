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
    <div>
      <h3>Service Provider Details</h3>
      <div>
        <label>Services Offered:</label>
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
            />
            <label htmlFor={service}>{service}</label>
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="hourlyRate">Hourly Rate ($):</label>
        <input type="number" id="hourlyRate" name="hourlyRate" step="0.01" min="0" value={formData.hourlyRate} onChange={handleChange} required={formData.isServiceProvider} />
      </div>
      <div>
        <label htmlFor="thirtyMinRate">30-Minute Rate ($):</label>
        <input type="number" id="thirtyMinRate" name="thirtyMinRate" step="0.01" min="0" value={formData.thirtyMinRate} onChange={handleChange} required={formData.isServiceProvider} />
      </div>
      <div>
        <label htmlFor="profilePicture">Profile Picture:</label>
        <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  );
}
