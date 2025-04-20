import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import StudentManagement from './components/modules/StudentManagement';
import StaffManagement from './components/modules/StaffManagement';
import ClassManagement from './components/modules/ClassManagement';
import AttendanceTracking from './components/modules/AttendanceTracking';
import Examination from './components/modules/Examination';
import TimetableManagement from './components/modules/TimetableManagement';
import FeeManagement from './components/modules/FeeManagement';
import Communication from './components/modules/Communication';
import Reports from './components/modules/Reports';
import SocialTimeline from './components/modules/SocialTimeline';
import AIAssistant from './components/modules/AIAssistant';
import TransportManagement from './components/modules/TransportManagement';
import SportsAndCultural from './components/modules/SportsAndCultural';
import TransportTracking from './components/modules/TransportTracking';

function App() {
  const { user } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app-container">
        {user && (
          <Navigation 
            collapsed={sidebarCollapsed} 
            setCollapsed={setSidebarCollapsed} 
          />
        )}
        <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute><StudentManagement /></ProtectedRoute>} />
            <Route path="/staff" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />
            <Route path="/classes" element={<ProtectedRoute><ClassManagement /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><AttendanceTracking /></ProtectedRoute>} />
            <Route path="/examinations" element={<ProtectedRoute><Examination /></ProtectedRoute>} />
            <Route path="/timetable" element={<ProtectedRoute><TimetableManagement /></ProtectedRoute>} />
            <Route path="/fees" element={<ProtectedRoute><FeeManagement /></ProtectedRoute>} />
            <Route path="/communication" element={<ProtectedRoute><Communication /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/social" element={<ProtectedRoute><SocialTimeline /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
            <Route path="/transport" element={<ProtectedRoute><TransportManagement /></ProtectedRoute>} />
            <Route path="/activities" element={<ProtectedRoute><SportsAndCultural /></ProtectedRoute>} />
            <Route path="/transport-tracking" element={<ProtectedRoute><TransportTracking /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;