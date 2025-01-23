import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddData, useLoggersPlantsGroup } from '../../../hooks';

export function AddPowerPlantDetails({ apiEndPoint }) {
  const { loggerPlantsGroup } = useLoggersPlantsGroup();
  const [resourceChoices, setResourceChoices] = useState([]);
  const [errors, setErrors] = useState({}); // State to store field-specific errors
  const [generalError, setGeneralError] = useState(''); // State for general form error message
  
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { savePlantData, loading, error } = useAddData(apiEndPoint);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    system_id: '',
    system_name: '',
    customer_name: '',
    country_name: '',
    resource: '',
    capacity_ac: '',
    capacity_dc: '',
    latitude: '',
    longitude: '',
    altitude: '',
    azimuth: '',
    tilt: '',
    location: ''
  });

  useEffect(() => {
    const fetchResourceChoices = async () => {
      try {
        const response = await fetch(`${baseUrl}/core/power-plant-resource-choices/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        const data = await response.json();
        if (data.resource_choices) {
          setResourceChoices(Object.entries(data.resource_choices));
        }
      } catch (error) {
        console.error('Error fetching resource choices:', error);
      }
    };

    fetchResourceChoices();
  }, [baseUrl, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear the error when the user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setGeneralError(''); // Clear general error when user changes any input
  };

  const validateForm = () => {
    const newErrors = {};

    // Check for required fields
    ['system_id', 'system_name', 'customer_name', 'country_name', 'resource','group', 'capacity_dc', 'latitude', 'longitude', 'altitude', 'azimuth', 'tilt'].forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const success = await savePlantData(formData);
    if (success) {
      navigate('/list-add');
    } else {
      // Set a general error message if save fails
      setGeneralError('An error occurred while saving. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/list-add');
  };

  return (
    <div className="second-content">
      <div className="sticky-part">
        <h5 className='text-center'>Add New Plant Details</h5>
      </div>
      <div className="mt-2 p-1 border shadow-sm rounded bg-light"  > 
        <div className="mt-3"  style={{ maxWidth: '600px', width: '100%', marginLeft:'25%' }}>
          {/* System ID */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">System ID <span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-8">
              <input
                type="text"
                name="system_id"
                value={formData.system_id}
                onChange={handleChange}
                className="form-control"
                required
              />
              {errors.system_id && <small className="text-danger">{errors.system_id}</small>}
            </div>
          </div>

          {/* System Name */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">System Name <span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-8">
              <input
                type="text"
                name="system_name"
                value={formData.system_name}
                onChange={handleChange}
                className="form-control"
                required
              />
              {errors.system_name && <small className="text-danger">{errors.system_name}</small>}
            </div>
          </div>

          {/* Group Dropdown */}
          <div className="form-group row mt-2">
              <label className="col-md-4 col-form-label">Group <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-8"> 
                <select
                    name="group"
                    value={formData.group}
                    onChange={handleChange}
                    className="form-control"
                    required
                >
                    <option value="">Select Group</option>
                    {loggerPlantsGroup && loggerPlantsGroup.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.group_name}
                        </option>
                    ))}
                </select>
                {errors.group && <small className="text-danger">{errors.group}</small>}
              </div>
            </div>

          {/* Customer Name */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Customer Name <span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-8">
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                className="form-control"
                required
              />
              {errors.customer_name && <small className="text-danger">{errors.customer_name}</small>}
            </div>
          </div>

          {/* Country Name */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Country Name <span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-8">
              <input
                type="text"
                name="country_name"
                value={formData.country_name}
                onChange={handleChange}
                className="form-control"
                required
              />
              {errors.country_name && <small className="text-danger">{errors.country_name}</small>}
            </div>
          </div>

          {/* Resource */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Resource <span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-8">
              <select
                name="resource"
                value={formData.resource}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select Resource</option>
                {resourceChoices && resourceChoices.length > 0 ? (
                  resourceChoices.map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No resources available</option>
                )}
              </select>
              {errors.resource && <small className="text-danger">{errors.resource}</small>}
            </div>
          </div>

          {/* Capacity AC (optional) */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Capacity AC (kW)</label>
            <div className="col-md-8">
              <input
                type="number"
                name="capacity_ac"
                value={formData.capacity_ac}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          {/* Capacity DC */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Capacity DC (kW) <span style={{ color: 'red' }}>*</span></label>
              <div className="col-md-8">
                <input
                  type="number"
                  name="capacity_dc"
                  value={formData.capacity_dc}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
                {errors.capacity_dc && <small className="text-danger">{errors.capacity_dc}</small>}
            </div>
          </div>

          {/* Latitude */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Latitude <span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-8">
              <input
                type="number"
                step="0.000001"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="form-control"
                required
              />
              {errors.latitude && <small className="text-danger">{errors.latitude}</small>}
            </div>
          </div>

          {/* Longitude */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Longitude <span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-8">
              <input
                type="number"
                step="0.000001"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="form-control"
                required
              />
              {errors.longitude && <small className="text-danger">{errors.longitude}</small>}
            </div>
          </div>

          {/* Altitude */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Altitude (m) <span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-8">
              <input
                type="number"
                name="altitude"
                value={formData.altitude}
                onChange={handleChange}
                className="form-control"
                required
              />
              {errors.altitude && <small className="text-danger">{errors.altitude}</small>}
            </div>
          </div>

          {/* Azimuth */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Azimuth (degrees) <span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-8">
              <input
                type="number"
                name="azimuth"
                value={formData.azimuth}
                onChange={handleChange}
                className="form-control"
                required
              />
              {errors.azimuth && <small className="text-danger">{errors.azimuth}</small>}
            </div>
          </div>

          {/* Tilt */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Tilt (degrees) <span style={{ color: 'red' }}>*</span></label>
            <div className="col-md-8">
              <input
                type="number"
                name="tilt"
                value={formData.tilt}
                onChange={handleChange}
                className="form-control"
                required
              />
              {errors.tilt && <small className="text-danger">{errors.tilt}</small>}
            </div>
          </div>

          {/* Location (optional) */}
          <div className="form-group row mt-2">
            <label className="col-md-4 col-form-label">Location</label>
            <div className="col-md-8">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          {/* Save and Cancel buttons */}
          <div className="text-center mt-3">
            <button className="btn btn-primary " onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>&nbsp;&nbsp;
            <button className="btn btn-secondary " onClick={handleCancel}>
              Cancel
            </button>
          </div>
          {/* General error message below buttons */}
          {error && (
            <div className="text-danger text-center mt-3">
              {error}
            </div>
          )}
          {generalError && (
            <div className="text-danger text-center mt-3">
              {generalError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
