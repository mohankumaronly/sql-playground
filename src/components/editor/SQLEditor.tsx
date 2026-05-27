import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

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
          className="h-full font-mono text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto"
          style={{
            backgroundColor: 'var(--bg-color)',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
        />
      </div>
    </div>
  );
};