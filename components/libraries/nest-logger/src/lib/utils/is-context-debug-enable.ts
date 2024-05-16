import { matchPattern } from './match-partern';

/**
 * Determines if debug mode should be enabled for a given context based on include and exclude patterns.
 *
 * @param {string} context - The context string to be evaluated (e.g., 'UserController', 'AuthService').
 * @param {string[]} includes - An array of strings representing include patterns.
 *                               Patterns can include wildcards (e.g., 'User*', 'Auth*').
 * @param {string[]} excludes - An array of strings representing exclude patterns.
 *                               Exact matches will disable debug mode for the given context.
 *
 * @returns {boolean} - Returns true if the context matches any include pattern and does not match any exclude pattern.
 *                      Returns false if the context matches any exclude pattern or does not match any include pattern.
 *
 * @example
 * const includes = ['User*', 'Auth*'];
 * const excludes = ['AdminController'];
 * isContextDebugEnable('UserController', includes, excludes); // true
 * isContextDebugEnable('AdminController', includes, excludes); // false
 */
export function isContextDebugEnable(context: string, includes: string[], excludes: string[]) {
  // If the context is in the excludes list, return false immediately
  if (excludes.includes(context)) {
    return false;
  }

  // If includes contains '*', return true
  if (includes.includes('*')) {
    return true;
  }

  // If includes and excludes are both empty, return false
  if (includes.length === 0 && excludes.length === 0) {
    return false;
  }

  // Check if the context matches any pattern in the includes list
  return includes.some((pattern) => matchPattern(context, pattern));
}
