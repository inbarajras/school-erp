import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { students } from '../mockData/students';
import { staff } from '../mockData/staff';
import { classes } from '../mockData/classes';
import { messages } from '../mockData/messages';

function Dashboard() {
  const { t } = useTranslation();
  const { user, role } = useContext(AuthContext);

  // Get recent announcements
  const announcements = messages.filter(msg => msg.to === 'All').slice(0, 3);
  
  // Get recent activity
  const recentActivity = messages.slice(0, 5);

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get emoji for stats cards
  const getStatIcon = (statType) => {
    switch(statType) {
      case 'students':
        return '👨‍🎓';
      case 'staff':
        return '👨‍🏫';
      case 'classes':
        return '🏫';
      default:
        return '📊';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{t('dashboard.title')}</h1>
        <div className="welcome-message">
          <span className="greeting">{t('dashboard.welcome')},</span>
          <span className="user-name">{user?.name}!</span>
        </div>
      </div>
      
      {(role === 'admin' || role === 'teacher') && (
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">{getStatIcon('students')}</div>
            <div className="stat-content">
              <h3>{t('dashboard.students')}</h3>
              <p className="stat-number">{students.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">{getStatIcon('staff')}</div>
            <div className="stat-content">
              <h3>{t('dashboard.staff')}</h3>
              <p className="stat-number">{staff.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">{getStatIcon('classes')}</div>
            <div className="stat-content">
              <h3>{t('dashboard.classes')}</h3>
              <p className="stat-number">{classes.length}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="dashboard-content">
        <div className="content-card announcements-card">
          <div className="card-header">
            <h3>{t('dashboard.announcements')}</h3>
          </div>
          <div className="card-body">
            {announcements.length > 0 ? (
              <ul className="announcement-list">
                {announcements.map(announcement => (
                  <li key={announcement.id} className="announcement-item">
                    <div className="announcement-header">
                      <div className="announcement-title">{announcement.subject}</div>
                      <div className="announcement-date">{formatDate(announcement.date)}</div>
                    </div>
                    <div className="announcement-content">{announcement.message}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">No announcements available</div>
            )}
          </div>
        </div>
        
        <div className="content-card activity-card">
          <div className="card-header">
            <h3>{t('dashboard.recentActivity')}</h3>
          </div>
          <div className="card-body">
            {recentActivity.length > 0 ? (
              <ul className="activity-list">
                {recentActivity.map(activity => (
                  <li key={activity.id} className="activity-item">
                    <div className="activity-header">
                      <div className="activity-subject">{activity.subject}</div>
                      <div className="activity-date">{formatDate(activity.date)}</div>
                    </div>
                    <div className="activity-details">
                      <span className="activity-from">{activity.from}</span>
                      <span className="activity-to">{activity.to}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;