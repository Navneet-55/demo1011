'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { KnowledgeGraph, GraphState } from '@/types/knowledge-graph';

interface KnowledgeGraphContextType {
  graphState: GraphState;
  addGraph: (graph: KnowledgeGraph) => void;
  selectNode: (nodeId: string | null) => void;
  addToExplorationHistory: (nodeId: string) => void;
  clearGraphs: () => void;
  navigateGraph: (direction: 'prev' | 'next') => void;
  highlightPath: (nodeIds: string[]) => void;
  getCurrentGraph: () => KnowledgeGraph | null;
}

const KnowledgeGraphContext = createContext<KnowledgeGraphContextType | undefined>(undefined);

const STORAGE_KEY = 'gyaanforge_knowledge_graphs';
const MAX_STORED_GRAPHS = 10;

export function KnowledgeGraphProvider({ children }: { children: React.ReactNode }) {
  const [graphState, setGraphState] = useState<GraphState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            graphs: parsed.graphs || [],
            currentGraphIndex: parsed.graphs?.length ? parsed.graphs.length - 1 : -1,
            selectedNodeId: null,
            highlightedPaths: [],
            explorationHistory: parsed.explorationHistory || [],
          };
        }
      } catch (error) {
        console.error('Failed to load knowledge graphs from localStorage:', error);
      }
    }
    return {
      graphs: [],
      currentGraphIndex: -1,
      selectedNodeId: null,
      highlightedPaths: [],
      explorationHistory: [],
    };
  });

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && graphState.graphs.length > 0) {
      try {
        const toStore = {
          graphs: graphState.graphs.slice(-MAX_STORED_GRAPHS),
          explorationHistory: graphState.explorationHistory.slice(-50),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
      } catch (error) {
        console.error('Failed to save knowledge graphs to localStorage:', error);
      }
    }
  }, [graphState.graphs, graphState.explorationHistory]);

  const addGraph = useCallback((graph: KnowledgeGraph) => {
    setGraphState((prev) => {
      const newGraphs = [...prev.graphs, graph].slice(-MAX_STORED_GRAPHS);
      return {
        ...prev,
        graphs: newGraphs,
        currentGraphIndex: newGraphs.length - 1,
        selectedNodeId: null,
        highlightedPaths: [],
      };
    });
  }, []);

  const selectNode = useCallback((nodeId: string | null) => {
    setGraphState((prev) => ({
      ...prev,
      selectedNodeId: nodeId,
    }));
  }, []);

  const addToExplorationHistory = useCallback((nodeId: string) => {
    setGraphState((prev) => ({
      ...prev,
      explorationHistory: [...prev.explorationHistory, nodeId].slice(-50),
    }));
  }, []);

  const clearGraphs = useCallback(() => {
    setGraphState({
      graphs: [],
      currentGraphIndex: -1,
      selectedNodeId: null,
      highlightedPaths: [],
      explorationHistory: [],
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const navigateGraph = useCallback((direction: 'prev' | 'next') => {
    setGraphState((prev) => {
      const newIndex = direction === 'prev' 
        ? Math.max(0, prev.currentGraphIndex - 1)
        : Math.min(prev.graphs.length - 1, prev.currentGraphIndex + 1);
      return {
        ...prev,
        currentGraphIndex: newIndex,
        selectedNodeId: null,
        highlightedPaths: [],
      };
    });
  }, []);

  const highlightPath = useCallback((nodeIds: string[]) => {
    setGraphState((prev) => ({
      ...prev,
      highlightedPaths: nodeIds,
    }));
  }, []);

  const getCurrentGraph = useCallback((): KnowledgeGraph | null => {
    if (graphState.currentGraphIndex >= 0 && graphState.currentGraphIndex < graphState.graphs.length) {
      return graphState.graphs[graphState.currentGraphIndex];
    }
    return null;
  }, [graphState.graphs, graphState.currentGraphIndex]);

  return (
    <KnowledgeGraphContext.Provider
      value={{
        graphState,
        addGraph,
        selectNode,
        addToExplorationHistory,
        clearGraphs,
        navigateGraph,
        highlightPath,
        getCurrentGraph,
      }}
    >
      {children}
    </KnowledgeGraphContext.Provider>
  );
}

export function useKnowledgeGraph() {
  const context = useContext(KnowledgeGraphContext);
  if (context === undefined) {
    throw new Error('useKnowledgeGraph must be used within a KnowledgeGraphProvider');
  }
  return context;
}
