import React, { useState, useEffect } from 'react';
import { Container } from './components/layout/Container';
import { Header } from './components/layout/Header';
import { SQLEditor } from './components/editor/SQLEditor';
import { DiagramCanvas } from './components/diagram/DiagramCanvas';
import { parseSQL } from './parser/sqlParser';
import { downloadSchemaAsZip } from './utils/exportZip';
import { Schema } from './types/schema';

const DEFAULT_SQL = `CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

// Key for localStorage
const STORAGE_KEY = 'sql-playground-content';

function App() {
  // Load saved SQL from localStorage on startup
  const [sql, setSql] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || DEFAULT_SQL;
  });
  
  const [schema, setSchema] = useState<Schema>({ tables: [] });

  // Parse SQL whenever it changes
  useEffect(() => {
    const parsed = parseSQL(sql);
    setSchema(parsed);
  }, [sql]);

  // Save to localStorage whenever SQL changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sql);
  }, [sql]);

  const handleExport = () => {
    downloadSchemaAsZip(schema);
  };

  const handleReset = () => {
    if (confirm('Reset to default SQL? Your current work will be lost.')) {
      setSql(DEFAULT_SQL);
    }
  };

  return (
    <Container>
      <Header onExport={handleExport} onReset={handleReset} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - SQL Editor */}
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-800">
          <SQLEditor value={sql} onChange={setSql} />
        </div>

        {/* Right Panel - Diagram */}
        <div className="w-1/2">
          <DiagramCanvas tables={schema.tables} />
        </div>
      </div>
    </Container>
  );
}

export default App;