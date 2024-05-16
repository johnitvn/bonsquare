export type LogLevel = 'info' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';
export const ALL_LOG_LEVELS = ['info', 'error', 'warn', 'debug', 'verbose', 'fatal'];
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  verbose: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
};

/**
 * Checks if target level is enabled.
 * @param targetLevel target level
 * @param logLevels array of enabled log levels
 */
export function isLogLevelEnabled(targetLevel: LogLevel, logLevels: LogLevel[] | undefined): boolean {
  if (!logLevels || (Array.isArray(logLevels) && logLevels?.length === 0)) {
    return false;
  }
  if (logLevels.includes(targetLevel)) {
    return true;
  }
  const highestLogLevelValue = logLevels.map((level) => LOG_LEVEL_VALUES[level]).sort((a, b) => b - a)?.[0];
  const targetLevelValue = LOG_LEVEL_VALUES[targetLevel];
  return targetLevelValue >= highestLogLevelValue;
}

export interface LogWriterService {
  verbose(message: string, extraInfo?: object): void;
  debug(message: string, extraInfo?: object): void;
  info(message: string, extraInfo?: object): void;
  warn(message: string, extraInfo?: object): void;
  error(message: string, extraInfo?: object): void;
  fatal(message: string, extraInfo?: object): void;
}
