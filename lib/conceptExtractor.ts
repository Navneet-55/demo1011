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

// Constants for configuration
const CONCEPT_EXTRACTION_CONFIG = {
  MAX_BOLD_CONCEPTS: 10,
  MAX_CODE_REFERENCES: 8,
  MAX_CONCEPT_WORDS: 5,
  MIN_NODES_THRESHOLD: 3,
  MIN_LINKS_THRESHOLD: 2,
  DEFAULT_RELATIONSHIP_STRENGTH: 0.7,
  CORE_TO_RELATED_STRENGTH: 0.8,
  EXAMPLE_STRENGTH: 0.6,
  DEPENDENCY_STRENGTH: 0.9,
} as const;

/**
 * Extracts concepts and relationships from text to build a knowledge graph
 * @param text - The source text to analyze
 * @param query - The user's query to contextualize the extraction
 * @returns A knowledge graph with nodes and links representing concepts and relationships
 */
export function extractConceptsFromText(text: string, query: string): KnowledgeGraph {
  if (!text?.trim() || !query?.trim()) {
    return {
      nodes: [],
      links: [],
      timestamp: Date.now(),
      context: query || '',
    };
  }

  const nodes: ConceptNode[] = [];
  const links: ConceptLink[] = [];
  const conceptSet = new Set<string>();
  const concepts: ExtractedConcept[] = [];

  // Extract raw text patterns
  const headers = extractPatternMatches(text, /#{1,6}\s+(.+?)(?:\n|$)/g);
  const boldConcepts = extractPatternMatches(text, /\*\*([^*]+)\*\*/g);
  const codeReferences = extractPatternMatches(text, /`([^`]+)`/g);

  // Process extracted patterns
  processConcepts(headers, concepts, conceptSet, text, 'core');
  processConcepts(
    boldConcepts.slice(0, CONCEPT_EXTRACTION_CONFIG.MAX_BOLD_CONCEPTS),
    concepts,
    conceptSet,
    text,
    'related',
    CONCEPT_EXTRACTION_CONFIG.MAX_CONCEPT_WORDS
  );
  processCodeReferences(codeReferences, concepts, conceptSet, CONCEPT_EXTRACTION_CONFIG.MAX_CODE_REFERENCES);

  // Add main query concept
  addMainQueryConcept(query, concepts, conceptSet);

  // Convert concepts to nodes
  concepts.forEach((concept, idx) => {
    nodes.push({
      id: `node-${idx}`,
      label: concept.name,
      type: concept.type,
      description: concept.description,
    });
  });

  // Create relationships
  const relationships = inferRelationships(concepts, text);
  createLinksFromRelationships(relationships, nodes, links);

  // Enhance graph if needed
  if (nodes.length < CONCEPT_EXTRACTION_CONFIG.MIN_NODES_THRESHOLD) {
    addGenericConceptNodes(query, nodes);
  }

  if (links.length < CONCEPT_EXTRACTION_CONFIG.MIN_LINKS_THRESHOLD && nodes.length > 1) {
    createDefaultConnections(nodes, links);
  }

  return {
    nodes,
    links,
    timestamp: Date.now(),
    context: query,
  };
}

/**
 * Extract regex pattern matches from text, returning trimmed match groups
 */
function extractPatternMatches(text: string, regex: RegExp): string[] {
  return Array.from(text.matchAll(regex))
    .map(match => match[1]?.trim())
    .filter((item): item is string => Boolean(item) && item.length > 0);
}

/**
 * Process concept matches with deduplication and filtering
 */
function processConcepts(
  matches: string[],
  concepts: ExtractedConcept[],
  conceptSet: Set<string>,
  text: string,
  type: 'core' | 'related' | 'example' | 'prerequisite',
  maxWords?: number
): void {
  matches.forEach(match => {
    if (
      !conceptSet.has(match.toLowerCase()) &&
      (!maxWords || match.split(' ').length <= maxWords)
    ) {
      conceptSet.add(match.toLowerCase());
      concepts.push({
        name: match,
        type,
        description: type === 'prerequisite' ? undefined : extractDescriptionForConcept(text, match),
      });
    }
  });
}

/**
 * Process code references with deduplication
 */
function processCodeReferences(
  matches: string[],
  concepts: ExtractedConcept[],
  conceptSet: Set<string>,
  maxReferences: number
): void {
  const uniqueRefs = new Set<string>();
  matches.slice(0, maxReferences).forEach(match => {
    const key = match.toLowerCase();
    if (!uniqueRefs.has(key) && !conceptSet.has(key) && match.split(' ').length <= 3) {
      uniqueRefs.add(key);
      conceptSet.add(key);
      concepts.push({
        name: match,
        type: 'example',
      });
    }
  });
}

/**
 * Add the main query concept to the beginning of concepts list
 */
function addMainQueryConcept(
  query: string,
  concepts: ExtractedConcept[],
  conceptSet: Set<string>
): void {
  const mainConcept = extractMainConceptFromQuery(query);
  if (mainConcept && !conceptSet.has(mainConcept.toLowerCase())) {
    concepts.unshift({
      name: mainConcept,
      type: 'core',
      description: 'Main topic of inquiry',
    });
  }
}

/**
 * Create links from relationships, matching concepts to nodes
 * Uses a Map for O(1) lookups instead of O(n) find operations
 */
function createLinksFromRelationships(
  relationships: ExtractedRelationship[],
  nodes: ConceptNode[],
  links: ConceptLink[]
): void {
  // Build a lookup map for better performance
  const nodeMap = new Map<string, ConceptNode>();
  nodes.forEach(node => {
    nodeMap.set(node.label.toLowerCase(), node);
  });

  relationships.forEach(rel => {
    const sourceNode = nodeMap.get(rel.from.toLowerCase());
    const targetNode = nodeMap.get(rel.to.toLowerCase());

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
}

/**
 * Add generic concept nodes if graph is too sparse
 */
function addGenericConceptNodes(
  query: string,
  nodes: ConceptNode[]
): void {
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

/**
 * Create default connections if relationship graph is sparse
 * Connects the first node to up to 3 subsequent nodes
 */
function createDefaultConnections(nodes: ConceptNode[], links: ConceptLink[]): void {
  if (nodes.length < 2) return;
  
  const maxConnections = Math.min(nodes.length - 1, 3);
  for (let i = 1; i <= maxConnections; i++) {
    links.push({
      source: nodes[0].id,
      target: nodes[i].id,
      type: 'related-to',
      strength: CONCEPT_EXTRACTION_CONFIG.DEFAULT_RELATIONSHIP_STRENGTH,
    });
  }
}

/**
 * Extracts a description for a concept by finding the sentence containing it
 */
function extractDescriptionForConcept(text: string, concept: string): string | undefined {
  const escapedConcept = concept.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escapedConcept}[^.!?]{0,200}[.!?]`, 'i');
  const match = text.match(regex);

  return match ? match[0].trim().slice(0, 150) : undefined;
}

