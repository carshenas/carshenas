/* eslint-disable */
/// <reference types="vite/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    VITE_APP_VERSION: string | undefined
    VITE_APP_STAGE: 'DEVELOPMENT' | 'PRODUCTION' | undefined

    // api
    VITE_SSL_ENABLED: 'true' | 'false' | undefined
    VITE_API_SERVER: string | undefined

    // app config
    VITE_BASE_CURRENCY_UNIT: 'IRT' | 'IRR' | undefined
    VITE_DISPLAY_CURRENCY_UNIT: 'IRT' | 'IRR' | undefined
  }
}
