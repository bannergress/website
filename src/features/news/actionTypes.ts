import { RehydrateAction } from '../../storeTypes'
import { NewsItem } from './types'

export const LOAD_NEWS = 'LOAD_NEWS'

interface LoadNewsAction {
  type: typeof LOAD_NEWS
  payload: Array<Partial<NewsItem>>
}

export type NewsActionTypes = LoadNewsAction | RehydrateAction
