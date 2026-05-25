import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import coursesData from '../data/courses.json'
import LessonContent from '../components/LessonContent.jsx'
import NotesManager from '../components/NotesManager.jsx'
import QuizView from '../components/QuizView.jsx'

export default function CourseView() {
  const { courseId, lessonSlug } = useParams();
  const navigate = useNavigate();

  const course = coursesData[courseId];
  
  if (!course) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <button className="nav-btn" onClick={() => navigate('/')} style={{ margin: '1.5rem auto' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Sidebar search filter
  const [sidebarQuery, setSidebarQuery] = useState('');
  
  // Track open/collapsed state of syllabus sections
  const [openSections, setOpenSections] = useState({});
  
  // Track completed lessons
  const [completedLessons, setCompletedLessons] = useState([]);
  
  // Sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // active tab: 'lesson' | 'notes' | 'quiz'
  const [activeTab, setActiveTab] = useState('lesson');

  // Load completed lessons list
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem(`completed_${courseId}`)) || [];
    setCompletedLessons(list);

    // Default open all sections initially
    const sectionsObj = {};
    course.syllabus.forEach((sec, idx) => {
      sectionsObj[idx] = true;
    });
    setOpenSections(sectionsObj);
  }, [courseId]);

  // Build a flat list of lessons for next/prev navigation
  const flatLessons = [];
  course.syllabus.forEach(section => {
    section.lessons.forEach(lesson => {
      flatLessons.push(lesson);
    });
  });

  const activeLessonIdx = flatLessons.findIndex(l => l.slug === lessonSlug);
  const activeLesson = activeLessonIdx !== -1 ? flatLessons[activeLessonIdx] : flatLessons[0];

  // If no slug is specified in URL, redirect to the first lesson
  useEffect(() => {
    if (!lessonSlug && flatLessons.length > 0) {
      navigate(`/course/${courseId}/${flatLessons[0].slug}`, { replace: true });
    }
  }, [lessonSlug, courseId, flatLessons]);

  const toggleSection = (idx) => {
    setOpenSections(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleLessonClick = (slug) => {
    navigate(`/course/${courseId}/${slug}`);
    setActiveTab('lesson'); // Reset to lesson body view on change
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false); // Collapses on mobile after click
    }
  };

  const toggleLessonComplete = (slug, e) => {
    e.stopPropagation();
    let updated;
    if (completedLessons.includes(slug)) {
      updated = completedLessons.filter(s => s !== slug);
    } else {
      updated = [...completedLessons, slug];
    }
    setCompletedLessons(updated);
    localStorage.setItem(`completed_${courseId}`, JSON.stringify(updated));
  };

  const handleNext = () => {
    if (activeLessonIdx !== -1 && activeLessonIdx < flatLessons.length - 1) {
      navigate(`/course/${courseId}/${flatLessons[activeLessonIdx + 1].slug}`);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (activeLessonIdx > 0) {
      navigate(`/course/${courseId}/${flatLessons[activeLessonIdx - 1].slug}`);
      window.scrollTo(0, 0);
    }
  };

  const progressPercent = flatLessons.length > 0
    ? Math.round((completedLessons.length / flatLessons.length) * 100)
    : 0;

  return (
    <div className="viewer-layout fade-in">
      {/* Mobile Sidebar Toggle Button */}
      <button 
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 110,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-color)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
          cursor: 'pointer',
          display: window.innerWidth <= 768 ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem'
        }}
        onClick={() => setIsSidebarOpen(prev => !prev)}
        className="sidebar-toggle-btn"
      >
        <i className={`fa-solid ${isSidebarOpen ? 'fa-xmark' : 'fa-list-ul'}`}></i>
      </button>

      {/* Syllabus Sidebar */}
      {isSidebarOpen && (
        <aside className="syllabus-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">{course.title}</h2>
            <div className="progress-container">
              <div className="progress-text-row">
                <span>Course Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            
            <div className="sidebar-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                placeholder="Filter syllabus..."
                value={sidebarQuery}
                onChange={(e) => setSidebarQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="syllabus-scroll">
            {course.syllabus.map((section, secIdx) => {
              // Filter lessons based on search query
              const filteredLessons = section.lessons.filter(l => 
                l.title.toLowerCase().includes(sidebarQuery.toLowerCase())
              );

              if (sidebarQuery && filteredLessons.length === 0) return null;

              const isSectionOpen = openSections[secIdx];

              return (
                <div key={secIdx} className="syllabus-section">
                  <div 
                    className="section-title-bar"
                    onClick={() => toggleSection(secIdx)}
                  >
                    <span>{section.title}</span>
                    <i className={`fa-solid ${isSectionOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}></i>
                  </div>
                  
                  {isSectionOpen && (
                    <ul className="section-lessons-list">
                      {filteredLessons.map((lesson, idx) => {
                        const slug = lesson.slug;
                        const isCompleted = completedLessons.includes(slug);
                        const isActive = activeLesson?.slug === slug;

                        return (
                          <li 
                            key={idx} 
                            className={`lesson-item ${isActive ? 'active' : ''}`}
                            onClick={() => handleLessonClick(slug)}
                          >
                            <span 
                              className={`checkbox-icon ${isCompleted ? 'completed' : 'uncompleted'}`}
                              onClick={(e) => toggleLessonComplete(slug, e)}
                              title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                            >
                              {isCompleted ? (
                                <i className="fa-solid fa-circle-check"></i>
                              ) : (
                                <i className="fa-regular fa-circle"></i>
                              )}
                            </span>
                            <span style={{ flex: 1 }}>{lesson.title}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <section className="article-container">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Tab Navigation header */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '2rem',
            paddingBottom: '0.5rem'
          }}>
            <button
              onClick={() => setActiveTab('lesson')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'lesson' ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'lesson' ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                borderBottom: activeTab === 'lesson' ? '2px solid var(--accent-color)' : 'none',
                transition: 'color 0.2s'
              }}
            >
              <i className="fa-regular fa-file-lines" style={{ marginRight: '0.5rem' }}></i> Lesson
            </button>
            
            <button
              onClick={() => setActiveTab('notes')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'notes' ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'notes' ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                borderBottom: activeTab === 'notes' ? '2px solid var(--accent-color)' : 'none',
                transition: 'color 0.2s'
              }}
            >
              <i className="fa-regular fa-note-sticky" style={{ marginRight: '0.5rem' }}></i> Notes
            </button>
            
            <button
              onClick={() => setActiveTab('quiz')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'quiz' ? 'var(--accent-color)' : 'var(--text-secondary)',
                fontWeight: activeTab === 'quiz' ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                padding: '0.5rem 1rem',
                borderBottom: activeTab === 'quiz' ? '2px solid var(--accent-color)' : 'none',
                transition: 'color 0.2s'
              }}
            >
              <i className="fa-solid fa-list-check" style={{ marginRight: '0.5rem' }}></i> Practice Quiz
            </button>
          </div>

          {/* Active Pane Render */}
          {activeTab === 'lesson' && activeLesson && (
            <div>
              <LessonContent 
                courseId={courseId} 
                lesson={activeLesson} 
                handleNext={handleNext}
                handlePrev={handlePrev}
                hasPrev={activeLessonIdx > 0}
                hasNext={activeLessonIdx !== -1 && activeLessonIdx < flatLessons.length - 1}
              />
            </div>
          )}

          {activeTab === 'notes' && activeLesson && (
            <NotesManager courseId={courseId} lessonSlug={activeLesson.slug} />
          )}

          {activeTab === 'quiz' && (
            <QuizView courseId={courseId} />
          )}
        </div>
      </section>
    </div>
  )
}
