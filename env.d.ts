/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    APP_VERSION: string | undefined
    APP_STAGE: 'DEVELOPMENT' | 'PRODUCTION' | undefined

    // api
    SSL_ENABLED: 'true' | 'false' | undefined
    API_SERVER: string | undefined

    // app config
    BASE_CURRENCY_UNIT: 'IRT' | 'IRR' | undefined
    DISPLAY_CURRENCY_UNIT: 'IRT' | 'IRR' | undefined
    WEBSITE_URL: string | undefined
  }
}
