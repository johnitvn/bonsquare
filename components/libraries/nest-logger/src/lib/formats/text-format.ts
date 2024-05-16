import { bgYellowBright, blue, bold, red } from 'chalk';
import { Format, TransformableInfo } from 'logform';
import * as winston from 'winston';
import { logLevelColorize } from '../utils/log-level-colorize';
import { forceContextToDebug } from './convert-context-to-debug';
import { filterDebugContext } from './filter-debug-context';

export const textFormat = (debugEnviroment: string): Format => {
  return winston.format.combine(
    forceContextToDebug(),
    filterDebugContext(debugEnviroment), // filter context in debug mode
    winston.format.printf((info: TransformableInfo) => {
      const { level, context, message, stack, ...metadata } = info;
      const levelOutput = bold(logLevelColorize(level, `[${level.toUpperCase().padEnd(6)}]`));
      const contextOutput = bold(blue(`[${context}]`));
      const messageOutput = logLevelColorize(
        level,
        `${message ?? ''}${Object.keys(metadata).length > 0 ? ' ' + JSON.stringify(metadata) : ''}`
      );
      const output = `${levelOutput} ${contextOutput}: ${messageOutput}${stack ? `\n\n${stack}\n` : ''}`;
      return level !== 'fatal' ? output : bgYellowBright(red(output));
    })
  );
};
