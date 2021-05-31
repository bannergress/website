import * as actionTypes from './actionTypes'
import { getNews } from './selectors'
import { loadNewsAction } from './actions'
import { NewsItem, NewsState } from './types'

export { default as NewsReducer } from './reducer'
export { actionTypes }
export { getNews }
export { loadNewsAction as loadNews }
export type { NewsItem, NewsState }
