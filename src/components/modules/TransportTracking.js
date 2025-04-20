import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Mock data for vehicles from previous module (simplified)
const vehiclesData = [
  { 
    id: 1, 
    registrationNumber: 'TN01AB1234', 
    type: 'Bus',
    route: 'Route 1 - North City',
    driver: 'Ramesh Kumar',
    driverContact: '9876543210',
    lastUpdated: new Date().toISOString(),
    status: 'active',
    currentLocation: { lat: 13.0827, lng: 80.2707 } // Chennai coordinates
  },
  { 
    id: 2, 
    registrationNumber: 'TN01CD5678', 
    type: 'Bus',
    route: 'Route 2 - South City',
    driver: 'Suresh Singh',
    driverContact: '9876543211',
    lastUpdated: new Date().toISOString(),
    status: 'active',
    currentLocation: { lat: 13.0622, lng: 80.2230 }
  },
  { 
    id: 3, 
    registrationNumber: 'TN01EF9012', 
    type: 'Van',
    route: 'Route 3 - East Suburb',
    driver: 'Dinesh Patel',
    driverContact: '9876543212',
    lastUpdated: new Date().toISOString(),
    status: 'maintenance',
    currentLocation: { lat: 13.1032, lng: 80.2952 }
  },
  { 
    id: 4, 
    registrationNumber: 'TN01GH3456', 
    type: 'Bus',
    route: 'Route 4 - West Suburb',
    driver: 'Prakash Reddy',
    driverContact: '9876543213',
    lastUpdated: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    status: 'active',
    currentLocation: { lat: 13.0487, lng: 80.2189 }
  }
];

// Mock journey logs
const journeyLogsData = [
  { 
    id: 1, 
    vehicleId: 1, 
    date: '2025-04-19', 
    startTime: '07:15', 
    endTime: '08:45',
    startOdometer: 12450,
    endOdometer: 12472,
    status: 'completed',
    notes: 'Morning pickup run completed on time'
  },
  { 
    id: 2, 
    vehicleId: 1, 
    date: '2025-04-19', 
    startTime: '14:30', 
    endTime: '16:00',
    startOdometer: 12472,
    endOdometer: 12494,
    status: 'completed',
    notes: 'Afternoon drop completed with slight delay due to traffic'
  },
  { 
    id: 3, 
    vehicleId: 2, 
    date: '2025-04-19', 
    startTime: '07:00', 
    endTime: '08:30',
    startOdometer: 8320,
    endOdometer: 8345,
    status: 'completed',
    notes: 'Normal operation'
  },
  { 
    id: 4, 
    vehicleId: 4, 
    date: '2025-04-20', 
    startTime: '07:10', 
    endTime: null,
    startOdometer: 5620,
    endOdometer: null,
    status: 'in-progress',
    notes: 'Morning pickup run'
  }
];

