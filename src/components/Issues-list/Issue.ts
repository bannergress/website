export interface Issue {
  key: string
  field: string
  type: 'error' | 'warning'
  message: string
}