/**
 * Extracts the main concept from a user query by removing question words
 */
function extractMainConceptFromQuery(query: string): string | null {
  // Remove common question words and punctuation
  const cleaned = query
    .toLowerCase()
    .replace(/^(what|how|why|when|where|who|explain|tell me about|describe)\s+(is|are|does|do)?\s*/i, '')
    .replace(/[?!.]+$/, '')
    .trim();

  // Extract key phrases (capitalize first letter)
  const words = cleaned.split(/\s+/).filter(w => w.length > 0 && w.length < 20);
  if (words.length === 0) return null;

  if (words.length <= 4) {
    return capitalizeWords(words);
  }

  // Take first few meaningful words
  return capitalizeWords(words.slice(0, 3));
}

/**
 * Capitalize each word in an array and join them
 */
function capitalizeWords(words: string[]): string {
  return words
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Infers relationships between concepts based on their types and text analysis
 */
function inferRelationships(concepts: ExtractedConcept[], text: string): ExtractedRelationship[] {
  const relationships: ExtractedRelationship[] = [];

  // Segment concepts by type for efficient processing
  const coreConcepts = concepts.filter(c => c.type === 'core');
  const relatedConcepts = concepts.filter(c => c.type === 'related');
  const examples = concepts.filter(c => c.type === 'example');

  // Connect core concepts to related concepts and examples
  coreConcepts.forEach(core => {
    const coreLower = core.name.toLowerCase();
    
    // Connect to related concepts (limit to 3 for graph clarity)
    relatedConcepts.slice(0, 3).forEach(related => {
      if (coreLower !== related.name.toLowerCase()) {
        relationships.push({
          from: core.name,
          to: related.name,
          type: 'related-to',
          strength: CONCEPT_EXTRACTION_CONFIG.CORE_TO_RELATED_STRENGTH,
        });
      }
    });

    // Connect examples (limit to 2 to avoid clutter)
    examples.slice(0, 2).forEach(example => {
      if (coreLower !== example.name.toLowerCase()) {
        relationships.push({
          from: example.name,
          to: core.name,
          type: 'example-of',
          strength: CONCEPT_EXTRACTION_CONFIG.EXAMPLE_STRENGTH,
        });
      }
    });
  });

  // Detect dependency patterns in text
  detectDependencies(text, concepts, coreConcepts, relationships);

  return relationships;
}

/**
 * Detect and extract dependency patterns from text
 */
function detectDependencies(
  text: string,
  concepts: ExtractedConcept[],
  coreConcepts: ExtractedConcept[],
  relationships: ExtractedRelationship[]
): void {
  const dependencyPatterns = [
    /requires?\s+([^.,]+)/gi,
    /depends?\s+on\s+([^.,]+)/gi,
    /needs?\s+([^.,]+)/gi,
  ];

  dependencyPatterns.forEach(pattern => {
    for (const match of text.matchAll(pattern)) {
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
          strength: CONCEPT_EXTRACTION_CONFIG.DEPENDENCY_STRENGTH,
        });
      }
    }
  });
}

function generateGenericConcepts(query: string): ExtractedConcept[] {
  const generic: ExtractedConcept[] = [];

  // Extract programming language or framework mentions
  const techKeywords = [
    'javascript', 'python', 'react', 'typescript', 'node',
    'api', 'database', 'function', 'class', 'component',
  ];

  const foundTech = techKeywords.find(keyword =>
    query.toLowerCase().includes(keyword)
  );

  if (foundTech) {
    generic.push({
      name: foundTech.charAt(0).toUpperCase() + foundTech.slice(1),
      type: 'prerequisite',
      description: 'Technology mentioned in query',
    });
  }

  return generic;
}
