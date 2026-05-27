import React, { useState, useEffect } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const FONT_SIZE_KEY = 'sql-editor-font-size';

export const SQLEditor: React.FC<SQLEditorProps> = ({ value, onChange }) => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return saved ? parseInt(saved) : 14;
  });
  
  // Track theme for editor styling
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Editor colors based on theme
  const editorBackground = isDark ? '#1a1a1a' : '#ffffff';
  const editorTextColor = isDark ? '#e5e5e5' : '#1f2937';

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            SQL Editor
          </h2>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {!isMobile && (
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                Font:
              </span>
            )}
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
      </div>
      
      {/* REMOVED min-h-0 and added overflow-auto directly to the CodeEditor container */}
      <div className="flex-1 p-3 sm:p-4 overflow-auto">
        <CodeEditor
          value={value}
          language="sql"
          placeholder="Write your SQL here..."
          onChange={(evn) => onChange(evn.target.value)}
          padding={12}
          className="w-full font-mono border border-gray-200 dark:border-gray-700 rounded-lg"
          style={{
            backgroundColor: editorBackground,
            color: editorTextColor,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: `${fontSize}px`,
            lineHeight: 1.5,
            minHeight: '300px',
            height: 'auto',
          }}
        />
      </div>
    </div>
  );
};