import JSZip from 'jszip';
import type { Schema } from '../types/schema';
import { generateMarkdown, generateSQL } from './markdownGenerator';

export async function downloadSchemaAsZip(schema: Schema): Promise<void> {
  if (!schema.tables || schema.tables.length === 0) {
    alert('No tables to export. Please add some tables first.');
    return;
  }

  const zip = new JSZip();
  

  const sqlContent = generateSQL(schema);
  zip.file('schema.sql', sqlContent);
  

  const markdownContent = generateMarkdown(schema);
  zip.file('README.md', markdownContent);
  

  const jsonContent = JSON.stringify(schema, null, 2);
  zip.file('schema.json', jsonContent);
  

  const blob = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `database-schema-${Date.now()}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}