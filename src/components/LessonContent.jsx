import React, { useState, useEffect, useRef } from 'react'

// Custom Visual Studio Dark Theme syntax highlighter
const highlightCode = (codeText, lang) => {
  if (!codeText) return '';
  
  // HTML escape helper
  let escaped = codeText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Token placeholders to prevent nested parsing
  const placeholders = [];
  
  // 1. Multiline comments /* ... */
  escaped = escaped.replace(/\/\*[\s\S]*?\*\//g, (match) => {
    const id = `___CMT_ML_${placeholders.length}___`;
    placeholders.push({ id, html: `<span class="vs-comment">${match}</span>` });
    return id;
  });

  // 2. Singleline comments // ... or -- ... for SQL
  const commentRegex = lang === 'SQL' ? /(\/\/.*$|--.*$)/gm : /\/\/.*$/gm;
  escaped = escaped.replace(commentRegex, (match) => {
    const id = `___CMT_SL_${placeholders.length}___`;
    placeholders.push({ id, html: `<span class="vs-comment">${match}</span>` });
    return id;
  });

  // 3. Strings "..." and '...'
  escaped = escaped.replace(/@?"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'/g, (match) => {
    const id = `___STR_${placeholders.length}___`;
    placeholders.push({ id, html: `<span class="vs-string">${match}</span>` });
    return id;
  });

  // 4. Keywords
  let keywords = [];
  if (lang === 'SQL') {
    keywords = [
      'select', 'from', 'where', 'insert', 'update', 'delete', 'create', 'table', 'alter', 'drop',
      'database', 'index', 'join', 'left', 'right', 'inner', 'outer', 'on', 'group', 'by', 'order',
      'having', 'in', 'and', 'or', 'not', 'null', 'into', 'values', 'set', 'procedure', 'exec',
      'transaction', 'commit', 'rollback', 'begin', 'end', 'go', 'returns', 'function', 'trigger',
      'view', 'as', 'declare', 'primary', 'key', 'foreign', 'references', 'identity', 'add', 'constraint',
      'int', 'varchar', 'nvarchar', 'char', 'date', 'datetime', 'decimal', 'bit', 'unique', 'default', 'check'
    ];
  } else {
    keywords = [
      'public', 'private', 'protected', 'internal', 'abstract', 'class', 'interface', 'struct', 'enum',
      'void', 'int', 'string', 'bool', 'float', 'double', 'decimal', 'long', 'char', 'new', 'return',
      'using', 'namespace', 'override', 'virtual', 'static', 'readonly', 'const', 'if', 'else', 'switch',
      'case', 'break', 'continue', 'while', 'for', 'foreach', 'in', 'do', 'try', 'catch', 'finally',
      'throw', 'async', 'await', 'var', 'get', 'set', 'yield', 'this', 'base', 'typeof', 'sizeof',
      'null', 'true', 'false', 'operator', 'implicit', 'explicit', 'params', 'out', 'ref', 'is', 'as'
    ];
  }

  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, lang === 'SQL' ? 'gi' : 'g');
  escaped = escaped.replace(keywordRegex, (match) => {
    return `<span class="vs-keyword">${match}</span>`;
  });

  // 5. Highlight numbers
  escaped = escaped.replace(/\b(\d+)\b/g, '<span class="vs-number">$1</span>');

  // 6. Highlight types (Capitalized identifiers)
  // Skip modifying already generated spans (vs-keyword, etc.)
  escaped = escaped.replace(/\b(?!vs-)([A-Z][a-zA-Z0-9_]*)\b/g, (match) => {
    if (keywords.includes(match.toLowerCase())) return match;
    return `<span class="vs-type">${match}</span>`;
  });

  // 7. Restore strings and comments in reverse order
  for (let i = placeholders.length - 1; i >= 0; i--) {
    const p = placeholders[i];
    escaped = escaped.replace(p.id, p.html);
  }

  return escaped;
};

