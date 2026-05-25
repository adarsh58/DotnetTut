import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CourseView from './pages/CourseView.jsx'

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className="layout-container">
        <header className="main-header">
          <Link to="/" className="logo-container">
            <span className="logo-icon">🚀</span>
            <span>DotNet Tutorials</span>
          </Link>
          
          <nav className="header-actions">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Dashboard
            </NavLink>
            
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <i className="fa-solid fa-sun"></i>
              ) : (
                <i className="fa-solid fa-moon"></i>
              )}
            </button>
          </nav>
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course/:courseId" element={<CourseView />} />
            <Route path="/course/:courseId/:lessonSlug" element={<CourseView />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
