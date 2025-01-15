import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { GrUpdate } from 'react-icons/gr';
import { IoMdAdd } from 'react-icons/io';
import { useTitle, useEditData, useLoggersPlantsGroup } from '../../hooks';
import Decimal from 'decimal.js';

export function ListPowerPlantDetails({ apiEndPoint, title }) {
  const navigate = useNavigate();
  const { loggerPlantsGroup } = useLoggersPlantsGroup();
  useTitle(title);
  const {
    listData: plantsData,
    loading,
    error,
    editState,
    handleEdit,
    handleInputChange,
    handleSave,
  } = useEditData(apiEndPoint);

  const [resourceChoices, setResourceChoices] = useState([]);
  // Use the environment variables for token and base URL
  const token = process.env.REACT_APP_API_TOKEN;
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Fetch resource choices from the API with token
  useEffect(() => {
    const fetchResourceChoices = async () => {
      try {
        const response = await fetch(`${baseUrl}/power-plant-resource-choices/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,  // Use the token from the environment variable
            
          },
        });
        const data = await response.json();
        if (data.resource_choices) {
          setResourceChoices(Object.entries(data.resource_choices));  // Assuming the API returns the choices in the "resource_choices" field
        }
      } catch (error) {
        console.error('Error fetching resource choices:', error);
      }
    };

    fetchResourceChoices();
  }, [apiEndPoint, baseUrl, token]);


  const handleAddClick = () => {
    navigate('/add-plant-details'); // Navigate to the add plant page
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;


  return (
    <div className="container">
      <h5 className="text-center">Plants Details</h5>
      <div className="d-flex justify-content-end mb-1">
        <span className="btn btn-sm btn-outline-primary" onClick={handleAddClick}>
          <IoMdAdd />
        </span>
      </div>
  
      <div className="border shadow-sm rounded bg-light " style={{ height: "500px", marginBottom: "20px", overflowY: 'auto' }}>
        {plantsData && plantsData.length > 0 ? (
          <table className="table  table-bordered table-striped text-center list-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>System ID</th>
                <th>System Name</th>
                <th>Customer Name</th>
                <th>Country</th>
                <th>Resource</th>
                <th>Capacity DC</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Altitude</th>
                <th>Azimuth</th>
                <th>Tilt</th>
                <th>Group</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {plantsData.map((plant, index) => (
                <tr key={plant.id}>
                  <td>{index + 1}</td>
                  {['system_id', 'system_name', 'customer_name', 'country_name', 'resource', 'capacity_dc', 'latitude', 'longitude', 'altitude', 'azimuth', 'tilt'].map((field, idx) => (
                    <td key={idx}>
                      {editState.editingIndex === index ? (
                        field === 'resource' ? (
                          <select
                            value={editState.originalValues[field] || plant[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                          >
                            {resourceChoices.map(([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={editState.originalValues[field] || plant[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                          />
                        )
                      ) : (
                        field === 'capacity_dc' ? `${plant[field]}` :
                        field === 'longitude' || field === 'latitude' ? new Decimal(plant[field]).toFixed(6) :
                        field === 'altitude' || field === 'azimuth' || field === 'tilt' ? new Decimal(plant[field]).toFixed(2) :
                        plant[field] || 'N/A'
                      )}
                    </td>
                  ))}
                  <td>
                    {editState.editingIndex === index ? (
                      <select
                        name="group"
                        value={editState.originalValues.group} // Holds the group ID
                        onChange={(e) => handleInputChange('group', e.target.value)}
                      >
                        {loggerPlantsGroup.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.group_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      // Display group name based on group ID
                      loggerPlantsGroup && (loggerPlantsGroup.find(group => group.id === plant.group)?.group_name || 'N/A')
                    )}
                  </td>
                  <td>{new Date(plant.updated_at).toLocaleString()}</td>
                  <td>
                    {editState.editingIndex === index ? (
                      <GrUpdate
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSave(index, plant.id)}
                      />
                    ) : (
                      <MdEdit
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(index, plant)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No plant details available</p>
        )}
      </div>
    </div>

  );
}
