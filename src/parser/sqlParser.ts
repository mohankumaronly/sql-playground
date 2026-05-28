import type { Schema, Table, Column } from '../types/schema';

export function parseSQL(sql: string): Schema {
  const tables: Table[] = [];

  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\(([\s\S]*?)\)\s*;/gi;
  
  let match;
  while ((match = createTableRegex.exec(sql)) !== null) {
    const tableName = match[1];
    const columnsDefinition = match[2];
    
    const columns: Column[] = [];
    
    const columnLines = splitColumns(columnsDefinition);
    
    for (const line of columnLines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.toUpperCase().startsWith('PRIMARY KEY')) continue;

      const foreignKeyMatch = trimmedLine.match(/FOREIGN\s+KEY\s*\((\w+)\)\s*REFERENCES\s*(\w+)\s*\((\w+)\)/i);
      if (foreignKeyMatch) {
        const columnName = foreignKeyMatch[1];
        const existingColumn = columns.find(c => c.name === columnName);
        if (existingColumn) {
          existingColumn.references = {
            table: foreignKeyMatch[2],
            column: foreignKeyMatch[3]
          };
          existingColumn.constraints.push('FOREIGN KEY');
        }
        continue;
      }
      
      const columnMatch = trimmedLine.match(/^(\w+)\s+(\w+(?:\([^)]+\))?)\s*(.*)$/i);
      if (columnMatch) {
        const columnName = columnMatch[1];
        const columnType = columnMatch[2];
        const constraintsStr = columnMatch[3];
        
        const constraints: string[] = [];
        const upperConstraints = constraintsStr.toUpperCase();
        
        if (upperConstraints.includes('NOT NULL')) constraints.push('NOT NULL');
        if (upperConstraints.includes('UNIQUE')) constraints.push('UNIQUE');
        if (upperConstraints.includes('PRIMARY KEY')) constraints.push('PRIMARY KEY');
        
        columns.push({
          name: columnName,
          type: columnType,
          constraints,
          references: null
        });
      }
    }
    
    if (columns.length > 0) {
      tables.push({
        name: tableName,
        columns
      });
    }
  }
  
  return { tables };
}

function splitColumns(columnsDef: string): string[] {
  const result: string[] = [];
  let current = '';
  let parenCount = 0;
  
  for (let i = 0; i < columnsDef.length; i++) {
    const char = columnsDef[i];
    
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    
    if (char === ',' && parenCount === 0) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current.trim()) {
    result.push(current);
  }
  
  return result;
}