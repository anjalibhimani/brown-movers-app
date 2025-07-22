export default function ServiceProviderFields({ formData, handleChange, handleServiceChange }) {
  return (
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
  );
}
