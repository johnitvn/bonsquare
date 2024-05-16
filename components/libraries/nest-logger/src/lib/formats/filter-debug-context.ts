import { Format, TransformableInfo } from 'logform'; // Importing Format and TransformableInfo from logform module
import { isContextDebugEnable } from '../utils/is-context-debug-enable';
import { parseDebugEnviroment } from '../utils/parser-debug-enviroment'; // Importing parseDebugEnviroment function from utility file

/**
 * A filter function that filters log messages based on debug environment settings.
 * @param debugEnviroment The debug environment string.
 * @returns A Format object for filtering log messages.
 */
export const filterDebugContext = (debugEnviroment: string): Format => {
  // Parse the debug environment string to extract included and excluded contexts
  const { includes, excludes } = parseDebugEnviroment(debugEnviroment);

  // Return a Format object with a transform method
  return {
    /**
     * Transforms the log message based on the debug context settings.
     * @param info The log message object.
     * @returns The transformed log message object or false if filtered out.
     */
    transform: (info: TransformableInfo) => {
      if (info.level !== 'debug' && info.level !== 'verbose') return info;

      // Check if the context of the log message is enabled for debugging
      // If the context is enabled, allow the log message to pass through unchanged
      return isContextDebugEnable(info['context'], includes, excludes) ? info : false;
    }
  };
};
