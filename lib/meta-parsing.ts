/**
 * Meta Parsing Utilities
 * Unsafe extraction of __META__....__META__ block from streamed text
 * Safe regex parsing; never crashes UI if meta is malformed/missing
 */

import { ResponseMetadata } from '@/types/api-contract'

export interface ParsedStream {
  content: string
  metadata: ResponseMetadata | null
  graph: any | null
  trace: any | null
}

/**
 * Extract metadata block from streamed text
 * Pattern: __META__{json}__META__
 */
export function extractMetadata(text: string): ResponseMetadata | null {
  try {
    const metaMatch = text.match(/__META__(.+?)__META__/s)
    if (!metaMatch || !metaMatch[1]) return null

    const jsonStr = metaMatch[1].trim()
    const parsed = JSON.parse(jsonStr) as ResponseMetadata
    return parsed
  } catch (error) {
    console.warn('Failed to parse metadata:', error)
    return null
  }
}

/**
 * Extract trace (legacy format for backwards compatibility)
 */
export function extractTrace(text: string): any | null {
  try {
    const traceMatch = text.match(/__TRACE__(.+?)__TRACE__/s)
    if (!traceMatch || !traceMatch[1]) return null

    const jsonStr = traceMatch[1].trim()
    return JSON.parse(jsonStr)
  } catch (error) {
    console.warn('Failed to parse trace:', error)
    return null
  }
}

/**
 * Extract knowledge graph (legacy format)
 */
export function extractGraph(text: string): any | null {
  try {
    const graphMatch = text.match(/__GRAPH__(.+?)__GRAPH__/s)
    if (!graphMatch || !graphMatch[1]) return null

    const jsonStr = graphMatch[1].trim()
    return JSON.parse(jsonStr)
  } catch (error) {
    console.warn('Failed to parse graph:', error)
    return null
  }
}

/**
 * Strip all metadata blocks from text
 */
export function stripMetadata(text: string): string {
  let cleaned = text
  cleaned = cleaned.replace(/__META__.+?__META__/s, '')
  cleaned = cleaned.replace(/__TRACE__.+?__TRACE__/s, '')
  cleaned = cleaned.replace(/__GRAPH__.+?__GRAPH__/s, '')
  return cleaned.trim()
}

/**
 * Parse complete streamed response
 */
export function parseStreamedResponse(text: string): ParsedStream {
  const metadata = extractMetadata(text)
  const trace = extractTrace(text)
  const graph = extractGraph(text)
  const content = stripMetadata(text)

  return {
    content,
    metadata,
    graph,
    trace,
  }
}
