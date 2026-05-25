import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import coursesData from '../data/courses.json'

// Course descriptions
const courseMeta = {
  'csharp': {
    desc: 'Master modern C# programming from fundamentals to advanced features like memory management, reflection, and multithreading.',
    icon: 'fa-code',
    tag: 'Core Language',
    level: 'Beginner to Advanced'
  },
  'design-patterns': {
    desc: 'Understand GoF Creational, Structural, and Behavioral patterns in C# with real-world enterprise architectures.',
    icon: 'fa-sitemap',
    tag: 'Software Design',
    level: 'Intermediate to Advanced'
  },
  'microservices': {
    desc: 'Build scalable, distributed microservices using ASP.NET Core, RabbitMQ, Ocelot API Gateways, and Docker.',
    icon: 'fa-cubes',
    tag: 'Architecture',
    level: 'Advanced'
  },
  'aspnet-core': {
    desc: 'Develop high-performance web applications, razor pages, and MVC architectures with ASP.NET Core.',
    icon: 'fa-globe',
    tag: 'Web Dev',
    level: 'Beginner to Advanced'
  },
  'aspnet-core-webapi': {
    desc: 'Create RESTful APIs, secure endpoints with JWT, use Entity Framework Core, and write integration tests.',
    icon: 'fa-cloud-meatball',
    tag: 'APIs',
    level: 'Intermediate to Advanced'
  },
  'azure': {
    desc: 'Deploy apps, run serverless functions, manage virtual machines, and design cloud architectures on Microsoft Azure.',
    icon: 'fa-cloud',
    tag: 'Cloud Computing',
    level: 'Intermediate'
  },
  'aspnet-webapi': {
    desc: 'Learn ASP.NET Web API 2 development, content negotiation, formatting, and security for legacy projects.',
    icon: 'fa-network-wired',
    tag: 'APIs',
    level: 'Intermediate'
  },
  'linq': {
    desc: 'Query collections, XML documents, and databases cleanly and efficiently using Language Integrated Query (LINQ).',
    icon: 'fa-filter',
    tag: 'Core Language',
    level: 'Beginner to Intermediate'
  },
  'ado-net': {
    desc: 'Interact directly with relational databases using connection pools, commands, readers, and transactions.',
    icon: 'fa-database',
    tag: 'Data Access',
    level: 'Beginner to Intermediate'
  },
  'solid-principles': {
    desc: 'Write robust, maintainable, and clean code by mastering SOLID software design principles in C#.',
    icon: 'fa-shield-halved',
    tag: 'Software Design',
    level: 'Intermediate'
  },
  'csharp-programs': {
    desc: 'Sharpen your coding skills with 70+ practical programs, algorithm puzzles, and technical interview questions.',
    icon: 'fa-terminal',
    tag: 'Practice',
    level: 'Beginner to Intermediate'
  },
  'mssql': {
    desc: 'Master SQL querying, schema designs, subqueries, complex joins, indexes, views, and store procedures in MS SQL Server.',
    icon: 'fa-server',
    tag: 'Databases',
    level: 'Beginner to Advanced'
  },
  'dsa': {
    desc: 'Learn fundamental data structures (Stacks, Queues, Trees, Graphs) and algorithms (Sorting, Searching, Dynamic Programming).',
    icon: 'fa-chart-simple',
    tag: 'Computer Science',
    level: 'Beginner to Advanced'
  }
};

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [progressMap, setProgressMap] = useState({});

  // Calculate total lessons and completed lessons count for each course
  useEffect(() => {
    const map = {};
    Object.keys(coursesData).forEach(courseSlug => {
      const course = coursesData[courseSlug];
      let totalLessons = 0;
      course.syllabus.forEach(sec => {
        totalLessons += sec.lessons.length;
      });

      // Get progress from localStorage
      const completedList = JSON.parse(localStorage.getItem(`completed_${courseSlug}`)) || [];
      const pct = totalLessons > 0 ? Math.round((completedList.length / totalLessons) * 100) : 0;
      
      map[courseSlug] = {
        total: totalLessons,
        completed: completedList.length,
        percent: pct
      };
    });
    setProgressMap(map);
  }, []);

  // Perform search across all lessons
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    Object.keys(coursesData).forEach(courseSlug => {
      const course = coursesData[courseSlug];
      course.syllabus.forEach((section, secIdx) => {
        section.lessons.forEach(lesson => {
          if (lesson.title.toLowerCase().includes(query)) {
            results.push({
              courseSlug: courseSlug,
              courseTitle: course.title,
              sectionTitle: section.title,
              lessonTitle: lesson.title,
              lessonSlug: lesson.slug
            });
          }
        });
      });
    });

    setSearchResults(results.slice(0, 10)); // Limit to top 10 search matches
  }, [searchQuery]);

  const handleCourseClick = (slug) => {
    // Navigate to the course viewer, loading the very first lesson
    const firstLesson = coursesData[slug].syllabus[0]?.lessons[0];
    if (firstLesson) {
      navigate(`/course/${slug}/${firstLesson.slug}`);
    } else {
      navigate(`/course/${slug}`);
    }
  };

  return (
    <div className="fade-in" style={{ flex: 1, overflowY: 'auto' }}>
      <section className="landing-hero">
        <h1 className="hero-title">Elevate Your .NET & Software Engineering Skills</h1>
        <p className="hero-subtitle">
          Learn C#, ASP.NET Core, Microservices, SQL Server, and DSA through step-by-step developer tutorials with real-time enterprise coding snippets.
        </p>

        <div className="search-container">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input 
            type="text" 
            placeholder="Search across 1,300+ technical tutorials (e.g. Delegates, SQL Joins)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              marginTop: '0.5rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              zIndex: 10,
              textAlign: 'left',
              overflow: 'hidden'
            }}>
              {searchResults.map((res, idx) => (
                <div 
                  key={idx}
                  onClick={() => navigate(`/course/${res.courseSlug}/${res.lessonSlug}`)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderBottom: idx === searchResults.length - 1 ? 'none' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {res.lessonTitle}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {res.courseTitle} <span style={{ margin: '0 0.25rem' }}>&bull;</span> {res.sectionTitle}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 2rem 2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Explore Our Courses
        </h2>
      </div>

      <section className="courses-grid">
        {Object.keys(coursesData).map(courseSlug => {
          const course = coursesData[courseSlug];
          const meta = courseMeta[courseSlug] || {
            desc: 'Learn all the basic and advanced concepts of this course with practical code examples.',
            icon: 'fa-graduation-cap',
            tag: 'Tutorial',
            level: 'Beginner to Advanced'
          };
          const progress = progressMap[courseSlug] || { percent: 0, completed: 0, total: 0 };

          return (
            <div 
              key={courseSlug} 
              className="course-card"
              onClick={() => handleCourseClick(courseSlug)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="course-icon-container">
                  <i className={`fa-solid ${meta.icon}`}></i>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--accent-color)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '50px',
                  border: '1px solid var(--border-color)'
                }}>
                  {meta.tag}
                </span>
              </div>

              <h3 className="course-card-title">{course.title}</h3>
              
              <div className="course-card-meta">
                <span><i className="fa-regular fa-folder-open" style={{ marginRight: '0.35rem' }}></i>{course.syllabus.length} Sections</span>
                <span><i className="fa-regular fa-file-lines" style={{ marginRight: '0.35rem' }}></i>{progress.total} Lessons</span>
              </div>

              <p className="course-card-desc">{meta.desc}</p>

              <div className="course-card-footer">
                <div className="progress-container">
                  <div className="progress-text-row">
                    <span>Progress ({progress.completed}/{progress.total})</span>
                    <span>{progress.percent}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${progress.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  )
}
