import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed
import { SearchBox } from './index';
import { useTitle, useIndivisualPowerGen, useNotification } from "../../hooks";

import { FaRegCircleXmark } from "react-icons/fa6";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";


import { RiEdit2Fill } from "react-icons/ri";
import { GrUpdate } from "react-icons/gr";



export const UpdatePowerGen = () => {

  const title = "Update Power Gen"
  useTitle(title);

  const apiEndPoint = "logger-power-gen";
  const token = process.env.REACT_APP_API_TOKEN; // Ensure your token is correctly set
  const baseUrl = process.env.REACT_APP_BASE_URL;

  // Initialize search parameters
  const [searchParams, setSearchParams] = useState({ formattedDate: '', selectedLoggers: [] });

  // Fetch data only when searchParams are valid
  const { data, error, loading } = useIndivisualPowerGen(apiEndPoint, searchParams);
  
  // Get logger names for the search box
  const { loggerNames } = useNotification(apiEndPoint);

  // State to track which row is being edited and the original value
  const [editState, setEditState] = useState({ editingIndex: null, originalValue: '', currentItem: null });

  // State for data
  const [localData, setLocalData] = useState(data);

  // Log the fetched data for debugging purposes
  useEffect(() => {
    //console.log("Data fetched:", data);
    setLocalData(data);
  }, [data]);

  // Handle search event and update the searchParams state
  const handleSearch = useCallback((params) => {
    setSearchParams(params);
  }, []);

  // Handle click of the Edit button
  const handleEdit = (index, currentItem) => {
    setEditState({ editingIndex: index, originalValue: currentItem.power_gen, currentItem });
  };

  // Handle click of the Update button
  const handleUpdate = async (index, id) => {
    const updatedValue = editState.originalValue;
    //const { logger_name, date } = editState.currentItem; // Destructure the currentItem for loggerName and date

    // Log the details to the console
    // console.log('Updating Power Gen Data:');
    // console.log(`Logger Name: ${logger_name}`);
    // console.log(`Date: ${date}`);
    // console.log(`ID: ${id}`);
    // console.log(`Updated Power Gen: ${updatedValue}`);

    try {
      const updateUrl = `${baseUrl}/${apiEndPoint}/${id}/`; // Adjust the URL as needed

      // Send the PATCH request to the server to update `power_gen`
      const response = await axios.patch(updateUrl, {
        power_gen: updatedValue
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
      <h6>Power generation list for update.</h6>
      <SearchBox 
        loggerNames={loggerNames} 
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
          <table className="table th-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Logger Name</th>
                <th>Power Generation (kWh)</th>
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
                  <td>{item.date}</td>
                  <td>{item.logger_name}</td>

                  {/* Conditionally render input or text based on edit state */}
                  <td>
                    {editState.editingIndex === index ? (
                      <input
                        type="number"
                        value={editState.originalValue || item.power_gen}
                        onChange={(e) => handleInputChange(e.target.value)}
                      />
                    ) : (
                      item.power_gen
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
};
