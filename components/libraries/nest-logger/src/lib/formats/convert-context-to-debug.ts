import { Format, TransformableInfo } from 'logform';
import { NestLogger } from '../nest-logger';

/**
 * A logform format that forces the log level to 'debug' for specified contexts.
 *
 * @returns {Format} - A logform format object with a transform function that adjusts the log level.
 *
 * @example
 * // Usage with a logger
 * const logger = createLogger({
 *   format: combine(
 *     forceContextToDebug(),
 *     format.json()
 *   ),
 *   transports: [new transports.Console()]
 * });
 */
export const forceContextToDebug = (): Format => {
  return {
    transform: (info: TransformableInfo) => {
      // Check if the log level is 'info' and the context is in the forceDebugContexts list
      if (info.level === 'info' && info['context'] && NestLogger.forceDebugContexts?.includes(info['context'])) {
        info.level = 'debug'; // Change log level to 'debug'
      }
      return info; // Return the modified log information
    }
  };
};
