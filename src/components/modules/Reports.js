import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { students } from '../../mockData/students';
import { classes } from '../../mockData/classes';
import { attendance } from '../../mockData/attendance';
import { fees } from '../../mockData/fees';

function Reports() {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState('attendance');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // Class options
  const classOptions = [...new Set(classes.map(cls => cls.name))];
  
  // Section options based on selected class
  const sectionOptions = selectedClass 
    ? [...new Set(classes.filter(cls => cls.name === selectedClass).map(cls => cls.section))]
    : [];
    
  // Student options based on selected class and section
  const studentOptions = selectedClass && selectedSection
    ? students.filter(
        student => student.class === selectedClass && student.section === selectedSection
      )
    : [];

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
    setReportData(null);
    setShowReport(false);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = () => {
    // In a real application, this would fetch data from an API
    // Here we'll generate mock data based on the selections
    
    let generatedData = null;
    
    if (reportType === 'attendance') {
      // Generate attendance report
      const filteredAttendance = attendance.filter(record => {
        // Filter by date range
        const recordDate = new Date(record.date);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        
        if (recordDate < startDate || recordDate > endDate) {
          return false;
        }
        
        // Filter by class and section
        if (selectedClass && record.class !== selectedClass) {
          return false;
        }
        
        if (selectedSection && record.section !== selectedSection) {
          return false;
        }
        
        // Filter by student if selected
        if (selectedStudent && record.studentId !== parseInt(selectedStudent)) {
          return false;
        }
        
        return true;
      });
      
      // Group by student
      const groupedByStudent = {};
      filteredAttendance.forEach(record => {
        if (!groupedByStudent[record.studentId]) {
          const student = students.find(s => s.id === record.studentId);
          groupedByStudent[record.studentId] = {
            studentId: record.studentId,
            studentName: student ? student.name : `Student ${record.studentId}`,
            present: 0,
            absent: 0,
            total: 0
          };
        }
        
        if (record.status === 'present') {
          groupedByStudent[record.studentId].present += 1;
        } else {
          groupedByStudent[record.studentId].absent += 1;
        }
        
        groupedByStudent[record.studentId].total += 1;
      });
      
      generatedData = {
        type: 'attendance',
        title: 'Attendance Report',
        dateRange: `${dateRange.startDate} to ${dateRange.endDate}`,
        students: Object.values(groupedByStudent).map(student => ({
          ...student,
          presentPercentage: student.total > 0 
            ? Math.round((student.present / student.total) * 100) 
            : 0
        }))
      };
    } else if (reportType === 'academic') {
      // Generate academic report (simplified mock data)
      const studentsList = selectedStudent 
        ? students.filter(s => s.id === parseInt(selectedStudent))
        : selectedClass && selectedSection
          ? students.filter(s => s.class === selectedClass && s.section === selectedSection)
          : [];
          
      generatedData = {
        type: 'academic',
        title: 'Academic Performance Report',
        dateRange: `${dateRange.startDate} to ${dateRange.endDate}`,
        students: studentsList.map(student => {
          // Generate random marks for subjects
          const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer'];
          const subjectMarks = subjects.map(subject => ({
            subject,
            marks: Math.floor(50 + Math.random() * 50), // Random marks between 50-100
            grade: ['A+', 'A', 'B+', 'B', 'C'][Math.floor(Math.random() * 5)]
          }));
          
          // Calculate average
          const totalMarks = subjectMarks.reduce((sum, subject) => sum + subject.marks, 0);
          const average = Math.round(totalMarks / subjects.length);
          
          return {
            studentId: student.id,
            studentName: student.name,
            subjects: subjectMarks,
            average,
            rank: Math.floor(Math.random() * 30) + 1 // Random rank
          };
        })
      };
    } else if (reportType === 'fee') {
      // Generate fee collection report
      const feeTypes = selectedClass 
        ? fees.filter(fee => fee.class === selectedClass).map(fee => fee.feeType)
        : [];
        
      const studentsList = selectedStudent 
        ? students.filter(s => s.id === parseInt(selectedStudent))
        : selectedClass && selectedSection
          ? students.filter(s => s.class === selectedClass && s.section === selectedSection)
          : [];
          
      generatedData = {
        type: 'fee',
        title: 'Fee Collection Report',
        dateRange: `${dateRange.startDate} to ${dateRange.endDate}`,
        summary: {
          totalStudents: studentsList.length,
          feeTypes,
          collected: Math.floor(70 + Math.random() * 30), // Random percentage between 70-100
          pending: Math.floor(Math.random() * 30) // Random percentage between 0-30
        },
        students: studentsList.map(student => {
          // Generate random fee status for each fee type
          const statuses = ['paid', 'unpaid', 'partial'];
          const feeStatus = feeTypes.map(feeType => {
            const feeDetails = fees.find(fee => fee.class === selectedClass && fee.feeType === feeType);
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            return {
              feeType,
              amount: feeDetails ? feeDetails.amount : 10000,
              status,
              paidAmount: status === 'paid' ? (feeDetails ? feeDetails.amount : 10000) :
                          status === 'partial' ? Math.floor((feeDetails ? feeDetails.amount : 10000) / 2) : 0
            };
          });
          
          return {
            studentId: student.id,
            studentName: student.name,
            fees: feeStatus
          };
        })
      };
    }
    
    setReportData(generatedData);
    setShowReport(true);
  };

  const renderReportContent = () => {
    if (!reportData) return null;
    
    switch (reportData.type) {
      case 'attendance':
        return (
          <div className="attendance-report">
            <div className="report-summary">
              <p>
                <strong>Date Range:</strong> {reportData.dateRange}
              </p>
              <p>
                <strong>Total Students:</strong> {reportData.students.length}
              </p>
            </div>
            
            <table className="report-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Present Days</th>
                  <th>Absent Days</th>
                  <th>Total Days</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {reportData.students.map(student => (
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>{student.studentName}</td>
                    <td>{student.present}</td>
                    <td>{student.absent}</td>
                    <td>{student.total}</td>
                    <td>{student.presentPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'academic':
        return (
          <div className="academic-report">
            <div className="report-summary">
              <p>
                <strong>Date Range:</strong> {reportData.dateRange}
              </p>
              <p>
                <strong>Total Students:</strong> {reportData.students.length}
              </p>
            </div>
            
            {reportData.students.map(student => (
              <div key={student.studentId} className="student-report-card">
                <h3>Student Report Card</h3>
                <div className="student-info">
                  <p><strong>Student ID:</strong> {student.studentId}</p>
                  <p><strong>Student Name:</strong> {student.studentName}</p>
                  <p><strong>Class:</strong> {selectedClass} {selectedSection}</p>
                  <p><strong>Rank:</strong> {student.rank}</p>
                </div>
                
                <table className="marks-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.subjects.map(subject => (
                      <tr key={subject.subject}>
                        <td>{subject.subject}</td>
                        <td>{subject.marks}</td>
                        <td>{subject.grade}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>Average</td>
                      <td colSpan="2">{student.average}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        );
        
      case 'fee':
        return (
          <div className="fee-report">
            <div className="report-summary">
              <p>
                <strong>Date Range:</strong> {reportData.dateRange}
              </p>
              <p>
                <strong>Total Students:</strong> {reportData.summary.totalStudents}
              </p>
              <p>
                <strong>Collection Rate:</strong> {reportData.summary.collected}%
              </p>
              <p>
                <strong>Pending Rate:</strong> {reportData.summary.pending}%
              </p>
            </div>
            
            <table className="report-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  {reportData.summary.feeTypes.map(type => (
                    <th key={type}>{type}</th>
                  ))}
                  <th>Total Paid</th>
                  <th>Total Pending</th>
                </tr>
              </thead>
              <tbody>
                {reportData.students.map(student => {
                  const totalPaid = student.fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
                  const totalAmount = student.fees.reduce((sum, fee) => sum + fee.amount, 0);
                  const totalPending = totalAmount - totalPaid;
                  
                  return (
                    <tr key={student.studentId}>
                      <td>{student.studentId}</td>
                      <td>{student.studentName}</td>
                      {student.fees.map((fee, index) => (
                        <td key={index} className={`status-${fee.status}`}>
                          {fee.paidAmount} / {fee.amount}
                        </td>
                      ))}
                      <td>{totalPaid}</td>
                      <td>{totalPending}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        
      default:
        return <div>No report data available</div>;
    }
  };

  return (
    <div className="reports">
      <h1>{t('reports.title')}</h1>
      
      <div className="report-filters">
        <div className="filter-group">
          <label>{t('reports.title')}</label>
          <select value={reportType} onChange={handleReportTypeChange}>
            <option value="attendance">{t('reports.attendance')}</option>
            <option value="academic">{t('reports.academic')}</option>
            <option value="fee">{t('reports.fee')}</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>{t('reports.class')}</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedSection('');
              setSelectedStudent('');
            }}
          >
            <option value="">--{t('common.select')}--</option>
            {classOptions.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>{t('reports.section')}</label>
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setSelectedStudent('');
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
          <label>{t('reports.student')}</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            disabled={!selectedSection}
          >
            <option value="">--{t('common.select')}--</option>
            {studentOptions.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="date-range">
        <div className="filter-group">
          <label>{t('reports.dateRange')}</label>
          <div className="date-inputs">
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
            <span>to</span>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>
      
      <div className="generate-button-container">
        <button 
          className="generate-button"
          onClick={generateReport}
          disabled={!selectedClass}
        >
          {t('reports.generate')}
        </button>
      </div>
      
      {showReport && reportData && (
        <div className="report-container">
          <div className="report-header">
            <h2>{reportData.title}</h2>
            <div className="report-actions">
              <button className="export-button">{t('reports.export')}</button>
              <button className="print-button">{t('reports.print')}</button>
            </div>
          </div>
          
          <div className="report-content">
            {renderReportContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;