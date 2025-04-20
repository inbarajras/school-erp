import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exams as examsData } from '../../mockData/exams';
import { classes } from '../../mockData/classes';
import { students } from '../../mockData/students';

function Examination() {
  const { t } = useTranslation();
  const [exams, setExams] = useState(examsData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [newExam, setNewExam] = useState({
    name: '',
    class: '',
    subject: '',
    date: '',
    duration: '',
    totalMarks: 100
  });

  // Class options for filtering
  const classOptions = [...new Set(classes.map(cls => cls.name))];
  
  // Subject options (hardcoded for simplicity)
  const subjectOptions = [
    'Mathematics', 'Science', 'English', 'Social Studies', 
    'Computer Science', 'Tamil', 'Hindi', 'Physics', 'Chemistry'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExam({
      ...newExam,
      [name]: value
    });
  };

  const handleAddExam = (e) => {
    e.preventDefault();
    const id = exams.length > 0 ? Math.max(...exams.map(e => e.id)) + 1 : 1;
    const examToAdd = {
      id,
      ...newExam
    };
    setExams([...exams, examToAdd]);
    setNewExam({
      name: '',
      class: '',
      subject: '',
      date: '',
      duration: '',
      totalMarks: 100
    });
    setShowAddForm(false);
  };

  const handleAddResult = (examId) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      setSelectedExam(exam);
      // Find students in this class
      const studentsInClass = students.filter(s => s.class === exam.class);
      const initialResults = studentsInClass.map(student => ({
        examId,
        studentId: student.id,
        studentName: student.name,
        marks: '',
        grade: ''
      }));
      setExamResults(initialResults);
      setShowResultForm(true);
    }
  };

  const handleMarksChange = (studentId, marks) => {
    setExamResults(
      examResults.map(result => {
        if (result.studentId === studentId) {
          // Calculate grade based on marks (simple calculation)
          let grade = '';
          const numMarks = Number(marks);
          const totalMarks = selectedExam.totalMarks;
          const percentage = (numMarks / totalMarks) * 100;
          
          if (percentage >= 90) grade = 'A+';
          else if (percentage >= 80) grade = 'A';
          else if (percentage >= 70) grade = 'B+';
          else if (percentage >= 60) grade = 'B';
          else if (percentage >= 50) grade = 'C';
          else if (percentage >= 40) grade = 'D';
          else grade = 'F';
          
          return { ...result, marks, grade };
        }
        return result;
      })
    );
  };

  const handleSaveResults = () => {
    // In a real application, this would save to the database
    alert(t('common.success'));
    setShowResultForm(false);
  };
  
  // Get subject icon
  const getSubjectIcon = (subject) => {
    switch(subject.toLowerCase()) {
      case 'mathematics':
        return '🧮';
      case 'science':
        return '🔬';
      case 'english':
        return '📝';
      case 'social studies':
        return '🌍';
      case 'computer science':
        return '💻';
      case 'tamil':
      case 'hindi':
        return '🗣️';
      case 'physics':
        return '⚛️';
      case 'chemistry':
        return '⚗️';
      default:
        return '📚';
    }
  };
  
  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Get grade color
  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+':
        return '#27ae60';
      case 'A':
        return '#2ecc71';
      case 'B+':
        return '#3498db';
      case 'B':
        return '#2980b9';
      case 'C':
        return '#f39c12';
      case 'D':
        return '#e67e22';
      case 'F':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  return (
    <div className="examination">
      <h1>{t('examinations.title')}</h1>
      
      <div className="controls">
        <div className="filter-controls">
          {/* Add filters here if needed */}
        </div>
        <button 
          className="add-button" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {t('examinations.addExam')}
        </button>
      </div>
      
      {showAddForm && (
        <div className="add-form">
          <h2>{t('examinations.addExam')}</h2>
          <form onSubmit={handleAddExam}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('examinations.name')}</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newExam.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('examinations.class')}</label>
                <select 
                  name="class" 
                  value={newExam.class} 
                  onChange={handleInputChange} 
                  required
                >
                  <option value="">--{t('common.select')}--</option>
                  {classOptions.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('examinations.subject')}</label>
                <select 
                  name="subject" 
                  value={newExam.subject} 
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
                <label>{t('examinations.date')}</label>
                <input 
                  type="date" 
                  name="date" 
                  value={newExam.date} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('examinations.duration')}</label>
                <input 
                  type="text" 
                  name="duration" 
                  value={newExam.duration} 
                  onChange={handleInputChange} 
                  placeholder="e.g. 3 hours"
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('examinations.totalMarks')}</label>
                <input 
                  type="number" 
                  name="totalMarks" 
                  value={newExam.totalMarks} 
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
      
      {showResultForm && selectedExam && (
        <div className="result-form">
          <div className="result-form-header">
            <h2>
              {t('examinations.addResult')}
            </h2>
            <div className="exam-badge">
              <span className="subject-icon">{getSubjectIcon(selectedExam.subject)}</span>
              <span className="exam-name">{selectedExam.name}</span>
              <span className="exam-subject">{selectedExam.subject}</span>
              <span className="exam-class">Class {selectedExam.class}</span>
            </div>
          </div>
          
          <div className="exam-details">
            <div className="detail-card">
              <div className="detail-icon">📅</div>
              <div className="detail-info">
                <div className="detail-label">{t('examinations.date')}</div>
                <div className="detail-value">{formatDate(selectedExam.date)}</div>
              </div>
            </div>
            <div className="detail-card">
              <div className="detail-icon">⏱️</div>
              <div className="detail-info">
                <div className="detail-label">Duration</div>
                <div className="detail-value">{selectedExam.duration}</div>
              </div>
            </div>
            <div className="detail-card">
              <div className="detail-icon">🎯</div>
              <div className="detail-info">
                <div className="detail-label">{t('examinations.totalMarks')}</div>
                <div className="detail-value">{selectedExam.totalMarks}</div>
              </div>
            </div>
          </div>
          
          <div className="results-table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>{t('students.id')}</th>
                  <th>{t('students.name')}</th>
                  <th>Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {examResults.map(result => (
                  <tr key={result.studentId}>
                    <td>{result.studentId}</td>
                    <td>{result.studentName}</td>
                    <td>
                      <input 
                        type="number" 
                        value={result.marks} 
                        onChange={(e) => handleMarksChange(result.studentId, e.target.value)}
                        max={selectedExam.totalMarks}
                        min="0"
                      />
                    </td>
                    <td>
                      <span 
                        className="grade-badge"
                        style={{ backgroundColor: getGradeColor(result.grade) }}
                      >
                        {result.grade || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="form-buttons">
            <button onClick={handleSaveResults} className="save-button">
              {t('common.save')}
            </button>
            <button 
              className="cancel-button" 
              onClick={() => setShowResultForm(false)}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}
      
      {/* Exams Card View */}
      <div className="exams-card-container">
        {exams.map(exam => (
          <div className="exam-card" key={exam.id}>
            <div className="exam-card-header">
              <div className="subject-icon">
                {getSubjectIcon(exam.subject)}
              </div>
              <div className="exam-info">
                <h3>{exam.name}</h3>
                <div className="exam-meta">
                  <span className="exam-subject">{exam.subject}</span>
                  <span className="exam-divider">•</span>
                  <span className="exam-class">Class {exam.class}</span>
                </div>
              </div>
            </div>
            <div className="exam-card-details">
              <div className="detail-item">
                <span className="detail-label">{t('examinations.date')}:</span>
                <span className="detail-value">{formatDate(exam.date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('examinations.duration')}:</span>
                <span className="detail-value">{exam.duration}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('examinations.totalMarks')}:</span>
                <span className="detail-value">{exam.totalMarks}</span>
              </div>
            </div>
            <div className="exam-card-actions">
              <button 
                className="view-button"
                onClick={() => alert('View results functionality')}
              >
                {t('examinations.viewResults')}
              </button>
              <button 
                className="edit-button"
                onClick={() => handleAddResult(exam.id)}
              >
                {t('examinations.addResult')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Examination;