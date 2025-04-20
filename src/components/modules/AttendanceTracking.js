import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { students } from '../../mockData/students';
import { classes } from '../../mockData/classes';
import { attendance as attendanceData } from '../../mockData/attendance';

function AttendanceTracking() {
  const { t } = useTranslation();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendance, setAttendance] = useState([]);
  const [studentsInClass, setStudentsInClass] = useState([]);

  // Filter unique class and section combinations
  const classOptions = [...new Set(classes.map(cls => cls.name))];
  const sectionOptions = selectedClass 
    ? [...new Set(classes.filter(cls => cls.name === selectedClass).map(cls => cls.section))]
    : [];

  useEffect(() => {
    if (selectedClass && selectedSection) {
      // Filter students by selected class and section
      const filteredStudents = students.filter(
        student => student.class === selectedClass && student.section === selectedSection
      );
      setStudentsInClass(filteredStudents);

      // Check if attendance records exist for this date, class, and section
      const existingAttendance = attendanceData.filter(
        record => record.date === selectedDate && 
                  record.class === selectedClass && 
                  record.section === selectedSection
      );

      if (existingAttendance.length > 0) {
        // Create attendance state from existing records
        const attendanceRecords = filteredStudents.map(student => {
          const record = existingAttendance.find(a => a.studentId === student.id);
          return {
            studentId: student.id,
            studentName: student.name,
            status: record ? record.status : 'present' // Default to present if no record
          };
        });
        setAttendance(attendanceRecords);
      } else {
        // Create new attendance records with default "present" status
        const newAttendance = filteredStudents.map(student => ({
          studentId: student.id,
          studentName: student.name,
          status: 'present'
        }));
        setAttendance(newAttendance);
      }
    } else {
      setStudentsInClass([]);
      setAttendance([]);
    }
  }, [selectedClass, selectedSection, selectedDate]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(
      attendance.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleSaveAttendance = () => {
    // In a real application, this would save to the database
    alert(t('common.success'));
  };

  return (
    <div className="attendance-tracking">
      <h1>{t('attendance.title')}</h1>
      
      <div className="attendance-filters">
        <div className="filter-group">
          <label>{t('attendance.date')}</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>{t('attendance.class')}</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection('');
            }}
          >
            <option value="">--{t('common.select')}--</option>
            {classOptions.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>{t('attendance.section')}</label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">--{t('common.select')}--</option>
            {sectionOptions.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>
      </div>
      
      {studentsInClass.length > 0 && (
        <div className="attendance-form">
          <table>
            <thead>
              <tr>
                <th>{t('students.id')}</th>
                <th>{t('students.name')}</th>
                <th>{t('attendance.status')}</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(record => (
                <tr key={record.studentId}>
                  <td>{record.studentId}</td>
                  <td>{record.studentName}</td>
                  <td>
                    <div className="status-toggle">
                      <label>
                        <input
                          type="radio"
                          name={`status-${record.studentId}`}
                          value="present"
                          checked={record.status === 'present'}
                          onChange={() => handleStatusChange(record.studentId, 'present')}
                        />
                        {t('attendance.present')}
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`status-${record.studentId}`}
                          value="absent"
                          checked={record.status === 'absent'}
                          onChange={() => handleStatusChange(record.studentId, 'absent')}
                        />
                        {t('attendance.absent')}
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="form-buttons">
            <button onClick={handleSaveAttendance} className="save-button">
              {t('attendance.save')}
            </button>
          </div>
        </div>
      )}
      
      {selectedClass && selectedSection && studentsInClass.length === 0 && (
        <div className="no-data">
          <p>No students found in this class and section.</p>
        </div>
      )}
    </div>
  );
}

export default AttendanceTracking;