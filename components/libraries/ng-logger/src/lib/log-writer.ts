/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { LogLevel, LogWriterService, isLogLevelEnabled } from '@bonsquare/log-writer';
import { LogWriterConfig } from './log-writer-config';

@Injectable({ providedIn: 'root' })
export class LogWriter implements LogWriterService {
  private level: LogLevel[];

  constructor(private config: LogWriterConfig) {
    this.level = Array.isArray(this.config.LOG) ? this.config.LOG : [this.config.LOG];
  }

  verbose(message: string, extraInfo?: object): void {
    if (isLogLevelEnabled('verbose', this.level)) {
      this.writeMessages('verbose', message, extraInfo);
    }
  }
  debug(message: string, extraInfo?: object): void {
    if (isLogLevelEnabled('debug', this.level)) {
      this.writeMessages('debug', message, extraInfo);
    }
  }
  info(message: string, extraInfo?: object): void {
    if (isLogLevelEnabled('info', this.level)) {
      this.writeMessages('info', message, extraInfo);
    }
  }
  warn(message: string, extraInfo?: object): void {
    if (isLogLevelEnabled('warn', this.level)) {
      this.writeMessages('warn', message, extraInfo);
    }
  }
  error(message: string, extraInfo?: object): void {
    if (isLogLevelEnabled('error', this.level)) {
      this.writeMessages('error', message, extraInfo);
    }
  }
  fatal(message: string, extraInfo?: object): void {
    if (isLogLevelEnabled('fatal', this.level)) {
      this.writeMessages('fatal', message, extraInfo);
    }
  }

  writeMessages(level: LogLevel, message: string, extraInfo?: object) {
    let writeMethod;

    switch (level) {
      case 'warn':
        writeMethod = console.warn;
        break;
      case 'error' || 'fatal':
        writeMethod = console.error;
        break;
      default:
        writeMethod = console.log;
        break;
    }
    extraInfo ? writeMethod(message, extraInfo) : writeMethod(message);
  }
}
