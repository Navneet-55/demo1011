'use client';

import React from 'react';
import { useKnowledgeGraph } from '@/contexts/KnowledgeGraphContext';

export function ConceptExplorer() {
  const { graphState, selectNode, navigateGraph, clearGraphs, getCurrentGraph } = useKnowledgeGraph();
  
  const currentGraph = getCurrentGraph();
  const selectedNode = currentGraph?.nodes.find(n => n.id === graphState.selectedNodeId);
  const relatedNodes = currentGraph && graphState.selectedNodeId
    ? currentGraph.links
        .filter(link => {
          const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
          const targetId = typeof link.target === 'string' ? link.target : link.target.id;
          return sourceId === graphState.selectedNodeId || targetId === graphState.selectedNodeId;
        })
        .map(link => {
          const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
          const targetId = typeof link.target === 'string' ? link.target : link.target.id;
          const nodeId = sourceId === graphState.selectedNodeId ? targetId : sourceId;
          return {
            node: currentGraph.nodes.find(n => n.id === nodeId),
            linkType: link.type,
            label: link.label,
          };
        })
        .filter(item => item.node)
    : [];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Concept Explorer
          </h3>
          {graphState.graphs.length > 0 && (
            <button
              onClick={clearGraphs}
              className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Graph Navigation */}
        {graphState.graphs.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateGraph('prev')}
              disabled={graphState.currentGraphIndex === 0}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous graph"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {graphState.currentGraphIndex + 1} / {graphState.graphs.length}
            </span>
            <button
              onClick={() => navigateGraph('next')}
              disabled={graphState.currentGraphIndex === graphState.graphs.length - 1}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next graph"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!currentGraph || currentGraph.nodes.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Click on a node to explore</p>
          </div>
        ) : selectedNode ? (
          <>
            {/* Selected Node Details */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">{selectedNode.label}</h4>
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {selectedNode.type}
                </span>
              </div>
              {selectedNode.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  {selectedNode.description}
                </p>
              )}
            </div>

            {/* Related Concepts */}
            {relatedNodes.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Related Concepts ({relatedNodes.length})
                </h5>
                <div className="space-y-2">
                  {relatedNodes.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => item.node && selectNode(item.node.id)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                          {item.node!.label}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.node!.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {item.linkType.replace(/-/g, ' ')}
                        {item.label && `: ${item.label}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Graph Overview */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Graph Overview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Concepts:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{currentGraph.nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Connections:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{currentGraph.links.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Context:</span>
                  <span className="font-medium text-gray-900 dark:text-white text-xs truncate max-w-[150px]">
                    {currentGraph.context}
                  </span>
                </div>
              </div>
            </div>

            {/* All Nodes List */}
            <div>
              <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                All Concepts
              </h5>
              <div className="space-y-1">
                {currentGraph.nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => selectNode(node.id)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition-colors flex items-center justify-between"
                  >
                    <span className="text-gray-900 dark:text-white">{node.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{node.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Exploration History */}
        {graphState.explorationHistory.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              Recent Explorations
            </h5>
            <div className="flex flex-wrap gap-1">
              {graphState.explorationHistory.slice(-10).reverse().map((nodeId, idx) => {
                const node = currentGraph?.nodes.find(n => n.id === nodeId);
                if (!node) return null;
                return (
                  <button
                    key={idx}
                    onClick={() => selectNode(nodeId)}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {node.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
