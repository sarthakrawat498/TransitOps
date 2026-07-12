type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  requestId?: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

class Logger {
  private format(entry: LogEntry): string {
    const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
    const request = entry.requestId ? ` [${entry.requestId}]` : "";
    const meta = entry.meta ? ` ${JSON.stringify(entry.meta)}` : "";
    return `${base}${request} ${entry.message}${meta}`;
  }

  private write(level: LogLevel, message: string, requestId?: string, meta?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      requestId,
      timestamp: new Date().toISOString(),
      meta,
    };

    const formatted = this.format(entry);

    switch (level) {
      case "error":
        console.error(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      default:
        console.log(formatted);
    }
  }

  debug(message: string, requestId?: string, meta?: Record<string, unknown>) {
    this.write("debug", message, requestId, meta);
  }

  info(message: string, requestId?: string, meta?: Record<string, unknown>) {
    this.write("info", message, requestId, meta);
  }

  warn(message: string, requestId?: string, meta?: Record<string, unknown>) {
    this.write("warn", message, requestId, meta);
  }

  error(message: string, requestId?: string, meta?: Record<string, unknown>) {
    this.write("error", message, requestId, meta);
  }
}

export const logger = new Logger();
