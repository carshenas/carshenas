//@ts-nocheck
import type AppConfig from '@/types/app-config'

const schema =
  import.meta.env.SSL_ENABLED && import.meta.env.SSL_ENABLED === 'true' ? 'https://' : 'http://'

export default function useAppConfig() {
  return {
    appVersion: import.meta.env.VITE_APP_VERSION || null,
    baseCurrencyUnit: import.meta.env.VITE_BASE_CURRENCY_UNIT || 'IRT',
    displayCurrencyUnit: import.meta.env.VITE_DISPLAY_CURRENCY_UNIT || 'IRT',
    apiServer: `${schema}${import.meta.env.VITE_API_SERVER}`,
    staticFileServer: import.meta.env.VITE_API_STATIC_SERVER
  } as AppConfig
}
