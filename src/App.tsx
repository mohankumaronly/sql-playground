import React, { useState, useEffect } from 'react';
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
);

CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2)
);

CREATE TABLE order_items (
    id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);`;

const STORAGE_KEY = 'sql-playground-content';
const PANEL_WIDTH_KEY = 'sql-playground-panel-width';

function App() {
  const [sql, setSql] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || DEFAULT_SQL;
  });
  
  const [schema, setSchema] = useState<Schema>({ tables: [] });
  
  // Check if mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Load saved panel width or default to 50% (only for desktop)
  const [editorWidth, setEditorWidth] = useState(() => {
    const saved = localStorage.getItem(PANEL_WIDTH_KEY);
    return saved ? parseInt(saved) : 50;
  });

  useEffect(() => {
    const parsed = parseSQL(sql);
    setSchema(parsed);
  }, [sql]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, sql);
  }, [sql]);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExport = () => {
    downloadSchemaAsZip(schema);
  };

  const handleReset = () => {
    if (confirm('Reset to default SQL? Your current work will be lost.')) {
      setSql(DEFAULT_SQL);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const container = document.getElementById('split-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setEditorWidth(newWidth);
        localStorage.setItem(PANEL_WIDTH_KEY, newWidth.toString());
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <Container>
      <Header onExport={handleExport} onReset={handleReset} />
      
      {isMobile ? (
        // Mobile Layout - Vertical Stack with Scroll
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top: SQL Editor - Scrollable */}
          <div className="flex-1 min-h-0 border-b border-gray-200 dark:border-gray-800 overflow-auto">
            <SQLEditor value={sql} onChange={setSql} />
          </div>
          
          {/* Bottom: Diagram - Scrollable */}
          <div className="flex-1 min-h-0 overflow-auto">
            <DiagramCanvas tables={schema.tables} />
          </div>
        </div>
      ) : (
        // Desktop Layout - Horizontal Split with Resize Handle
        <div id="split-container" className="flex-1 flex overflow-hidden relative">
          {/* Left Panel - SQL Editor */}
          <div style={{ width: `${editorWidth}%` }} className="min-w-[20%] max-w-[80%] overflow-auto">
            <SQLEditor value={sql} onChange={setSql} />
          </div>
          
          {/* Resize Handle */}
          <div
            onMouseDown={handleMouseDown}
            className="w-1 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors cursor-col-resize active:bg-blue-600"
          />
          
          {/* Right Panel - Diagram */}
          <div style={{ width: `${100 - editorWidth}%` }} className="min-w-[20%] max-w-[80%] overflow-auto">
            <DiagramCanvas tables={schema.tables} />
          </div>
        </div>
      )}
    </Container>
  );
}

export default App;