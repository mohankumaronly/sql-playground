import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { autocompletion } from '@codemirror/autocomplete';
import { EditorView } from '@codemirror/view';
import type { Extension } from '@codemirror/state';

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const FONT_SIZE_KEY = 'sql-editor-font-size';

// SQL Keywords for autocomplete
const sqlKeywords = [
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'INDEX', 'VIEW', 'DATABASE', 'PRIMARY', 'KEY', 'FOREIGN',
  'REFERENCES', 'NOT', 'NULL', 'UNIQUE', 'DEFAULT', 'CHECK', 'CONSTRAINT',
  'INT', 'VARCHAR', 'TEXT', 'DATE', 'TIME', 'DATETIME', 'DECIMAL', 'FLOAT',
  'AND', 'OR', 'IN', 'LIKE', 'BETWEEN', 'IS', 'JOIN', 'INNER', 'LEFT', 'RIGHT',
  'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT'
];

// SQL syntax error patterns
const checkSQLErrors = (sqlCode: string): string[] => {
  const errors: string[] = [];
  const upperCode = sqlCode.toUpperCase();
  
  // Check for unmatched parentheses
  let parenCount = 0;
  for (const char of sqlCode) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
  }
  if (parenCount !== 0) {
    errors.push(`Unmatched parentheses: ${parenCount > 0 ? '(' : ')'} count mismatch`);
  }
  
  // Check for incomplete CREATE TABLE
  if (upperCode.includes('CREATE TABLE') && !upperCode.includes('(')) {
    errors.push('Incomplete CREATE TABLE statement: missing parentheses');
  }
  
  // Check for keywords that might indicate typos
  const commonTypos = ['CREAT', 'TABEL', 'FROME', 'WHER', 'UPDAT', 'DELET'];
  for (const typo of commonTypos) {
    if (upperCode.includes(typo) && !upperCode.includes(typo + 'E')) {
      errors.push(`Possible typo: '${typo}' - did you mean '${typo}E'?`);
    }
  }
  
  return errors;
};

// Auto-format SQL code
const formatSQL = (sqlCode: string): string => {
  const lines = sqlCode.split('\n');
  const formatted: string[] = [];
  let indentLevel = 0;
  const indentSize = 2;
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      formatted.push('');
      continue;
    }
    
    // Decrease indent for closing parentheses
    if (trimmed.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add indentation
    const indent = ' '.repeat(indentLevel * indentSize);
    formatted.push(indent + trimmed);
    
    // Increase indent for opening parentheses and certain keywords
    if (trimmed.endsWith('(') || 
        trimmed.toUpperCase().startsWith('CREATE') ||
        (trimmed.toUpperCase().startsWith('SELECT') && !trimmed.toUpperCase().includes('INSERT'))) {
      indentLevel++;
    }
    
    // Decrease indent for closing statements
    if (trimmed.endsWith(');') || trimmed.endsWith(';')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
  }
  
  return formatted.join('\n');
};

export const SQLEditor: React.FC<SQLEditorProps> = ({ value, onChange }) => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return saved ? parseInt(saved) : 14;
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Check for errors when value changes
  useEffect(() => {
    const sqlErrors = checkSQLErrors(value);
    setErrors(sqlErrors);
  }, [value]);

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, fontSize.toString());
  }, [fontSize]);

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const increaseFont = () => {
    if (fontSize < 24) setFontSize(fontSize + 1);
  };

  const decreaseFont = () => {
    if (fontSize > 10) setFontSize(fontSize - 1);
  };

  const resetFont = () => setFontSize(14);

  const handleFormatCode = () => {
    const formatted = formatSQL(value);
    onChange(formatted);
  };

  const [, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Custom SQL autocomplete - Simplified version without dialect
  const sqlExtensions: Extension[] = [
    sql({
      upperCaseKeywords: true,
    }),
    autocompletion({
      override: [
        (context) => {
          const word = context.matchBefore(/\w+/);
          if (!word) return null;
          const options = sqlKeywords
            .filter(kw => kw.toLowerCase().startsWith(word.text.toLowerCase()))
            .map(kw => ({
              label: kw,
              type: 'keyword',
              apply: kw,
            }));
          return { from: word.from, to: word.to, options };
        },
      ],
    }),
    EditorView.lineWrapping,
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            SQL Editor
            {errors.length > 0 && (
              <span className="ml-2 text-xs text-red-500">
                ⚠️ {errors.length} error(s)
              </span>
            )}
          </h2>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleFormatCode}
              className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400
                       transition-colors touch-manipulation"
              title="Format SQL Code"
            >
              Format
            </button>
            
            <button
              onClick={() => setShowErrors(!showErrors)}
              className={`px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600
                       transition-colors touch-manipulation ${errors.length > 0 ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
              title="Show Errors"
            >
              {showErrors ? 'Hide' : 'Show'} Errors
            </button>
            
            <button
              onClick={decreaseFont}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300
                       flex items-center justify-center touch-manipulation"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 min-w-8.75 sm:min-w-10 text-center">
              {fontSize}
            </span>
            
            <button
              onClick={increaseFont}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300
                       flex items-center justify-center touch-manipulation"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            <button
              onClick={resetFont}
              className="text-xs px-2 py-1 sm:px-2.5 sm:py-1.5 rounded border border-gray-300 dark:border-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400
                       transition-colors touch-manipulation"
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Error Panel */}
        {showErrors && errors.length > 0 && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
              SQL Errors:
            </div>
            <ul className="text-xs text-red-600 dark:text-red-300 space-y-1">
              {errors.map((error, idx) => (
                <li key={idx} className="font-mono">• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-3 sm:p-4 overflow-auto">
        <CodeMirror
          value={value}
          height="100%"
          extensions={sqlExtensions}
          onChange={(val) => onChange(val)}
          theme={isDark ? 'dark' : 'light'}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          style={{
            fontSize: `${fontSize}px`,
            height: '100%',
            overflow: 'auto',
          }}
        />
      </div>
    </div>
  );
};