import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

function Navigation({ collapsed, setCollapsed }) {
  const { t } = useTranslation();
  const { logout, user, role } = useContext(AuthContext);
  const { language, changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get current page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/students') return 'Students';
    if (path === '/staff') return 'Staff';
    if (path === '/classes') return 'Classes';
    if (path === '/attendance') return 'Attendance';
    if (path === '/examinations') return 'Examinations';
    if (path === '/timetable') return 'Timetable';
    if (path === '/fees') return 'Fees';
    if (path === '/communication') return 'Communication';
    if (path === '/reports') return 'Reports';
    if (path === '/social') return 'Community Feed';
    if (path === '/assistant') return 'AI Assistant';
    if (path === '/transport') return 'Transport';
    if (path === '/activities') return 'Sports & Cultural';
    if (path === '/transport-tracking') return 'Transport Tracking';
    
    return 'School Management System';
  };

  // Navigation items with Material UI icons
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊', materialIcon: 'dashboard', visible: true },
    { path: '/students', label: 'Students', icon: '👨‍🎓', materialIcon: 'school', visible: role === 'admin' || role === 'teacher' },
    { path: '/staff', label: 'Staff', icon: '👨‍🏫', materialIcon: 'groups', visible: role === 'admin' || role === 'teacher' },
    { path: '/classes', label: 'Classes', icon: '🏫', materialIcon: 'meeting_room', visible: role === 'admin' || role === 'teacher' },
    { path: '/attendance', label: 'Attendance', icon: '📋', materialIcon: 'fact_check', visible: role === 'admin' || role === 'teacher' },
    { path: '/examinations', label: 'Examinations', icon: '📝', materialIcon: 'quiz', visible: role === 'admin' || role === 'teacher' },
    { path: '/timetable', label: 'Timetable', icon: '🕒', materialIcon: 'schedule', visible: role === 'admin' || role === 'teacher' },
    { path: '/fees', label: 'Fees', icon: '💰', materialIcon: 'payments', visible: role === 'admin' || role === 'teacher' },
    { path: '/communication', label: 'Communication', icon: '✉️', materialIcon: 'email', visible: true },
    { path: '/social', label: 'Community Feed', icon: '🌐', materialIcon: 'forum', visible: true },
    { path: '/reports', label: 'Reports', icon: '📈', materialIcon: 'bar_chart', visible: role === 'admin' || role === 'teacher' },
    { path: '/transport', label: 'Transport Management', icon: '🚌', materialIcon: 'directions_bus', visible: role === 'admin' || role === 'teacher' },
    { path: '/transport-tracking', label: 'Transport Tracking', icon: '🗺️', materialIcon: 'location_on', visible: role === 'parent' || role === 'admin' || role === 'teacher' },
    { path: '/activities', label: 'Sports & Cultural', icon: '🏆', materialIcon: 'emoji_events', visible: true },
    { path: '/assistant', label: 'AI Assistant', icon: '🤖', materialIcon: 'smart_toy', visible: true },
  ];

  return (
    <>
      {/* Top Header Bar with Gradient */}
      <header className="app-header gradient-header">
        <div className="header-left">
          <button 
            className="menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className="material-icons">menu</span>
          </button>
          
          <button 
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <span className="material-icons">chevron_right</span> : <span className="material-icons">chevron_left</span>}
          </button>
          
          <div className="logo-wrapper">
            <div className="app-logo"><span className="material-icons">school</span></div>
            <h1 className="app-title">School Management System</h1>
          </div>
          
          <div className="page-title-container">
            <span className="separator">|</span>
            <h2 className="page-title">{getPageTitle()}</h2>
          </div>
        </div>
        
        <div className="header-right">
          {/* <div className="language-selector">
            <button 
              onClick={() => changeLanguage('en')} 
              className={language === 'en' ? 'active' : ''}
            >
              EN
            </button>
            <button 
              onClick={() => changeLanguage('ta')} 
              className={language === 'ta' ? 'active' : ''}
            >
              தமிழ்
            </button>
          </div> */}
          
          <div className="user-profile">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
              alt={user?.name} 
              className="user-avatar"
            />
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{role}</span>
            </div>
          </div>
          
          <button onClick={handleLogout} className="header-logout-button">
            <span className="material-icons logout-icon">logout</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </header>
      
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
      
      {/* Sidebar Navigation with gradient background */}
      <aside className={`sidebar gradient-bg ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-content">
          <ul className="nav-links">
            {navItems.filter(item => item.visible).map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span className="material-icons nav-icon">{item.materialIcon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Mobile close button */}
        {mobileOpen && (
          <button 
            className="close-sidebar"
            onClick={() => setMobileOpen(false)}
          >
            <span className="material-icons">close</span>
          </button>
        )}
      </aside>

      {/* CSS for gradient styles - add this to your CSS file */}
      <style>
        {`
          /* Gradient background for sidebar */
          .sidebar.gradient-bg {
            background: linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%);
            color: white;
          }
          
          /* Gradient background for header */
          .app-header.gradient-header {
            background: linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          
          /* Adjusted text and icon colors for gradient header */
          .gradient-header .header-left button,
          .gradient-header .app-logo,
          .gradient-header .app-title,
          .gradient-header .separator,
          .gradient-header .page-title,
          .gradient-header .user-name,
          .gradient-header .user-role {
            color: white;
          }
          
          /* Special styling for buttons in gradient header */
          .gradient-header .menu-toggle:hover, 
          .gradient-header .sidebar-toggle:hover {
            background-color: rgba(255, 255, 255, 0.15);
          }
          
          /* Header logout button styling */
          .gradient-header .header-logout-button {
            background-color: rgba(231, 76, 60, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            transition: all 0.3s ease;
          }
          
          .gradient-header .header-logout-button:hover {
            background-color: rgba(231, 76, 60, 0.4);
            transform: translateY(-2px);
          }
          
          /* User avatar border */
          .gradient-header .user-avatar {
            border: 2px solid rgba(255, 255, 255, 0.8);
          }
          
          .sidebar.gradient-bg .nav-links li a {
            color: rgba(255, 255, 255, 0.85);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            padding: 12px 15px;
          }
          
          .sidebar.gradient-bg .nav-links li a:hover,
          .sidebar.gradient-bg .nav-links li a.active {
            color: white;
            background-color: rgba(255, 255, 255, 0.15);
          }
          
          .sidebar.gradient-bg .nav-links li a.active {
            border-left: 3px solid white;
          }
          
          .material-icons {
            font-size: 24px;
          }
          
          .nav-icon {
            margin-right: 12px;
          }
          
          .sidebar.collapsed .nav-icon {
            margin-right: 0;
          }
          
          /* Make sure to include Material Icons CSS in your HTML */
          /* Add this to your HTML: <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> */
        `}
      </style>
    </>
  );
}

export default Navigation;