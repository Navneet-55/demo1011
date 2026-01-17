export interface ConceptNode {
  id: string;
  label: string;
  type: 'core' | 'related' | 'example' | 'prerequisite';
  description?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface ConceptLink {
  source: string | ConceptNode;
  target: string | ConceptNode;
  type: 'depends-on' | 'related-to' | 'implements' | 'example-of';
  label?: string;
  strength: number; // 0-1
}

export interface KnowledgeGraph {
  nodes: ConceptNode[];
  links: ConceptLink[];
  timestamp: number;
  context: string; // The query that generated this graph
}

export interface GraphState {
  graphs: KnowledgeGraph[];
  currentGraphIndex: number;
  selectedNodeId: string | null;
  highlightedPaths: string[];
  explorationHistory: string[];
}

export interface GraphConfig {
  width: number;
  height: number;
  nodeRadius: {
    core: number;
    related: number;
    example: number;
    prerequisite: number;
  };
  colors: {
    core: string;
    related: string;
    example: string;
    prerequisite: string;
  };
  linkStrengthRange: [number, number];
  chargeStrength: number;
  centerStrength: number;
}

export const DEFAULT_GRAPH_CONFIG: GraphConfig = {
  width: 800,
  height: 600,
  nodeRadius: {
    core: 20,
    related: 15,
    example: 12,
    prerequisite: 18,
  },
  colors: {
    core: '#3b82f6',
    related: '#10b981',
    example: '#f59e0b',
    prerequisite: '#8b5cf6',
  },
  linkStrengthRange: [0.3, 1],
  chargeStrength: -300,
  centerStrength: 0.05,
};
