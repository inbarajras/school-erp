import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { students } from '../../mockData/students';
import { staff } from '../../mockData/staff';

// Mock data for activities
const activitiesData = [
  {
    id: 1,
    name: 'Annual Sports Day',
    type: 'Sports',
    category: 'School Event',
    startDate: '2025-05-15',
    endDate: '2025-05-15',
    coordinators: [2, 4], // Staff IDs
    venue: 'School Playground',
    status: 'upcoming',
    description: 'Annual intramural sports competition with track and field events.'
  },
  {
    id: 2,
    name: 'Chess Tournament',
    type: 'Sports',
    category: 'Competition',
    startDate: '2025-04-25',
    endDate: '2025-04-26',
    coordinators: [2], // Staff IDs
    venue: 'School Auditorium',
    status: 'upcoming',
    description: 'Inter-class chess competition for all age groups.'
  },
  {
    id: 3,
    name: 'Classical Dance Workshop',
    type: 'Cultural',
    category: 'Workshop',
    startDate: '2025-04-10',
    endDate: '2025-04-12',
    coordinators: [3], // Staff IDs
    venue: 'Dance Room',
    status: 'completed',
    description: 'Three-day workshop on classical dance forms taught by visiting artists.'
  },
  {
    id: 4,
    name: 'Annual Cultural Festival',
    type: 'Cultural',
    category: 'School Event',
    startDate: '2025-06-20',
    endDate: '2025-06-22',
    coordinators: [3, 5], // Staff IDs
    venue: 'School Auditorium',
    status: 'upcoming',
    description: 'Three-day cultural extravaganza featuring performances, art exhibitions, and competitions.'
  }
];

// Mock data for participant registrations
const participantsData = [
  { id: 1, activityId: 1, studentId: 1, category: 'Under 15', events: ['100m Sprint', 'Long Jump'], status: 'confirmed' },
  { id: 2, activityId: 1, studentId: 2, category: 'Under 15', events: ['400m Race', 'Relay'], status: 'confirmed' },
  { id: 3, activityId: 2, studentId: 3, category: 'Junior', events: ['Chess'], status: 'confirmed' },
  { id: 4, activityId: 3, studentId: 4, category: 'Open', events: ['Bharatanatyam'], status: 'confirmed' },
  { id: 5, activityId: 4, studentId: 1, category: 'Group', events: ['Drama', 'Group Dance'], status: 'pending' }
];

