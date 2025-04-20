import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { classes as classesData } from '../../mockData/classes';
import { staff } from '../../mockData/staff';

function ClassManagement() {
  const { t } = useTranslation();
  const { hasPermission } = useContext(AuthContext);
  const [classes, setClasses] = useState(classesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    section: '',
    classTeacher: '',
    totalStudents: 0
  });

  // Get all teachers for the class teacher dropdown
  const teachers = staff.filter(member => member.role === 'Teacher').map(teacher => teacher.name);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass({
      ...newClass,
      [name]: value
    });
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    const id = classes.length > 0 ? Math.max(...classes.map(c => c.id)) + 1 : 1;
    const classToAdd = {
      id,
      ...newClass,
      totalStudents: parseInt(newClass.totalStudents) // Ensure it's a number
    };
    setClasses([...classes, classToAdd]);
    setNewClass({
      name: '',
      section: '',
      classTeacher: '',
      totalStudents: 0
    });
    setShowAddForm(false);
  };

  const handleDeleteClass = (id) => {
    if (window.confirm(t('common.confirm'))) {
      setClasses(classes.filter(cls => cls.id !== id));
    }
  };

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Available class names and sections for dropdowns
  const classNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const sectionNames = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Get image for class based on class number
  const getClassImage = (className) => {
    const classNum = parseInt(className);
    // Pick different images for different grade levels
    if (classNum <= 5) {
      return '/images/elementary-class.jpg'; // Elementary level
    } else if (classNum <= 8) {
      return '/images/middle-class.jpg'; // Middle school
    } else {
      return '/images/high-class.jpg'; // High school
    }
  };

  // Generate a background color for class cards based on section
  const getSectionColor = (section) => {
    const colors = {
      'A': '#e3f2fd', // Light blue
      'B': '#e8f5e9', // Light green
      'C': '#fff3e0', // Light orange
      'D': '#f3e5f5', // Light purple
      'E': '#e0f7fa', // Light cyan
      'F': '#fffde7'  // Light yellow
    };
    return colors[section] || '#f5f5f5'; // Default light gray
  };

  return (
    <div className="class-management">
      <h1>{t('classes.title')}</h1>
      
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
            {t('classes.addClass')}
          </button>
        )}
      </div>
      
      {showAddForm && (
        <div className="add-form">
          <h2>{t('classes.addClass')}</h2>
          <form onSubmit={handleAddClass}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('classes.name')}</label>
                <select 
                  name="name" 
                  value={newClass.name} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">--{t('common.select')}--</option>
                  {classNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('classes.section')}</label>
                <select 
                  name="section" 
                  value={newClass.section} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">--{t('common.select')}--</option>
                  {sectionNames.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('classes.classTeacher')}</label>
                <select 
                  name="classTeacher" 
                  value={newClass.classTeacher} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">--{t('common.select')}--</option>
                  {teachers.map(teacher => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('classes.totalStudents')}</label>
                <input 
                  type="number" 
                  name="totalStudents" 
                  value={newClass.totalStudents} 
                  onChange={handleInputChange} 
                  min="0"
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
      
      {/* Card View for Classes */}
      <div className="classes-card-container">
        {filteredClasses.length > 0 ? (
          filteredClasses.map(cls => (
            <div 
              className="class-card" 
              key={cls.id}
              style={{ backgroundColor: getSectionColor(cls.section) }}
            >
              <div className="class-card-image">
                {/* <img src={classroom}/> */}
                <div className="class-image-placeholder">
                  <div className="class-grade">
                    {cls.name}<sup>th</sup> Grade
                  </div>
                  <div className="section-label">Section {cls.section}</div>
                </div>
              </div>
              <div className="class-card-content">
                <div className="class-name">
                  Grade {cls.name} - Section {cls.section}
                </div>
                <div className="class-details">
                  <div className="detail-row">
                    <span className="detail-label">{t('classes.classTeacher')}:</span>
                    <span className="detail-value">{cls.classTeacher}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">{t('classes.totalStudents')}:</span>
                    <span className="detail-value">{cls.totalStudents}</span>
                  </div>
                  <div className="student-capacity">
                    <div className="capacity-bar">
                      <div 
                        className="capacity-filled"
                        style={{ 
                          width: `${Math.min(cls.totalStudents / 40 * 100, 100)}%`,
                          backgroundColor: cls.totalStudents > 35 ? '#e74c3c' : '#27ae60'
                        }}
                      ></div>
                    </div>
                    <div className="capacity-text">
                      {cls.totalStudents > 35 ? 'Near capacity' : 'Available seats'}
                    </div>
                  </div>
                </div>
                <div className="class-card-actions">
                  <button className="view-button">{t('classes.view')}</button>
                  <button className="edit-button">{t('classes.edit')}</button>
                  {hasPermission('admin') && (
                    <button 
                      className="delete-button" 
                      onClick={() => handleDeleteClass(cls.id)}
                    >
                      {t('classes.delete')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No classes found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassManagement;