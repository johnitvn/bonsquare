/**
 * Parses a debug environment string into includes and excludes arrays.
 *
 * @param debugEnviroment The debug environment string to parse.
 * @returns An object containing arrays of includes and excludes.
 */
export function parseDebugEnviroment(debugEnviroment: string): { includes: string[]; excludes: string[] } {
  // If the debug environment string is not provided or empty, return empty result
  if (!debugEnviroment) {
    return { includes: [], excludes: [] };
  }

  // Split the environment string into individual variables
  const variables = debugEnviroment.split(',');
  const includes: string[] = [];
  const excludes: string[] = [];

  // Iterate through each variable
  variables.forEach((variable) => {
    // Trim whitespace from the variable
    variable = variable.trim();

    if (variable.startsWith('!')) {
      // If the variable starts with '!', it is an exclude variable
      excludes.push(variable.substring(1));
    } else {
      // Otherwise, it is an include variable
      includes.push(variable);
    }
  });

  // Return the arrays of includes and excludes
  return { includes, excludes };
}
