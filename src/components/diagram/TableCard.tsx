import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Table } from '../../types/schema';

interface TableCardProps {
  table: Table;
}

export const TableCard: React.FC<TableCardProps> = ({ table }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: table.name });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={`border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 mb-4 cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-2xl' : ''}`}>
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 font-bold border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <span className="text-gray-900 dark:text-white font-mono text-sm">
              {table.name}
            </span>
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        </div>
        <div className="p-2 space-y-1">
          {table.columns.map((col, idx) => (
            <div key={idx} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
              <span className="font-mono text-sm text-gray-700 dark:text-gray-300 w-24">
                {col.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {col.type}
              </span>
              <div className="flex gap-1 ml-auto">
                {col.constraints.includes('PRIMARY KEY') && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                    PK
                  </span>
                )}
                {col.constraints.includes('FOREIGN KEY') && col.references && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    FK → {col.references.table}
                  </span>
                )}
                {col.constraints.includes('NOT NULL') && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    NOT NULL
                  </span>
                )}
                {col.constraints.includes('UNIQUE') && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    UNIQUE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};