function SportsAndCultural() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('activities');
  const [activities, setActivities] = useState(activitiesData);
  const [participants, setParticipants] = useState(participantsData);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showAddActivityForm, setShowAddActivityForm] = useState(false);
  const [showAddParticipantForm, setShowAddParticipantForm] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    type: 'Sports',
    category: '',
    startDate: '',
    endDate: '',
    coordinators: [],
    venue: '',
    status: 'upcoming',
    description: ''
  });
  const [newParticipant, setNewParticipant] = useState({
    activityId: '',
    studentId: '',
    category: '',
    events: '',
    status: 'pending'
  });
  const [activityFilter, setActivityFilter] = useState({
    type: '',
    status: ''
  });

  // Filter activities based on filters
  const filteredActivities = activities.filter(activity => {
    if (activityFilter.type && activity.type !== activityFilter.type) return false;
    if (activityFilter.status && activity.status !== activityFilter.status) return false;
    return true;
  });

  // Handle activity form input changes
  const handleActivityInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity({
      ...newActivity,
      [name]: value
    });
  };

  // Handle coordinator selection
  const handleCoordinatorChange = (e) => {
    const options = e.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(parseInt(options[i].value));
      }
    }
    setNewActivity({
      ...newActivity,
      coordinators: selectedValues
    });
  };

  // Handle participant form input changes
  const handleParticipantInputChange = (e) => {
    const { name, value } = e.target;
    setNewParticipant({
      ...newParticipant,
      [name]: value
    });
    
    // Set selected activity for events list
    if (name === 'activityId') {
      setSelectedActivity(parseInt(value));
    }
  };

  // Add new activity
  const handleAddActivity = (e) => {
    e.preventDefault();
    const id = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;
    const activityToAdd = { id, ...newActivity };
    setActivities([...activities, activityToAdd]);
    setNewActivity({
      name: '',
      type: 'Sports',
      category: '',
      startDate: '',
      endDate: '',
      coordinators: [],
      venue: '',
      status: 'upcoming',
      description: ''
    });
    setShowAddActivityForm(false);
  };

  // Add new participant
  const handleAddParticipant = (e) => {
    e.preventDefault();
    const id = participants.length > 0 ? Math.max(...participants.map(p => p.id)) + 1 : 1;
    const activityId = parseInt(newParticipant.activityId);
    const studentId = parseInt(newParticipant.studentId);
    
    // Convert comma-separated events to array
    const events = newParticipant.events.split(',').map(event => event.trim());
    
    const participantToAdd = { 
      id, 
      activityId,
      studentId,
      category: newParticipant.category,
      events,
      status: newParticipant.status
    };
    
    setParticipants([...participants, participantToAdd]);
    setNewParticipant({
      activityId: '',
      studentId: '',
      category: '',
      events: '',
      status: 'pending'
    });
    setSelectedActivity(null);
    setShowAddParticipantForm(false);
  };

  // Delete activity
  const handleDeleteActivity = (id) => {
    if (window.confirm('Are you sure?')) {
      setActivities(activities.filter(activity => activity.id !== id));
      // Also delete related participants
      setParticipants(participants.filter(participant => participant.activityId !== id));
    }
  };

  // Delete participant
  const handleDeleteParticipant = (id) => {
    if (window.confirm('Are you sure?')) {
      setParticipants(participants.filter(participant => participant.id !== id));
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get student name from ID
  const getStudentName = (id) => {
    const student = students.find(student => student.id === id);
    return student ? student.name : `Student ${id}`;
  };

  // Get activity name from ID
  const getActivityName = (id) => {
    const activity = activities.find(activity => activity.id === id);
    return activity ? activity.name : `Activity ${id}`;
  };

  // Get coordinator names from IDs
  const getCoordinatorNames = (coordinatorIds) => {
    return coordinatorIds.map(id => {
      const coordinator = staff.find(staff => staff.id === id);
      return coordinator ? coordinator.name : `Staff ${id}`;
    }).join(', ');
  };

  return (
    <div className="sports-cultural">
      <h1>Sports & Cultural Activities</h1>
      
      <div className="module-tabs">
        <button 
          className={`module-tab ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          Activities & Events
        </button>
        <button 
          className={`module-tab ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          Participants
        </button>
      </div>
      
      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div className="activities-section">
          <div className="section-header">
            <h2>Activities & Events</h2>
            <div className="header-actions">
              <div className="filter-controls">
                <select 
                  value={activityFilter.type}
                  onChange={(e) => setActivityFilter({...activityFilter, type: e.target.value})}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                </select>
                <select 
                  value={activityFilter.status}
                  onChange={(e) => setActivityFilter({...activityFilter, status: e.target.value})}
                  className="filter-select"
                >
                  <option value="">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button 
                className="add-button"
                onClick={() => setShowAddActivityForm(!showAddActivityForm)}
              >
                Add Activity
              </button>
            </div>
          </div>
          
          {showAddActivityForm && (
            <div className="add-form">
              <h3>Add New Activity</h3>
              <form onSubmit={handleAddActivity}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Activity Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={newActivity.name} 
                      onChange={handleActivityInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select 
                      name="type" 
                      value={newActivity.type} 
                      onChange={handleActivityInputChange}
                    >
                      <option value="Sports">Sports</option>
                      <option value="Cultural">Cultural</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input 
                      type="text" 
                      name="category" 
                      value={newActivity.category} 
                      placeholder="School Event, Competition, Workshop, etc."
                      onChange={handleActivityInputChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      name="startDate" 
                      value={newActivity.startDate} 
                      onChange={handleActivityInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input 
                      type="date" 
                      name="endDate" 
                      value={newActivity.endDate} 
                      onChange={handleActivityInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Venue</label>
                    <input 
                      type="text" 
                      name="venue" 
                      value={newActivity.venue} 
                      onChange={handleActivityInputChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Coordinators</label>
                    <select 
                      multiple
                      name="coordinators" 
                      value={newActivity.coordinators} 
                      onChange={handleCoordinatorChange}
                      required
                    >
                      {staff.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.role})
                        </option>
                      ))}
                    </select>
                    <small>Hold Ctrl/Cmd to select multiple</small>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      name="status" 
                      value={newActivity.status} 
                      onChange={handleActivityInputChange}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={newActivity.description}
                      onChange={handleActivityInputChange}
                      rows="4"
                    />
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-button">Save</button>
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => setShowAddActivityForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {filteredActivities.length > 0 ? (
            <div className="activities-list">
              <div className="card-grid">
                {filteredActivities.map(activity => (
                  <div key={activity.id} className={`activity-card ${activity.status}`}>
                    <div className="activity-card-header">
                      <div className="activity-type-badge">
                        <span className={`activity-type ${activity.type.toLowerCase()}`}>
                          {activity.type}
                        </span>
                        <span className="activity-category">{activity.category}</span>
                      </div>
                      <span className={`activity-status ${activity.status}`}>{activity.status}</span>
                    </div>
                    <div className="activity-card-body">
                      <h3 className="activity-name">{activity.name}</h3>
                      <div className="activity-dates">
                        <span>{formatDate(activity.startDate)}</span>
                        {activity.startDate !== activity.endDate && (
                          <>
                            <span className="date-separator">to</span>
                            <span>{formatDate(activity.endDate)}</span>
                          </>
                        )}
                      </div>
                      <div className="activity-details">
                        <div className="detail-row">
                          <span className="detail-label">Venue:</span>
                          <span className="detail-value">{activity.venue}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Coordinators:</span>
                          <span className="detail-value">{getCoordinatorNames(activity.coordinators)}</span>
                        </div>
                      </div>
                      <div className="activity-description">
                        <p>{activity.description}</p>
                      </div>
                    </div>
                    <div className="activity-card-actions">
                      <button className="view-button">View</button>
                      <button className="edit-button">Edit</button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteActivity(activity.id)}
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
              <p>No activities found. Please add an activity.</p>
            </div>
          )}
        </div>
      )}
      
      {/* Participants Tab */}
      {activeTab === 'participants' && (
        <div className="participants-section">
          <div className="section-header">
            <h2>Participants</h2>
            <button 
              className="add-button"
              onClick={() => setShowAddParticipantForm(!showAddParticipantForm)}
            >
              Add Participant
            </button>
          </div>
          
          {showAddParticipantForm && (
            <div className="add-form">
              <h3>Add New Participant</h3>
              <form onSubmit={handleAddParticipant}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Activity</label>
                    <select 
                      name="activityId" 
                      value={newParticipant.activityId} 
                      onChange={handleParticipantInputChange} 
                      required
                    >
                      <option value="">--Select--</option>
                      {activities.map(activity => (
                        <option key={activity.id} value={activity.id}>
                          {activity.name} ({activity.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Student</label>
                    <select 
                      name="studentId" 
                      value={newParticipant.studentId} 
                      onChange={handleParticipantInputChange} 
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
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <input 
                      type="text" 
                      name="category" 
                      value={newParticipant.category} 
                      placeholder="Age group, Weight class, etc."
                      onChange={handleParticipantInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Events</label>
                    <input 
                      type="text" 
                      name="events" 
                      value={newParticipant.events} 
                      placeholder="Comma-separated events"
                      onChange={handleParticipantInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      name="status" 
                      value={newParticipant.status} 
                      onChange={handleParticipantInputChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="form-buttons">
                  <button type="submit" className="save-button">Save</button>
                  <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={() => {
                      setShowAddParticipantForm(false);
                      setSelectedActivity(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {participants.length > 0 ? (
            <div className="participants-list">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Activity</th>
                    <th>Category</th>
                    <th>Events</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(participant => (
                    <tr key={participant.id} className={`status-${participant.status}`}>
                      <td>{getStudentName(participant.studentId)}</td>
                      <td>{getActivityName(participant.activityId)}</td>
                      <td>{participant.category}</td>
                      <td>
                        <ul className="event-list">
                          {participant.events.map((event, index) => (
                            <li key={index} className="event-item">{event}</li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <span className={`status-badge ${participant.status}`}>
                          {participant.status}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="edit-button">Edit</button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteParticipant(participant.id)}
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
              <p>No participants found. Please add participants to activities.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SportsAndCultural;