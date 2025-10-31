/**
 * Logger Utility
 * 
 * Simple logging utility for MCP servers
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export class Logger {
  private level: LogLevel;
  private prefix: string;

  constructor(prefix = 'MCP', level: LogLevel = 'info') {
    this.prefix = prefix;
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
    return levels[level] <= levels[this.level];
  }

  private formatMessage(level: LogLevel, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.prefix}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}${args.length > 0 ? ' ' + JSON.stringify(args) : ''}`;
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, ...args));
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, ...args));
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, ...args));
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, ...args));
    }
  }
}

/**
 * Create a logger instance
 */
export function createLogger(prefix?: string, level?: LogLevel): Logger {
  return new Logger(prefix, level);
}







