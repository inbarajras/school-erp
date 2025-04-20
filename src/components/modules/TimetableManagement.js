import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { timetable as timetableData } from '../../mockData/timetable';
import { classes } from '../../mockData/classes';
import { staff } from '../../mockData/staff';

function TimetableManagement() {
  const { t } = useTranslation();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [timetable, setTimetable] = useState(null);

  // Class options for filtering
  const classOptions = [...new Set(classes.map(cls => cls.name))];
  
  // Section options based on selected class
  const sectionOptions = selectedClass 
    ? [...new Set(classes.filter(cls => cls.name === selectedClass).map(cls => cls.section))]
    : [];

  // Day options
  const dayOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const handleViewTimetable = () => {
    if (selectedClass && selectedSection && selectedDay) {
      // Find timetable for this class, section, and day
      const foundTimetable = timetableData.find(
        tt => tt.class === selectedClass && 
             tt.section === selectedSection && 
             tt.day === selectedDay
      );
      
      if (foundTimetable) {
        setTimetable(foundTimetable);
      } else {
        setTimetable(null);
        alert('No timetable found for the selected criteria');
      }
    }
  };

  return (
    <div className="timetable-management">
      <h1>{t('timetable.title')}</h1>
      
      <div className="timetable-filters">
        <div className="filter-group">
          <label>{t('timetable.class')}</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection('');
              setTimetable(null);
            }}
          >
            <option value="">--{t('common.select')}--</option>
            {classOptions.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>{t('timetable.section')}</label>
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setTimetable(null);
            }}
            disabled={!selectedClass}
          >
            <option value="">--{t('common.select')}--</option>
            {sectionOptions.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>{t('timetable.day')}</label>
          <select
            value={selectedDay}
            onChange={(e) => {
              setSelectedDay(e.target.value);
              setTimetable(null);
            }}
            disabled={!selectedSection}
          >
            <option value="">--{t('common.select')}--</option>
            {dayOptions.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div className="filter-group view-button-container">
          <button 
            className="view-button"
            onClick={handleViewTimetable}
            disabled={!selectedClass || !selectedSection || !selectedDay}
          >
            {t('timetable.view')}
          </button>
        </div>
      </div>
      
      {timetable && (
        <div className="timetable-display">
          <h2>
            {t('timetable.class')} {timetable.class} {t('timetable.section')} {timetable.section} - 
            {timetable.day}
          </h2>
          <table className="timetable-table">
            <thead>
              <tr>
                <th>{t('timetable.period')}</th>
                <th>{t('timetable.time')}</th>
                <th>{t('timetable.subject')}</th>
                <th>{t('timetable.teacher')}</th>
              </tr>
            </thead>
            <tbody>
              {timetable.periods.map(period => (
                <tr key={period.period}>
                  <td>{period.period}</td>
                  <td>{period.time}</td>
                  <td>{period.subject}</td>
                  <td>{period.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!timetable && selectedClass && selectedSection && selectedDay && (
        <div className="no-data">
          <p>No timetable found for the selected criteria.</p>
        </div>
      )}
    </div>
  );
}

export default TimetableManagement;