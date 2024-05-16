import { LoggerService, Optional } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as winston from 'winston';
import { EnvironmentVariables } from './enviroment-variables';
import { jsonFormat } from './formats/json-format';
import { textFormat } from './formats/text-format';

export class NestLogger implements LoggerService {
  private static logger: winston.Logger;
  public static forceDebugContexts: string[] = [];
  private context?: string;

  constructor(@Optional() context?: string, @Optional() forceDebugContexts?: string[]) {
    this.context = context;
    if (!NestLogger.logger) {
      const enviroments = plainToInstance(EnvironmentVariables, process.env, { enableImplicitConversion: true });
      const errors = validateSync(enviroments, { skipMissingProperties: false, whitelist: true });
      if (errors.length == 0) {
        const format =
          enviroments.LOG_FORMAT === 'json'
            ? // when production we need to json for export to elk stack for analytics log
              jsonFormat(enviroments.LOG_DEBUG)
            : // when serve we need text for human read
              textFormat(enviroments.LOG_DEBUG);
        NestLogger.logger = winston.createLogger({
          level: 'verbose',
          levels: {
            fatal: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4,
            verbose: 5
          },
          format,
          transports: [new winston.transports.Console({})]
        });
        this.debug({ message: 'Initalized logging', LOG_DEBUG: enviroments.LOG_DEBUG }, NestLogger.name);
      } else {
        throw new Error('logging enviroments in invalid!\n' + errors.toString());
      }
    }

    forceDebugContexts &&
      forceDebugContexts.forEach((context) => {
        if (NestLogger.forceDebugContexts.indexOf(context) === -1) {
          NestLogger.forceDebugContexts.push(context);
        }
      });
  }

  public setContext(context: string) {
    this.context = context;
  }

  public log(message: any, context?: string): any {
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, level = 'info', ...meta } = message;
      return NestLogger.logger.log(level, msg as string, { context, ...meta });
    }

    return NestLogger.logger.info(message, { context });
  }

  public fatal(message: any, trace?: string, context?: string): any {
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return NestLogger.logger.log({
        level: 'fatal',
        message: msg,
        context,
        stack: [trace || stack],
        error: message,
        ...meta
      });
    }

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return NestLogger.logger.error({ level: 'fatal', message: msg, context, stack: [trace], ...meta });
    }

    return NestLogger.logger.error({ level: 'fatal', message, context, stack: [trace] });
  }

  public error(message: any, trace?: string, context?: string): any {
    context = context || this.context;

    if (message instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { message: msg, name, stack, ...meta } = message;

      return NestLogger.logger.error(msg, { context, stack: [trace || message.stack], error: message, ...meta });
    }

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return NestLogger.logger.error(msg as string, { context, stack: [trace], ...meta });
    }

    return NestLogger.logger.error(message, { context, stack: [trace] });
  }

  public warn(message: any, context?: string): any {
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return NestLogger.logger.warn(msg as string, { context, ...meta });
    }

    return NestLogger.logger.warn(message, { context });
  }

  public debug(message: any, context?: string): any {
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return NestLogger.logger.debug(msg as string, { context, ...meta });
    }

    return NestLogger.logger.debug(message, { context });
  }

  public verbose(message: any, context?: string): any {
    context = context || this.context;

    if (!!message && 'object' === typeof message) {
      const { message: msg, ...meta } = message;

      return NestLogger.logger.verbose(msg as string, { context, ...meta });
    }

    return NestLogger.logger.verbose(message, { context });
  }
}
