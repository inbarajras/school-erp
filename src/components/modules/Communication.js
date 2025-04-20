import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import { messages as messagesData } from '../../mockData/messages';
import { students } from '../../mockData/students';
import { staff } from '../../mockData/staff';
import { classes } from '../../mockData/classes';

function Communication() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState(messagesData);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [activeTab, setActiveTab] = useState('inbox');
  const [recipientType, setRecipientType] = useState('all');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [newMessage, setNewMessage] = useState({
    subject: '',
    message: ''
  });

  // Filter messages for inbox and outbox
  const inboxMessages = messages.filter(msg => 
    msg.to === 'All' || msg.to === user?.role || msg.to === user?.name
  );
  const outboxMessages = messages.filter(msg => msg.from === user?.name);

  // Recipient options
  const recipientOptions = [
    { value: 'all', label: 'All' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'students', label: 'Students' },
    { value: 'parents', label: 'Parents' },
    { value: 'class', label: 'Specific Class' }
  ];

  // Class options
  const classOptions = [...new Set(classes.map(cls => cls.name))];
  
  // Section options based on selected class
  const sectionOptions = selectedClass 
    ? [...new Set(classes.filter(cls => cls.name === selectedClass).map(cls => cls.section))]
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage({
      ...newMessage,
      [name]: value
    });
  };

  const handleRecipientTypeChange = (e) => {
    setRecipientType(e.target.value);
    if (e.target.value !== 'class') {
      setSelectedClass('');
      setSelectedSection('');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    // Determine recipient based on selection
    let recipient = 'All';
    if (recipientType === 'class' && selectedClass && selectedSection) {
      recipient = `Class ${selectedClass}${selectedSection}`;
    } else if (recipientType !== 'all') {
      recipient = recipientType.charAt(0).toUpperCase() + recipientType.slice(1);
    }
    
    // Create new message
    const id = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    const currentDate = new Date().toISOString().split('T')[0];
    
    const messageToAdd = {
      id,
      from: user?.name,
      to: recipient,
      subject: newMessage.subject,
      message: newMessage.message,
      date: currentDate
    };
    
    setMessages([messageToAdd, ...messages]);
    setNewMessage({
      subject: '',
      message: ''
    });
    setShowComposeForm(false);
  };

  return (
    <div className="communication">
      <h1>{t('communication.title')}</h1>
      
      <div className="communication-controls">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            {t('communication.inbox')}
          </button>
          <button 
            className={`tab ${activeTab === 'outbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('outbox')}
          >
            {t('communication.outbox')}
          </button>
        </div>
        <button 
          className="compose-button" 
          onClick={() => setShowComposeForm(!showComposeForm)}
        >
          {t('communication.newMessage')}
        </button>
      </div>
      
      {showComposeForm && (
        <div className="compose-form">
          <h2>{t('communication.newMessage')}</h2>
          <form onSubmit={handleSendMessage}>
            <div className="form-group">
              <label>{t('communication.recipient')}</label>
              <select 
                value={recipientType}
                onChange={handleRecipientTypeChange}
                required
              >
                {recipientOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {recipientType === 'class' && (
              <div className="form-row">
                <div className="form-group">
                  <label>{t('communication.class')}</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setSelectedSection('');
                    }}
                    required
                  >
                    <option value="">--{t('common.select')}--</option>
                    {classOptions.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('communication.section')}</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    disabled={!selectedClass}
                    required
                  >
                    <option value="">--{t('common.select')}--</option>
                    {sectionOptions.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label>{t('communication.subject')}</label>
              <input 
                type="text" 
                name="subject" 
                value={newMessage.subject} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>{t('communication.message')}</label>
              <textarea 
                name="message" 
                value={newMessage.message} 
                onChange={handleInputChange} 
                required 
                rows="6"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="send-button">{t('communication.send')}</button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => setShowComposeForm(false)}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="messages-list">
        {activeTab === 'inbox' ? (
          <>
            <h2>{t('communication.inbox')}</h2>
            {inboxMessages.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>{t('communication.from')}</th>
                    <th>{t('communication.subject')}</th>
                    <th>{t('communication.date')}</th>
                    <th>{t('students.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {inboxMessages.map(message => (
                    <tr key={message.id}>
                      <td>{message.from}</td>
                      <td>{message.subject}</td>
                      <td>{message.date}</td>
                      <td className="actions">
                        <button className="view-button" onClick={() => alert(message.message)}>
                          {t('common.view')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">
                <p>No messages in your inbox.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2>{t('communication.outbox')}</h2>
            {outboxMessages.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>{t('communication.to')}</th>
                    <th>{t('communication.subject')}</th>
                    <th>{t('communication.date')}</th>
                    <th>{t('students.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {outboxMessages.map(message => (
                    <tr key={message.id}>
                      <td>{message.to}</td>
                      <td>{message.subject}</td>
                      <td>{message.date}</td>
                      <td className="actions">
                        <button className="view-button" onClick={() => alert(message.message)}>
                          {t('common.view')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">
                <p>No messages in your outbox.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Communication;