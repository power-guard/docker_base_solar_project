import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Header, Sidebar } from '../components';
import LoginPage from '../pages/loginPage/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import {
  Home,
  SolarData,
  ModifyDataPage,
  UtilityHome,
  CurtailmentHome,
  CurtailmentAdd,
  ListAddHome,
  WeatherHome,
} from '../pages';
import {
  AddPowerPlantDetails,
  AddLoggerPlantGroup,
  AddLoggerCategory,
  AddUtilityPlantId,
} from '../pages/systemList';

import './MainLayout.css';

const AllRoutes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token'); // Check token in localStorage
    setIsLoggedIn(!!token); // Set login status based on token existence
  }, []);

  return (
    <Router>
      <div className="main-layout">
        {/* Header is always visible */}
        <Header />
        <div className="content">
          {/* Sidebar is conditionally displayed */}
          {isLoggedIn && <Sidebar />}
          <main className={`main-content ${!isLoggedIn ? 'full-width' : ''}`}>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home title="Power Guard - Home" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/solar-data"
                element={
                  <ProtectedRoute>
                    <SolarData apiEndPoint="logger-power-gen" title="Solar-Data-Graph" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-update"
                element={
                  <ProtectedRoute>
                    <ModifyDataPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/utility-data"
                element={
                  <ProtectedRoute>
                    <UtilityHome title="Utility-billing-Data" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/curtailment-data"
                element={
                  <ProtectedRoute>
                    <CurtailmentHome apiEndPoint="curtailment-event" title="Curtailment-Data" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/curtailment-add"
                element={
                  <ProtectedRoute>
                    <CurtailmentAdd apiEndPoint="curtailment-event" title="Curtailment-Data-Add" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/list-add"
                element={
                  <ProtectedRoute>
                    <ListAddHome title="List-Add-data" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-plant-details"
                element={
                  <ProtectedRoute>
                    <AddPowerPlantDetails apiEndPoint="power-plant-detail" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-plant-logger-group"
                element={
                  <ProtectedRoute>
                    <AddLoggerPlantGroup apiEndPoint="loggers-plants-group" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-logger-category"
                element={
                  <ProtectedRoute>
                    <AddLoggerCategory apiEndPoint="loggercategories" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-utility-plant"
                element={
                  <ProtectedRoute>
                    <AddUtilityPlantId apiEndPoint="utility-plants-list" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/weather-data"
                element={
                  <ProtectedRoute>
                    <WeatherHome title="Weather Data" />
                  </ProtectedRoute>
                }
              />

              {/* Default Route */}
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default AllRoutes;
