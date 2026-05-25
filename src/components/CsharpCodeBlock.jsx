import React, { useState } from 'react';

export default function CsharpCodeBlock({ code, highlightLine = -1 }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic C# Syntax Highlighter Tokenizer
  const highlightCsharp = (text) => {
    // Escape HTML first
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Syntax regex mappings
    // 1. Comments: //...
    html = html.replace(/(\/\/.*)/g, '<span class="vs-comment">$1</span>');

    // 2. Multiline comments: /* ... */
    html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="vs-comment">$1</span>');

    // 3. Strings: "..."
    html = html.replace(/("(?:\\.|[^"\\])*")/g, '<span class="vs-string">$1</span>');

    // 4. Keywords
    const keywords = [
      'public', 'private', 'protected', 'internal', 'class', 'interface', 'struct', 'enum',
      'void', 'int', 'long', 'double', 'float', 'bool', 'char', 'string', 'object', 'var',
      'return', 'if', 'else', 'for', 'foreach', 'while', 'do', 'switch', 'case', 'break',
      'continue', 'new', 'throw', 'null', 'true', 'false', 'this', 'base', 'static',
      'readonly', 'const', 'override', 'virtual', 'abstract', 'using', 'namespace', 'get', 'set'
    ];
    
    // Boundary match keywords (avoiding inside tags)
    keywords.forEach(kw => {
      const reg = new RegExp(`\\b(${kw})\\b(?![^<]*>)`, 'g');
      html = html.replace(reg, '<span class="vs-keyword">$1</span>');
    });

    // 5. Common standard types
    const types = [
      'ListNode', 'TreeNode', 'NumArray', 'MyCircularQueue', 'DSU', 'SegmentTree', 'IList',
      'List', 'Dictionary', 'HashSet', 'Queue', 'Stack', 'PriorityQueue', 'Math', 'ArgumentException',
      'Exception', 'Console', 'Array', 'IEnumerable', 'IEnumerator'
    ];
    types.forEach(t => {
      const reg = new RegExp(`\\b(${t})\\b(?![^<]*>)`, 'g');
      html = html.replace(reg, '<span class="vs-type">$1</span>');
    });

    // 6. Numbers
    html = html.replace(/\b(\d+)\b(?![^<]*>)/g, '<span class="vs-number">$1</span>');

    return html;
  };

  const lines = code.split('\n');

  return (
    <div className="code-wrapper">
      <div className="code-header-bar">
        <span><i className="fa-solid fa-file-code" style={{ marginRight: '0.5rem', color: '#06b6d4' }}></i>Solution.cs</span>
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? (
            <>
              <i className="fa-solid fa-check" style={{ color: 'var(--success)' }}></i>
              <span style={{ color: 'var(--success)' }}>Copied!</span>
            </>
          ) : (
            <>
              <i className="fa-regular fa-copy"></i>
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <pre>
        <code>
          {lines.map((lineContent, idx) => {
            const lineNum = idx + 1;
            const isActive = highlightLine === lineNum;
            return (
              <div 
                key={idx} 
                className={`code-line-row ${isActive ? 'active-code-line' : ''}`}
                style={{
                  display: 'flex',
                  backgroundColor: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-color)' : '3px solid transparent',
                  paddingLeft: isActive ? '5px' : '8px',
                  transition: 'background-color 0.2s, border-left-color 0.2s'
                }}
              >
                <span 
                  className="line-number" 
                  style={{ 
                    width: '30px', 
                    color: isActive ? 'var(--accent-color)' : '#64748b', 
                    userSelect: 'none',
                    textAlign: 'right',
                    marginRight: '15px',
                    fontSize: '0.85rem'
                  }}
                >
                  {lineNum}
                </span>
                <span 
                  dangerouslySetInnerHTML={{ __html: highlightCsharp(lineContent) || '&nbsp;' }} 
                  style={{ flex: 1, whiteSpace: 'pre' }}
                />
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
