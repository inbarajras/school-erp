import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { students as studentsData } from '../../mockData/students';

function StudentManagement() {
  const { t } = useTranslation();
  const { hasPermission } = useContext(AuthContext);
  const [students, setStudents] = useState(studentsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    class: '',
    section: '',
    gender: '',
    dob: '',
    contact: '',
    address: '',
    parent: '',
    parentContact: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value
    });
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const studentToAdd = {
      id,
      ...newStudent
    };
    setStudents([...students, studentToAdd]);
    setNewStudent({
      name: '',
      class: '',
      section: '',
      gender: '',
      dob: '',
      contact: '',
      address: '',
      parent: '',
      parentContact: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm(t('common.confirm'))) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate a random avatar color based on student ID
  const getAvatarColor = (id) => {
    const colors = [
      '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63',
      '#3F51B5', '#009688', '#FFC107', '#673AB7', '#795548'
    ];
    return colors[id % colors.length];
  };

  // Get initials from student name
  const getInitials = (name) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="student-management">
      <h1>{t('students.title')}</h1>
      
      <div className="controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {hasPermission('admin') && (
          <button 
            className="add-button" 
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {t('students.addNew')}
          </button>
        )}
      </div>
      
      {showAddForm && (
        <div className="add-form">
          <h2>{t('students.addNew')}</h2>
          <form onSubmit={handleAddStudent}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('students.name')}</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newStudent.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('students.class')}</label>
                <input 
                  type="text" 
                  name="class" 
                  value={newStudent.class} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('students.section')}</label>
                <input 
                  type="text" 
                  name="section" 
                  value={newStudent.section} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('students.gender')}</label>
                <select 
                  name="gender" 
                  value={newStudent.gender} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">--{t('common.select')}--</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('students.dob')}</label>
                <input 
                  type="date" 
                  name="dob" 
                  value={newStudent.dob} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('students.contact')}</label>
                <input 
                  type="text" 
                  name="contact" 
                  value={newStudent.contact} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('students.address')}</label>
                <input 
                  type="text" 
                  name="address" 
                  value={newStudent.address} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group">
                <label>{t('students.parent')}</label>
                <input 
                  type="text" 
                  name="parent" 
                  value={newStudent.parent} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('students.parentContact')}</label>
                <input 
                  type="text" 
                  name="parentContact" 
                  value={newStudent.parentContact} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-button">{t('common.save')}</button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => setShowAddForm(false)}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Card View for Students */}
      <div className="students-card-container">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <div className="student-card" key={student.id}>
              <div className="student-card-header">
                <div 
                  className="student-avatar" 
                  style={{ backgroundColor: getAvatarColor(student.id) }}
                >
                  {getInitials(student.name)}
                </div>
                <h3 className="student-name">{student.name}</h3>
                <div className="student-id">ID: {student.id}</div>
              </div>
              <div className="student-card-details">
                <div className="detail-row">
                  <span className="detail-label">{t('students.class')}:</span>
                  <span className="detail-value">{student.class} {student.section}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t('students.gender')}:</span>
                  <span className="detail-value">{student.gender}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t('students.parent')}:</span>
                  <span className="detail-value">{student.parent}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t('students.contact')}:</span>
                  <span className="detail-value">{student.contact}</span>
                </div>
              </div>
              <div className="student-card-actions">
                <button className="view-button">{t('students.view')}</button>
                <button className="edit-button">{t('students.edit')}</button>
                {hasPermission('admin') && (
                  <button 
                    className="delete-button" 
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    {t('students.delete')}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No students found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentManagement;