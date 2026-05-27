import React from 'react';

interface SQLEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const SQLEditor: React.FC<SQLEditorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-2 bg-gray-50 dark:bg-gray-950">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          SQL Editor
        </h2>
      </div>
      <div className="flex-1 p-4">
        <textarea
          className="w-full h-full font-mono text-sm p-4 border border-gray-200 dark:border-gray-700 rounded-lg 
                     bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Write your SQL here...&#10;&#10;Example:&#10;CREATE TABLE users (&#10;    id INT PRIMARY KEY,&#10;    name VARCHAR(100) NOT NULL,&#10;    email VARCHAR(255) UNIQUE&#10;);&#10;&#10;CREATE TABLE orders (&#10;    order_id INT PRIMARY KEY,&#10;    user_id INT,&#10;    total DECIMAL(10,2),&#10;    FOREIGN KEY (user_id) REFERENCES users(id)&#10;);"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};