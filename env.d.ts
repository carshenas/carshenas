/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_APP_VERSION: string | undefined
    VITE_APP_STAGE: 'DEVELOPMENT' | 'PRODUCTION' | undefined

    // API
    VITE_SSL_ENABLED: boolean | undefined
    VITE_API_SERVER: string | undefined

    // App config
    VITE_BASE_CURRENCY_UNIT: 'IRT' | 'IRR' | undefined
    VITE_DISPLAY_CURRENCY_UNIT: 'IRT' | 'IRR' | undefined

    // Database
    VITE_INDEXED_DB_VERSION: number

    // Static files
    VITE_API_STATIC_SERVER: string
  }
}
