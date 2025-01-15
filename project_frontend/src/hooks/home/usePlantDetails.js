import { useState, useEffect } from 'react';
import axios from 'axios';

export const usePlantDetails = () => {
    const apiEndPoint = 'power-plant-detail'
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = process.env.REACT_APP_API_TOKEN;
    const url = `${process.env.REACT_APP_BASE_URL}/${apiEndPoint}`;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch logger names from the main API endpoint
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                setData(response.data); // Save the fetched data
            } catch (error) {
                console.error('Error fetching data:', error.message || error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url, token]); // Dependencies: run effect when url or token changes

    return { data, loading, error }; // Return fetched data, loading state, and error
};
