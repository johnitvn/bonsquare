import { Format } from 'logform';
import * as winston from 'winston';
import { forceContextToDebug } from './convert-context-to-debug';
import { filterDebugContext } from './filter-debug-context';

/**
 * Generates a log format that includes a timestamp, extracts context and metadata, and converts to JSON format.
 * @param debugEnviroment A string representing the debug environment configuration.
 * @returns A log format that includes a timestamp, context, metadata, and is in JSON format.
 */
export const jsonFormat = (debugEnviroment: string): Format => {
  return winston.format.combine(
    winston.format.timestamp(), // Automatically adds a timestamp to log messages
    // transformMetaData(), // extract context and metadata
    forceContextToDebug(),
    filterDebugContext(debugEnviroment), // filter context in debug mode
    winston.format.json() // Converts log message to JSON format
  );
};
