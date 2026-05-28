import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import type { Table } from '../../types/schema';
import { TableNode } from './TableNode';

interface DiagramCanvasProps {
  tables: Table[];
}

// Convert table to React Flow node
const tableToNode = (table: Table, index: number): Node => ({
  id: table.name,
  type: 'tableNode',
  position: table.position || { x: 250, y: index * 200 },
  data: { table },
});

// Create edges (lines) between tables based on foreign keys
const createEdges = (tables: Table[]): Edge[] => {
  const edges: Edge[] = [];
  
  tables.forEach((table) => {
    table.columns.forEach((column) => {
      if (column.references) {
        edges.push({
          id: `${table.name}-${column.references.table}-${column.name}`,
          source: table.name,
          target: column.references.table,
          sourceHandle: `${table.name}-${column.name}-source`,
          targetHandle: `${column.references.table}-${column.references.column}-target`,
          label: column.name,
          type: 'smoothstep',
          animated: true,
          style: { 
            stroke: '#8b5cf6', 
            strokeWidth: 3,
          },
          labelStyle: { 
            fill: '#8b5cf6', 
            fontSize: 11,
            fontWeight: 'bold',
          },
          labelBgStyle: {
            fill: 'white',
            fillOpacity: 0.9,
            rx: 4,
            ry: 4,
          },
          labelBgPadding: [4, 2],
          labelBgBorderRadius: 4,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#8b5cf6',
          },
          zIndex: 10,
        });
      }
    });
  });
  
  return edges;
};

// Register custom node type
const nodeTypes = {
  tableNode: TableNode,
};

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ tables }) => {
  // Convert tables to nodes
  const initialNodes = tables.map((table, idx) => tableToNode(table, idx));
  const initialEdges = createEdges(tables);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Update nodes and edges when tables change
  useEffect(() => {
    // Preserve existing positions
    const existingPositions = new Map(
      nodes.map((node) => [node.id, node.position])
    );
    
    const newNodes = tables.map((table, idx) => {
      const existingPos = existingPositions.get(table.name);
      return {
        id: table.name,
        type: 'tableNode',
        position: existingPos || table.position || { x: 250, y: idx * 200 },
        data: { table },
      };
    });
    
    setNodes(newNodes);
    setEdges(createEdges(tables));
  }, [tables, setNodes, setEdges]);
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  const onSaveLayout = useCallback(() => {
    // Save positions to localStorage
    const positions = nodes.map((node) => ({
      id: node.id,
      position: node.position,
    }));
    localStorage.setItem('table-positions', JSON.stringify(positions));
  }, [nodes]);
  
  const onResetLayout = useCallback(() => {
    // Reset positions
    const newNodes = nodes.map((node, idx) => ({
      ...node,
      position: { x: 250, y: idx * 200 },
    }));
    setNodes(newNodes);
    localStorage.removeItem('table-positions');
  }, [nodes, setNodes]);
  
  // Load saved positions on mount
  useEffect(() => {
    const saved = localStorage.getItem('table-positions');
    if (saved) {
      const positions = JSON.parse(saved);
      const updatedNodes = nodes.map((node) => {
        const savedPos = positions.find((p: any) => p.id === node.id);
        if (savedPos) {
          return { ...node, position: savedPos.position };
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  }, []);
  
  return (
    // CHANGED: Made this div take full height and width with proper constraints
    <div className="flex flex-col h-full w-full min-h-0">
      {/* CHANGED: Made header sticky for mobile scrolling */}
      <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 px-4 py-2 bg-gray-50 dark:bg-gray-950">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Database Diagram
            {tables.length > 0 && (
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                (Drag tables to position, zoom with mouse)
              </span>
            )}
          </h2>
          
          <div className="flex gap-2">
            <button
              onClick={onSaveLayout}
              className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400
                       transition-colors"
            >
              Save Layout
            </button>
            <button
              onClick={onResetLayout}
              className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400
                       transition-colors"
            >
              Reset Layout
            </button>
          </div>
        </div>
      </div>
      
      {/* CHANGED: Added min-h-0 and flex-1 for proper scrolling */}
      <div className="flex-1 min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#8b5cf6', strokeWidth: 3 },
          }}
        >
          <Background color="#aaa" gap={16} size={1} />
          <Controls 
            position="bottom-right"
            showZoom={true}
            showFitView={true}
            showInteractive={true}
            className="bg-white! !dark:bg-gray-800 rounded-lg! shadow-lg! border! border-gray-200! !dark:border-gray-700"
          />
          <MiniMap 
            nodeColor={() => '#3b82f6'}
            nodeStrokeWidth={3}
            zoomable={true}
            pannable={true}
            className="bg-gray-100! !dark:bg-gray-800 rounded-lg! border! border-gray-200! !dark:border-gray-700"
          />
          <Panel position="top-right">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-1 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              🔍 Scroll to zoom | Drag to pan | Drag tables to reposition
            </div>
          </Panel>
          <Panel position="bottom-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-1 text-xs text-purple-600 dark:text-purple-400 border border-gray-200 dark:border-gray-700">
              🔗 Purple lines show Foreign Key relationships
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};