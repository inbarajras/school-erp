import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const { language, changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Educational quotes
  const staticQuote = {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="quotes-section">
          <div className="quote-container">
            <p className="quote-text">"{staticQuote.text}"</p>
            <p className="quote-author">- {staticQuote.author}</p>
          </div>
        </div>
        
        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="login-header">
              <div className="login-logo">
                <span className="material-icons">school</span>
              </div>
              <h1>School Management System</h1>
              <p className="login-subtitle">Sign in to your account</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-with-icon">
                  <span className="material-icons">person</span>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-with-icon">
                  <span className="material-icons">lock</span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
              
              <button type="submit" className="login-button">
                <span className="material-icons">login</span>
                Sign In
              </button>
            </form>
            
            <div className="login-help">
              <p>Demo credentials:</p>
              <div className="credentials-grid">
                <div className="credential-item">
                  <div className="credential-role">Admin</div>
                  <div className="credential-details">
                    <div><span>Username:</span> admin</div>
                    <div><span>Password:</span> 123456</div>
                  </div>
                </div>
                <div className="credential-item">
                  <div className="credential-role">Teacher</div>
                  <div className="credential-details">
                    <div><span>Username:</span> teacher</div>
                    <div><span>Password:</span> 123456</div>
                  </div>
                </div>
                <div className="credential-item">
                  <div className="credential-role">Student</div>
                  <div className="credential-details">
                    <div><span>Username:</span> student</div>
                    <div><span>Password:</span> 123456</div>
                  </div>
                </div>
                <div className="credential-item">
                  <div className="credential-role">Parent</div>
                  <div className="credential-details">
                    <div><span>Username:</span> parent</div>
                    <div><span>Password:</span> 123456</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .login-page {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url('https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2672&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        
        .login-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }
        
        .login-content {
          display: flex;
          width: 100%;
          max-width: 1200px;
          height: 100%;
          position: relative;
          z-index: 1;
        }
        
        .quotes-section {
          flex: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        
        .quote-container {
          text-align: center;
          max-width: 600px;
          color: white;
        }
        
        .quote-text {
          font-size: 2rem;
          font-weight: 300;
          line-height: 1.4;
          margin-bottom: 20px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }
        
        .quote-author {
          font-size: 1.2rem;
          font-style: italic;
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        }
        
        .login-card-wrapper {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        
        .login-card {
          width: 100%;
          max-width: 450px;
          background: linear-gradient(135deg, rgba(58, 28, 113, 0.7) 0%, rgba(215, 109, 119, 0.7) 50%, rgba(255, 175, 123, 0.7) 100%);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          color: white;
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .login-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 15px;
        }
        
        .login-logo .material-icons {
          font-size: 48px;
          padding: 10px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }
        
        .login-header h1 {
          font-size: 1.8rem;
          font-weight: 600;
          margin: 10px 0;
        }
        
        .login-subtitle {
          font-size: 1rem;
          opacity: 0.9;
        }
        
        .error-message {
          background-color: rgba(231, 76, 60, 0.3);
          border-left: 4px solid #e74c3c;
          padding: 10px 15px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .input-with-icon {
          position: relative;
        }
        
        .input-with-icon .material-icons {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.6);
        }
        
        .input-with-icon input {
          width: 100%;
          padding: 12px 12px 12px 45px;
          background-color: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        
        .input-with-icon input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .input-with-icon input:focus {
          background-color: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          outline: none;
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          font-size: 0.9rem;
        }
        
        .remember-me {
          display: flex;
          align-items: center;
        }
        
        .remember-me input {
          margin-right: 8px;
        }
        
        .forgot-password {
          color: white;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.3s;
        }
        
        .forgot-password:hover {
          opacity: 1;
          text-decoration: underline;
        }
        
        .login-button {
          width: 100%;
          padding: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.25);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 25px;
        }
        
        .login-button .material-icons {
          margin-right: 10px;
        }
        
        .login-button:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: translateY(-2px);
        }
        
        .login-help {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 20px;
        }
        
        .login-help p {
          margin-bottom: 15px;
          text-align: center;
          font-weight: 500;
        }
        
        .credentials-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .credential-item {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 10px;
        }
        
        .credential-role {
          font-weight: 600;
          margin-bottom: 5px;
          padding-bottom: 5px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .credential-details {
          font-size: 0.85rem;
        }
        
        .credential-details div {
          margin: 3px 0;
        }
        
        .credential-details span {
          font-weight: 500;
          margin-right: 5px;
        }
        
        /* Responsive styles */
        @media (max-width: 992px) {
          .login-content {
            flex-direction: column;
            height: auto;
            min-height: 100%;
          }
          
          .quotes-section {
            padding: 30px 20px;
          }
          
          .quote-text {
            font-size: 1.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .login-page {
            height: auto;
            min-height: 100vh;
          }
        }
        
        @media (max-width: 576px) {
          .login-card {
            padding: 25px;
          }
          
          .login-header h1 {
            font-size: 1.5rem;
          }
          
          .credentials-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;