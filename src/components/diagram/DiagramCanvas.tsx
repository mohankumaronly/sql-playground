import React from 'react';
import type { Table } from '../../types/schema';
import { TableCard } from './TableCard';

interface DiagramCanvasProps {
  tables: Table[];
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ tables }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-2 bg-gray-50 dark:bg-gray-950">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Database Diagram
        </h2>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {tables.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <p className="text-lg font-medium">No tables to display</p>
            <p className="text-sm mt-2">Write SQL in the editor to see your diagram</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tables.map((table, idx) => (
              <TableCard key={idx} table={table} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};