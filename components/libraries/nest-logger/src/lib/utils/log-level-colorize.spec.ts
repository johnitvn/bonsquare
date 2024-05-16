import { cyan, green, magenta, red, redBright, yellow } from 'chalk';
import { logLevelColorize } from './log-level-colorize';

describe('logLevelColorize', () => {
  test('should colorize debug level with magentaBright', () => {
    const message = 'Debug message';
    const result = logLevelColorize('debug', message);
    expect(result).toBe(magenta(message));
  });

  test('should colorize warn level with yellow', () => {
    const message = 'Warning message';
    const result = logLevelColorize('warn', message);
    expect(result).toBe(yellow(message));
  });

  test('should colorize error level with redBright', () => {
    const message = 'Error message';
    const result = logLevelColorize('error', message);
    expect(result).toBe(redBright(message));
  });

  test('should colorize verbose level with cyanBright', () => {
    const message = 'Verbose message';
    const result = logLevelColorize('verbose', message);
    expect(result).toBe(cyan(message));
  });

  test('should colorize fatal level with red', () => {
    const message = 'Fatal message';
    const result = logLevelColorize('fatal', message);
    expect(result).toBe(red(message));
  });

  test('should colorize unknown level with green', () => {
    const message = 'Default message';
    const result = logLevelColorize('unknown', message);
    expect(result).toBe(green(message));
  });

  test('should colorize empty level with green', () => {
    const message = 'Default message';
    const result = logLevelColorize('', message);
    expect(result).toBe(green(message));
  });
});
