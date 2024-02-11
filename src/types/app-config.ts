import type { NullableString } from './global'

export default interface AppConfig {
  appVersion: NullableString
  baseCurrencyUnit: 'IRT' | 'IRR'
  displayCurrencyUnit: 'IRT' | 'IRR'
  websiteUrl: string
  apiServer: string
  serverFilesRootPath: string
  staticFileServer: string
  thumbnailEnabled: boolean
  thumbnailServer: NullableString
  thumbnailServerRoot: NullableString
}
