import React from 'react';
import { Handle, Position } from 'reactflow';
import type { Table } from '../../types/schema';

interface TableNodeData {
  table: Table;
}

interface TableNodeProps {
  data: TableNodeData;
  selected?: boolean;
}

export const TableNode: React.FC<TableNodeProps> = ({ data, selected }) => {
  const { table } = data;
  
  return (
    <div className={`rounded-lg shadow-lg bg-white dark:bg-gray-900 border-2 ${selected ? 'border-blue-500' : 'border-gray-300 dark:border-gray-700'} min-w-[240px]`}>
      {/* Table Header */}
      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 font-bold border-b border-gray-300 dark:border-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          <span className="text-gray-900 dark:text-white font-mono text-sm font-semibold">
            {table.name}
          </span>
        </div>
      </div>
      
      {/* Table Columns */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {table.columns.map((col, idx) => (
          <div key={idx} className="px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
            <div className="flex items-center gap-2">
              {/* Left Handle for incoming connections */}
              {col.references && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${table.name}-${col.name}-target`}
                  style={{ background: '#8b5cf6', width: 8, height: 8 }}
                />
              )}
              
              <span className="font-mono text-sm text-gray-800 dark:text-gray-200 w-20">
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
                {col.constraints.includes('NOT NULL') && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    NN
                  </span>
                )}
                {col.constraints.includes('UNIQUE') && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    UQ
                  </span>
                )}
              </div>
              
              {/* Right Handle for outgoing connections (if this column is a foreign key) */}
              {col.references && (
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${table.name}-${col.name}-source`}
                  style={{ background: '#8b5cf6', width: 8, height: 8 }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};