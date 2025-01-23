import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Ensure axios is installed
import { SearchBox } from '../index';

import { usePlantList, useIndivisualUtilityData } from '../../../hooks';

import { FaRegCircleXmark } from "react-icons/fa6";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RiEdit2Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";

export function UpdateDailyProductions({ apiEndPoint }) {
  const token = localStorage.getItem('token'); // Ensure your token is correctly set
  const baseUrl = process.env.REACT_APP_BASE_URL;

  const [searchParams, setSearchParams] = useState({ formattedDate: '', plantIds: [] });
  const [plantIds, setPlantIds] = useState([]);
  const { plantsData, error: plantError, loading: plantLoading } = usePlantList();
  const { data, error, loading } = useIndivisualUtilityData(apiEndPoint, searchParams);

  // State to track which row is being edited and the original value
  const [editState, setEditState] = useState({ editingIndex: null, originalValue: '', currentItem: null });

  // Local data state
  const [localData, setLocalData] = useState([]);

  // Extract plant IDs after the data has been fetched
  useEffect(() => {
    if (plantsData && plantsData.length > 0) {
      const fetchedPlantIds = plantsData.map(plant => plant.plant_id);
      setPlantIds(fetchedPlantIds); // Update the plantIds state
    }
  }, [plantsData]);

  // Sync localData with fetched data only when data initially changes
  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  // Handle search parameters update
  const handleSearch = useCallback((params) => {
    setSearchParams(params); // Update the state
  }, []);

  // Handle loading and error states
  if (plantLoading) return <p>Loading...</p>;
  if (plantError) return <p>Error loading data: {plantError?.message}</p>;

  // Handle click of the Edit button
  const handleEdit = (index, currentItem) => {
    setEditState({ editingIndex: index, originalValue: currentItem.power_production_kwh, currentItem });
  };

  // Handle click of the Update button
  const handleUpdate = async (index, id) => {
    const updatedValue = editState.originalValue;

    try {
      const updateUrl = `${baseUrl}/core/${apiEndPoint}/${id}/`; // Adjust the URL as needed

      // Send the PATCH request to the server to update `power_production_kwh`
      const response = await axios.patch(updateUrl, {
        power_production_kwh: updatedValue
      }, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // Extract the updated object from the response
      const updatedItem = response.data;  // This should be the updated object returned by the server

      // Update the local state with the updated object
      const updatedData = localData.map((item, idx) =>
        idx === index ? { ...item, ...updatedItem } : item  // Replace the entire object with the updated one
      );

      // Reset editing state (optional)
      setEditState({ editingIndex: null, originalValue: '', currentItem: null });

      // Update the local data with the full updated object
      setLocalData(updatedData);

      console.log('Update successful:', updatedItem);  // Optional: to check the updated object

    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  // Handle change in input field
  const handleInputChange = (value) => {
    setEditState((prev) => ({ ...prev, originalValue: value }));
  };

  return (
    <div>
      <h6>Update Daily Productions Data</h6>
      <SearchBox
        loggerNames={plantIds}
        onSearch={handleSearch}
        searchParams={searchParams}
      />

      {/* Display loading state */}
      {loading && <p>Loading data...</p>}

      {/* Display error if any */}
      {error && <p style={{ color: 'red' }}>Error fetching data: {error.message}</p>}

      {/* Display data */}
      {localData.length > 0 ? (
        <div className="data-section">
          <table className="table text-center th-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Plant ID</th>
                <th>Power Production (kWh)</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Update At</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {localData.map((item, index) => (
                <tr key={item.id}>
                  <td>{item.production_date}</td>
                  <td>{item.plant_id}</td>

                  {/* Conditionally render input or text based on edit state */}
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="number"
                        value={editState.originalValue || item.power_production_kwh}
                        onChange={(e) => handleInputChange(e.target.value)}
                      />
                    ) : (
                      item.power_production_kwh
                    )}
                  </td>
                  <td>
                    {item.status ? (
                      <IoIosCheckmarkCircleOutline style={{ color: 'green' }} />
                    ) : (
                      <FaRegCircleXmark style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>{new Date(item.created_at).toLocaleString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    hour12: true
                  })}</td>
                  <td>{new Date(item.updated_at).toLocaleString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    hour12: true
                  })}</td>
                  <td>{item.user}</td>

                  {/* Conditionally render Edit or Update icon */}
                  <td>
                    {editState.editingIndex === index ? (
                      <GrUpdate
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleUpdate(index, item.id)}
                      />
                    ) : (
                      <RiEdit2Fill
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(index, item)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available or loading...</p>
      )}
    </div>
  );
}
