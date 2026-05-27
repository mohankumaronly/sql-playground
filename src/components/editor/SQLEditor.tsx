import React, { useState, useEffect } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Key for localStorage
const FONT_SIZE_KEY = 'sql-editor-font-size';

export const SQLEditor: React.FC<SQLEditorProps> = ({ value, onChange }) => {
  // Load saved font size or default to 14
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return saved ? parseInt(saved) : 14;
  });

  // Save font size to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, fontSize.toString());
  }, [fontSize]);

  const increaseFont = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 1);
    }
  };

  const decreaseFont = () => {
    if (fontSize > 10) {
      setFontSize(fontSize - 1);
    }
  };

  const resetFont = () => {
    setFontSize(14);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-2 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            SQL Editor
          </h2>
          
          {/* Font Size Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Font Size:</span>
            <button
              onClick={decreaseFont}
              className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300
                       flex items-center justify-center"
              aria-label="Decrease font size"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300 min-w-10 text-center">
              {fontSize}px
            </span>
            
            <button
              onClick={increaseFont}
              className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300
                       flex items-center justify-center"
              aria-label="Increase font size"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            <button
              onClick={resetFont}
              className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400
                       transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <CodeEditor
          value={value}
          language="sql"
          placeholder={`Write your SQL here...

Example:
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);`}
          onChange={(evn) => onChange(evn.target.value)}
          padding={15}
          className="h-full font-mono border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto"
          style={{
            backgroundColor: 'var(--bg-color)',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: `${fontSize}px`,
            lineHeight: 1.5,
          }}
        />
      </div>
    </div>
  );
};