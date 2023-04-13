import { BannerOrder, BannerOrderDirection } from '../banner/filter'

export interface SettingsState {
  defaultOrderBy: BannerOrder
  defaultOrderDirection: BannerOrderDirection
  defaultOnline: boolean | undefined
}
