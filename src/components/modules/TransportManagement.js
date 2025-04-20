import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { students } from '../../mockData/students';

// Mock data for vehicles
const vehiclesData = [
  { 
    id: 1, 
    registrationNumber: 'TN01AB1234', 
    type: 'Bus',
    capacity: 45,
    driver: 'Ramesh Kumar',
    driverContact: '9876543210',
    route: 'Route 1 - North City',
    status: 'active'
  },
  { 
    id: 2, 
    registrationNumber: 'TN01CD5678', 
    type: 'Bus',
    capacity: 40,
    driver: 'Suresh Singh',
    driverContact: '9876543211',
    route: 'Route 2 - South City',
    status: 'active'
  },
  { 
    id: 3, 
    registrationNumber: 'TN01EF9012', 
    type: 'Van',
    capacity: 12,
    driver: 'Dinesh Patel',
    driverContact: '9876543212',
    route: 'Route 3 - East Suburb',
    status: 'maintenance'
  },
  { 
    id: 4, 
    registrationNumber: 'TN01GH3456', 
    type: 'Bus',
    capacity: 45,
    driver: 'Prakash Reddy',
    driverContact: '9876543213',
    route: 'Route 4 - West Suburb',
    status: 'active'
  },
];

// Mock data for stops
const stopsData = [
  { id: 1, routeId: 1, name: 'Central Park', time: '07:30', sequence: 1 },
  { id: 2, routeId: 1, name: 'Market Junction', time: '07:45', sequence: 2 },
  { id: 3, routeId: 1, name: 'Hospital Road', time: '08:00', sequence: 3 },
  { id: 4, routeId: 1, name: 'Temple Street', time: '08:15', sequence: 4 },
  { id: 5, routeId: 2, name: 'Railway Station', time: '07:20', sequence: 1 },
  { id: 6, routeId: 2, name: 'Cinema Hall', time: '07:35', sequence: 2 },
  { id: 7, routeId: 2, name: 'College Road', time: '07:50', sequence: 3 },
  { id: 8, routeId: 3, name: 'Hillside View', time: '07:15', sequence: 1 },
  { id: 9, routeId: 3, name: 'Garden Estate', time: '07:30', sequence: 2 },
  { id: 10, routeId: 4, name: 'Lake Avenue', time: '07:10', sequence: 1 },
  { id: 11, routeId: 4, name: 'Business Park', time: '07:25', sequence: 2 },
  { id: 12, routeId: 4, name: 'Residential Complex', time: '07:40', sequence: 3 },
];

// Mock data for transport allocations
const transportAllocationsData = [
  { id: 1, studentId: 1, vehicleId: 1, stopId: 2, feeStatus: 'paid' },
  { id: 2, studentId: 2, vehicleId: 1, stopId: 3, feeStatus: 'pending' },
  { id: 3, studentId: 3, vehicleId: 2, stopId: 6, feeStatus: 'paid' },
  { id: 4, studentId: 4, vehicleId: 4, stopId: 11, feeStatus: 'paid' },
];

