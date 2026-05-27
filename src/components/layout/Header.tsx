import React from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';

interface HeaderProps {
  onExport?: () => void;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, onReset }) => {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            SQL Playground
          </h1>
          <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            Beta
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {onReset && (
            <Button onClick={onReset} variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </Button>
          )}
          {onExport && (
            <Button onClick={onExport} variant="primary" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};