import { api } from '../../api'
import { NewsItem } from './types'

export const getNews = () => api.get<Array<NewsItem>>('news')