export default function LessonContent({ courseId, lesson, handleNext, handlePrev, hasNext, hasPrev }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  // Determine code language based on course slug
  const getLanguageLabel = () => {
    if (courseId === 'mssql') return 'SQL';
    if (courseId === 'dsa') return 'C++ / Java / C#';
    return 'C#';
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setContent(null);

    const isLocalFile = window.location.protocol === 'file:';
    // Use relative path for local disk loading, and root-relative path for standard dev/prod web servers
    const contentUrl = isLocalFile 
      ? `./content/${courseId}/${lesson.slug}.json`
      : `/content/${courseId}/${lesson.slug}.json`;

    fetch(contentUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load content resource (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        if (active) {
          setContent(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          console.error(err);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [courseId, lesson.slug]);

  // Hook to parse and inject Copy buttons & highlight code blocks
  useEffect(() => {
    if (loading || !content || !contentRef.current) return;

    const preBlocks = contentRef.current.querySelectorAll('pre');
    
    preBlocks.forEach((pre) => {
      // Check if this pre is already wrapped
      if (pre.parentElement.classList.contains('code-wrapper')) return;

      const codeText = pre.innerText || pre.textContent;
      const lang = getLanguageLabel();
      
      // Perform highlighting
      const highlightedHtml = highlightCode(codeText, lang);

      // Create a wrapper container
      const wrapper = document.createElement('div');
      wrapper.className = 'code-wrapper';
      
      // Put wrapper before the pre block in the DOM
      pre.parentNode.insertBefore(wrapper, pre);
      
      // Create code header bar
      const header = document.createElement('div');
      header.className = 'code-header-bar';
      
      const langLabel = document.createElement('span');
      langLabel.textContent = lang;
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Code';
      
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(codeText).then(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--success)"></i> Copied!';
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Code';
          }, 2000);
        }).catch(err => {
          console.error('Could not copy text: ', err);
        });
      };
      
      header.appendChild(langLabel);
      header.appendChild(copyBtn);
      
      // Set the highlighted content inside code tags
      pre.innerHTML = `<code>${highlightedHtml}</code>`;
      
      // Move pre inside the wrapper and append header
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });

  }, [loading, content]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 2rem',
        gap: '1rem',
        color: 'var(--text-secondary)'
      }}>
        <i className="fa-solid fa-spinner fa-spin-pulse" style={{ fontSize: '2.5rem', color: 'var(--accent-color)' }}></i>
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Loading tutorial content...</p>
      </div>
    );
  }

  const isLocalFileProtocol = window.location.protocol === 'file:';

  if (error) {
    return (
      <div style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        backgroundColor: 'var(--bg-secondary)',
        margin: '2rem 0'
      }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2.5rem', color: 'var(--danger)', marginBottom: '1rem' }}></i>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Oops! Failed to load lesson</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
        
        {isLocalFileProtocol && (
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderLeft: '4px solid var(--warning)',
            padding: '1rem',
            borderRadius: '0 6px 6px 0',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto 1.5rem auto',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            color: 'var(--text-secondary)'
          }}>
            <h4 style={{ color: 'var(--warning)', fontWeight: 700, marginBottom: '0.25rem' }}>
              <i className="fa-solid fa-circle-info"></i> Browser Security Restriction (CORS)
            </h4>
            You are opening this application directly via <code>file://</code> protocol. Modern web browsers block loading internal JSON files from disk due to security policies. 
            <br /><br />
            <strong>To run correctly:</strong> Please open your terminal inside the project directory and run <code>npm run dev</code> to launch the web server on <code>http://localhost:3000</code>.
          </div>
        )}

        <button className="nav-btn" onClick={() => window.location.reload()} style={{ margin: '0 auto' }}>
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <article className="fade-in">
      <div className="breadcrumbs">
        <span>Dashboard</span>
        <span className="breadcrumb-separator">/</span>
        <span>Course Details</span>
        <span className="breadcrumb-separator">/</span>
        <span style={{ color: 'var(--text-primary)' }}>{lesson.title}</span>
      </div>

      <h1 className="article-title">{content?.title || lesson.title}</h1>
      
      <div 
        ref={contentRef}
        className="lesson-body"
        dangerouslySetInnerHTML={{ __html: content?.content || '' }}
      />

      <div className="nav-buttons-container">
        <button 
          className="nav-btn" 
          onClick={handlePrev}
          disabled={!hasPrev}
        >
          <i className="fa-solid fa-arrow-left"></i> Previous Lesson
        </button>
        <button 
          className="nav-btn" 
          onClick={handleNext}
          disabled={!hasNext}
        >
          Next Lesson <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </article>
  )
}