function TransportManagement() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('vehicles');
  const [vehicles, setVehicles] = useState(vehiclesData);
  const [stops, setStops] = useState(stopsData);
  const [allocations, setAllocations] = useState(transportAllocationsData);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [showAddStopForm, setShowAddStopForm] = useState(false);
  const [showAddAllocationForm, setShowAddAllocationForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: '',
    type: 'Bus',
    capacity: 45,
    driver: '',
    driverContact: '',
    route: '',
    status: 'active'
  });
  const [newStop, setNewStop] = useState({
    routeId: '',
    name: '',
    time: '',
    sequence: 1
  });
  const [newAllocation, setNewAllocation] = useState({
    studentId: '',
    vehicleId: '',
    stopId: '',
    feeStatus: 'pending'
  });

  // Filter stops based on selected vehicle route
  const filteredStops = selectedVehicle 
    ? stops.filter(stop => {
        const vehicle = vehicles.find(v => v.id === selectedVehicle);
        const routeId = parseInt(vehicle ? vehicle.id : 0);
        return stop.routeId === routeId;
      })
    : [];

  // Handle vehicle form input changes
  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle({
      ...newVehicle,
      [name]: value
    });
  };

  // Handle stop form input changes
  const handleStopInputChange = (e) => {
    const { name, value } = e.target;
    setNewStop({
      ...newStop,
      [name]: value
    });
  };

  // Handle allocation form input changes
  const handleAllocationInputChange = (e) => {
    const { name, value } = e.target;
    setNewAllocation({
      ...newAllocation,
      [name]: value
    });
    
    // Auto-populate stops dropdown when vehicle is selected
    if (name === 'vehicleId') {
      setSelectedVehicle(parseInt(value));
    }
  };

  // Add new vehicle
  const handleAddVehicle = (e) => {
    e.preventDefault();
    const id = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
    const vehicleToAdd = { id, ...newVehicle };
    setVehicles([...vehicles, vehicleToAdd]);
    setNewVehicle({
      registrationNumber: '',
      type: 'Bus',
      capacity: 45,
      driver: '',
      driverContact: '',
      route: '',
      status: 'active'
    });
    setShowAddVehicleForm(false);
  };

  // Add new stop
  const handleAddStop = (e) => {
    e.preventDefault();
    const id = stops.length > 0 ? Math.max(...stops.map(s => s.id)) + 1 : 1;
    const routeId = parseInt(newStop.routeId);
    const sequence = parseInt(newStop.sequence);
    const stopToAdd = { 
      id, 
      ...newStop,
      routeId,
      sequence 
    };
    setStops([...stops, stopToAdd]);
    setNewStop({
      routeId: '',
      name: '',
      time: '',
      sequence: 1
    });
    setShowAddStopForm(false);
  };

  // Add new allocation
  const handleAddAllocation = (e) => {
    e.preventDefault();
    const id = allocations.length > 0 ? Math.max(...allocations.map(a => a.id)) + 1 : 1;
    const studentId = parseInt(newAllocation.studentId);
    const vehicleId = parseInt(newAllocation.vehicleId);
    const stopId = parseInt(newAllocation.stopId);
    const allocationToAdd = { 
      id, 
      studentId,
      vehicleId,
      stopId,
      feeStatus: newAllocation.feeStatus
    };
    setAllocations([...allocations, allocationToAdd]);
    setNewAllocation({
      studentId: '',
      vehicleId: '',
      stopId: '',
      feeStatus: 'pending'
    });
    setSelectedVehicle(null);
    setShowAddAllocationForm(false);
  };

  // Delete vehicle
  const handleDeleteVehicle = (id) => {
    if (window.confirm('Are you sure?')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      // Also delete related allocations
      setAllocations(allocations.filter(allocation => allocation.vehicleId !== id));
    }
  };

  // Delete stop
  const handleDeleteStop = (id) => {
    if (window.confirm('Are you sure?')) {
      setStops(stops.filter(stop => stop.id !== id));
      // Also delete related allocations
      setAllocations(allocations.filter(allocation => allocation.stopId !== id));
    }
  };

  // Delete allocation
  const handleDeleteAllocation = (id) => {
    if (window.confirm('Are you sure?')) {
      setAllocations(allocations.filter(allocation => allocation.id !== id));
    }
  };

  // Helper to get student name by ID
  const getStudentName = (id) => {
    const student = students.find(student => student.id === id);
    return student ? student.name : `Student ${id}`;
  };

  // Helper to get vehicle registration by ID
  const getVehicleRegistration = (id) => {
    const vehicle = vehicles.find(vehicle => vehicle.id === id);
    return vehicle ? vehicle.registrationNumber : `Vehicle ${id}`;
  };

  // Helper to get stop name by ID
  const getStopName = (id) => {
    const stop = stops.find(stop => stop.id === id);
    return stop ? stop.name : `Stop ${id}`;
  };

  // Helper to get vehicle route by ID
  const getVehicleRoute = (id) => {
    const vehicle = vehicles.find(vehicle => vehicle.id === id);
    return vehicle ? vehicle.route : '';
  };

  return (
    <div className="transport-management">
      <h1>Transport Management</h1>
      
      <div className="module-tabs">
        <button 
          className={`module-tab ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          Vehicles
        </button>
        <button 
          className={`module-tab ${activeTab === 'stops' ? 'active' : ''}`}
          onClick={() => setActiveTab('stops')}
        >
          Stops & Routes
        </button>
        <button 
          className={`module-tab ${activeTab === 'allocations' ? 'active' : ''}`}
          onClick={() => setActiveTab('allocations')}
        >
          Student Allocations
        </button>
      </div>
      
      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div className="vehicles-section">
          <div className="section-header">
            <h2>Vehicles</h2>
            <button 
              className="add-button"
              onClick={() => setShowAddVehicleForm(!showAddVehicleForm)}
            >
              Add Vehicle
            </button>
          </div>
          
          {showAddVehicleForm && (
            <div className="add-form">
              <h3>Add Vehicle</h3>
              <form onSubmit={handleAddVehicle}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Registration Number</label>
                    <input 
                      type="text" 
                      name="registrationNumber" 
                      value={newVehicle.registrationNumber} 
                      onChange={handleVehicleInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Vehicle Type</label>
                    <select 
                      name="type" 
                      value={newVehicle.type} 
                      onChange={handleVehicleInputChange}
                    >
                      <option value="Bus">Bus</option>
                      <option value="Van">Van</option>
                      <option value="Mini Bus">Mini Bus</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Capacity</label>
                    <input 
                      type="number" 
                      name="capacity" 
                      value={newVehicle.capacity} 
                      onChange={handleVehicleInputChange} 
                      min="1"
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Driver Name</label>
                    <input 
                      type="text" 
                      name="driver" 
                      value={newVehicle.driver} 
                      onChange={handleVehicleInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Driver Contact</label>
                    <input 
                      type="text" 
                      name="driverContact" 
                      value={newVehicle.driverContact} 
                      onChange={handleVehicleInputChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Route</label>
                    <input 
                      type="text" 
                      name="route" 
                      value={newVehicle.route} 
                      onChange={handleVehicleInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      name="status" 
                      value={newVehicle.status} 
                      onChange={handleVehicleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-button">Save</button>
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => setShowAddVehicleForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {vehicles.length > 0 ? (
            <div className="vehicles-list">
              <div className="card-grid">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className={`vehicle-card ${vehicle.status}`}>
                    <div className="vehicle-card-header">
                      <span className={`vehicle-type ${vehicle.type.toLowerCase()}`}>{vehicle.type}</span>
                      <span className="vehicle-status">{vehicle.status}</span>
                    </div>
                    <div className="vehicle-card-body">
                      <h3 className="vehicle-reg">{vehicle.registrationNumber}</h3>
                      <div className="vehicle-details">
                        <div className="detail-row">
                          <span className="detail-label">Route:</span>
                          <span className="detail-value">{vehicle.route}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Driver:</span>
                          <span className="detail-value">{vehicle.driver}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Contact:</span>
                          <span className="detail-value">{vehicle.driverContact}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Capacity:</span>
                          <span className="detail-value">{vehicle.capacity} seats</span>
                        </div>
                      </div>
                    </div>
                    <div className="vehicle-card-actions">
                      <button className="view-button">View</button>
                      <button className="edit-button">Edit</button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-data">
              <p>No vehicles found. Please add a vehicle.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Stops Tab */}
      {activeTab === 'stops' && (
        <div className="stops-section">
          <div className="section-header">
            <h2>Stops & Routes</h2>
            <button 
              className="add-button"
              onClick={() => setShowAddStopForm(!showAddStopForm)}
            >
              Add Stop
            </button>
          </div>
          
          {showAddStopForm && (
            <div className="add-form">
              <h3>Add Stop</h3>
              <form onSubmit={handleAddStop}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Route</label>
                    <select 
                      name="routeId" 
                      value={newStop.routeId} 
                      onChange={handleStopInputChange} 
                      required
                    >
                      <option value="">--Select--</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.route} ({vehicle.registrationNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Stop Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={newStop.name} 
                      onChange={handleStopInputChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Pickup Time</label>
                    <input 
                      type="time" 
                      name="time" 
                      value={newStop.time} 
                      onChange={handleStopInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Sequence</label>
                    <input 
                      type="number" 
                      name="sequence" 
                      value={newStop.sequence} 
                      onChange={handleStopInputChange} 
                      min="1"
                      required 
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-button">Save</button>
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => setShowAddStopForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {stops.length > 0 ? (
            <div className="routes-display">
              {vehicles.map(vehicle => {
                const routeStops = stops.filter(stop => stop.routeId === vehicle.id)
                  .sort((a, b) => a.sequence - b.sequence);
                
                if (routeStops.length === 0) return null;
                
                return (
                  <div key={vehicle.id} className="route-card">
                    <div className="route-header">
                      <h3>{vehicle.route}</h3>
                      <span className="vehicle-info">
                        {vehicle.registrationNumber} ({vehicle.type})
                      </span>
                    </div>
                    <div className="stops-timeline">
                      {routeStops.map((stop, index) => (
                        <div key={stop.id} className="stop-item">
                          <div className="stop-point">
                            <span className="stop-number">{stop.sequence}</span>
                          </div>
                          <div className="stop-details">
                            <div className="stop-name">{stop.name}</div>
                            <div className="stop-time">{stop.time}</div>
                          </div>
                          <div className="stop-actions">
                            <button className="edit-button sm">Edit</button>
                            <button 
                              className="delete-button sm"
                              onClick={() => handleDeleteStop(stop.id)}
                            >
                              Delete
                            </button>
                          </div>
                          {index < routeStops.length - 1 && <div className="stop-connector"></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-data">
              <p>No stops found. Please add stops to routes.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Allocations Tab */}
      {activeTab === 'allocations' && (
        <div className="allocations-section">
          <div className="section-header">
            <h2>Student Allocations</h2>
            <button 
              className="add-button"
              onClick={() => setShowAddAllocationForm(!showAddAllocationForm)}
            >
              Add Allocation
            </button>
          </div>
          
          {showAddAllocationForm && (
            <div className="add-form">
              <h3>Add Transport Allocation</h3>
              <form onSubmit={handleAddAllocation}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Student</label>
                    <select 
                      name="studentId" 
                      value={newAllocation.studentId} 
                      onChange={handleAllocationInputChange} 
                      required
                    >
                      <option value="">--Select--</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} (Class {student.class}-{student.section})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Vehicle/Route</label>
                    <select 
                      name="vehicleId" 
                      value={newAllocation.vehicleId} 
                      onChange={handleAllocationInputChange} 
                      required
                    >
                      <option value="">--Select--</option>
                      {vehicles.filter(v => v.status === 'active').map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.route} ({vehicle.registrationNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Pickup Stop</label>
                    <select 
                      name="stopId" 
                      value={newAllocation.stopId} 
                      onChange={handleAllocationInputChange} 
                      disabled={!selectedVehicle}
                      required
                    >
                      <option value="">--Select--</option>
                      {filteredStops.map(stop => (
                        <option key={stop.id} value={stop.id}>
                          {stop.name} ({stop.time})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Fee Status</label>
                    <select 
                      name="feeStatus" 
                      value={newAllocation.feeStatus} 
                      onChange={handleAllocationInputChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="exempted">Exempted</option>
                    </select>
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-button">Save</button>
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => {
                      setShowAddAllocationForm(false);
                      setSelectedVehicle(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {allocations.length > 0 ? (
            <div className="allocations-list">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Route</th>
                    <th>Vehicle</th>
                    <th>Stop</th>
                    <th>Fee Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map(allocation => (
                    <tr key={allocation.id} className={`fee-status-${allocation.feeStatus}`}>
                      <td>{getStudentName(allocation.studentId)}</td>
                      <td>{getVehicleRoute(allocation.vehicleId)}</td>
                      <td>{getVehicleRegistration(allocation.vehicleId)}</td>
                      <td>{getStopName(allocation.stopId)}</td>
                      <td>
                        <span className={`status-badge ${allocation.feeStatus}`}>
                          {allocation.feeStatus}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="edit-button">Edit</button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteAllocation(allocation.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-data">
              <p>No transport allocations found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TransportManagement;