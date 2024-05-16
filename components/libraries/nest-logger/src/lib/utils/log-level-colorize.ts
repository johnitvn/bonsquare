import { cyan, green, magenta, red, redBright, yellow } from 'chalk';

/**
 * Colorizes a log message based on the specified log level.
 *
 * @param {string} level - The log level (e.g., 'debug', 'warn', 'error', 'verbose', 'fatal').
 *                         If the level is not recognized, a default color is applied.
 * @param {string} message - The log message to be colorized.
 *
 * @returns {string} - The colorized log message.
 *
 * @example
 * console.log(logLevelColorize('debug', 'This is a debug message')); // Magenta colored message
 * console.log(logLevelColorize('warn', 'This is a warning')); // Yellow colored message
 * console.log(logLevelColorize('info', 'This is an info message')); // Green colored message (default)
 */
export function logLevelColorize(level: string, message: string): string {
  // Mapping of log levels to chalk color functions
  const colorMap: { [key: string]: (msg: string) => string } = {
    debug: magenta,
    warn: yellow,
    error: redBright,
    verbose: cyan,
    fatal: red,
    default: green
  };

  // Select the appropriate color function based on the log level, defaulting to 'default' if unrecognized
  const colorizeFunc = colorMap[level] || colorMap['default'];

  // Return the colorized message
  return colorizeFunc(message);
}
