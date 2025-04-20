import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fees as feesData } from '../../mockData/fees';
import { students } from '../../mockData/students';
import { classes } from '../../mockData/classes';

function FeeManagement() {
  const { t } = useTranslation();
  const [fees, setFees] = useState(feesData);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedFeeType, setSelectedFeeType] = useState('');
  const [studentFees, setStudentFees] = useState([]);
  const [showCollectForm, setShowCollectForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Class options for filtering
  const classOptions = [...new Set(classes.map(cls => cls.name))];
  
  // Fee type options based on selected class
  const feeTypeOptions = selectedClass 
    ? [...new Set(fees.filter(fee => fee.class === selectedClass).map(fee => fee.feeType))]
    : [];

  useEffect(() => {
    if (selectedClass && selectedFeeType) {
      // Find fee details
      const feeDetails = fees.find(
        fee => fee.class === selectedClass && fee.feeType === selectedFeeType
      );
      
      if (feeDetails) {
        // Find students in this class
        const studentsInClass = students.filter(s => s.class === selectedClass);
        
        // Create fee records for each student (with random payment status for demo)
        const statuses = ['paid', 'unpaid', 'partial'];
        const studentFeeRecords = studentsInClass.map(student => {
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return {
            studentId: student.id,
            studentName: student.name,
            feeId: feeDetails.id,
            amount: feeDetails.amount,
            dueDate: feeDetails.dueDate,
            status: randomStatus,
            paidAmount: randomStatus === 'paid' ? feeDetails.amount : 
                       randomStatus === 'partial' ? Math.floor(feeDetails.amount / 2) : 0,
            paymentDate: randomStatus === 'paid' ? '2025-04-10' : null,
            receiptNo: randomStatus === 'paid' ? `R-${Math.floor(1000 + Math.random() * 9000)}` : null
          };
        });
        
        setStudentFees(studentFeeRecords);
      }
    } else {
      setStudentFees([]);
    }
  }, [selectedClass, selectedFeeType]);

  const handleCollectFee = (student) => {
    setSelectedStudent(student);
    setShowCollectForm(true);
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    // Get form data
    const formData = new FormData(e.target);
    const paidAmount = Number(formData.get('paidAmount'));
    
    // Update student fee record
    setStudentFees(prevFees => 
      prevFees.map(fee => {
        if (fee.studentId === selectedStudent.studentId) {
          // Calculate new status
          let newStatus = 'unpaid';
          if (paidAmount >= fee.amount) {
            newStatus = 'paid';
          } else if (paidAmount > 0) {
            newStatus = 'partial';
          }
          
          return {
            ...fee,
            paidAmount: paidAmount,
            paymentDate: formData.get('paymentDate'),
            receiptNo: formData.get('receiptNo'),
            status: newStatus
          };
        }
        return fee;
      })
    );
    
    setShowCollectForm(false);
    setSelectedStudent(null);
  };

  return (
    <div className="fee-management">
      <h1>{t('fees.title')}</h1>
      
      <div className="fee-filters">
        <div className="filter-group">
          <label>{t('fees.class')}</label>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedFeeType('');
            }}
          >
            <option value="">--{t('common.select')}--</option>
            {classOptions.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>{t('fees.feeType')}</label>
          <select
            value={selectedFeeType}
            onChange={(e) => setSelectedFeeType(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">--{t('common.select')}--</option>
            {feeTypeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      
      {showCollectForm && selectedStudent && (
        <div className="collect-form">
          <h2>{t('fees.collectFee')}</h2>
          <div className="student-info">
            <p><strong>{t('students.name')}:</strong> {selectedStudent.studentName}</p>
            <p><strong>{t('fees.amount')}:</strong> {selectedStudent.amount}</p>
            <p><strong>{t('fees.dueDate')}:</strong> {selectedStudent.dueDate}</p>
            <p><strong>{t('fees.status')}:</strong> {t(`fees.${selectedStudent.status}`)}</p>
          </div>
          <form onSubmit={handleSavePayment}>
            <div className="form-row">
              <div className="form-group">
                <label>{t('fees.paymentDate')}</label>
                <input 
                  type="date" 
                  name="paymentDate" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('fees.amount')}</label>
                <input 
                  type="number" 
                  name="paidAmount" 
                  defaultValue={selectedStudent.amount - selectedStudent.paidAmount}
                  min="0"
                  max={selectedStudent.amount - selectedStudent.paidAmount}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{t('fees.receiptNo')}</label>
                <input 
                  type="text" 
                  name="receiptNo" 
                  defaultValue={`R-${Math.floor(1000 + Math.random() * 9000)}`}
                  required 
                />
              </div>
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-button">{t('common.save')}</button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => {
                  setShowCollectForm(false);
                  setSelectedStudent(null);
                }}
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {studentFees.length > 0 && (
        <div className="fees-list">
          <table>
            <thead>
              <tr>
                <th>{t('students.id')}</th>
                <th>{t('students.name')}</th>
                <th>{t('fees.amount')}</th>
                <th>{t('fees.dueDate')}</th>
                <th>{t('fees.status')}</th>
                <th>{t('fees.paymentDate')}</th>
                <th>{t('fees.receiptNo')}</th>
                <th>{t('students.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {studentFees.map(fee => (
                <tr key={fee.studentId} className={`status-${fee.status}`}>
                  <td>{fee.studentId}</td>
                  <td>{fee.studentName}</td>
                  <td>{fee.amount}</td>
                  <td>{fee.dueDate}</td>
                  <td>{t(`fees.${fee.status}`)}</td>
                  <td>{fee.paymentDate || '-'}</td>
                  <td>{fee.receiptNo || '-'}</td>
                  <td className="actions">
                    {fee.status !== 'paid' && (
                      <button 
                        className="edit-button" 
                        onClick={() => handleCollectFee(fee)}
                      >
                        {t('fees.collectFee')}
                      </button>
                    )}
                    <button 
                      className="view-button"
                      onClick={() => alert('Generate Invoice functionality')}
                    >
                      {t('fees.generateInvoice')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedClass && selectedFeeType && studentFees.length === 0 && (
        <div className="no-data">
          <p>No fee information found for the selected criteria.</p>
        </div>
      )}
    </div>
  );
}

export default FeeManagement;