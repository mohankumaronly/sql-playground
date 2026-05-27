export interface Reference {
  table: string;
  column: string;
}

export interface Column {
  name: string;
  type: string;
  constraints: string[];
  references: Reference | null;
}

export interface Table {
  name: string;
  columns: Column[];
  position?: { x: number; y: number };
}

export interface Schema {
  tables: Table[];
}