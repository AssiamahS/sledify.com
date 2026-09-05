/**
 * Type-safe environment variable access
 * This module provides validated access to environment variables
 */

const getEnvVar = (key: keyof ImportMetaEnv, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue === undefined) {
    console.warn(`Environment variable ${key} is not defined`);
    return "";
  }
  return value ?? defaultValue ?? "";
};

export const env = {
  /** Application title */
  APP_TITLE: getEnvVar("VITE_APP_TITLE", "Axle Truck Fleet Tracking"),

  /** API base URL */
  API_URL: getEnvVar("VITE_API_URL", "http://localhost:3000/api"),

  /** Debug mode enabled */
  DEBUG: getEnvVar("VITE_DEBUG", "false") === "true",

  /** Current mode (development/production) */
  MODE: import.meta.env.MODE,

  /** Is production build */
  IS_PROD: import.meta.env.PROD,

  /** Is development build */
  IS_DEV: import.meta.env.DEV,
} as const;

export type Env = typeof env;
