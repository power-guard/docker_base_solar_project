import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Header, Sidebar } from '../components';
import { Home, SolarData, ModifyDataPage, UtilityHome, CurtailmentHome, CurtailmentAdd, ListAddHome, WeatherHome } from "../pages";
import {AddPowerPlantDetails, AddLoggerPlantGroup, AddLoggerCategory, AddUtilityPlantId} from '../pages/systemList';


import './MainLayout.css';

export const MainLayout = ({ children }) => {
  return (
    <Router>
      <div className="main-layout">
        <Header />
        <div className="content">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/home" element={<Home title = "Power Guard - Home"/>} />
              <Route path="/Solar-Data" element={<SolarData apiEndPoint= "logger-power-gen" title = "Solar-Data-Graph"/>} />
              <Route path="/add-update" element={<ModifyDataPage />} />
              <Route path="/utility-data" element={<UtilityHome title = "Utility-billing-Data"/>} />
              <Route path="/curtailment-Data" element={<CurtailmentHome apiEndPoint= "curtailment-event" title = "Curtailment-Data"/>} />
              <Route path="/curtailment-add" element={<CurtailmentAdd apiEndPoint= "curtailment-event" title = "Curtailment-Data-Add"/>} />
              <Route path="/list-add" element={<ListAddHome title = "List-Add-data"/>} />

              <Route path="/add-plant-details" element={<AddPowerPlantDetails apiEndPoint="power-plant-detail" />} />
              <Route path="/add-plant-logger-group" element={<AddLoggerPlantGroup apiEndPoint="loggers-plants-group" />} />
              <Route path="/add-logger-category" element={<AddLoggerCategory apiEndPoint="loggercategories" />} />
              <Route path="/add-utlity-plant" element={<AddUtilityPlantId apiEndPoint="utility-plants-list" />} />

              <Route path="/weather-data" element={<WeatherHome title = "Weather Data" />} />

            
 
              <Route path="/" element={<Home title = "Power Guard - Home"/>} />
            </Routes>
            {children}
          </main>
        </div>
      </div>
    </Router>
  );
};