import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Table } from '../../types/schema';
import { TableCard } from './TableCard';

interface DiagramCanvasProps {
  tables: Table[];
  onReorder?: (tables: Table[]) => void;
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ tables, onReorder }) => {
  const [items, setItems] = useState(tables);

  // Update items when tables prop changes
  React.useEffect(() => {
    setItems(tables);
  }, [tables]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.name === active.id);
      const newIndex = items.findIndex((item) => item.name === over?.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      
      if (onReorder) {
        onReorder(newItems);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-2 bg-gray-50 dark:bg-gray-950">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Database Diagram
          {items.length > 0 && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              (Drag to reorder)
            </span>
          )}
        </h2>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <p className="text-lg font-medium">No tables to display</p>
            <p className="text-sm mt-2">Write SQL in the editor to see your diagram</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.name)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {items.map((table) => (
                  <TableCard key={table.name} table={table} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};