import type { Nullable } from './utilities'

export default interface AppConfig {
  appVersion: Nullable<string>
  baseCurrencyUnit: 'IRT' | 'IRR'
  displayCurrencyUnit: 'IRT' | 'IRR'
  websiteUrl: string
  apiServer: string
  serverFilesRootPath: string
  staticFileServer: string
  thumbnailEnabled: boolean
  thumbnailServer: Nullable<string>
  thumbnailServerRoot: Nullable<string>
}
