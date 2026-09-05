/// <reference types="vite/client" />

/**
 * Type-safe environment variables
 * Add your environment variables here for full TypeScript support
 */
interface ImportMetaEnv {
  /** App title */
  readonly VITE_APP_TITLE: string;
  /** API base URL */
  readonly VITE_API_URL: string;
  /** Enable debug mode */
  readonly VITE_DEBUG: string;
  /** Current environment */
  readonly MODE: string;
  /** Base URL */
  readonly BASE_URL: string;
  /** Production mode flag */
  readonly PROD: boolean;
  /** Development mode flag */
  readonly DEV: boolean;
  /** Server-side rendering flag */
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
