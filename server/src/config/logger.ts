/**
 * Reusable Logging Service
 * Prepares the architecture for advanced logging (e.g., Winston, Pino, or DataDog) in future phases.
 */

const logMessage = (level: string, message: string, meta?: any) => {
  const timestamp = new Date().toISOString();
  const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
  
  switch (level) {
    case 'info':
      console.log(`[${timestamp}] INFO: ${message}${metaString}`);
      break;
    case 'warn':
      console.warn(`[${timestamp}] WARN: ${message}${metaString}`);
      break;
    case 'error':
      console.error(`[${timestamp}] ERROR: ${message}${metaString}`);
      break;
    case 'debug':
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`[${timestamp}] DEBUG: ${message}${metaString}`);
      }
      break;
    default:
      console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`);
  }
};

export const logger = {
  info: (message: string, meta?: any) => logMessage('info', message, meta),
  warn: (message: string, meta?: any) => logMessage('warn', message, meta),
  error: (message: string, meta?: any) => logMessage('error', message, meta),
  debug: (message: string, meta?: any) => logMessage('debug', message, meta),
};
