import type { ParsedError, StackTraceLine, ErrorLocation } from '@/types/error-debugger';

export function parseErrorStack(errorMessage: string): ParsedError {
  const lines = errorMessage.split('\n');
  
  // Extract error type and message from first line
  const firstLine = lines[0] || '';
  const typeMatch = firstLine.match(/^([\w]+Error):\s*(.*)$/);
  
  const errorType = typeMatch?.[1] || 'Error';
  const message = typeMatch?.[2] || firstLine;

  // Parse stack trace
  const stackTrace = parseStackTrace(lines);

  // Determine root location (first non-native stack frame)
  const rootLocation = getRootLocation(stackTrace);

  return {
    type: errorType,
    message,
    rawStack: errorMessage,
    stackTrace,
    rootLocation,
  };
}

function parseStackTrace(lines: string[]): StackTraceLine[] {
  const stack: StackTraceLine[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Try to parse "at functionName (file:line:column)" format
    const atMatch = line.match(/at\s+(.+?)\s+\(([^:]+):(\d+):(\d+)\)/);
    if (atMatch) {
      stack.push({
        functionName: atMatch[1],
        file: atMatch[2],
        line: parseInt(atMatch[3], 10),
        column: parseInt(atMatch[4], 10),
      });
      continue;
    }

    // Try to parse "at file:line:column" format (no function name)
    const simpleMatch = line.match(/at\s+([^:]+):(\d+):(\d+)/);
    if (simpleMatch) {
      stack.push({
        functionName: '<anonymous>',
        file: simpleMatch[1],
        line: parseInt(simpleMatch[2], 10),
        column: parseInt(simpleMatch[3], 10),
      });
      continue;
    }

    // Try to parse "functionName (file)" format
    const simpleFileMatch = line.match(/(.+?)\s+\((.+?)\)/);
    if (simpleFileMatch) {
      stack.push({
        functionName: simpleFileMatch[1],
        file: simpleFileMatch[2],
        line: 0,
      });
      continue;
    }
  }

  return stack;
}

function getRootLocation(stackTrace: StackTraceLine[]): ErrorLocation | null {
  if (stackTrace.length === 0) return null;

  // Find the first user code (not from node_modules or internal)
  const userFrame = stackTrace.find(
    (frame) =>
      !frame.file.includes('node_modules') &&
      !frame.file.includes('<internal') &&
      !frame.file.startsWith('[')
  );

  if (userFrame) {
    return {
      file: userFrame.file,
      line: userFrame.line,
      column: userFrame.column,
      functionName: userFrame.functionName !== '<anonymous>' ? userFrame.functionName : undefined,
    };
  }

  // Fallback to first frame
  const first = stackTrace[0];
  return {
    file: first.file,
    line: first.line,
    column: first.column,
    functionName: first.functionName !== '<anonymous>' ? first.functionName : undefined,
  };
}

export function generateErrorSuggestions(error: ParsedError): string[] {
  const suggestions: string[] = [];
  const { type, message } = error;

  // TypeError suggestions
  if (type === 'TypeError') {
    if (message.includes('Cannot read')) {
      suggestions.push(
        'Check if the object exists before accessing its properties',
        'Add null/undefined checks: if (obj && obj.property)',
        'Consider using optional chaining: obj?.property',
        'Use nullish coalescing: obj ?? defaultValue'
      );
    }
    if (message.includes('not a function')) {
      suggestions.push(
        'Verify the variable is actually a function',
        'Check if the function is imported correctly',
        'Ensure you\'re not overwriting the function with another value',
        'Check for typos in the function name'
      );
    }
  }

  // ReferenceError suggestions
  if (type === 'ReferenceError') {
    suggestions.push(
      'Verify the variable is declared before use',
      'Check if the variable is in the correct scope',
      'Ensure imports are correct and the module exists',
      'Look for typos in the variable name',
      'Check if the variable is exported from its module'
    );
  }

  // SyntaxError suggestions
  if (type === 'SyntaxError') {
    suggestions.push(
      'Check for missing or extra parentheses, brackets, or braces',
      'Verify all strings are properly quoted',
      'Look for missing semicolons (if using strict mode)',
      'Check arrow function syntax: () => {}',
      'Verify proper async/await usage'
    );
  }

  // RangeError suggestions
  if (type === 'RangeError') {
    suggestions.push(
      'Check array/string index bounds',
      'Verify numeric values are within valid ranges',
      'Look for infinite loops or recursion',
      'Check recursive function base cases'
    );
  }

  // Generic fallback suggestions
  if (suggestions.length === 0) {
    suggestions.push(
      'Read the error message carefully - it usually describes the problem',
      'Check the stack trace to find where the error originated',
      'Search for the error message in documentation',
      'Review recent code changes near the error location'
    );
  }

  return suggestions;
}

export function extractRelevantCode(errorMessage: string): string {
  // Try to extract the problematic code snippet from the error message
  const codeMatch = errorMessage.match(/```[\s\S]*?```/);
  if (codeMatch) {
    return codeMatch[0];
  }

  // If no code block, return the first few lines of context
  const lines = errorMessage.split('\n').slice(0, 5);
  return lines.join('\n');
}

export function normalizeErrorMessage(error: string | Error): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n${error.stack || ''}`;
  }
  return String(error);
}

export function isSimilarError(error1: ParsedError, error2: ParsedError): boolean {
  // Check if errors are of the same type and have similar messages
  return (
    error1.type === error2.type &&
    error1.message.split(' ').slice(0, 3).join(' ') ===
      error2.message.split(' ').slice(0, 3).join(' ')
  );
}
