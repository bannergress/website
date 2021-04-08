import { create } from 'apisauce'

// define the api
export const api = create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: { Accept: 'application/json' },
})
