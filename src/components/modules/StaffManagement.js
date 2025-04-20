import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { staff as staffData } from '../../mockData/staff';

function StaffManagement() {
  const { t } = useTranslation();
  const { hasPermission } = useContext(AuthContext);
  const [staff, setStaff] = useState(staffData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    subject: '',
    contact: '',
    email: '',
    joinDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff({
      ...newStaff,
      [name]: value
    });
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    const id = staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1;
    const staffToAdd = {
      id,
      ...newStaff
    };
    setStaff([...staff, staffToAdd]);
    setNewStaff({
      name: '',
      role: '',
      subject: '',
      contact: '',
      email: '',
      joinDate: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm(t('common.confirm'))) {
      setStaff(staff.filter(member => member.id !== id));
    }
  };

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleOptions = ['Principal', 'Teacher', 'Administrator', 'Librarian', 'Counselor', 'Lab Assistant'];
  
  const subjectOptions = [
    'Mathematics', 'Science', 'English', 'Social Studies', 
    'Computer Science', 'Tamil', 'Hindi', 'Physics', 'Chemistry',
    'Administration', 'Library', 'Counseling'
  ];

  // Generate a random avatar color based on staff ID
  const getAvatarColor = (id) => {
    const colors = [
      '#3498db', '#9b59b6', '#e74c3c', '#1abc9c', '#f1c40f',
      '#34495e', '#16a085', '#d35400', '#8e44ad', '#2980b9'
    ];
    return colors[id % colors.length];
  };

  // Get initials from staff name
  const getInitials = (name) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get role icon based on role
  const getRoleIcon = (role) => {
    switch(role.toLowerCase()) {
      case 'principal':
        return '👑';
      case 'teacher':
        return '👨‍🏫';
      case 'administrator':
        return '👨‍💼';
      case 'librarian':
        return '📚';
      case 'counselor':
        return '🧠';
      case 'lab assistant':
        return '🔬';
      default:
        return '👤';
    }
  };

  return (
    <div className="staff-management">
      <h1>{t('staff.title')}</h1>
      
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
            {t('staff.addNew')}
          </button>
        )}
      </div>
      
      {showAddForm && (
        <div className="add-form">
          <h2>{t('staff.addNew')}</h2>
          <form onSubmit={handleAddStaff}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('staff.name')}</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newStaff.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('staff.role')}</label>
                <select 
                  name="role" 
                  value={newStaff.role} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">--{t('common.select')}--</option>
                  {roleOptions.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('staff.subject')}</label>
                <select 
                  name="subject" 
                  value={newStaff.subject} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">--{t('common.select')}--</option>
                  {subjectOptions.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('staff.contact')}</label>
                <input 
                  type="text" 
                  name="contact" 
                  value={newStaff.contact} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('staff.email')}</label>
                <input 
                  type="email" 
                  name="email" 
                  value={newStaff.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('staff.joinDate')}</label>
                <input 
                  type="date" 
                  name="joinDate" 
                  value={newStaff.joinDate} 
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
      
      {/* Card View for Staff */}
      <div className="staff-card-container">
        {filteredStaff.length > 0 ? (
          filteredStaff.map(member => (
            <div className="staff-card" key={member.id}>
              <div className="staff-card-header">
                <div 
                  className="staff-avatar" 
                  style={{ backgroundColor: getAvatarColor(member.id) }}
                >
                  {getInitials(member.name)}
                </div>
                <h3 className="staff-name">{member.name}</h3>
                <div className="staff-role">
                  <span className="role-icon">{getRoleIcon(member.role)}</span>
                  <span>{member.role}</span>
                </div>
                <div className="staff-id">ID: {member.id}</div>
              </div>
              <div className="staff-card-details">
                <div className="detail-row">
                  <span className="detail-label">{t('staff.subject')}:</span>
                  <span className="detail-value">{member.subject}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t('staff.email')}:</span>
                  <span className="detail-value">{member.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t('staff.contact')}:</span>
                  <span className="detail-value">{member.contact}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">{t('staff.joinDate')}:</span>
                  <span className="detail-value">{member.joinDate}</span>
                </div>
              </div>
              <div className="staff-card-actions">
                <button className="view-button">{t('staff.view')}</button>
                <button className="edit-button">{t('staff.edit')}</button>
                {hasPermission('admin') && (
                  <button 
                    className="delete-button" 
                    onClick={() => handleDeleteStaff(member.id)}
                  >
                    {t('staff.delete')}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No staff members found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffManagement;