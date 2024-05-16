/**
 * Matches a context string against a pattern with optional wildcards.
 *
 * @param {string } context - The context string to be matched against the pattern.
 * @param {string} pattern - The pattern string, which may contain '*' as a wildcard.
 *                           - '*' matches any sequence of characters.
 *
 * @returns {boolean} - Returns true if the context matches the pattern, otherwise returns false.
 *
 * @example
 * matchPattern('UserController', 'User*'); // true
 * matchPattern('AuthService', 'Auth*'); // true
 * matchPattern('UserController', '*Controller'); // true
 * matchPattern('UserController', '*'); // true
 * matchPattern('AdminController', 'User*'); // false
 */
export function matchPattern(context: string, pattern: string): boolean {
  // Handle the case where the pattern is '*'
  if (pattern === '*') {
    return true;
  }

  // Handle the case where the pattern does not contain '*'
  if (!pattern.includes('*')) {
    return context === pattern;
  }

  // Split the pattern by '*' to handle wildcards
  const parts = pattern.split('*');

  // Handle patterns that start and end with '*', matching any substring
  if (pattern.startsWith('*') && pattern.endsWith('*')) {
    return context.includes(parts[1]);
  }

  // Handle patterns that start with '*', matching any ending substring
  if (pattern.startsWith('*')) {
    return context.endsWith(parts[1]);
  }

  // Handle patterns that end with '*', matching any starting substring
  if (pattern.endsWith('*')) {
    return context.startsWith(parts[0]);
  }

  // Handle patterns with '*' in the middle, matching corresponding parts of context
  let index = 0;
  for (const part of parts) {
    index = context.indexOf(part, index);
    if (index === -1) {
      return false;
    }
    index += part.length;
  }

  return true;
}
