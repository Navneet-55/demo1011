export interface ErrorLocation {
  file: string;
  line: number;
  column?: number;
  functionName?: string;
}

export interface StackTraceLine {
  file: string;
  line: number;
  column?: number;
  functionName: string;
  source?: string;
}

export interface ParsedError {
  type: string; // TypeError, ReferenceError, SyntaxError, etc.
  message: string;
  rawStack?: string;
  stackTrace: StackTraceLine[];
  rootLocation: ErrorLocation | null;
}

export interface ErrorSuggestion {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  fixes: string[];
  prevention: string[];
  relatedTopics: string[];
}

export interface ErrorAnalysis {
  id: string;
  timestamp: number;
  parsedError: ParsedError;
  suggestions: ErrorSuggestion[];
  frequency?: number; // How many times this error occurred
  lastSeen?: number;
  resolved?: boolean;
}

export interface ErrorPattern {
  errorType: string;
  count: number;
  firstSeen: number;
  lastSeen: number;
  avgResolutionTime?: number; // milliseconds
}

export interface ErrorDebuggerState {
  currentError: ErrorAnalysis | null;
  errorHistory: ErrorAnalysis[];
  errorPatterns: ErrorPattern[];
  selectedErrorId: string | null;
}

export const ERROR_SEVERITY_COLORS = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#f59e0b',
  low: '#10b981',
};

export const COMMON_ERROR_PATTERNS = {
  'TypeError: Cannot read property': {
    type: 'TypeError',
    title: 'Null/Undefined Property Access',
    description: 'Attempting to access a property on null or undefined',
    severity: 'high' as const,
  },
  'ReferenceError: .*is not defined': {
    type: 'ReferenceError',
    title: 'Undefined Variable',
    description: 'Variable referenced before declaration or out of scope',
    severity: 'high' as const,
  },
  'SyntaxError': {
    type: 'SyntaxError',
    title: 'Syntax Error',
    description: 'Code has invalid JavaScript/TypeScript syntax',
    severity: 'critical' as const,
  },
  'TypeError: .* is not a function': {
    type: 'TypeError',
    title: 'Not a Function',
    description: 'Attempting to call something that is not a function',
    severity: 'high' as const,
  },
  'RangeError': {
    type: 'RangeError',
    title: 'Invalid Range',
    description: 'Value is outside the allowed range',
    severity: 'medium' as const,
  },
};
