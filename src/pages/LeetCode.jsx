import React, { useState, useEffect } from 'react';
import { categories } from '../data/leetcode_patterns.js';
import LeetCodeVisualizer from '../components/LeetCodeVisualizer.jsx';
import CsharpCodeBlock from '../components/CsharpCodeBlock.jsx';

export default function LeetCode() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePattern, setActivePattern] = useState(categories[0].patterns[0]);
  const [activeTab, setActiveTab] = useState('explanation'); // explanation, animation, solution
  const [expandedCats, setExpandedCats] = useState(new Set([categories[0].id]));

  // Sidebar responsive drawer state (matching layout details in CourseView)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleCategory = (catId) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  // Find all matching patterns based on search query
  const getFilteredCategories = () => {
    if (!searchQuery.trim()) return categories;
    
    const query = searchQuery.toLowerCase();
    return categories.map(cat => {
      const matchingPatterns = cat.patterns.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
      
      if (matchingPatterns.length > 0) {
        return { ...cat, patterns: matchingPatterns };
      }
      return null;
    }).filter(Boolean);
  };

  const filtered = getFilteredCategories();

  // Automatically expand categories containing search results
  useEffect(() => {
    if (searchQuery.trim() && filtered.length > 0) {
      setExpandedCats(new Set(filtered.map(c => c.id)));
    }
  }, [searchQuery]);

  const selectPattern = (pattern) => {
    setActivePattern(pattern);
    setIsSidebarOpen(false);
  };

  return (
    <div className="viewer-layout fade-in">
      
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar List panel */}
      <aside className={`syllabus-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">LeetCode Algorithms</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Master C# coding patterns</p>
          
          <div className="sidebar-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              placeholder="Search 100+ patterns..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="syllabus-scroll">
          {filtered.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
              No patterns matched "{searchQuery}"
            </div>
          ) : (
            filtered.map(cat => {
              const isExpanded = expandedCats.has(cat.id);
              return (
                <div key={cat.id} className="syllabus-section">
                  <div 
                    className="section-title-bar" 
                    onClick={() => toggleCategory(cat.id)}
                    style={{ borderLeft: isExpanded ? '3px solid var(--accent-secondary)' : '3px solid transparent' }}
                  >
                    <span>
                      <i className={`fa-solid ${cat.icon}`} style={{ marginRight: '0.65rem', color: 'var(--text-tertiary)', width: '16px' }}></i>
                      {cat.title}
                    </span>
                    <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}></i>
                  </div>

                  {isExpanded && (
                    <ul className="section-lessons-list">
                      {cat.patterns.map(p => {
                        const isActive = activePattern.id === p.id;
                        return (
                          <li 
                            key={p.id}
                            className={`lesson-item ${isActive ? 'active' : ''}`}
                            onClick={() => selectPattern(p)}
                            style={{ paddingLeft: '1.75rem' }}
                          >
                            <i className="fa-regular fa-circle-dot" style={{ fontSize: '0.7rem', opacity: 0.8 }}></i>
                            <span>{p.title}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Workspace content */}
      <section className="article-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="article-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: '1000px', width: '100%' }}>
          
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
            <span>LeetCode</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span>{categories.find(c => c.patterns.some(p => p.id === activePattern.id))?.title}</span>
            <span className="breadcrumb-separator">&gt;</span>
            <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{activePattern.title}</span>
          </div>

          {/* Heading block */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 className="article-title" style={{ margin: 0, fontSize: '2rem' }}>{activePattern.title}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginTop: '0.5rem', maxWidth: '750px' }}>
                {activePattern.description}
              </p>
            </div>
            
            {/* Complexity Badges */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                color: 'var(--accent-color)',
                fontFamily: 'var(--font-mono)'
              }}>
                {activePattern.complexity.split('|')[0].trim()}
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                color: 'var(--accent-secondary)',
                fontFamily: 'var(--font-mono)'
              }}>
                {activePattern.complexity.split('|')[1]?.trim() || 'Space: O(1)'}
              </span>
            </div>
          </div>

          {/* Workspace Tabs Header */}
          <div className="course-tabs-header">
            <button 
              className={`nav-btn ${activeTab === 'explanation' ? 'active' : ''}`}
              onClick={() => setActiveTab('explanation')}
              style={{
                backgroundColor: activeTab === 'explanation' ? 'var(--accent-glow)' : 'transparent',
                borderColor: activeTab === 'explanation' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'explanation' ? 'var(--accent-color)' : 'var(--text-secondary)'
              }}
            >
              <i className="fa-regular fa-file-lines" style={{ marginRight: '0.5rem' }}></i>📖 Explanation & Concept
            </button>
            <button 
              className={`nav-btn ${activeTab === 'animation' ? 'active' : ''}`}
              onClick={() => setActiveTab('animation')}
              style={{
                backgroundColor: activeTab === 'animation' ? 'var(--accent-glow)' : 'transparent',
                borderColor: activeTab === 'animation' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'animation' ? 'var(--accent-color)' : 'var(--text-secondary)'
              }}
            >
              <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '0.5rem' }}></i>⚡ Interactive Animation
            </button>
            <button 
              className={`nav-btn ${activeTab === 'solution' ? 'active' : ''}`}
              onClick={() => setActiveTab('solution')}
              style={{
                backgroundColor: activeTab === 'solution' ? 'var(--accent-glow)' : 'transparent',
                borderColor: activeTab === 'solution' ? 'var(--accent-color)' : 'transparent',
                color: activeTab === 'solution' ? 'var(--accent-color)' : 'var(--text-secondary)'
              }}
            >
              <i className="fa-solid fa-code" style={{ marginRight: '0.5rem' }}></i>💻 C# Solution
            </button>
          </div>

          {/* Tab Workspace Panels */}
          <div style={{ flex: 1, minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Panel: Explanation */}
            {activeTab === 'explanation' && (
              <div className="lesson-body fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem' }}>What is {activePattern.title}?</h3>
                  <p>{activePattern.description}</p>
                </section>

                <section style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fa-solid fa-circle-question"></i> What algorithm is used and WHY?
                  </h4>
                  <p style={{ margin: 0 }}>
                    {activePattern.whyUsed}
                  </p>
                </section>

                <section>
                  <h3 style={{ margin: '1.5rem 0 0.75rem 0', fontSize: '1.25rem' }}>Standard Problem Example</h3>
                  <div style={{ backgroundColor: 'var(--code-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <h5 style={{ fontWeight: 800, margin: '0 0 0.5rem 0', fontSize: '0.98rem' }}>{activePattern.example.title}</h5>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{activePattern.example.problem}</p>
                  </div>
                </section>

                <section>
                  <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem' }}>Why C# for Algorithm Interviews?</h3>
                  <p>
                    C# provides robust type-safety, rich collection data structures (like <code>Stack&lt;T&gt;</code>, <code>Queue&lt;T&gt;</code>, <code>LinkedList&lt;T&gt;</code>, and the modern <code>PriorityQueue&lt;TElement, TPriority&gt;</code>), and high-performance compilation making it a favorite for enterprise systems. Implementing these patterns demonstrates strong object-oriented principles and memory management expertise.
                  </p>
                </section>
              </div>
            )}

            {/* Panel: Interactive Simulator */}
            {activeTab === 'animation' && (
              <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.75rem 1.25rem', borderRadius: '8px' }}>
                  <i className="fa-solid fa-info-circle" style={{ color: 'var(--accent-color)' }}></i>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Type custom integers, click <strong>Play</strong> or step through the algorithm lines to watch variables update in real time.
                  </span>
                </div>
                <LeetCodeVisualizer patternId={activePattern.id} csharpCode={activePattern.example.csharp} />
              </div>
            )}

            {/* Panel: C# Solution */}
            {activeTab === 'solution' && (
              <div className="lesson-body fade-in">
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Optimal C# Implementation</h3>
                  <p style={{ margin: 0, fontSize: '0.92rem' }}>
                    This C# code represents the optimal industry-grade solution. Pay attention to edge case validations, boundary constraints, and memory efficiency.
                  </p>
                </div>
                <CsharpCodeBlock code={activePattern.example.csharp} />
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Floating Action Button for Mobile Sidebar Drawer */}
      <button 
        className="sidebar-toggle-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title="Show algorithm list"
        aria-label="Show algorithm list"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

    </div>
  );
}
