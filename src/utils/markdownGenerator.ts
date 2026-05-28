import type { Schema } from '../types/schema';

export function generateMarkdown(schema: Schema): string {
  const { tables } = schema;
  const date = new Date().toISOString().split('T')[0];
  
  let markdown = `# 📊 Database Schema Documentation\n\n`;
  markdown += `**Generated:** ${date}\n\n`;
  markdown += `**Total Tables:** ${tables.length}\n\n`;
  markdown += `---\n\n`;
  

  markdown += `## 📑 Table of Contents\n\n`;
  tables.forEach(table => {
    markdown += `- [${table.name}](#${table.name.toLowerCase()})\n`;
  });
  markdown += `\n---\n\n`;

  tables.forEach(table => {
    markdown += `## 📋 ${table.name}\n\n`;
    markdown += `| Column | Type | Constraints | Foreign Key |\n`;
    markdown += `|--------|------|-------------|-------------|\n`;
    
    table.columns.forEach(col => {
      const constraints = col.constraints.join(', ') || '-';
      const foreignKey = col.references 
        ? `→ ${col.references.table}.${col.references.column}` 
        : '-';
      
      markdown += `| \`${col.name}\` | \`${col.type}\` | ${constraints} | ${foreignKey} |\n`;
    });
    
    markdown += `\n`;
  });
  

  markdown += `## 🔗 Relationships\n\n`;
  const relationships = tables.flatMap(table =>
    table.columns
      .filter(col => col.references)
      .map(col => `- \`${table.name}.${col.name}\` → \`${col.references!.table}.${col.references!.column}\``)
  );
  
  if (relationships.length === 0) {
    markdown += `*No foreign key relationships defined*\n`;
  } else {
    markdown += relationships.join('\n') + '\n';
  }
  
  return markdown;
}

export function generateSQL(schema: Schema): string {
  const { tables } = schema;
  let sql = `-- Auto-generated SQL Schema\n`;
  sql += `-- Generated on: ${new Date().toISOString()}\n\n`;
  
  tables.forEach(table => {
    sql += `CREATE TABLE ${table.name} (\n`;
    
    const columnDefs = table.columns.map(col => {
      let def = `    ${col.name} ${col.type}`;
      if (col.constraints.includes('NOT NULL')) def += ` NOT NULL`;
      if (col.constraints.includes('UNIQUE')) def += ` UNIQUE`;
      if (col.constraints.includes('PRIMARY KEY')) def += ` PRIMARY KEY`;
      return def;
    });
    
    sql += columnDefs.join(',\n');
  
    
    const foreignKeys = table.columns.filter(col => col.references);
    foreignKeys.forEach(fk => {
      sql += `,\n    FOREIGN KEY (${fk.name}) REFERENCES ${fk.references!.table}(${fk.references!.column})`;
    });
    
    sql += `\n);\n\n`;
  });
  
  return sql;
}