function TransportTracking() {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState(vehiclesData);
  const [journeyLogs, setJourneyLogs] = useState(journeyLogsData);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddJourneyForm, setShowAddJourneyForm] = useState(false);
  const [showEndJourneyForm, setShowEndJourneyForm] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [activeTab, setActiveTab] = useState('tracking');
  const [newJourney, setNewJourney] = useState({
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    startOdometer: '',
    notes: ''
  });
  const [endJourneyData, setEndJourneyData] = useState({
    journeyId: '',
    endTime: '',
    endOdometer: '',
    notes: ''
  });

  // Update vehicle locations every few seconds (simulation)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => {
          if (vehicle.status !== 'active') return vehicle;
          
          // Only update active vehicles
          // Simulate small movement
          const latChange = (Math.random() - 0.5) * 0.001;
          const lngChange = (Math.random() - 0.5) * 0.001;
          
          return {
            ...vehicle,
            lastUpdated: new Date().toISOString(),
            currentLocation: {
              lat: vehicle.currentLocation.lat + latChange,
              lng: vehicle.currentLocation.lng + lngChange
            }
          };
        })
      );
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Filter vehicles based on filter
  const filteredVehicles = vehicleFilter
    ? vehicles.filter(vehicle => 
        vehicle.registrationNumber.includes(vehicleFilter) || 
        vehicle.route.toLowerCase().includes(vehicleFilter.toLowerCase())
      )
    : vehicles;

  // Get in-progress journeys
  const activeJourneys = journeyLogs.filter(journey => journey.status === 'in-progress');
  
  // Format time since last update
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffMs = now - updateTime;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    
    if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
      return `${diffMin} minutes ago`;
    } else {
      return updateTime.toLocaleTimeString();
    }
  };

  // Handle journey form input changes
  const handleJourneyInputChange = (e) => {
    const { name, value } = e.target;
    setNewJourney({
      ...newJourney,
      [name]: value
    });
  };

  // Handle end journey form input changes
  const handleEndJourneyInputChange = (e) => {
    const { name, value } = e.target;
    setEndJourneyData({
      ...endJourneyData,
      [name]: value
    });
  };

  // Start new journey
  const handleStartJourney = (e) => {
    e.preventDefault();
    const id = journeyLogs.length > 0 ? Math.max(...journeyLogs.map(j => j.id)) + 1 : 1;
    const vehicleId = parseInt(newJourney.vehicleId);
    const startOdometer = parseInt(newJourney.startOdometer);
    
    const journeyToAdd = { 
      id, 
      vehicleId,
      date: newJourney.date,
      startTime: newJourney.startTime,
      endTime: null,
      startOdometer,
      endOdometer: null,
      status: 'in-progress',
      notes: newJourney.notes
    };
    
    setJourneyLogs([...journeyLogs, journeyToAdd]);
    setNewJourney({
      vehicleId: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      startOdometer: '',
      notes: ''
    });
    setShowAddJourneyForm(false);
  };

  // End journey
  const handleEndJourney = (e) => {
    e.preventDefault();
    const journeyId = parseInt(endJourneyData.journeyId);
    const endOdometer = parseInt(endJourneyData.endOdometer);
    
    setJourneyLogs(journeyLogs.map(journey => {
      if (journey.id === journeyId) {
        return {
          ...journey,
          endTime: endJourneyData.endTime,
          endOdometer,
          status: 'completed',
          notes: journey.notes + (endJourneyData.notes ? '; ' + endJourneyData.notes : '')
        };
      }
      return journey;
    }));
    
    setEndJourneyData({
      journeyId: '',
      endTime: '',
      endOdometer: '',
      notes: ''
    });
    setShowEndJourneyForm(false);
  };

  // Get vehicle registration by ID
  const getVehicleRegistration = (id) => {
    const vehicle = vehicles.find(vehicle => vehicle.id === id);
    return vehicle ? vehicle.registrationNumber : `Vehicle ${id}`;
  };

  // Get vehicle route by ID
  const getVehicleRoute = (id) => {
    const vehicle = vehicles.find(vehicle => vehicle.id === id);
    return vehicle ? vehicle.route : '';
  };

  return (
    <div className="transport-tracking">
      <h1>{t('tracking.title', 'Transport Tracking System')}</h1>
      
      <div className="module-tabs">
        <button 
          className={`module-tab ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          {t('tracking.liveTracking', 'Live Tracking')}
        </button>
        <button 
          className={`module-tab ${activeTab === 'journeys' ? 'active' : ''}`}
          onClick={() => setActiveTab('journeys')}
        >
          {t('tracking.journeyLogs', 'Journey Logs')}
        </button>
      </div>
      
      {/* Live Tracking Tab */}
      {activeTab === 'tracking' && (
        <div className="tracking-section">
          <div className="section-header">
            <h2>{t('tracking.liveTracking', 'Live Vehicle Tracking')}</h2>
            <div className="header-actions">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder={t('tracking.searchVehicles', 'Search by registration or route')}
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="tracking-container">
            <div className="vehicle-list-panel">
              <h3>{t('tracking.vehicles', 'Vehicles')}</h3>
              <div className="vehicle-list">
                {filteredVehicles.map(vehicle => (
                  <div 
                    key={vehicle.id} 
                    className={`vehicle-list-item ${vehicle.status} ${selectedVehicle === vehicle.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                  >
                    <div className="vehicle-list-header">
                      <span className="vehicle-reg">{vehicle.registrationNumber}</span>
                      <span className={`vehicle-status ${vehicle.status}`}>{vehicle.status}</span>
                    </div>
                    <div className="vehicle-list-details">
                      <div className="vehicle-route">{vehicle.route}</div>
                      <div className="last-updated">
                        {t('tracking.lastUpdated', 'Last updated')}: {getTimeAgo(vehicle.lastUpdated)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="map-container">
              {/* Placeholder for map - in a real application, this would integrate with a mapping API */}
              <div className="map-placeholder">
                <div className="map-header">
                  <h3>{t('tracking.liveMap', 'Live Map')}</h3>
                  <span className="map-info">Showing {filteredVehicles.length} vehicles</span>
                </div>
                <div className="map-content">
                  <div className="map-message">
                    <p>Map integration would be implemented here with a real mapping API (Google Maps, Mapbox, etc.)</p>
                    <p>Vehicle coordinates are being simulated for demonstration purposes.</p>
                  </div>
                  <div className="map-details">
                    {selectedVehicle && (() => {
                      const vehicle = vehicles.find(v => v.id === selectedVehicle);
                      if (!vehicle) return null;
                      
                      return (
                        <div className="selected-vehicle-details">
                          <h4>{vehicle.registrationNumber}</h4>
                          <p><strong>Route:</strong> {vehicle.route}</p>
                          <p><strong>Driver:</strong> {vehicle.driver} ({vehicle.driverContact})</p>
                          <p><strong>Status:</strong> {vehicle.status}</p>
                          <p><strong>Current Location:</strong> Lat: {vehicle.currentLocation.lat.toFixed(4)}, Lng: {vehicle.currentLocation.lng.toFixed(4)}</p>
                          <p><strong>Last Updated:</strong> {getTimeAgo(vehicle.lastUpdated)}</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Journey Logs Tab */}
      {activeTab === 'journeys' && (
        <div className="journeys-section">
          <div className="section-header">
            <h2>{t('tracking.journeyLogs', 'Journey Logs')}</h2>
            <div className="header-actions">
              <button 
                className="add-button"
                onClick={() => setShowAddJourneyForm(!showAddJourneyForm)}
              >
                {t('tracking.startJourney', 'Start Journey')}
              </button>
              <button 
                className="end-button"
                onClick={() => setShowEndJourneyForm(!showEndJourneyForm)}
                disabled={activeJourneys.length === 0}
              >
                {t('tracking.endJourney', 'End Journey')}
              </button>
            </div>
          </div>
          
          {showAddJourneyForm && (
            <div className="add-form">
              <h3>{t('tracking.startJourney', 'Start New Journey')}</h3>
              <form onSubmit={handleStartJourney}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('tracking.vehicle', 'Vehicle')}</label>
                    <select 
                      name="vehicleId" 
                      value={newJourney.vehicleId} 
                      onChange={handleJourneyInputChange} 
                      required
                    >
                      <option value="">--{t('common.select')}--</option>
                      {vehicles.filter(v => v.status === 'active').map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.registrationNumber} ({vehicle.route})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('tracking.date', 'Date')}</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={newJourney.date} 
                      onChange={handleJourneyInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>{t('tracking.startTime', 'Start Time')}</label>
                    <input 
                      type="time" 
                      name="startTime" 
                      value={newJourney.startTime} 
                      onChange={handleJourneyInputChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('tracking.startOdometer', 'Start Odometer Reading (km)')}</label>
                    <input 
                      type="number" 
                      name="startOdometer" 
                      value={newJourney.startOdometer} 
                      onChange={handleJourneyInputChange} 
                      min="0"
                      required 
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>{t('tracking.notes', 'Notes')}</label>
                    <input
                      type="text"
                      name="notes"
                      value={newJourney.notes}
                      onChange={handleJourneyInputChange}
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-button">{t('tracking.start', 'Start Journey')}</button>
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => setShowAddJourneyForm(false)}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {showEndJourneyForm && (
            <div className="add-form">
              <h3>{t('tracking.endJourney', 'End Active Journey')}</h3>
              <form onSubmit={handleEndJourney}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('tracking.journey', 'Select Active Journey')}</label>
                    <select 
                      name="journeyId" 
                      value={endJourneyData.journeyId} 
                      onChange={handleEndJourneyInputChange} 
                      required
                    >
                      <option value="">--{t('common.select')}--</option>
                      {activeJourneys.map(journey => (
                        <option key={journey.id} value={journey.id}>
                          {getVehicleRegistration(journey.vehicleId)} - {journey.date} - Started: {journey.startTime}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('tracking.endTime', 'End Time')}</label>
                    <input 
                      type="time" 
                      name="endTime" 
                      value={endJourneyData.endTime} 
                      onChange={handleEndJourneyInputChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('tracking.endOdometer', 'End Odometer Reading (km)')}</label>
                    <input 
                      type="number" 
                      name="endOdometer" 
                      value={endJourneyData.endOdometer} 
                      onChange={handleEndJourneyInputChange} 
                      min="0"
                      required 
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>{t('tracking.notes', 'Additional Notes')}</label>
                    <input
                      type="text"
                      name="notes"
                      value={endJourneyData.notes}
                      onChange={handleEndJourneyInputChange}
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-button">{t('tracking.end', 'End Journey')}</button>
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => setShowEndJourneyForm(false)}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="journey-logs">
            <h3>{t('tracking.recentJourneys', 'Recent Journeys')}</h3>
            <table className="journey-table">
              <thead>
                <tr>
                  <th>{t('tracking.date')}</th>
                  <th>{t('tracking.vehicle')}</th>
                  <th>{t('tracking.route')}</th>
                  <th>{t('tracking.startTime')}</th>
                  <th>{t('tracking.endTime')}</th>
                  <th>{t('tracking.duration')}</th>
                  <th>{t('tracking.distance')}</th>
                  <th>{t('tracking.status')}</th>
                  <th>{t('tracking.notes')}</th>
                </tr>
              </thead>
              <tbody>
                {journeyLogs.sort((a, b) => {
                  // Sort by date descending, then by start time
                  if (a.date !== b.date) return new Date(b.date) - new Date(a.date);
                  return a.startTime.localeCompare(b.startTime);
                }).map(journey => {
                  // Calculate duration and distance
                  let duration = '-';
                  if (journey.startTime && journey.endTime) {
                    const [startHour, startMin] = journey.startTime.split(':').map(Number);
                    const [endHour, endMin] = journey.endTime.split(':').map(Number);
                    const startMinutes = startHour * 60 + startMin;
                    const endMinutes = endHour * 60 + endMin;
                    let diffMinutes = endMinutes - startMinutes;
                    
                    // Handle overnight journeys
                    if (diffMinutes < 0) diffMinutes += 24 * 60;
                    
                    const hours = Math.floor(diffMinutes / 60);
                    const minutes = diffMinutes % 60;
                    duration = `${hours}h ${minutes}m`;
                  }
                  
                  // Calculate distance
                  let distance = '-';
                  if (journey.startOdometer && journey.endOdometer) {
                    distance = `${journey.endOdometer - journey.startOdometer} km`;
                  }
                  
                  return (
                    <tr key={journey.id} className={`status-${journey.status}`}>
                      <td>{journey.date}</td>
                      <td>{getVehicleRegistration(journey.vehicleId)}</td>
                      <td>{getVehicleRoute(journey.vehicleId)}</td>
                      <td>{journey.startTime}</td>
                      <td>{journey.endTime || '-'}</td>
                      <td>{duration}</td>
                      <td>{distance}</td>
                      <td>
                        <span className={`status-badge ${journey.status}`}>
                          {journey.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                      </td>
                      <td>
                        <div className="journey-notes">{journey.notes}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransportTracking;