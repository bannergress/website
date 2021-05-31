export interface NewsItem {
  uuid: string
  content: string
  created: Date
}

export interface NewsState {
  news: Array<NewsItem>
}
