import type { ConceptNode, ConceptLink, KnowledgeGraph } from '@/types/knowledge-graph';

interface ExtractedConcept {
  name: string;
  type: 'core' | 'related' | 'example' | 'prerequisite';
  description?: string;
}

interface ExtractedRelationship {
  from: string;
  to: string;
  type: 'depends-on' | 'related-to' | 'implements' | 'example-of';
  label?: string;
  strength: number;
}

export function extractConceptsFromText(text: string, query: string): KnowledgeGraph {
  const nodes: ConceptNode[] = [];
  const links: ConceptLink[] = [];
  
  // Extract concepts from markdown headers
  const headerRegex = /#{1,6}\s+(.+?)(?:\n|$)/g;
  const headers = Array.from(text.matchAll(headerRegex));
  
  // Extract bold concepts
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const boldConcepts = Array.from(text.matchAll(boldRegex));
  
  // Extract code references
  const codeRegex = /`([^`]+)`/g;
  const codeReferences = Array.from(text.matchAll(codeRegex));

  const conceptSet = new Set<string>();
  const concepts: ExtractedConcept[] = [];

  // Process headers as core concepts
  headers.forEach((match) => {
    const concept = match[1].trim();
    if (concept && !conceptSet.has(concept.toLowerCase())) {
      conceptSet.add(concept.toLowerCase());
      concepts.push({
        name: concept,
        type: 'core',
        description: extractDescriptionForConcept(text, concept),
      });
    }
  });

  // Process bold text as related concepts
  boldConcepts.slice(0, 10).forEach((match) => {
    const concept = match[1].trim();
    if (concept && !conceptSet.has(concept.toLowerCase()) && concept.split(' ').length <= 5) {
      conceptSet.add(concept.toLowerCase());
      concepts.push({
        name: concept,
        type: 'related',
        description: extractDescriptionForConcept(text, concept),
      });
    }
  });

  // Process code references as examples
  const uniqueCodeRefs = new Set<string>();
  codeReferences.slice(0, 8).forEach((match) => {
    const concept = match[1].trim();
    if (concept && concept.split(' ').length <= 3 && !uniqueCodeRefs.has(concept.toLowerCase())) {
      uniqueCodeRefs.add(concept.toLowerCase());
      if (!conceptSet.has(concept.toLowerCase())) {
        conceptSet.add(concept.toLowerCase());
        concepts.push({
          name: concept,
          type: 'example',
        });
      }
    }
  });

  // Add query as the central core concept if not already present
  const mainConceptFromQuery = extractMainConceptFromQuery(query);
  if (mainConceptFromQuery && !conceptSet.has(mainConceptFromQuery.toLowerCase())) {
    concepts.unshift({
      name: mainConceptFromQuery,
      type: 'core',
      description: 'Main topic of inquiry',
    });
  }

  // Convert to nodes with IDs
  concepts.forEach((concept, idx) => {
    nodes.push({
      id: `node-${idx}`,
      label: concept.name,
      type: concept.type,
      description: concept.description,
    });
  });

  // Create relationships based on proximity and context
  const relationships = inferRelationships(concepts, text);
  relationships.forEach((rel) => {
    const sourceNode = nodes.find((n) => n.label.toLowerCase() === rel.from.toLowerCase());
    const targetNode = nodes.find((n) => n.label.toLowerCase() === rel.to.toLowerCase());
    
    if (sourceNode && targetNode) {
      links.push({
        source: sourceNode.id,
        target: targetNode.id,
        type: rel.type,
        label: rel.label,
        strength: rel.strength,
      });
    }
  });

  // If we have fewer than 3 nodes, add some generic ones
  if (nodes.length < 3) {
    const genericConcepts = generateGenericConcepts(query);
    genericConcepts.forEach((concept, idx) => {
      nodes.push({
        id: `node-gen-${idx}`,
        label: concept.name,
        type: concept.type,
        description: concept.description,
      });
    });
  }

  // Create some default connections if we have few links
  if (links.length < 2 && nodes.length > 1) {
    for (let i = 1; i < Math.min(nodes.length, 4); i++) {
      links.push({
        source: nodes[0].id,
        target: nodes[i].id,
        type: 'related-to',
        strength: 0.7,
      });
    }
  }

  return {
    nodes,
    links,
    timestamp: Date.now(),
    context: query,
  };
}

function extractDescriptionForConcept(text: string, concept: string): string | undefined {
  const escapedConcept = concept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escapedConcept}[^.]*\\.`, 'i');
  const match = text.match(regex);
  
  if (match) {
    return match[0].trim().slice(0, 150);
  }
  
  return undefined;
}

function extractMainConceptFromQuery(query: string): string | null {
  // Remove common question words
  const cleaned = query
    .toLowerCase()
    .replace(/^(what|how|why|when|where|explain|tell me about|describe)\s+/i, '')
    .replace(/\?$/, '')
    .trim();
  
  // Extract key phrases (capitalize first letter)
  const words = cleaned.split(' ');
  if (words.length <= 4) {
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  
  // Take first few words
  return words
    .slice(0, 3)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function inferRelationships(concepts: ExtractedConcept[], text: string): ExtractedRelationship[] {
  const relationships: ExtractedRelationship[] = [];
  
  // Connect core concepts to related concepts
  const coreConcepts = concepts.filter(c => c.type === 'core');
  const relatedConcepts = concepts.filter(c => c.type === 'related');
  const examples = concepts.filter(c => c.type === 'example');
  
  coreConcepts.forEach((core) => {
    relatedConcepts.slice(0, 3).forEach((related) => {
      if (core.name !== related.name) {
        relationships.push({
          from: core.name,
          to: related.name,
          type: 'related-to',
          strength: 0.8,
        });
      }
    });
    
    examples.slice(0, 2).forEach((example) => {
      if (core.name !== example.name) {
        relationships.push({
          from: example.name,
          to: core.name,
          type: 'example-of',
          strength: 0.6,
        });
      }
    });
  });
  
  // Look for "depends on" patterns
  const dependencyPatterns = [
    /requires?\s+([^.,]+)/gi,
    /depends?\s+on\s+([^.,]+)/gi,
    /needs?\s+([^.,]+)/gi,
  ];
  
  dependencyPatterns.forEach((pattern) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const dependency = match[1].trim();
      const matchingConcept = concepts.find(c => 
        c.name.toLowerCase().includes(dependency.toLowerCase()) ||
        dependency.toLowerCase().includes(c.name.toLowerCase())
      );
      
      if (matchingConcept && coreConcepts.length > 0) {
        relationships.push({
          from: coreConcepts[0].name,
          to: matchingConcept.name,
          type: 'depends-on',
          label: 'requires',
          strength: 0.9,
        });
      }
    }
  });
  
  return relationships;
}

function generateGenericConcepts(query: string): ExtractedConcept[] {
  const generic: ExtractedConcept[] = [];
  
  // Extract programming language or framework mentions
  const techKeywords = ['javascript', 'python', 'react', 'typescript', 'node', 'api', 'database', 'function', 'class', 'component'];
  const foundTech = techKeywords.find(keyword => query.toLowerCase().includes(keyword));
  
  if (foundTech) {
    generic.push({
      name: foundTech.charAt(0).toUpperCase() + foundTech.slice(1),
      type: 'prerequisite',
      description: 'Technology mentioned in query',
    });
  }
  
  return generic;
}
