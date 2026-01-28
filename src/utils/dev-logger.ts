/**
 * Development-only logging utilities
 * These will be stripped out in production builds
 */

import { isDev } from '@pulsar-framework/pulsar.dev/env';

const isDevMode = isDev();

export const devLog = {
  /**
   * Log a warning message (only in development)
   */
  warn: (...args: any[]) => {
    if (isDevMode) {
      console.warn(...args);
    }
  },

  /**
   * Log an error message (always logged)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * Log a debug message (only in development)
   */
  debug: (...args: any[]) => {
    if (isDevMode) {
      console.log(...args);
    }
  },

  /**
   * Log an info message (only in development)
   */
  info: (...args: any[]) => {
    if (isDevMode) {
      console.info(...args);
    }
  },
};
