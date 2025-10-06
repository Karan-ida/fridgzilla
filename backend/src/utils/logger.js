// backend/src/utils/logger.js

const levels = {
  info: "INFO",
  warn: "WARN",
  error: "ERROR",
};

export const logger = {
  info: (message, meta = {}) => {
    console.log(`[${levels.info}] ${new Date().toISOString()} - ${message}`, meta);
  },

  warn: (message, meta = {}) => {
    console.warn(`[${levels.warn}] ${new Date().toISOString()} - ${message}`, meta);
  },

  error: (message, meta = {}) => {
    console.error(`[${levels.error}] ${new Date().toISOString()} - ${message}`, meta);
  },
};
