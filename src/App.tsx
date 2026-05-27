import { useState, useEffect } from 'react';
import { Container } from './components/layout/Container';
import { Header } from './components/layout/Header';
import { SQLEditor } from './components/editor/SQLEditor';
import { DiagramCanvas } from './components/diagram/DiagramCanvas';
import { parseSQL } from './parser/sqlParser';
import { downloadSchemaAsZip } from './utils/exportZip';
import type { Schema } from './types/schema';

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

function App() {
  const [sql, setSql] = useState(DEFAULT_SQL);
  const [schema, setSchema] = useState<Schema>({ tables: [] });

  useEffect(() => {
    const parsed = parseSQL(sql);
    setSchema(parsed);
  }, [sql]);

  const handleExport = () => {
    downloadSchemaAsZip(schema);
  };

  return (
    <Container>
      <Header onExport={handleExport} />
      
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