import React, { useState, useEffect } from 'react'

export default function NotesManager({ courseId, lessonSlug }) {
  const [noteText, setNoteText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const storageKey = `notes_${courseId}_${lessonSlug}`;

  useEffect(() => {
    const savedNote = localStorage.getItem(storageKey) || '';
    setNoteText(savedNote);
    setIsSaved(false);
  }, [courseId, lessonSlug]);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setNoteText(text);
    localStorage.setItem(storageKey, text);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1500);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your notes for this lesson?')) {
      setNoteText('');
      localStorage.removeItem(storageKey);
    }
  };

  const handleExport = () => {
    if (!noteText.trim()) {
      alert('Please write some notes before exporting.');
      return;
    }
    const blob = new Blob([noteText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `notes-${courseId}-${lessonSlug}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simple Markdown parser
  const renderMarkdown = (text) => {
    if (!text.trim()) return '<p style="color: var(--text-tertiary)">No notes written yet. Start typing on the left!</p>';
    
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold: **text**
    html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text*
    html = html.replace(/\*([\s\S]+?)\*/g, '<em>$1</em>');
    
    // Inline code: `code`
    html = html.replace(/`([^`]+)`/g, '<code style="background-color: var(--bg-tertiary); padding: 0.1rem 0.3rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em">$1</code>');

    // Headers: # Header
    html = html.replace(/^### (.*$)/gim, '<h3 style="margin-top: 1rem; margin-bottom: 0.5rem; color: var(--text-primary)">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="margin-top: 1.25rem; margin-bottom: 0.75rem; color: var(--text-primary)">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="margin-top: 1.5rem; margin-bottom: 1rem; color: var(--text-primary)">$1</h1>');

    // Lists: - item
    html = html.replace(/^\- (.*$)/gim, '<li style="margin-left: 1.5rem; margin-bottom: 0.25rem">$1</li>');

    // Replace linebreaks with paragraph breaks
    html = html.split('\n').map(line => {
      if (line.trim().startsWith('<li') || line.trim().startsWith('<h')) return line;
      return `<p style="margin-bottom: 0.5rem">${line}</p>`;
    }).join('\n');

    return html;
  };

  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      marginTop: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Personal Study Notes</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Notes are autosaved to your browser local storage.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="nav-btn" 
            onClick={() => setShowPreview(!showPreview)}
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
          >
            <i className={`fa-solid ${showPreview ? 'fa-pen-to-square' : 'fa-eye'}`}></i> {showPreview ? 'Edit Notes' : 'Preview MD'}
          </button>
          
          <button 
            className="nav-btn" 
            onClick={handleExport}
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}
          >
            <i className="fa-solid fa-file-export"></i> Export .md
          </button>

          <button 
            className="nav-btn" 
            onClick={handleClear}
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
          >
            <i className="fa-regular fa-trash-can"></i> Clear
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: showPreview ? '1fr' : '1fr 1fr',
        gap: '1.5rem',
        minHeight: '400px'
      }}>
        {!showPreview ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <textarea
                placeholder="Type your notes here... You can use basic markdown like **bold**, *italics*, # Headers, or - lists."
                value={noteText}
                onChange={handleTextChange}
                style={{
                  width: '100%',
                  flex: 1,
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  resize: 'none',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              {isSaved && (
                <span style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  fontSize: '0.75rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <i className="fa-solid fa-check"></i> Saved
                </span>
              )}
            </div>

            <div style={{
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-secondary)',
              padding: '1.25rem',
              overflowY: 'auto',
              maxHeight: '500px'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                Live Preview
              </div>
              <div 
                style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(noteText) }}
              />
            </div>
          </>
        ) : (
          <div style={{
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem',
            overflowY: 'auto'
          }}>
            <div 
              style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(noteText) }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
