'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useKnowledgeGraph } from '@/contexts/KnowledgeGraphContext';
import { DEFAULT_GRAPH_CONFIG } from '@/types/knowledge-graph';
import type { ConceptNode, ConceptLink } from '@/types/knowledge-graph';

export function KnowledgeGraphVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { graphState, selectNode, addToExplorationHistory, highlightPath, getCurrentGraph } = useKnowledgeGraph();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const currentGraph = getCurrentGraph();

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current?.parentElement) {
        const rect = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main D3 rendering
  useEffect(() => {
    if (!svgRef.current || !currentGraph || currentGraph.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const config = DEFAULT_GRAPH_CONFIG;

    // Create container groups
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create simulation
    const simulation = d3.forceSimulation<ConceptNode>(currentGraph.nodes)
      .force('link', d3.forceLink<ConceptNode, ConceptLink>(currentGraph.links)
        .id((d) => d.id)
        .distance(100)
        .strength((d) => d.strength))
      .force('charge', d3.forceManyBody().strength(config.chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(currentGraph.links)
      .enter()
      .append('line')
      .attr('stroke', (d) => {
        const sourceId = typeof d.source === 'string' ? d.source : d.source.id;
        const targetId = typeof d.target === 'string' ? d.target : d.target.id;
        const isHighlighted = graphState.highlightedPaths.includes(sourceId) && 
                              graphState.highlightedPaths.includes(targetId);
        return isHighlighted ? '#f59e0b' : '#6b7280';
      })
      .attr('stroke-opacity', (d) => {
        const sourceId = typeof d.source === 'string' ? d.source : d.source.id;
        const targetId = typeof d.target === 'string' ? d.target : d.target.id;
        const isHighlighted = graphState.highlightedPaths.includes(sourceId) && 
                              graphState.highlightedPaths.includes(targetId);
        return isHighlighted ? 0.9 : 0.3;
      })
      .attr('stroke-width', (d) => d.strength * 3);

    // Create link labels
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(currentGraph.links.filter(d => d.label))
      .enter()
      .append('text')
      .attr('font-size', 10)
      .attr('fill', '#9ca3af')
      .attr('text-anchor', 'middle')
      .text((d) => d.label || '');

    // Create nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(currentGraph.nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => config.nodeRadius[d.type])
      .attr('fill', (d) => {
        if (graphState.selectedNodeId === d.id) return '#ef4444';
        if (graphState.highlightedPaths.includes(d.id)) return '#f59e0b';
        return config.colors[d.type];
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag<SVGCircleElement, ConceptNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }))
      .on('click', (event, d) => {
        event.stopPropagation();
        selectNode(d.id);
        addToExplorationHistory(d.id);
        
        // Highlight connected nodes
        const connectedIds = new Set<string>([d.id]);
        currentGraph.links.forEach(link => {
          const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
          const targetId = typeof link.target === 'string' ? link.target : link.target.id;
          if (sourceId === d.id) connectedIds.add(targetId);
          if (targetId === d.id) connectedIds.add(sourceId);
        });
        highlightPath(Array.from(connectedIds));
      })
      .on('mouseenter', function(this: SVGCircleElement, event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', config.nodeRadius[d.type] * 1.3);
      })
      .on('mouseleave', function(this: SVGCircleElement, event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', config.nodeRadius[d.type]);
      });

    // Create node labels
    const label = g.append('g')
      .selectAll('text')
      .data(currentGraph.nodes)
      .enter()
      .append('text')
      .attr('font-size', 12)
      .attr('font-weight', (d) => d.type === 'core' ? 'bold' : 'normal')
      .attr('fill', '#111827')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => config.nodeRadius[d.type] + 15)
      .style('pointer-events', 'none')
      .text((d) => d.label);

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as ConceptNode).x!)
        .attr('y1', (d) => (d.source as ConceptNode).y!)
        .attr('x2', (d) => (d.target as ConceptNode).x!)
        .attr('y2', (d) => (d.target as ConceptNode).y!);

      linkLabel
        .attr('x', (d) => ((d.source as ConceptNode).x! + (d.target as ConceptNode).x!) / 2)
        .attr('y', (d) => ((d.source as ConceptNode).y! + (d.target as ConceptNode).y!) / 2);

      node
        .attr('cx', (d) => d.x!)
        .attr('cy', (d) => d.y!);

      label
        .attr('x', (d) => d.x!)
        .attr('y', (d) => d.y!);
    });

    // Click on background to deselect
    svg.on('click', () => {
      selectNode(null);
      highlightPath([]);
    });

    return () => {
      simulation.stop();
    };
  }, [currentGraph, dimensions, graphState.selectedNodeId, graphState.highlightedPaths, selectNode, addToExplorationHistory, highlightPath]);

  if (!currentGraph || currentGraph.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="font-medium">No Knowledge Graph Yet</p>
          <p className="text-sm mt-1">Ask a question to visualize concepts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-xs">
        <div className="font-semibold mb-2 text-gray-900 dark:text-white">Node Types</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DEFAULT_GRAPH_CONFIG.colors.core }} />
            <span className="text-gray-700 dark:text-gray-300">Core Concept</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DEFAULT_GRAPH_CONFIG.colors.prerequisite }} />
            <span className="text-gray-700 dark:text-gray-300">Prerequisite</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DEFAULT_GRAPH_CONFIG.colors.related }} />
            <span className="text-gray-700 dark:text-gray-300">Related Topic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DEFAULT_GRAPH_CONFIG.colors.example }} />
            <span className="text-gray-700 dark:text-gray-300">Example</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => {
            const svg = d3.select(svgRef.current!);
            svg.transition().duration(300).call(
              d3.zoom<SVGSVGElement, unknown>().transform as any,
              d3.zoomIdentity
            );
          }}
          className="px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
        >
          Reset Zoom
        </button>
      </div>
    </div>
  );
}
