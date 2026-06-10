/**
 * Centralised app configuration.
 *
 * Values are read from environment variables with safe defaults.
 * Add new settings here rather than scattering process.env reads
 * throughout the codebase.
 */
export const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',

  /** Pagination defaults */
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  /** Request logger — set LOG_REQUESTS=false to silence in tests */
  logging: {
    requests: process.env.LOG_REQUESTS !== 'false',
  },
};
